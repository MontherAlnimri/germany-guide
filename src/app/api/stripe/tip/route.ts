import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { amount } = await req.json();

    if (!amount || amount < 100) {
      return NextResponse.json({ error: 'Minimum tip is €1.00' }, { status: 400 });
    }

    const origin = req.headers.get('origin') || 'https://my-german-guide.vercel.app';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: 'Support Germany Guide',
              description: 'Thank you for your generous tip!',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${origin}/support/thank-you`,
      cancel_url: `${origin}/support`,
      metadata: {
        type: 'tip',
        user_id: user?.id || 'anonymous',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error: unknown) {
    console.error('Tip error:', error);
    const message = error instanceof Error ? error.message : 'Internal error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}