"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { blogPosts, BLOG_CATEGORIES, BlogCategory, getRelevantPosts } from "@/lib/blog";
import { useDict } from "@/lib/i18n/context";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, BookOpen } from "lucide-react";

interface UserProfile {
  visa_type: string | null;
  first_vs_renewal: string | null;
}

function GuideCard({ post }: { post: (typeof blogPosts)[number] }) {
  const dict = useDict();
  const cat = BLOG_CATEGORIES[post.category as BlogCategory];

  return (
    <Link
      href={`/guides/${post.slug}`}
      className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 hover:shadow-lg dark:hover:shadow-gray-900/50 transition-shadow overflow-hidden group"
    >
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <CategoryIcon category={post.category} className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/50 px-2 py-1 rounded-full">
            {cat?.label}
          </span>
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 mb-2">
          {post.title}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
          {post.description}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>{post.readingTime} {dict?.guides?.minRead ?? "min read"}</span>
          <span>{dict?.guides?.updated ?? "Updated"} {post.updatedAt}</span>
        </div>
      </div>
    </Link>
  );
}

export default function GuidesClient() {
  const dict = useDict();
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("visa_type, first_vs_renewal")
          .eq("id", user.id)
          .single();
        if (data) setProfile(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  const { recommended, essential, other } = getRelevantPosts(
    profile?.visa_type,
    profile?.first_vs_renewal
  );

  const hasPersonalization = profile?.visa_type && (recommended.length > 0 || essential.length > 0);

  // For category filtering in "All Guides" / "Other Guides" section
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
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
          <Link
            href="/"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm mb-4 inline-block"
          >
            &larr; {dict?.guides?.backToHome ?? "Back to Home"}
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mt-2">
            {dict?.guides?.pageTitle ?? "Germany Guides"}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-2 max-w-2xl">
            {dict?.guides?.pageSubtitle ?? "Comprehensive, free guides for navigating German bureaucracy. Written by expats who have been through it all."}
          </p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-10">
        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 mb-3" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <>
            {/* Recommended for You */}
            {hasPersonalization && recommended.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="w-6 h-6 text-amber-500" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dict?.guides?.recommendedForYou ?? "Recommended for You"}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 ml-9">
                  {dict?.guides?.basedOnProfile ?? "Based on your visa type and application status"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recommended.map((post) => (
                    <GuideCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Essential Guides */}
            {hasPersonalization && essential.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-2">
                  <BookOpen className="w-6 h-6 text-blue-500 dark:text-blue-400" />
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {dict?.guides?.essentialGuides ?? "Essential Guides"}
                  </h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 ml-9">
                  {dict?.guides?.basedOnProfile ?? "Based on your visa type and application status"}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {essential.map((post) => (
                    <GuideCard key={post.slug} post={post} />
                  ))}
                </div>
              </section>
            )}

            {/* Category Filter + All/Other Guides */}
            <section>
              {hasPersonalization && (
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  {dict?.guides?.otherGuides ?? "Other Guides"}
                </h2>
              )}

              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeCategory === "all"
                      ? "bg-blue-600 text-white"
                      : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border dark:border-gray-700"
                  }`}
                >
                  {dict?.guides?.allGuides ?? "All Guides"} ({hasPersonalization ? other.length : blogPosts.length})
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
                          ? "bg-blue-600 text-white"
                          : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border dark:border-gray-700"
                      }`}
                    >
                      <CategoryIcon category={key} className="w-4 h-4 inline-block mr-1" /> {cat.label} ({count})
                    </button>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {otherFiltered.map((post) => (
                  <GuideCard key={post.slug} post={post} />
                ))}
              </div>

              {otherFiltered.length === 0 && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  {dict?.guides?.noGuides ?? "No guides in this category yet. Check back soon!"}
                </div>
              )}
            </section>
          </>
        )}
      </div>

      {/* SEO Content */}
      <section className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {dict?.guides?.aboutTitle ?? "About Our Germany Guides"}
          </h2>
          <div className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Moving to Germany is an exciting adventure, but navigating the
              German bureaucratic system can be overwhelming. From registering
              your address (Anmeldung) to understanding the health insurance
              system, opening a bank account, and filing taxes — there are
              dozens of steps that must be completed, often with strict
              deadlines.
            </p>
            <p>
              Our free guides are written by expats and international
              professionals who have personally navigated every step of the
              process. Each guide provides practical, up-to-date information
              for 2025, including required documents, costs, timelines, and
              insider tips that you will not find on official government
              websites.
            </p>
            <p>
              Whether you are a student applying for a visa, a skilled worker
              with a Blue Card, or a freelancer setting up in Berlin — our
              guides cover every scenario. All guides are free to read and
              regularly updated to reflect the latest regulations and
              requirements.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm">
        <div className="max-w-6xl mx-auto px-4 py-8 flex flex-wrap gap-4 justify-between">
          <p>&copy; {new Date().getFullYear()} {dict?.common?.appName ?? "Germany Guide"}</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/about" className="hover:text-white">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
