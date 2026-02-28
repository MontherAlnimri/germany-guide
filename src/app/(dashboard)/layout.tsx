import Navbar from "@/components/layout/Navbar";
import LegalFooter from "@/components/layout/LegalFooter";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex-1">
        {children}
      </main>
      <LegalFooter />
    </div>
  );
}