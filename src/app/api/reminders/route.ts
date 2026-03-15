import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { resend, EMAIL_FROM } from "@/lib/email/resend";
import { deadlineReminderEmail, visaExpiryEmail } from "@/lib/email/templates";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== "Bearer " + cronSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];
  const emailsSent: string[] = [];
  const errors: string[] = [];

  try {
    // === VISA EXPIRY REMINDERS ===
    const { data: profiles } = await supabase
      .from("profiles")
      .select("id, email, full_name, visa_expiry_date")
      .not("visa_expiry_date", "is", null);

    if (profiles) {
      for (const p of profiles) {
        if (!p.email || !p.visa_expiry_date) continue;
        const days = Math.ceil(
          (new Date(p.visa_expiry_date).getTime() - Date.now()) / 86400000
        );

        if ([90, 60, 30, 14, 7, 3, 1, 0].includes(days)) {
          try {
            const template = visaExpiryEmail(
              p.full_name || "",
              days,
              new Date(p.visa_expiry_date).toLocaleDateString("en-DE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })
            );

            const { error: sendError } = await resend.emails.send({
              from: EMAIL_FROM,
              to: p.email,
              subject: template.subject,
              html: template.html,
            });

            if (sendError) {
              errors.push(`Visa email to ${p.email}: ${sendError.message}`);
            } else {
              emailsSent.push(`visa-expiry:${p.email}:${days}d`);
            }
          } catch (err) {
            errors.push(`Visa email to ${p.email}: ${String(err)}`);
          }
        }
      }
    }

    // === DEADLINE REMINDERS ===
    const { data: deadlines } = await supabase
      .from("deadlines")
      .select("*, profiles!inner(email, full_name)")
      .eq("is_done", false)
      .not("remind_at", "is", null)
      .lte("remind_at", today);

    if (deadlines) {
      for (const dl of deadlines) {
        const profile = (dl as any).profiles;
        if (!profile?.email) continue;

        const days = Math.ceil(
          (new Date(dl.due_date).getTime() - Date.now()) / 86400000
        );

        if ([14, 7, 3, 1, 0].includes(days) || days < 0) {
          try {
            const template = deadlineReminderEmail(
              profile.full_name || "",
              dl.title,
              new Date(dl.due_date).toLocaleDateString("en-DE", {
                year: "numeric",
                month: "long",
                day: "numeric",
              }),
              days
            );

            const { error: sendError } = await resend.emails.send({
              from: EMAIL_FROM,
              to: profile.email,
              subject: template.subject,
              html: template.html,
            });

            if (sendError) {
              errors.push(`Deadline email to ${profile.email}: ${sendError.message}`);
            } else {
              emailsSent.push(`deadline:${profile.email}:${dl.title}`);
            }
          } catch (err) {
            errors.push(`Deadline email to ${profile.email}: ${String(err)}`);
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      date: today,
      emails_sent: emailsSent.length,
      emails: emailsSent,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to send reminders" },
      { status: 500 }
    );
  }
}