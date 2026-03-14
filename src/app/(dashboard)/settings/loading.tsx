import { Skeleton } from "@/components/ui/Skeleton";

export default function SettingsLoading() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Skeleton className="h-7 w-32 mb-2" />
        <Skeleton className="h-4 w-48" />
      </div>

      {/* Account info card */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
        <Skeleton className="h-6 w-44 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      {/* Profile card */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
        <Skeleton className="h-6 w-24 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-11 w-full rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-11 w-full rounded-xl" />
            <Skeleton className="h-11 w-full rounded-xl" />
          </div>
          <Skeleton className="h-10 w-20 rounded-lg" />
        </div>
      </div>

      {/* Password card */}
      <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6">
        <Skeleton className="h-6 w-40 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-11 w-full rounded-xl" />
          <Skeleton className="h-10 w-36 rounded-lg" />
        </div>
      </div>
    </div>
  );
}