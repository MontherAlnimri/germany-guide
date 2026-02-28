import Link from "next/link";

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-blue-700">
            Germany Guide
          </Link>
          <div className="flex gap-4 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-blue-700">Privacy</Link>
            <Link href="/terms" className="text-gray-600 hover:text-blue-700">Terms</Link>
            <Link href="/about" className="text-gray-600 hover:text-blue-700">About</Link>
          </div>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 px-4 py-6 mt-12">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500">
          <div className="flex justify-center gap-4 mb-2">
            <Link href="/privacy" className="hover:text-blue-700">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blue-700">Terms of Service</Link>
            <Link href="/about" className="hover:text-blue-700">About</Link>
          </div>
          <p>{'\u00A9'} {new Date().getFullYear()} Germany Guide. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}