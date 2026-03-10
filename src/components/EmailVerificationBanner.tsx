'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useEmailVerified } from '@/hooks/useEmailVerified';
import { useDict } from '@/lib/i18n/context';
import { Button } from '@/components/ui/Button';

export default function EmailVerificationBanner() {
  const { verified, loading, email } = useEmailVerified();
  const dict = useDict();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [dismissed, setDismissed] = useState(false);

  if (loading || verified !== false || dismissed) return null;

  const handleResend = async () => {
    if (!email) return;
    setSending(true);
    setError('');
    setSent(false);

    try {
      const supabase = createClient();
      const { error: resendError } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard`,
        },
      });

      if (resendError) {
        setError(resendError.message);
      } else {
        setSent(true);
      }
    } catch {
      setError('Failed to send verification email');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="text-amber-600 text-xl flex-shrink-0 mt-0.5">{"\u26A0\uFE0F"}</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-amber-800">
              {dict.verification?.bannerTitle ?? 'Email not verified'}
            </p>
            <p className="text-sm text-amber-700 mt-0.5">
              {dict.verification?.bannerDesc ?? 'Please verify your email to access all features.'}
            </p>
            {sent && (
              <p className="text-sm text-green-700 mt-1 font-medium">
                {dict.verification?.resent ?? 'Verification email sent! Check your inbox.'}
              </p>
            )}
            {error && (
              <p className="text-sm text-red-600 mt-1">{error}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            size="sm"
            onClick={handleResend}
            disabled={sending || sent}
          >
            {sending
              ? (dict.common?.loading ?? 'Loading...')
              : sent
                ? (dict.verification?.sentButton ?? 'Sent')
                : (dict.verification?.resendButton ?? 'Resend Email')}
          </Button>
          <button
            onClick={() => setDismissed(true)}
            className="text-amber-400 hover:text-amber-600 p-1 min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label={dict.common?.close ?? 'Close'}
          >
            {"\u2715"}
          </button>
        </div>
      </div>
    </div>
  );
}