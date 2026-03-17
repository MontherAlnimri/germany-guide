import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Stripe from 'stripe';
import { trackServerEvent } from '@/lib/analytics-server';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
    if (webhookSecret && webhookSecret !== 'whsec_placeholder') {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } else {
      event = JSON.parse(body) as Stripe.Event;
    }
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const adminSupabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.mode === 'subscription') {
          const userId = session.metadata?.supabase_user_id;
          const plan = session.metadata?.plan || 'monthly';
          const customerId = session.customer as string;
          const subscriptionId = session.subscription as string;

          if (userId) {
            const sub = await stripe.subscriptions.retrieve(subscriptionId);
            const subData = sub as unknown as Record<string, unknown>;
            const periodStart = subData.current_period_start as number;
            const periodEnd = subData.current_period_end as number;

            await adminSupabase
              .from('subscriptions')
              .upsert({
                user_id: userId,
                stripe_customer_id: customerId,
                stripe_subscription_id: subscriptionId,
                plan,
                status: 'active',
                current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
                current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
                updated_at: new Date().toISOString(),
              }, { onConflict: 'user_id' });

            await adminSupabase
              .from('profiles')
              .update({ is_premium: true, updated_at: new Date().toISOString() })
              .eq('id', userId);

            // Track subscription event
            await trackServerEvent(userId, 'premium_subscribed', { plan });
          }
        }

        if (session.mode === 'payment' && session.metadata?.type === 'tip') {
          const userId = session.metadata?.user_id;
          await adminSupabase.from('tips').insert({
            user_id: userId !== 'anonymous' ? userId : null,
            amount: session.amount_total || 0,
            currency: session.currency || 'eur',
            stripe_payment_intent_id: session.payment_intent as string,
            status: 'succeeded',
          });

          // Track tip event
          await trackServerEvent(userId || 'anonymous', 'tip_sent', { amount: (session.amount_total || 0) / 100 });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as unknown as Record<string, unknown>;
        const customerId = subscription.customer as string;
        const subStatus = subscription.status as string;
        const cancelAtPeriodEnd = subscription.cancel_at_period_end as boolean;
        const periodStart = subscription.current_period_start as number;
        const periodEnd = subscription.current_period_end as number;

        const { data: existingSub } = await adminSupabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (existingSub) {
          const isActive = subStatus === 'active';

          await adminSupabase
            .from('subscriptions')
            .update({
              status: cancelAtPeriodEnd ? 'cancelled' : (isActive ? 'active' : 'past_due'),
              current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
              current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', customerId);

          await adminSupabase
            .from('profiles')
            .update({ is_premium: isActive, updated_at: new Date().toISOString() })
            .eq('id', existingSub.user_id);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as unknown as Record<string, unknown>;
        const customerId = subscription.customer as string;

        const { data: existingSub } = await adminSupabase
          .from('subscriptions')
          .select('user_id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (existingSub) {
          await adminSupabase
            .from('subscriptions')
            .update({
              status: 'expired',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_customer_id', customerId);

          await adminSupabase
            .from('profiles')
            .update({ is_premium: false, updated_at: new Date().toISOString() })
            .eq('id', existingSub.user_id);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}