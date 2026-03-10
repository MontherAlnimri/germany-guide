'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function useEmailVerified() {
  const [verified, setVerified] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function check() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setVerified(!!user.email_confirmed_at);
        setEmail(user.email ?? null);
      } else {
        setVerified(null);
        setEmail(null);
      }
      setLoading(false);
    }

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setVerified(!!session.user.email_confirmed_at);
        setEmail(session.user.email ?? null);
      } else {
        setVerified(null);
        setEmail(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return { verified, loading, email };
}