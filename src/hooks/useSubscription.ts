'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: 'free' | 'monthly' | 'yearly';
  status: 'active' | 'cancelled' | 'expired' | 'past_due';
  current_period_start: string | null;
  current_period_end: string | null;
}

export function useSubscription() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPremium, setIsPremium] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchSubscription() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: sub } = await supabase
          .from('subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (sub) {
          setSubscription(sub);
          setIsPremium(
            (sub.plan === 'monthly' || sub.plan === 'yearly') &&
            sub.status === 'active'
          );
        } else {
          setIsPremium(false);
        }
      } catch {
        setIsPremium(false);
      } finally {
        setLoading(false);
      }
    }

    fetchSubscription();
  }, [supabase]);

  return { subscription, isPremium, loading };
}