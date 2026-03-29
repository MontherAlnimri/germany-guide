import { Building2, FileCheck, Home, Landmark, Shield, Briefcase, GraduationCap, Coffee } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  registration: Building2,
  visa: FileCheck,
  housing: Home,
  finance: Landmark,
  insurance: Shield,
  work: Briefcase,
  education: GraduationCap,
  "daily-life": Coffee,
};

export function CategoryIcon({ category, className = "w-5 h-5" }: { category: string; className?: string }) {
  const Icon = iconMap[category];
  if (!Icon) return null;
  return <Icon className={className} />;
}
