import Navbar from "@/components/layout/Navbar";
import LegalFooter from "@/components/layout/LegalFooter";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-surface dark:bg-gray-900 flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 flex-1 pb-24 md:pb-6">
        {children}
      </main>
      <LegalFooter />
    </div>
  );
}