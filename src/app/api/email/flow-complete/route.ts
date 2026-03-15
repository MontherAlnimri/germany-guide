import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, EMAIL_FROM } from "@/lib/email/resend";
import { flowCompletionEmail } from "@/lib/email/templates";

export async function POST(request: NextRequest) {
  try {
    const { userId, flowTitle } = await request.json();
    if (!userId || !flowTitle) {
      return NextResponse.json({ error: "Missing userId or flowTitle" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", userId)
      .single();

    if (!profile?.email) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const template = flowCompletionEmail(profile.full_name || "", flowTitle);

    const { error: sendError } = await resend.emails.send({
      from: EMAIL_FROM,
      to: profile.email,
      subject: template.subject,
      html: template.html,
    });

    if (sendError) {
      return NextResponse.json({ error: sendError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send completion email" },
      { status: 500 }
    );
  }
}