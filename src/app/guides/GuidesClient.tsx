"use client";

import { useState } from "react";
import Link from "next/link";
import { blogPosts, BLOG_CATEGORIES, BlogCategory } from "@/lib/blog";
import { useDict } from "@/lib/i18n/context";
import { CategoryIcon } from "@/components/ui/CategoryIcon";

export default function GuidesClient() {
  const dict = useDict();
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered =
    activeCategory === "all"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

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

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 border dark:border-gray-700"
            }`}
          >
            {dict?.guides?.allGuides ?? "All Guides"} ({blogPosts.length})
          </button>
          {categories.map(([key, cat]) => {
            const count = blogPosts.filter((p) => p.category === key).length;
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
      </div>

      {/* Article Grid */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post) => {
            const cat =
              BLOG_CATEGORIES[post.category as BlogCategory];
            return (
              <Link
                key={post.slug}
                href={`/guides/${post.slug}`}
                className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 hover:shadow-lg transition-shadow overflow-hidden group"
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
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {dict?.guides?.noGuides ?? "No guides in this category yet. Check back soon!"}
          </div>
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
