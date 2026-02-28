import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const ADMIN_EMAILS = ["montheralnimri2003@gmail.com"];

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes(user.email || "")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const [usersRes, subsRes, tipsRes, flowsRes, docsRes] = await Promise.all([
    supabase.from("profiles").select("id, full_name, visa_type, city, is_premium, created_at", { count: "exact" }),
    supabase.from("subscriptions").select("*").eq("status", "active"),
    supabase.from("tips").select("amount, status, created_at").eq("status", "succeeded"),
    supabase.from("flow_instances").select("id", { count: "exact", head: true }),
    supabase.from("documents").select("id", { count: "exact", head: true }),
  ]);

  const totalUsers = usersRes.count || 0;
  const activeSubscriptions = subsRes.data?.length || 0;
  const totalTipRevenue = (tipsRes.data || []).reduce((sum, t) => sum + t.amount, 0);
  const totalFlows = flowsRes.count || 0;
  const totalDocuments = docsRes.count || 0;

  const monthlySubscribers = (subsRes.data || []).filter((s) => s.plan === "monthly").length;
  const yearlySubscribers = (subsRes.data || []).filter((s) => s.plan === "yearly").length;

  const mrr = monthlySubscribers * 499 + yearlySubscribers * Math.round(3999 / 12);

  return NextResponse.json({
    totalUsers,
    activeSubscriptions,
    monthlySubscribers,
    yearlySubscribers,
    mrr,
    totalTipRevenue,
    totalFlows,
    totalDocuments,
    recentUsers: (usersRes.data || [])
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 20),
    recentTips: (tipsRes.data || [])
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10),
  });
}