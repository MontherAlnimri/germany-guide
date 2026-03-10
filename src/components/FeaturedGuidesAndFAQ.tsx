"use client";

import Link from "next/link";
import { blogPosts, BLOG_CATEGORIES, BlogCategory } from "@/lib/blog";

export function FeaturedGuides() {
  const featured = blogPosts.slice(0, 6);

  return (
    <section className="py-16 bg-white" id="guides">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
          Free Germany Guides
        </h2>
        <p className="text-center text-gray-600 mb-10 max-w-2xl mx-auto">
          Detailed, step-by-step guides covering every aspect of life in
          Germany. Written by expats, updated for 2025.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((post) => {
            const cat = BLOG_CATEGORIES[post.category as BlogCategory];
            return (
              <Link
                key={post.slug}
                href={`/guides/${post.slug}`}
                className="bg-gray-50 rounded-xl p-5 hover:shadow-md transition-shadow border group"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{cat?.icon}</span>
                  <span className="text-xs font-medium text-blue-600">
                    {cat?.label}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-1">
                  {post.title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2">
                  {post.description}
                </p>
                <span className="text-xs text-gray-400 mt-2 block">
                  {post.readingTime} min read
                </span>
              </Link>
            );
          })}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/guides"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Guides &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}

const faqData = [
  {
    q: "What is the first thing I should do when I arrive in Germany?",
    a: "Register your address (Anmeldung) at the local Buergeramt within 14 days of moving in. This is legally required and is a prerequisite for almost everything else — opening a bank account, getting health insurance, and obtaining your tax ID.",
  },
  {
    q: "Do I need to speak German to navigate bureaucracy?",
    a: "While knowing German helps, many offices in larger cities have English-speaking staff. Our app provides step-by-step guides in 11 languages, so you know exactly what documents to bring and what to expect at each appointment.",
  },
  {
    q: "How long does it take to get a residence permit?",
    a: "Processing times vary by city and visa type. In Berlin, expect 2-4 months. In Munich or smaller cities, it can be as fast as 2-4 weeks. We recommend booking your Auslaenderbehorde appointment as early as possible.",
  },
  {
    q: "Is health insurance mandatory in Germany?",
    a: "Yes, health insurance is mandatory for all residents. Employees are automatically enrolled in public insurance (GKV) through their employer. Students get a discounted rate of about EUR 110-120/month. Freelancers must arrange their own coverage.",
  },
  {
    q: "How much money do I need to live in Germany?",
    a: "Monthly costs vary by city: EUR 950-1,300 in affordable cities like Leipzig, EUR 1,200-2,000 in Berlin or Hamburg, and EUR 1,500-2,500+ in Munich. This includes rent, insurance, food, transport, and basic expenses.",
  },
  {
    q: "What is a blocked account (Sperrkonto)?",
    a: "A blocked account is required for student visa applicants to prove financial resources. You deposit at least EUR 11,904 (2025 requirement) into a special account that releases EUR 992/month after arrival. Expatrio and Fintiba are the most popular providers.",
  },
  {
    q: "Can I work while studying in Germany?",
    a: "Yes, non-EU students can work 120 full days or 240 half days per year. Student assistant (HiWi) jobs at your university do not count toward this limit. Exceeding the limit can affect your residence permit.",
  },
  {
    q: "Is the Germany Guide app free?",
    a: "Yes! The free plan includes up to 3 active bureaucratic workflows and 10 tracked documents. Premium users get unlimited workflows, documents, PDF exports, and an ad-free experience for EUR 4.99/month or EUR 39.99/year.",
  },
];

export function FAQSection() {
  return (
    <section className="py-16 bg-gray-50" id="faq">
      <div className="max-w-3xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-center text-gray-600 mb-10">
          Common questions about moving to and living in Germany
        </p>
        <div className="space-y-4">
          {faqData.map((item, i) => (
            <details
              key={i}
              className="bg-white rounded-xl border p-5 group"
            >
              <summary className="font-semibold text-gray-900 cursor-pointer list-none flex items-center justify-between">
                <span className="pr-4">{item.q}</span>
                <span className="text-gray-400 group-open:rotate-180 transition-transform text-xl flex-shrink-0">
                  &#9662;
                </span>
              </summary>
              <p className="text-gray-600 mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </div>

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqData.map((item) => ({
              "@type": "Question",
              name: item.q,
              acceptedAnswer: {
                "@type": "Answer",
                text: item.a,
              },
            })),
          }),
        }}
      />
    </section>
  );
}