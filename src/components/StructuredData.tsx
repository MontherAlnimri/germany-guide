export default function StructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Germany Guide",
    description:
      "Step-by-step guidance for visas, city registration, health insurance, and settling in Germany. Available in 11 languages.",
    url: "https://germany-guide-1.vercel.app",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web",
    offers: [
      {
        "@type": "Offer",
        name: "Free Plan",
        price: "0",
        priceCurrency: "EUR",
        description: "Up to 3 active flows, 10 documents, all 11 languages",
      },
      {
        "@type": "Offer",
        name: "Premium Monthly",
        price: "4.99",
        priceCurrency: "EUR",
        description: "Unlimited flows, documents, ad-free, PDF export",
      },
      {
        "@type": "Offer",
        name: "Premium Yearly",
        price: "39.99",
        priceCurrency: "EUR",
        description: "Unlimited flows, documents, ad-free, PDF export",
      },
    ],
    availableLanguage: [
      "English", "German", "Arabic", "Turkish", "Ukrainian",
      "French", "Spanish", "Russian", "Chinese", "Hindi", "Hungarian",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}