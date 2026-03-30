"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBlogPost, getRelatedPosts, BLOG_CATEGORIES, BlogCategory } from "@/lib/blog";
import { notFound } from "next/navigation";
import { useGuideProfile } from "@/hooks/useGuideProfile";
import { useDict } from "@/lib/i18n/context";
import { VisaCallout, CityCallout, FlowCTA } from "@/components/guides/PersonalizedCallout";
import { createClient } from "@/lib/supabase/client";
import { Sparkles, MapPin, User } from "lucide-react";

// City-specific tips keyed by guide category
const CITY_TIPS: Record<string, Record<string, string>> = {
  registration: {
    Berlin: "In Berlin, book your Anmeldung appointment at the Bürgeramt online — slots fill up fast, try early mornings.",
    Munich: "In Munich, the KVR (Kreisverwaltungsreferat) handles Anmeldung. Book at muenchen.de/terminvereinbarung.",
    Hamburg: "In Hamburg, try the Kundenzentrum in less central districts like Wandsbek for faster appointments.",
    Frankfurt: "In Frankfurt, visit the Bürgeramt Höchst or Sachsenhausen for shorter wait times.",
    Cologne: "In Cologne, the Kundenzentrum Ehrenfeld usually has shorter queues than the main city center office.",
  },
  visa: {
    Berlin: "The Berlin Ausländerbehörde (LEA) is notoriously busy — arrive early and bring all documents.",
    Munich: "Munich's Ausländerbehörde is at Ruppertstraße 19. Book online at muenchen.de.",
    Hamburg: "Hamburg's immigration office is the Einwohnerzentralamt at Hammer Str. 30-34.",
  },
  housing: {
    Berlin: "Berlin's rental market is competitive. Check WG-Gesucht, Immobilienscout24, and local Facebook groups.",
    Munich: "Munich has Germany's highest rents. Consider suburbs like Garching, Freising, or Unterschleißheim.",
    Hamburg: "Hamburg neighborhoods like Barmbek, Eilbek, and Wandsbek offer better value than the city center.",
  },
  finance: {
    Berlin: "N26, Commerzbank, and Deutsche Bank all have English-friendly branches in Berlin.",
    Munich: "Sparkasse München and HypoVereinsbank have many branches. Some offer English support.",
  },
  insurance: {
    Berlin: "TK (Techniker Krankenkasse) has an English-friendly office in Berlin at Bramfelder Straße.",
    Munich: "AOK Bayern and TK both have good English support in Munich.",
  },
};

// Visa-specific tips keyed by guide category
const VISA_TIPS: Record<string, Record<string, string>> = {
  registration: {
    student_visa: "As a student, you must register within 14 days of arrival. Your university's international office can often help with the process.",
    blue_card: "Blue Card holders typically have employer support for registration. Ask your HR department if they offer relocation assistance.",
    freelance_visa: "Freelancers need a confirmed address for registration. If you're still apartment hunting, some co-living spaces offer Anmeldung-eligible addresses.",
  },
  insurance: {
    student_visa: "Students under 30 can get public health insurance at reduced rates (~110€/month). After 30, you'll need private insurance.",
    blue_card: "With a Blue Card salary, you can choose between public and private health insurance. Private may offer better coverage but consider long-term implications.",
    freelance_visa: "Freelancers must arrange their own health insurance. Public insurance (freiwillige Versicherung) costs ~15% of income.",
  },
  finance: {
    student_visa: "Many banks offer free student accounts (Studentenkonto). Bring your university enrollment certificate.",
    blue_card: "Your employer will need your IBAN for salary payments. Open a bank account as early as possible.",
  },
};

function formatVisaLabel(visaType: string): string {
  return visaType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

function renderMarkdown(
  content: string,
  userCity?: string | null,
  userVisaType?: string | null,
  guideCategory?: string
) {
  const lines = content.split("\n");
  const elements: React.ReactNode[] = [];
  let inTable = false;
  let tableRows: string[][] = [];
  let tableHeaders: string[] = [];
  let inList = false;
  let listItems: React.ReactNode[] = [];
  let listOrdered = false;
  let key = 0;
  let lastH2 = "";

  const flushList = () => {
    if (inList && listItems.length > 0) {
      if (listOrdered) {
        elements.push(
          <ol key={key++} className="list-decimal list-inside space-y-1 my-4 text-gray-700 dark:text-gray-300">
            {listItems}
          </ol>
        );
      } else {
        elements.push(
          <ul key={key++} className="list-disc list-inside space-y-1 my-4 text-gray-700 dark:text-gray-300">
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
          <table className="min-w-full border-collapse border border-gray-200 dark:border-gray-700 text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800">
                {tableHeaders.map((h, i) => (
                  <th
                    key={i}
                    className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-left font-semibold text-gray-900 dark:text-white"
                  >
                    {h.trim()}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-white dark:bg-gray-900" : "bg-gray-50 dark:bg-gray-800"}>
                  {row.map((cell, ci) => (
                    <td
                      key={ci}
                      className="border border-gray-200 dark:border-gray-700 px-4 py-2 text-gray-700 dark:text-gray-300"
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

  // Inject personalized callouts after certain h2 headings
  const injectCallouts = (headingText: string) => {
    const lowerHeading = headingText.toLowerCase();
    const cat = guideCategory || "";

    // City callout after relevant headings
    if (userCity && userCity !== "Other") {
      const cityTips = CITY_TIPS[cat];
      if (cityTips?.[userCity] && (
        lowerHeading.includes("where") ||
        lowerHeading.includes("office") ||
        lowerHeading.includes("appointment") ||
        lowerHeading.includes("location") ||
        lowerHeading.includes("how to") ||
        lowerHeading.includes("step")
      )) {
        elements.push(
          <CityCallout key={`city-${key++}`} city={userCity}>
            {cityTips[userCity]}
          </CityCallout>
        );
      }
    }

    // Visa callout after relevant headings
    if (userVisaType) {
      const visaTips = VISA_TIPS[cat];
      if (visaTips?.[userVisaType] && (
        lowerHeading.includes("requirement") ||
        lowerHeading.includes("document") ||
        lowerHeading.includes("cost") ||
        lowerHeading.includes("important") ||
        lowerHeading.includes("tip") ||
        lowerHeading.includes("what you need")
      )) {
        elements.push(
          <VisaCallout key={`visa-${key++}`} visaType={userVisaType}>
            {visaTips[userVisaType]}
          </VisaCallout>
        );
      }
    }
  };

  const formatInline = (text: string): React.ReactNode => {
    const parts: React.ReactNode[] = [];
    const regex = /(\*\*[^*]+\*\*|\[([^\]]+)\]\(([^)]+)\))/g;
    let last = 0;
    let match;
    let partKey = 0;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > last) {
        const segment = text.slice(last, match.index);
        parts.push(highlightCity(segment, partKey++));
      }
      if (match[0].startsWith("**")) {
        parts.push(
          <strong key={partKey++} className="font-semibold text-gray-900 dark:text-white">
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
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {match[2]}
          </a>
        );
      }
      last = match.index + match[0].length;
    }
    if (last < text.length) {
      const segment = text.slice(last);
      parts.push(highlightCity(segment, partKey++));
    }
    return parts.length === 1 ? parts[0] : <>{parts}</>;
  };

  // Highlight user's city name in text
  const highlightCity = (text: string, partKey: number): React.ReactNode => {
    if (!userCity || userCity === "Other") return text;
    const regex = new RegExp(`\\b(${userCity.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "gi");
    const parts = text.split(regex);
    if (parts.length === 1) return text;
    return (
      <span key={`hl-${partKey}`}>
        {parts.map((part, i) =>
          regex.test(part) ? (
            <mark key={i} className="bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-200 px-0.5 rounded">
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed === "") {
      flushList();
      flushTable();
      continue;
    }

    if (trimmed === "---") {
      flushList();
      flushTable();
      elements.push(<hr key={key++} className="my-8 border-gray-200 dark:border-gray-700" />);
      continue;
    }

    // Table
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      const cells = trimmed.split("|").filter((c) => c.trim() !== "");
      if (cells.every((c) => /^[\s-:]+$/.test(c))) continue;
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
        <h3 key={key++} className="text-xl font-bold text-gray-900 dark:text-white mt-8 mb-3">
          {formatInline(trimmed.slice(4))}
        </h3>
      );
      continue;
    }
    if (trimmed.startsWith("## ")) {
      flushList();
      const headingText = trimmed.slice(3);
      // Inject callouts after previous h2 content
      if (lastH2) injectCallouts(lastH2);
      lastH2 = headingText;
      elements.push(
        <h2
          key={key++}
          className="text-2xl font-bold text-gray-900 dark:text-white mt-10 mb-4 pb-2 border-b border-gray-200 dark:border-gray-700"
        >
          {formatInline(headingText)}
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
            className="mt-1 h-4 w-4 rounded border-gray-300 dark:border-gray-600"
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
      <p key={key++} className="text-gray-700 dark:text-gray-300 leading-relaxed my-4">
        {formatInline(trimmed)}
      </p>
    );
  }

  flushList();
  flushTable();
  // Inject callouts for the last h2 section
  if (lastH2) injectCallouts(lastH2);

  return elements;
}

export default function GuideArticle({ slug }: { slug: string }) {
  const post = getBlogPost(slug);
  if (!post) return notFound();

  const dict = useDict();
  const router = useRouter();
  const related = getRelatedPosts(slug, 3);
  const cat = BLOG_CATEGORIES[post.category as BlogCategory];
  const { loading, isAuthenticated, profile, matchingFlow, activeInstance } = useGuideProfile(slug);
  const [starting, setStarting] = useState(false);

  const g = dict?.guides;

  // Generate TOC from h2 headers
  const toc = post.content
    .split("\n")
    .filter((l) => l.trim().startsWith("## "))
    .map((l) => l.trim().slice(3));

  // Start a new flow from the guide
  const handleStartFlow = async () => {
    if (!matchingFlow) return;
    setStarting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: steps } = await supabase
        .from("flow_steps")
        .select("*")
        .eq("flow_variant_id", matchingFlow.variantId)
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
          flow_variant_id: matchingFlow.variantId,
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
      setStarting(false);
    }
  };

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
      url: "https://germany-guide-1.vercel.app",
    },
    mainEntityOfPage: `https://germany-guide-1.vercel.app/guides/${slug}`,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* Header */}
      <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:py-10">
          <div className="flex items-center gap-2 mb-4">
            <Link
              href="/guides"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
            >
              &larr; {g?.backToGuides ?? "All Guides"}
            </Link>
            <span className="text-gray-300 dark:text-gray-600">/</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">{cat?.label}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
            {post.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mt-3">{post.description}</p>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500 dark:text-gray-400">
            <span>{cat?.icon} {cat?.label}</span>
            <span>{post.readingTime} {g?.minRead ?? "min read"}</span>
            <span>{g?.updated ?? "Updated"} {post.updatedAt}</span>
          </div>

          {/* Personalized banner */}
          {!loading && isAuthenticated && profile?.visa_type && (
            <div className="mt-5 flex flex-wrap items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/60 dark:border-blue-700/40 rounded-xl px-4 py-3">
              <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-sm font-medium text-blue-900 dark:text-blue-200">
                {g?.personalizedFor ?? "Personalized for"}{" "}
                <span className="font-bold">{formatVisaLabel(profile.visa_type)}</span>
                {profile.city && profile.city !== "Other" && (
                  <>
                    {" "}{g?.inYourCity ?? "in"}{" "}
                    <span className="font-bold">{profile.city}</span>
                  </>
                )}
              </span>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Flow CTA — top of article for authenticated users */}
        {!loading && isAuthenticated && matchingFlow && (
          <FlowCTA
            hasActiveInstance={!!activeInstance}
            instanceId={activeInstance?.id}
            progress={activeInstance?.progress}
            flowTitle={matchingFlow.baseFlowTitle}
            flowIcon={matchingFlow.baseFlowIcon}
            onStartFlow={handleStartFlow}
            starting={starting}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Table of Contents - sidebar on desktop */}
          {toc.length > 2 && (
            <aside className="lg:col-span-1 order-2 lg:order-1">
              <div className="lg:sticky lg:top-4 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4">
                <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-3 uppercase tracking-wide">
                  {g?.contents ?? "Contents"}
                </h3>
                <nav className="space-y-2">
                  {toc.map((heading, i) => (
                    <div key={i} className="text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer line-clamp-2">
                      {heading.replace(/\*\*/g, "")}
                    </div>
                  ))}
                </nav>
              </div>
            </aside>
          )}

          {/* Main Content */}
          <article
            className={`order-1 lg:order-2 bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-6 sm:p-8 ${
              toc.length > 2 ? "lg:col-span-3" : "lg:col-span-4"
            }`}
          >
            {renderMarkdown(post.content, profile?.city, profile?.visa_type, post.category)}

            {/* Tags */}
            <div className="mt-10 pt-6 border-t dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </div>

        {/* CTA — context-aware */}
        {!loading && isAuthenticated && matchingFlow ? (
          /* Authenticated + matching flow: show flow CTA at bottom too */
          <FlowCTA
            hasActiveInstance={!!activeInstance}
            instanceId={activeInstance?.id}
            progress={activeInstance?.progress}
            flowTitle={matchingFlow.baseFlowTitle}
            flowIcon={matchingFlow.baseFlowIcon}
            onStartFlow={handleStartFlow}
            starting={starting}
          />
        ) : !loading && isAuthenticated ? (
          /* Authenticated but no matching flow */
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {g?.trackProgress ?? "Track Your Progress with Germany Guide"}
            </h2>
            <p className="text-blue-100 mb-4 max-w-lg mx-auto">
              {g?.trackProgressDesc ?? "Explore all available flows to find step-by-step guidance for your situation."}
            </p>
            <Link
              href="/flow"
              className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors min-h-[44px]"
            >
              {g?.viewFlows ?? "View All Flows"}
            </Link>
          </div>
        ) : (
          /* Not authenticated — keep SEO CTA */
          <div className="mt-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 sm:p-8 text-center">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {g?.trackProgress ?? "Track Your Progress with Germany Guide"}
            </h2>
            <p className="text-blue-100 mb-4 max-w-lg mx-auto">
              {g?.ctaDescription ?? "Stop juggling spreadsheets and checklists. Our app guides you through every step of German bureaucracy, tracks your documents, and reminds you of deadlines."}
            </p>
            <Link
              href="/register"
              className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors min-h-[44px]"
            >
              {g?.getStarted ?? "Get Started Free"}
            </Link>
          </div>
        )}

        {/* Related Guides */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              {g?.relatedGuides ?? "Related Guides"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((r) => {
                const rCat = BLOG_CATEGORIES[r.category as BlogCategory];
                return (
                  <Link
                    key={r.slug}
                    href={`/guides/${r.slug}`}
                    className="bg-white dark:bg-gray-800 rounded-xl border dark:border-gray-700 p-4 hover:shadow-md dark:hover:shadow-gray-900/50 transition-shadow"
                  >
                    <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                      {rCat?.icon} {rCat?.label}
                    </span>
                    <h3 className="font-bold text-gray-900 dark:text-white mt-1 line-clamp-2 text-sm">
                      {r.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {r.readingTime} {g?.minRead ?? "min read"}
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
