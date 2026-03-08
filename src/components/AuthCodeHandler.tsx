"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCodeHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const handleCode = async () => {
      const supabase = createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data.session) {
        // Check if recovery flow by looking at session user amr
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = data.session as any;
        const amr = raw?.user?.amr as { method: string }[] | undefined;
        const isRecovery = amr?.some((a) => a.method === "otp" || a.method === "recovery");

        if (isRecovery) {
          router.replace("/reset-password");
        } else {
          router.replace("/dashboard");
        }
      }
    };

    handleCode();
  }, [searchParams, router]);

  const code = searchParams.get("code");
  if (!code) return null;

  return (
    <div className="fixed inset-0 bg-white z-[9999] flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Processing...</p>
      </div>
    </div>
  );
}