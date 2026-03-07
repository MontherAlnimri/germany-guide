"use client";

import { useEffect, useState } from "react";

interface AdminData {
  totalUsers: number;
  activeSubscriptions: number;
  monthlySubscribers: number;
  yearlySubscribers: number;
  mrr: number;
  totalTipRevenue: number;
  totalFlows: number;
  totalDocuments: number;
  recentUsers: Array<{
    id: string;
    full_name: string;
    visa_type: string;
    city: string;
    is_premium: boolean;
    created_at: string;
  }>;
  recentTips: Array<{
    amount: number;
    status: string;
    created_at: string;
  }>;
}

export default function AdminPage() {
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/admin");
        if (!res.ok) {
          setError("Unauthorized or error loading admin data");
          setLoading(false);
          return;
        }
        const json = await res.json();
        setData(json);
      } catch {
        setError("Failed to load admin data");
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-red-500 text-center">
          <p className="text-xl font-bold mb-2">Access Denied</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!data) return null;

  const statCards = [
    { label: "Total Users", value: data.totalUsers, color: "bg-blue-50 text-blue-700" },
    { label: "Active Subs", value: data.activeSubscriptions, color: "bg-green-50 text-green-700" },
    { label: "Monthly", value: data.monthlySubscribers, color: "bg-purple-50 text-purple-700" },
    { label: "Yearly", value: data.yearlySubscribers, color: "bg-indigo-50 text-indigo-700" },
    { label: "MRR", value: `\u20AC${(data.mrr / 100).toFixed(2)}`, color: "bg-emerald-50 text-emerald-700" },
    { label: "Total Tips", value: `\u20AC${(data.totalTipRevenue / 100).toFixed(2)}`, color: "bg-amber-50 text-amber-700" },
    { label: "Flows", value: data.totalFlows, color: "bg-cyan-50 text-cyan-700" },
    { label: "Documents", value: data.totalDocuments, color: "bg-rose-50 text-rose-700" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Admin Dashboard</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-xl p-3 sm:p-5 ${card.color}`}>
            <p className="text-xs sm:text-sm font-medium opacity-80 truncate">{card.label}</p>
            <p className="text-lg sm:text-2xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Users</h2>
        <div className="overflow-x-auto -mx-4 sm:mx-0">
          <div className="min-w-[600px] px-4 sm:px-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Name</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Visa</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">City</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Plan</th>
                  <th className="text-left py-2 px-3 font-medium text-gray-600">Joined</th>
                </tr>
              </thead>
              <tbody>
                {data.recentUsers.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 px-3 whitespace-nowrap">{user.full_name || "N/A"}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{user.visa_type || "N/A"}</td>
                    <td className="py-2 px-3 whitespace-nowrap">{user.city || "N/A"}</td>
                    <td className="py-2 px-3">
                      {user.is_premium ? (
                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-medium">Premium</span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">Free</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-gray-500 whitespace-nowrap">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {data.recentTips.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Recent Tips</h2>
          <div className="space-y-2">
            {data.recentTips.map((tip, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-700 font-medium">{"\u20AC"}{(tip.amount / 100).toFixed(2)}</span>
                <span className="text-sm text-gray-500">{new Date(tip.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}