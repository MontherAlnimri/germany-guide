import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Check if this is a recovery flow
      // Supabase sets the session user with a recovery AMR claim
      const session = data?.session;
      if (session) {
        const amr = session.user?.amr;
        const isRecovery = amr?.some((a: { method: string }) => a.method === "otp" || a.method === "recovery");
        if (isRecovery && next === "/dashboard") {
          // User came from password reset email, redirect to reset page
          return NextResponse.redirect(origin + "/reset-password");
        }
      }
      return NextResponse.redirect(origin + next);
    }
  }

  return NextResponse.redirect(origin + "/login?error=auth_callback_error");
}