import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || authHeader !== "Bearer " + cronSecret) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = createAdminClient();
  const today = new Date().toISOString().split("T")[0];
  const reminders: any[] = [];

  try {
    const { data: profiles } = await supabase.from("profiles").select("id, email, full_name, visa_expiry_date").not("visa_expiry_date", "is", null);
    if (profiles) {
      for (const p of profiles) {
        const days = Math.ceil((new Date(p.visa_expiry_date!).getTime() - Date.now()) / 86400000);
        if ([90, 60, 30, 14, 7, 3, 1, 0].includes(days)) {
          const { data: existing } = await supabase.from("reminders").select("id").eq("user_id", p.id).eq("reminder_type", "visa_expiry").eq("scheduled_for", today).limit(1);
          if (!existing || existing.length === 0) {
            const title = days === 0 ? "Your visa expires TODAY!" : "Your visa expires in " + days + " days";
            const { data: r } = await supabase.from("reminders").insert({ user_id: p.id, reminder_type: "visa_expiry", title, message: "Start renewal process.", status: "pending", scheduled_for: today }).select().single();
            if (r) reminders.push({ ...r, user_email: p.email });
          }
        }
      }
    }

    const { data: dls } = await supabase.from("deadlines").select("*").eq("is_completed", false).lte("remind_at", today);
    if (dls) {
      for (const dl of dls) {
        const days = Math.ceil((new Date(dl.due_date).getTime() - Date.now()) / 86400000);
        if ([14, 7, 3, 1, 0].includes(days) || days < 0) {
          const { data: existing } = await supabase.from("reminders").select("id").eq("user_id", dl.user_id).eq("deadline_id", dl.id).eq("scheduled_for", today).limit(1);
          if (!existing || existing.length === 0) {
            const title = days < 0 ? "OVERDUE: " + dl.title : days === 0 ? "Due TODAY: " + dl.title : dl.title + " - " + days + " days left";
            const { data: r } = await supabase.from("reminders").insert({ user_id: dl.user_id, deadline_id: dl.id, reminder_type: "deadline", title, message: dl.description, status: "pending", scheduled_for: today }).select().single();
            if (r) reminders.push(r);
          }
        }
      }
    }

    return NextResponse.json({ success: true, date: today, reminders_generated: reminders.length, reminders });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to generate reminders" }, { status: 500 });
  }
}
