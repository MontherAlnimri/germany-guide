"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDict } from "@/lib/i18n/context";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import AdBanner from "@/components/AdBanner";
import AffiliateSection from "@/components/AffiliateSection";
import UsageBar from "@/components/ui/UsageBar";
import Link from "next/link";

interface Profile {
  full_name: string;
  visa_type: string;
  city: string;
  onboarding_complete: boolean;
}

interface FlowInstance {
  id: string;
  status: string;
  progress: number;
  flow_variant_id: string;
}

interface Deadline {
  id: string;
  title: string;
  due_date: string;
  is_done: boolean;
}

export default function DashboardPage() {
  const dict = useDict();
  const d = dict.dashboard;
  const router = useRouter();
  const { isPremium } = useSubscription();
  const { flowCount, documentCount, maxFlows, maxDocuments } = useUsageLimits();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [flows, setFlows] = useState<FlowInstance[]>([]);
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [docCount, setDocCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [profileRes, flowRes, deadlineRes, docRes] = await Promise.all([
        supabase.from("profiles").select("full_name, visa_type, city, onboarding_complete").eq("id", user.id).single(),
        supabase.from("flow_instances").select("id, status, progress, flow_variant_id").eq("user_id", user.id).order("updated_at", { ascending: false }).limit(5),
        supabase.from("deadlines").select("id, title, due_date, is_done").eq("user_id", user.id).eq("is_done", false).order("due_date").limit(5),
        supabase.from("documents").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);

      if (profileRes.data) {
        setProfile(profileRes.data);
        if (!profileRes.data.onboarding_complete) {
          router.push("/onboarding");
          return;
        }
      }
      if (flowRes.data) setFlows(flowRes.data);
      if (deadlineRes.data) setDeadlines(deadlineRes.data);
      setDocCount(docRes.count || 0);
      setLoading(false);
    }
    load();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">{dict.common?.loading || "Loading..."}</div>
      </div>
    );
  }

  const activeFlows = flows.filter((f) => f.status === "in_progress").length;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {d?.welcome || "Welcome back"}{profile?.full_name ? `, ${profile.full_name}` : ""}
        </h1>
        <p className="text-gray-500 text-sm mt-1">{d?.overview || "Overview"}</p>
      </div>

      {!isPremium && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
          <h2 className="text-lg font-bold mb-1">{d?.premiumBanner || "Upgrade to Premium"}</h2>
          <p className="text-blue-100 text-sm mb-4">{d?.premiumBannerDesc || "Get unlimited flows, documents, ad-free experience, and more."}</p>
          <Link href="/premium" className="inline-block bg-white text-blue-700 px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-50 transition-colors">
            {d?.premiumBannerCta || "Upgrade Now"}
          </Link>
        </div>
      )}

      {!isPremium && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UsageBar label={dict.flows?.title || "Flows"} current={flowCount} max={maxFlows as number} isPremium={isPremium} />
          <UsageBar label={dict.docs?.title || "Documents"} current={documentCount} max={maxDocuments as number} isPremium={isPremium} />
        </div>
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-2xl font-bold text-blue-600">{activeFlows}</p>
          <p className="text-sm text-gray-500 mt-1">{d?.activeFlows || "Active Flows"}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-2xl font-bold text-green-600">{docCount}</p>
          <p className="text-sm text-gray-500 mt-1">{d?.totalDocuments || "Documents"}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 text-center">
          <p className="text-2xl font-bold text-purple-600">{deadlines.length}</p>
          <p className="text-sm text-gray-500 mt-1">{d?.upcomingDeadlines || "Deadlines"}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <button onClick={() => router.push("/flow")} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl mb-2">{"\u{1F4CB}"}</div>
          <p className="text-sm font-medium text-gray-700">{dict.nav?.flows || "Flows"}</p>
        </button>
        <button onClick={() => router.push("/documents")} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl mb-2">{"\u{1F4C2}"}</div>
          <p className="text-sm font-medium text-gray-700">{dict.nav?.documents || "Documents"}</p>
        </button>
        <button onClick={() => router.push("/deadlines")} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl mb-2">{"\u{23F0}"}</div>
          <p className="text-sm font-medium text-gray-700">{dict.nav?.deadlines || "Deadlines"}</p>
        </button>
        <button onClick={() => router.push("/support")} className="bg-white rounded-xl border border-gray-200 p-4 text-center hover:shadow-md transition-shadow">
          <div className="text-2xl mb-2">{"\u{2764}"}</div>
          <p className="text-sm font-medium text-gray-700">{d?.tipCardCta || "Leave a Tip"}</p>
        </button>
      </div>

      {flows.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">{d?.recentFlows || "Recent Flows"}</h2>
            <button onClick={() => router.push("/flow")} className="text-sm text-blue-600 hover:text-blue-800 font-medium">{d?.viewAll || "View All"}</button>
          </div>
          <div className="space-y-3">
            {flows.slice(0, 3).map((flow) => (
              <div key={flow.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between cursor-pointer hover:shadow-sm transition-shadow" onClick={() => router.push(`/flow/${flow.id}`)}>
                <div>
                  <p className="font-medium text-gray-900 text-sm">Flow</p>
                  <p className="text-xs text-gray-500">{flow.status === "completed" ? dict.flows?.completed || "Completed" : dict.flows?.inProgress || "In Progress"}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-blue-600">{flow.progress}%</span>
                  <div className="w-16 bg-gray-200 rounded-full h-1.5">
                    <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${flow.progress}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {deadlines.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-gray-800">{d?.upcomingDeadlines || "Upcoming Deadlines"}</h2>
            <button onClick={() => router.push("/deadlines")} className="text-sm text-blue-600 hover:text-blue-800 font-medium">{d?.viewAll || "View All"}</button>
          </div>
          <div className="space-y-3">
            {deadlines.map((dl) => {
              const daysLeft = Math.ceil((new Date(dl.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
              return (
                <div key={dl.id} className="bg-white rounded-lg border border-gray-200 p-4 flex items-center justify-between">
                  <p className="font-medium text-gray-900 text-sm">{dl.title}</p>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${daysLeft <= 7 ? "bg-red-100 text-red-700" : daysLeft <= 30 ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}`}>
                    {daysLeft > 0 ? `${daysLeft} ${dict.deadlines?.daysLeft || "days left"}` : dict.deadlines?.overdue || "Overdue"}
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-semibold text-gray-900 mb-1">{d?.tipCard || "Support Germany Guide"}</h3>
        <p className="text-sm text-gray-500 mb-4">{d?.tipCardDesc || "Help us keep the service running and improving."}</p>
        <Link href="/support" className="inline-block bg-pink-50 text-pink-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-pink-100 transition-colors">
          {"\u2764"} {d?.tipCardCta || "Leave a Tip"}
        </Link>
      </div>

      <AdBanner />
      <AffiliateSection />
    </div>
  );
}