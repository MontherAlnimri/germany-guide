"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDict } from "@/lib/i18n/context";
import { trackEvent, identifyUser } from "@/lib/analytics";

export default function LoginPage() {
  const dict = useDict();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setShowVerificationMessage(false);
    setLoading(true);

    const supabase = createClient();
    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError) {
      if (signInError.message.toLowerCase().includes("email not confirmed")) {
        setShowVerificationMessage(true);
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    if (data.user && !data.user.email_confirmed_at) {
      setShowVerificationMessage(true);
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    if (data.user) {
      trackEvent("user_logged_in", { method: "email" });
      identifyUser(data.user.id, { email: data.user.email ?? undefined });
    }

    router.push("/dashboard");
    router.refresh();
  };

  const handleResendVerification = async () => {
    if (!email) return;
    setLoading(true);
    const supabase = createClient();
    const { error: resendError } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback?next=/dashboard`,
      },
    });
    setLoading(false);
    if (resendError) {
      setError(resendError.message);
    } else {
      setError("");
      setShowVerificationMessage(true);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="glass-dark rounded-2xl shadow-premium-lg p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-500/25">
            <span className="text-2xl text-white">{"\uD83C\uDDE9\uD83C\uDDEA"}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{dict.auth.loginTitle}</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">{dict.auth.loginSubtitle}</p>
        </div>

        {showVerificationMessage && (
          <div className="bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700/50 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <span className="text-amber-500 text-xl flex-shrink-0">{"\uD83D\uDCE7"}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">
                  {dict.verification?.checkEmailTitle ?? "Check your email"}
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  {dict.verification?.checkEmailDesc ?? "We sent a verification link to:"}
                </p>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mt-1">{email}</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                  {dict.verification?.checkEmailHint ?? "Click the link in the email to verify your account, then sign in."}
                </p>
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                >
                  {dict.verification?.resendButton ?? "Resend verification email"}
                </button>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm rounded-xl p-3 border border-red-100 dark:border-red-700/50">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{dict.auth.email}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 dark:text-white outline-none transition-all min-h-[44px]"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{dict.auth.password}</label>
              <Link
                href="/forgot-password"
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                {dict.auth.forgotPassword}
              </Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white dark:focus:bg-gray-800 dark:text-white outline-none transition-all min-h-[44px]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 min-h-[48px] shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30"
          >
            {loading ? dict.common.loading : dict.auth.signIn}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          {dict.auth.noAccount}{" "}
          <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            {dict.auth.createOne}
          </Link>
        </p>
      </div>
    </div>
  );
}