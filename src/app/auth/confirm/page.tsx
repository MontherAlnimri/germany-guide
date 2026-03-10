'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function AuthConfirmPage() {
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function handleConfirmation() {
      try {
        const hash = window.location.hash;
        if (!hash) {
          const params = new URLSearchParams(window.location.search);
          const code = params.get('code');
          if (code) {
            const supabase = createClient();
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
              setStatus('error');
              setMessage(error.message);
            } else {
              setStatus('success');
              setMessage('Email verified successfully!');
              setTimeout(() => router.push('/dashboard'), 2000);
            }
          } else {
            setStatus('error');
            setMessage('No confirmation token found.');
          }
          return;
        }

        const hashParams = new URLSearchParams(hash.substring(1));
        const type = hashParams.get('type');
        const tokenHash = hashParams.get('token_hash') || hashParams.get('access_token');

        if (!tokenHash) {
          setStatus('error');
          setMessage('No confirmation token found.');
          return;
        }

        const supabase = createClient();

        if (type === 'recovery') {
          const { error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: 'recovery',
          });
          if (error) {
            setStatus('error');
            setMessage(error.message);
          } else {
            router.push('/reset-password');
          }
          return;
        }

        const otpType = type === 'email_change' ? 'email_change' : 'signup';
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: otpType as 'signup' | 'email_change',
        });

        if (error) {
          setStatus('error');
          setMessage(error.message);
        } else {
          setStatus('success');
          setMessage(type === 'email_change' ? 'Email updated successfully!' : 'Email verified successfully!');
          setTimeout(() => router.push('/dashboard'), 2000);
        }
      } catch {
        setStatus('error');
        setMessage('An unexpected error occurred.');
      }
    }

    handleConfirmation();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="text-center max-w-md">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Verifying your email...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-5xl mb-4">{"\u2705"}</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">{message}</h1>
            <p className="text-gray-600">Redirecting to dashboard...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-5xl mb-4">{"\u274C"}</div>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Verification Failed</h1>
            <p className="text-red-600 mb-4">{message}</p>
            <button
              onClick={() => router.push('/login')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Go to Sign In
            </button>
          </>
        )}
      </div>
    </div>
  );
}