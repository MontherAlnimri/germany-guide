"use client";

import Link from "next/link";
import { getBlogPost, getRelatedPosts, BLOG_CATEGORIES, BlogCategory } from "@/lib/blog";
import { notFound } from "next/navigation";

function renderMarkdown(content: string) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let listOrdered = false;
  let key = 0;

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (listOrdered) {
        elements.push(
          <ol key={key++} className="list-decimal list-inside space-y-1 my-4 text-gray-700">
            {listItems}
          </ol>
        );
      } else {
        elements.push(
          <ul key={key++} className="list-disc list-inside space-y-1 my-4 text-gray-700">
            {listItems}
          </ul>
        );
      }
      listItems = [];
      inList = false;
    }
  };

  const flushTable = () => {
    if (inTable && tableHeaders.length > 0) {
      elements.push(
        <div key={key++} className="overflow-x-auto my-6">
          <table className="min-w-full border-collapse border border-gray-200 text-sm">
            <thead>
              <tr className="bg-gray-50">
                {tableHeaders.map((h, i) => (
                  <th
                    key={i}
                    className="border border-gray-200 px-4 py-2 text-left font-semibold text-gray-900"
                  >
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border border-gray-200 px-4 py-2 text-gray-700"
                    >
                      {formatInline(cell.trim())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableHeaders = [];
      tableRows = [];
      inTable = false;
    }
  };

  const formatInline = (text: string): React.ReactNode => {
    // Bold + links
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\[([^\]]+)\]\(([^)]+)\))/g;
    let last = 0;
    let match;
    let partKey = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) {
        parts.push(text.slice(last, match.index));
      }
      if (match[0].startsWith("**")) {
        parts.push(
          <strong key={partKey++} className="font-semibold text-gray-900">
            {match[0].slice(2, -2)}
          </strong>
        );
      } else if (match[2] && match[3]) {
        parts.push(
          <a
            key={partKey++}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline"
          >
            {match[2]}
          </a>
        );
      }
      last = match.index + match[0].length;
    }
    if (last < text.length) {
      parts.push(text.slice(last));
    }
    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Empty line
    if (trimmed === "") {
      flushList();
      flushTable();
      continue;
    }

    // Horizontal rule
    if (trimmed === "---") {
      flushList();
      flushTable();
      elements.push(<hr key={key++} className="my-8 border-gray-200" />);
      continue;
    }

    // Table
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed
        .split("|")
        .filter((c) => c.trim() !== "");

      // Check if separator row
      if (cells.every((c) => /^[\s-:]+$/.test(c))) {
        continue; // Skip separator
      }

      if (!inTable) {
        inTable = true;
        tableHeaders = cells;
      } else {
        tableRows.push(cells);
      }
      continue;
    } else if (inTable) {
      flushTable();
    }

    // Headers
    if (trimmed.startsWith("### ")) {
      flushList();
      elements.push(
        <h3 key={key++} className="text-xl font-bold text-gray-900 mt-8 mb-3">
          {formatInline(trimmed.slice(4))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      elements.push(
        <h2
          key={key++}
          className="text-2xl font-bold text-gray-900 mt-10 mb-4 pb-2 border-b"
        >
          {formatInline(trimmed.slice(3))}
        </h2>
      );
      continue;
    }

    // Checkbox list items
    if (trimmed.startsWith("- [ ] ") || trimmed.startsWith("- [x] ")) {
      if (!inList) {
        flushList();
        inList = true;
        listOrdered = false;
      }
      const checked = trimmed.startsWith("- [x] ");
      const text = trimmed.slice(6);
      listItems.push(
        <li key={key++} className="flex items-start gap-2">
          <input
            type="checkbox"
            defaultChecked={checked}
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />
          <span>{formatInline(text)}</span>
        </li>
      );
      continue;
    }

    // Unordered list
    if (trimmed.startsWith("- ")) {
      if (!inList || listOrdered) {
        flushList();
        inList = true;
        listOrdered = false;
      }
      listItems.push(
        <li key={key++}>{formatInline(trimmed.slice(2))}</li>
      );
      continue;
    }

    // Ordered list
    const olMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (olMatch) {
      if (!inList || !listOrdered) {
        flushList();
        inList = true;
        listOrdered = true;
      }
      listItems.push(
        <li key={key++}>{formatInline(olMatch[2])}</li>
      );
      continue;
    }

    // Regular paragraph
    flushList();
    flushTable();
    elements.push(
      <p key={key++} className="text-gray-700 leading-relaxed my-4">
        {formatInline(trimmed)}
      </p>
    );
  }

  flushList();
  flushTable();

  return elements;
}

export default function GuideArticle({ slug }: { slug: string }) {
  const post = getBlogPost(slug);
  if (!post) return notFound();

  const related = getRelatedPosts(slug, 3);
  const cat = BLOG_CATEGORIES[post.category as BlogCategory];

  // Generate TOC from h2 headers
  const toc = post.content
    .split("\n")
    .filter((l) => l.trim().startsWith("## "))
    .map((l) => l.trim().slice(3));

  // Article structured data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    author: { "@type": "Organization", name: post.author },
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    publisher: {
      "@type": "Organization",
      name: "Germany Guide",
      url: "https://my-germany-guide.vercel.app",
    },
    mainEntityOfPage: `https://my-germany-guide.vercel.app/guides/${slug}`,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/guides"
              className="text-blue-600 hover:text-blue-700 text-sm"
            >
              &larr; All Guides
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-sm text-gray-500">{cat?.label}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-gray-600 mt-3">{post.description}</p>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
            <span>{cat?.icon} {cat?.label}</span>
            <span>{post.readingTime} min read</span>
            <span>Updated {post.updatedAt}</span>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - sidebar on desktop */}
          {toc.length > 2 && (
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-4 bg-white rounded-xl border p-4">
                <h3 className="font-bold text-sm text-gray-900 mb-3 uppercase tracking-wide">
                  Contents
                </h3>
                <nav className="space-y-2">
                  {toc.map((heading, i) => (
                    <div key={i} className="text-sm text-gray-600 hover:text-blue-600 cursor-pointer line-clamp-2">
                      {heading.replace(/\*\*/g, "")}
                    </div>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <article
            className={`order-1 lg:order-2 bg-white rounded-xl border p-6 sm:p-8 ${
              toc.length > 2 ? "lg:col-span-3" : "lg:col-span-4"
            }`}
          >
            {renderMarkdown(post.content)}

            {/* Tags */}
            <div className="mt-10 pt-6 border-t">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>

        {/* CTA */}
        <div className="mt-8 bg-blue-600 text-white rounded-xl p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            Track Your Progress with Germany Guide
          </h2>
          <p className="text-blue-100 mb-4 max-w-lg mx-auto">
            Stop juggling spreadsheets and checklists. Our app guides you
            through every step of German bureaucracy, tracks your documents,
            and reminds you of deadlines.
          </p>
          <Link
            href="/register"
            className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
          >
            Get Started Free
          </Link>
        </div>

        {/* Related Guides */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Related Guides
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => {
                const rCat =
                  BLOG_CATEGORIES[r.category as BlogCategory];
                return (
                  <Link
                    key={r.slug}
                    href={`/guides/${r.slug}`}
                    className="bg-white rounded-xl border p-4 hover:shadow-md transition-shadow"
                  >
                    <span className="text-xs text-blue-600 font-medium">
                      {rCat?.icon} {rCat?.label}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-1 line-clamp-2 text-sm">
                      {r.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {r.readingTime} min read
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 text-sm mt-12">
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