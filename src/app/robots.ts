import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/flow/", "/documents/", "/deadlines/", "/onboarding/", "/api/"],
    },
    sitemap: "https://my-germany-guide.vercel.app/sitemap.xml",
  };
}