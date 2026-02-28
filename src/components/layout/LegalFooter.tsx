"use client";

import Link from "next/link";
import { useDict } from "@/lib/i18n/context";

export default function LegalFooter() {
  const dict = useDict();

  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">
              {dict.common?.appName || "Germany Guide"}
            </h3>
            <p className="text-sm leading-relaxed">
              {dict.about?.subtitle || "Making German bureaucracy manageable for everyone"}
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/register" className="hover:text-white transition-colors">{dict.landing?.getStarted || "Get Started"}</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">{dict.auth?.signIn || "Sign In"}</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors">{dict.about?.title || "About Us"}</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">{dict.privacy?.title || "Privacy Policy"}</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">{dict.terms?.title || "Terms of Service"}</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-8 text-center text-sm">
          <p>{"\u00A9"} {new Date().getFullYear()} {dict.common?.appName || "Germany Guide"}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}