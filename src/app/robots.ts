import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/admin/", "/onboarding/"],
      },
    ],
    sitemap: "https://germany-guide-1.vercel.app/sitemap.xml",
  };
}