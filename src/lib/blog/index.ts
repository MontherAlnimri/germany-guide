import { BlogPost } from "./types";
import postAnmeldung from "./post-anmeldung";
import postHealthInsurance from "./post-health-insurance";
import postBankAccount from "./post-bank-account";
import postHousing from "./post-housing";
import postBlueCard from "./post-blue-card";
import postStudentVisa from "./post-student-visa";
import postTaxes from "./post-taxes";
import postFirst30Days from "./post-first-30-days";
import postWorkPermit from "./post-work-permit";
import postJobSeekerVisa from "./post-job-seeker-visa";
import postFamilyReunion from "./post-family-reunion";
import postFreelanceVisa from "./post-freelance-visa";
import postPermanentResidence from "./post-permanent-residence";

export const blogPosts: BlogPost[] = [
  postAnmeldung,
  postHealthInsurance,
  postBankAccount,
  postHousing,
  postBlueCard,
  postStudentVisa,
  postTaxes,
  postFirst30Days,
  postWorkPermit,
  postJobSeekerVisa,
  postFamilyReunion,
  postFreelanceVisa,
  postPermanentResidence,
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return blogPosts.filter((p) => p.category === category);
}

export function getAllCategories(): string[] {
  return Array.from(new Set(blogPosts.map((p) => p.category)));
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

export function getRelevantPosts(
  visaType?: string | null,
  applicationType?: string | null
): { recommended: BlogPost[]; essential: BlogPost[]; other: BlogPost[] } {
  if (!visaType) {
    return { recommended: [], essential: [], other: blogPosts };
  }

  const allVisaTypes = [
    "student_visa", "job_seeker_visa", "blue_card", "work_permit",
    "family_reunion", "freelance_visa", "permanent_residence", "other",
  ];

  const recommended: BlogPost[] = [];
  const essential: BlogPost[] = [];
  const other: BlogPost[] = [];

  for (const post of blogPosts) {
    const matchesVisa = post.relevantVisaTypes?.includes(visaType);
    const matchesApp = !applicationType || !post.relevantApplicationTypes?.length || post.relevantApplicationTypes.includes(applicationType);
    const isUniversal = post.relevantVisaTypes?.length === allVisaTypes.length;

    if (matchesVisa && matchesApp) {
      if (isUniversal) {
        essential.push(post);
      } else {
        recommended.push(post);
      }
    } else {
      other.push(post);
    }
  }

  return { recommended, essential, other };
}

export { type BlogPost } from "./types";
export { BLOG_CATEGORIES, type BlogCategory } from "./types";
