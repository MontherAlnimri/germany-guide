"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { blogPosts, BLOG_CATEGORIES, BlogCategory, getRelevantPosts } from "@/lib/blog";
import { useDict } from "@/lib/i18n/context";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, BookOpen, ArrowRight, Play, CheckCircle2, Clock, ChevronRight } from "lucide-react";

interface UserProfile {
  visa_type: string | null;
  first_vs_renewal: string | null;
  city: string | null;
  full_name: string | null;
}

interface BaseFlow {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: string;
}

interface FlowVariant {
  id: string;
  base_flow_id: string;
  visa_type: string;
  first_vs_renewal: string;
}

interface FlowInstance {
  id: string;
  flow_variant_id: string;
  status: string;
  progress: number;
  created_at: string;
}

function formatVisaLabel(v: string) {
  return v.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function GuideCard({ post }: { post: (typeof blogPosts)[number] }) {
  const dict = useDict();
  const cat = BLOG_CATEGORIES[post.category as BlogCategory];

  return (
    <Link
      href={`/guides/${post.slug}`}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 hover:border-blue-200 dark:hover:border-blue-700 transition-all duration-200 overflow-hidden group"
    >
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <CategoryIcon category={post.category} className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 px-2 py-0.5 rounded-full">
            {cat?.label}
          </span>
        </div>
        <h3 className="text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
          {post.title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
          {post.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>{post.readingTime} {dict?.guides?.minRead ?? "min read"}</span>
          <ChevronRight className="w-4 h-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </Link>
  );
}

export default function GuidesClient() {
  const dict = useDict();
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [baseFlows, setBaseFlows] = useState<BaseFlow[]>([]);
  const [variants, setVariants] = useState<FlowVariant[]>([]);
  const [instances, setInstances] = useState<FlowInstance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setIsAuthenticated(true);

      const [profileRes, baseRes, variantRes, instanceRes] = await Promise.all([
        supabase.from("profiles").select("visa_type, first_vs_renewal, city, full_name").eq("id", user.id).single(),
        supabase.from("base_flows").select("*"),
        supabase.from("flow_variants").select("*"),
        supabase.from("flow_instances").select("*").eq("user_id", user.id),
      ]);

      if (profileRes.data) setProfile(profileRes.data);
      if (baseRes.data) setBaseFlows(baseRes.data);
      if (variantRes.data) setVariants(variantRes.data);
      if (instanceRes.data) setInstances(instanceRes.data);
      setLoading(false);
    }
    load();
  }, []);

  const startFlow = async (variantId: string) => {
    setStartingId(variantId);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: steps } = await supabase
        .from("flow_steps")
        .select("*")
        .eq("flow_variant_id", variantId)
        .order("step_order");

      const snapshot = (steps || []).map((s: Record<string, unknown>) => ({
        ...s,
        is_done: false,
        user_notes: "",
      }));

      const { data: instance } = await supabase
        .from("flow_instances")
        .insert({
          user_id: user.id,
          flow_variant_id: variantId,
          status: "in_progress",
          progress: 0,
          step_snapshot: snapshot,
        })
        .select()
        .single();

      if (instance) {
        router.push(`/flow/${instance.id}`);
      }
    } catch (err) {
      console.error("Error starting flow:", err);
    } finally {
      setStartingId(null);
    }
  };

  const getBaseFlow = (bfId: string) => baseFlows.find((b) => b.id === bfId);

  // Active flow instances
  const activeInstances = instances.filter((i) => i.status !== "completed");
  const completedInstances = instances.filter((i) => i.status === "completed");

  // Recommended variants: match user profile, not yet started
  const recommendedVariants = profile?.visa_type
    ? variants.filter(
        (v) =>
          v.visa_type === profile.visa_type &&
          v.first_vs_renewal === (profile.first_vs_renewal || "first") &&
          !instances.some((i) => i.flow_variant_id === v.id)
      )
    : [];

  // Blog posts sorting
  const { recommended, essential, other } = getRelevantPosts(
    profile?.visa_type,
    profile?.first_vs_renewal
  );

  const hasPersonalization = profile?.visa_type && (recommended.length > 0 || essential.length > 0);

  const otherFiltered =
    activeCategory === "all"
      ? (hasPersonalization ? other : blogPosts)
      : (hasPersonalization ? other : blogPosts).filter((p) => p.category === activeCategory);

  const categories = Object.entries(BLOG_CATEGORIES) as [
    BlogCategory,
    (typeof BLOG_CATEGORIES)[BlogCategory]
  ][];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
        <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12">
          <Link
            href="/"
            className="text-blue-200 hover:text-white text-sm mb-4 inline-flex items-center gap-1"
          >
            &larr; {dict?.guides?.backToHome ?? "Back to Home"}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold mt-2">
            {isAuthenticated && profile?.visa_type
              ? `Your ${formatVisaLabel(profile.visa_type)} Guide`
              : dict?.guides?.pageTitle ?? "Germany Guides"}
          </h1>
          <p className="text-blue-100 mt-2 max-w-2xl text-lg">
            {isAuthenticated && profile?.visa_type
              ? `Step-by-step guidance personalized for ${formatVisaLabel(profile.visa_type)} holders${profile.city && profile.city !== "Other" ? ` in ${profile.city}` : ""}`
              : dict?.guides?.pageSubtitle ?? "Comprehensive, free guides for navigating German bureaucracy."}
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl border dark:border-gray-700 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <>
            {/* ===== FLOW-FIRST SECTION: Active Flows ===== */}
            {isAuthenticated && activeInstances.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-xl">
                    <Play className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Continue Your Guides
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Pick up where you left off
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeInstances.map((instance) => {
                    const variant = variants.find((v) => v.id === instance.flow_variant_id);
                    const base = variant ? getBaseFlow(variant.base_flow_id) : null;
                    return (
                      <div
                        key={instance.id}
                        onClick={() => router.push(`/flow/${instance.id}`)}
                        className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-blue-200 dark:border-blue-700/50 p-5 cursor-pointer hover:shadow-lg hover:border-blue-400 dark:hover:border-blue-500 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{base?.icon || "📋"}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white truncate">
                              {base?.title || "Flow"}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                              {base?.description}
                            </p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                              {instance.progress}%
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${instance.progress}%` }}
                          />
                        </div>
                        <div className="mt-3 flex items-center justify-end">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 group-hover:gap-2 transition-all">
                            Continue <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ===== FLOW-FIRST SECTION: Recommended Flows to Start ===== */}
            {isAuthenticated && recommendedVariants.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-xl">
                    <Sparkles className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Start a New Guide
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Personalized step-by-step guides matched to your {formatVisaLabel(profile?.visa_type || "")}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedVariants.map((variant) => {
                    const base = getBaseFlow(variant.base_flow_id);
                    if (!base) return null;
                    return (
                      <div
                        key={variant.id}
                        className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl border-2 border-dashed border-blue-300 dark:border-blue-700 p-5 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md transition-all"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl">{base.icon || "📋"}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                              {base.title}
                            </h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                              {base.description}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => startFlow(variant.id)}
                          disabled={startingId === variant.id}
                          className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md shadow-blue-500/20 min-h-[44px] disabled:opacity-50"
                        >
                          {startingId === variant.id ? "Starting..." : "Start This Guide"}
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ===== Completed Flows ===== */}
            {isAuthenticated && completedInstances.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-xl">
                    <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Completed
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {completedInstances.map((instance) => {
                    const variant = variants.find((v) => v.id === instance.flow_variant_id);
                    const base = variant ? getBaseFlow(variant.base_flow_id) : null;
                    return (
                      <div
                        key={instance.id}
                        onClick={() => router.push(`/flow/${instance.id}`)}
                        className="bg-white dark:bg-gray-800 rounded-2xl border border-green-200 dark:border-green-800 p-4 cursor-pointer hover:shadow-md transition-all opacity-80 hover:opacity-100"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{base?.icon || "📋"}</span>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{base?.title || "Flow"}</h3>
                            <span className="text-xs text-green-600 dark:text-green-400 font-medium">Completed</span>
                          </div>
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* ===== Divider between flows and articles ===== */}
            {isAuthenticated && (activeInstances.length > 0 || recommendedVariants.length > 0) && (
              <div className="flex items-center gap-4 py-2">
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                <span className="text-sm font-medium text-gray-400 dark:text-gray-500 flex items-center gap-2">
                  <BookOpen className="w-4 h-4" /> Reference Articles
                </span>
                <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
              </div>
            )}

            {/* ===== Blog Articles: Recommended ===== */}
            {hasPersonalization && recommended.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {dict?.guides?.recommendedForYou ?? "Recommended Reading"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommended.map((post) => (
                    <GuideCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* ===== Blog Articles: Essential ===== */}
            {hasPersonalization && essential.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {dict?.guides?.essentialGuides ?? "Essential Reading"}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {essential.map((post) => (
                    <GuideCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* ===== Blog Articles: Category Filter ===== */}
            <section>
              {hasPersonalization && (
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                  {dict?.guides?.otherGuides ?? "More Articles"}
                </h2>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === "all"
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border dark:border-gray-700"
                  }`}
                >
                  All ({hasPersonalization ? other.length : blogPosts.length})
                </button>
                {categories.map(([key, cat]) => {
                  const pool = hasPersonalization ? other : blogPosts;
                  const count = pool.filter((p) => p.category === key).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveCategory(key)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeCategory === key
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border dark:border-gray-700"
                      }`}
                    >
                      <CategoryIcon category={key} className="w-4 h-4 inline-block mr-1" /> {cat.label} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {otherFiltered.map((post) => (
                  <GuideCard key={post.slug} post={post} />
                ))}
              </div>

              {otherFiltered.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {dict?.guides?.noGuides ?? "No guides in this category yet."}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm mt-8">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-wrap gap-4 justify-between">
          <p>&copy; {new Date().getFullYear()} {dict?.common?.appName ?? "Germany Guide"}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
            <Link href="/terms" className="hover:text-white">Terms</Link>
            <Link href="/about" className="hover:text-white">About</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
