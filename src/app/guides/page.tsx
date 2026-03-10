import { Metadata } from "next";
import GuidesClient from "./GuidesClient";

export const metadata: Metadata = {
  title: "Germany Guides - Free Guides for Expats & Students | Germany Guide",
  description:
    "Comprehensive, free guides for navigating German bureaucracy. From Anmeldung to taxes, health insurance to housing - everything you need to know about living in Germany.",
  keywords: [
    "Germany guide",
    "expat Germany",
    "Anmeldung guide",
    "German bureaucracy",
    "living in Germany",
    "German health insurance",
    "German bank account",
    "student visa Germany",
    "Blue Card Germany",
    "German taxes",
  ],
  openGraph: {
    title: "Free Germany Guides for Expats & Students",
    description:
      "Comprehensive, step-by-step guides for navigating German bureaucracy. Everything from city registration to taxes, written by people who have been through it.",
    type: "website",
  },
};

export default function GuidesPage() {
  return <GuidesClient />;
}