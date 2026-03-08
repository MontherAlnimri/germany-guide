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
      const session = data?.session;
      if (session) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const raw = session as any;
        const amr = raw?.user?.amr as { method: string }[] | undefined;
        const isRecovery = amr?.some((a) => a.method === "otp" || a.method === "recovery");
        if (isRecovery && next === "/dashboard") {
          return NextResponse.redirect(origin + "/reset-password");
        }
      }
      return NextResponse.redirect(origin + next);
    }
  }

  return NextResponse.redirect(origin + "/login?error=auth_callback_error");
}