"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDict } from "@/lib/i18n/context";
import { DOCUMENT_TYPES } from "@/lib/constants";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import LimitModal from "@/components/ui/LimitModal";
import { trackDocumentAdded } from "@/lib/analytics-events";

export default function NewDocumentPage() {
  const dict = useDict();
  const router = useRouter();
  const { canAddDoc: canCreateDocument, docCount: documentCount, maxDocs: maxDocuments } = useUsageLimits();

  const [docType, setDocType] = useState("");
  const [docName, setDocName] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [status, setStatus] = useState("pending");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [showLimitModal, setShowLimitModal] = useState(false);

  useEffect(() => {
    if (!canCreateDocument && documentCount > 0) {
      setShowLimitModal(true);
    }
  }, [canCreateDocument, documentCount]);

  const handleSave = async () => {
    if (!canCreateDocument) {
      setShowLimitModal(true);
      return;
    }

    if (!docType || !docName) return;
    setSaving(true);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from("documents").insert({
      user_id: user.id,
      doc_type: docType,
      doc_name: docName,
      issue_date: issueDate || null,
      expiry_date: expiryDate || null,
      status,
      notes: notes || null,
    });

    trackDocumentAdded(docType);
    router.push("/documents");
  };

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => router.push("/documents")}
        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 mb-4 inline-flex items-center gap-1 min-h-[44px]"
      >
        {"\u2190"} {dict.docs?.backToDocuments || "Back to Documents"}
      </button>

      <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-6">
        {dict.docs?.addNewDocument || "Add New Document"}
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-4 sm:p-6 space-y-5 shadow-premium">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {dict.docs?.docType || "Document Type"}
          </label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 min-h-[44px]"
          >
            <option value="">{dict.docs?.selectDocType || "Select document type"}</option>
            {DOCUMENT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {dict.docs?.docName || "Document Name"}
          </label>
          <input
            type="text"
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            placeholder={dict.docs?.enterDocName || "Enter document name"}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 min-h-[44px]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {dict.docs?.issueDate || "Issue Date"}
            </label>
            <input
              type="date"
              value={issueDate}
              onChange={(e) => setIssueDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 min-h-[44px]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {dict.docs?.expiryDate || "Expiry Date"}
            </label>
            <input
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 min-h-[44px]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {dict.docs?.status || "Status"}
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 min-h-[44px]"
          >
            <option value="valid">{dict.docs?.valid || "Valid"}</option>
            <option value="pending">{dict.docs?.pending || "Pending"}</option>
            <option value="expired">{dict.docs?.expired || "Expired"}</option>
            <option value="notUploaded">{dict.docs?.notUploaded || "Not Uploaded"}</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={dict.docs?.notesPlaceholder || "Add notes about this document..."}
            rows={3}
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!docType || !docName || saving}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[48px] shadow-lg shadow-blue-500/25"
        >
          {saving
            ? dict.common?.loading || "Saving..."
            : dict.docs?.saveDocument || "Save Document"}
        </button>
      </div>

      <LimitModal
        type="document"
        current={documentCount}
        max={maxDocuments as number}
        isOpen={showLimitModal}
        onClose={() => {
          setShowLimitModal(false);
          if (!canCreateDocument) router.push("/documents");
        }}
      />
    </div>
  );
}