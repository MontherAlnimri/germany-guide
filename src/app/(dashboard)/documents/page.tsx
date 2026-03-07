"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDict } from "@/lib/i18n/context";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { exportDocumentsToPDF } from "@/lib/pdf-export";
import UsageBar from "@/components/ui/UsageBar";

interface Doc {
  id: string;
  doc_type: string;
  doc_name: string;
  issue_date: string | null;
  expiry_date: string | null;
  status: string;
  notes: string | null;
  created_at: string;
}

export default function DocumentsPage() {
  const dict = useDict();
  const d = dict.docs;
  const router = useRouter();
  const { isPremium } = useSubscription();
  const { documentCount, maxDocuments, canCreateDocument } = useUsageLimits();

  const [documents, setDocuments] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (data) setDocuments(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleDelete = async (docId: string) => {
    const supabase = createClient();
    await supabase.from("documents").delete().eq("id", docId);
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
  };

  const handleExportPDF = () => {
    exportDocumentsToPDF(
      documents.map((doc) => ({
        doc_type: doc.doc_type,
        doc_name: doc.doc_name,
        issue_date: doc.issue_date,
        expiry_date: doc.expiry_date,
        status: doc.status,
        notes: doc.notes,
      }))
    );
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      valid: "bg-green-100 text-green-700",
      pending: "bg-yellow-100 text-yellow-700",
      expired: "bg-red-100 text-red-700",
      notUploaded: "bg-gray-100 text-gray-600",
    };
    const labels: Record<string, string> = {
      valid: d?.valid || "Valid",
      pending: d?.pending || "Pending",
      expired: d?.expired || "Expired",
      notUploaded: d?.notUploaded || "Not Uploaded",
    };
    return (
      <span className={`text-xs px-2 py-1 rounded-full font-medium ${styles[status] || styles.pending}`}>
        {labels[status] || status}
      </span>
    );
  };

  const isExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const diff = new Date(expiryDate).getTime() - Date.now();
    return diff > 0 && diff < 30 * 24 * 60 * 60 * 1000;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-gray-500">{dict.common?.loading || "Loading..."}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {d?.documentVault || "Document Vault"}
        </h1>
        <div className="flex items-center gap-2 sm:gap-3">
          {isPremium && documents.length > 0 && (
            <button
              onClick={handleExportPDF}
              className="bg-amber-100 text-amber-800 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-amber-200 transition-colors"
            >
              Export PDF
            </button>
          )}
          <button
            onClick={() => {
              if (!canCreateDocument) {
                alert("You have reached the free plan limit. Upgrade to Premium for unlimited documents.");
                router.push("/premium");
                return;
              }
              router.push("/documents/new");
            }}
            className="bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap"
          >
            + {d?.addNewDocument || "Add Document"}
          </button>
        </div>
      </div>

      {!isPremium && (
        <UsageBar
          label={d?.title || "Documents"}
          current={documentCount}
          max={maxDocuments as number}
          isPremium={isPremium}
        />
      )}

      {documents.length === 0 ? (
        <div className="text-center py-12 sm:py-16">
          <div className="text-4xl sm:text-5xl mb-4">{"\u{1F4C4}"}</div>
          <h2 className="text-lg font-semibold text-gray-900 mb-2">
            {d?.noDocuments || "No documents added yet"}
          </h2>
          <p className="text-gray-500 mb-6 text-sm sm:text-base">
            {d?.addFirst || "Add your first document to start tracking"}
          </p>
          <button
            onClick={() => router.push("/documents/new")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            + {d?.addNewDocument || "Add Document"}
          </button>
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5 hover:shadow-sm transition-shadow"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">{doc.doc_name}</h3>
                    {getStatusBadge(doc.status)}
                    {isExpiringSoon(doc.expiry_date) && (
                      <span className="text-xs px-2 py-1 rounded-full font-medium bg-orange-100 text-orange-700">
                        {d?.expiringSoon || "Expiring Soon"}
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">{doc.doc_type}</p>
                  <div className="flex flex-wrap gap-3 sm:gap-4 mt-2 text-xs text-gray-400">
                    {doc.issue_date && (
                      <span>
                        {d?.issued || "Issued"}: {new Date(doc.issue_date).toLocaleDateString()}
                      </span>
                    )}
                    {doc.expiry_date && (
                      <span>
                        {d?.expires || "Expires"}: {new Date(doc.expiry_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {doc.notes && (
                    <p className="text-xs sm:text-sm text-gray-500 mt-2 italic line-clamp-2">{doc.notes}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (confirm(d?.deleteConfirm || "Are you sure you want to delete this document?")) {
                      handleDelete(doc.id);
                    }
                  }}
                  className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0 p-1 min-w-[36px] min-h-[36px] flex items-center justify-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}