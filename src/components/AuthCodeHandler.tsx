"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthCodeHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState("Processing...");

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code) return;

    const handleCode = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
          console.error("Code exchange error:", error.message);
          setStatus("Link expired or invalid. Redirecting...");
          setTimeout(() => router.replace("/login"), 2000);
          return;
        }

        if (data.session) {
          // Simple approach: check if user got here from a recovery email
          // by checking the url for recovery indicators or session amr
          let isRecovery = false;
          try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const raw = data.session as any;
            const amr = raw?.user?.amr;
            if (Array.isArray(amr)) {
              isRecovery = amr.some((a: { method: string }) => a.method === "otp" || a.method === "recovery");
            }
          } catch {
            // ignore amr check errors
          }

          if (isRecovery) {
            router.replace("/reset-password");
          } else {
            router.replace("/dashboard");
          }
          return;
        }

        setStatus("Something went wrong. Redirecting...");
        setTimeout(() => router.replace("/login"), 2000);
      } catch (err) {
        console.error("Auth handler error:", err);
        setStatus("Something went wrong. Redirecting...");
        setTimeout(() => router.replace("/login"), 2000);
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
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  );
}