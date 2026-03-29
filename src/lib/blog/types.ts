export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: "registration" | "visa" | "housing" | "finance" | "insurance" | "work" | "education" | "daily-life";
  tags: string[];
  readingTime: number;
  publishedAt: string;
  updatedAt: string;
  author: string;
  relevantVisaTypes?: string[];
  relevantApplicationTypes?: string[];
}

export const BLOG_CATEGORIES = {
  registration: { label: "City Registration", icon: "\uD83C\uDFE2" },
  visa: { label: "Visa & Residence Permits", icon: "\uD83D\uDCCB" },
  housing: { label: "Housing", icon: "\uD83C\uDFE0" },
  finance: { label: "Banking & Finance", icon: "\uD83C\uDFE6" },
  insurance: { label: "Insurance", icon: "\uD83D\uDEE1\uFE0F" },
  work: { label: "Working in Germany", icon: "\uD83D\uDCBC" },
  education: { label: "Education", icon: "\uD83C\uDF93" },
  "daily-life": { label: "Daily Life", icon: "\u2615" },
} as const;

export type BlogCategory = keyof typeof BLOG_CATEGORIES;