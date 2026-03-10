import { BlogPost } from "./types";
import postAnmeldung from "./post-anmeldung";
import postHealthInsurance from "./post-health-insurance";
import postBankAccount from "./post-bank-account";
import postHousing from "./post-housing";
import postBlueCard from "./post-blue-card";
import postStudentVisa from "./post-student-visa";
import postTaxes from "./post-taxes";
import postFirst30Days from "./post-first-30-days";

export const blogPosts: BlogPost[] = [
  postAnmeldung,
  postHealthInsurance,
  postBankAccount,
  postHousing,
  postBlueCard,
  postStudentVisa,
  postTaxes,
  postFirst30Days,
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}

export function getAllCategories(): string[] {
  return [...new Set(blogPosts.map((p) => p.category))];
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const post = getBlogPost(slug);
  if (!post) return [];
  return blogPosts
    .filter((p) => p.slug !== slug)
    .filter(
      (p) =>
        p.category === post.category ||
        p.tags.some((t) => post.tags.includes(t))
    )
    .slice(0, limit);
}

export { type BlogPost } from "./types";
export { BLOG_CATEGORIES, type BlogCategory } from "./types";