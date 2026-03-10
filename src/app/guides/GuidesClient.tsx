"use client";

import { useState } from "react";
import Link from "next/link";
import { blogPosts, BLOG_CATEGORIES, BlogCategory } from "@/lib/blog";

export default function GuidesClient() {
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-10">
          <Link
            href="/"
            className="text-blue-600 hover:text-blue-700 text-sm mb-4 inline-block"
          >
            &larr; Back to Home
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
            Germany Guides
          </h1>
          <p className="text-lg text-gray-600 mt-2 max-w-2xl">
            Comprehensive, free guides for navigating German bureaucracy.
            Written by expats who have been through it all.
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
                : "bg-white text-gray-600 hover:bg-gray-100 border"
            }`}
          >
            All Guides ({blogPosts.length})
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
                    : "bg-white text-gray-600 hover:bg-gray-100 border"
                }`}
              >
                {cat.icon} {cat.label} ({count})
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
                className="bg-white rounded-xl border hover:shadow-lg transition-shadow overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg">{cat?.icon}</span>
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                      {cat?.label}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {post.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{post.readingTime} min read</span>
                    <span>Updated {post.updatedAt}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No guides in this category yet. Check back soon!
          </div>
        )}
      </div>

      {/* SEO Content */}
      <section className="bg-white border-t">
        <div className="max-w-4xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            About Our Germany Guides
          </h2>
          <div className="prose prose-gray max-w-none">
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
          <p>&copy; {new Date().getFullYear()} Germany Guide</p>
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