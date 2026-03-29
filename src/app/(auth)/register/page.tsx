'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useDict } from '@/lib/i18n/context';
import { trackEvent } from '@/lib/analytics';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';

export default function RegisterPage() {
  const dict = useDict();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError(dict.auth?.passwordTooShort ?? 'Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError(dict.auth?.passwordMismatch ?? 'Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/onboarding`,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      const needsConfirmation = data.user && !data.user.email_confirmed_at;

      if (needsConfirmation) {
        await supabase.auth.signOut();
        trackEvent("user_signed_up", { method: "email" });
        setRegistered(true);
      } else {
        setRegistered(true);
      }
    } catch {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (registered) {
    return (
      <div className="w-full max-w-md">
        <div className="glass-dark rounded-2xl shadow-premium-lg p-6 sm:p-8 text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <span className="text-3xl">{"\uD83D\uDCE7"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {dict.verification?.checkEmailTitle ?? 'Check your email'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            {dict.verification?.checkEmailDesc ?? 'We sent a verification link to:'}
          </p>
          <p className="font-medium text-gray-900 dark:text-white mb-6">{email}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            {dict.verification?.checkEmailHint ?? 'Click the link in the email to verify your account, then sign in.'}
          </p>
          <Link href="/login">
            <Button variant="outline" className="w-full">
              {dict.auth?.backToLogin ?? 'Back to Sign In'}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="glass-dark rounded-2xl shadow-premium-lg p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <span className="text-2xl text-white">{"\u{2728}"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {dict.auth?.registerTitle ?? 'Create Account'}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
            {dict.auth?.registerDesc ?? 'Start your journey in Germany'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700/50 text-red-700 dark:text-red-400 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {dict.auth?.fullName ?? 'Full Name'}
            </label>
            <Input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="Max Mustermann"
              className="min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {dict.auth?.email ?? 'Email'}
            </label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              className="min-h-[44px]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {dict.auth?.password ?? 'Password'}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="********"
              className="min-h-[44px]"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {dict.auth?.passwordHint ?? 'At least 6 characters'}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {dict.auth?.confirmPassword ?? 'Confirm Password'}
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="********"
              className="min-h-[44px]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 min-h-[48px] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
          >
            {loading ? (dict.common?.loading ?? 'Loading...') : (dict.auth?.signUp ?? 'Sign Up')}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          {dict.auth?.hasAccount ?? 'Already have an account?'}{' '}
          <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            {dict.auth?.signInLink ?? 'Sign In'}
          </Link>
        </p>
      </div>
    </div>
  );
}