'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useDict } from '@/lib/i18n/context';
import { DOCUMENT_TYPES, DOCUMENT_STATUSES } from '@/lib/constants';

export default function NewDocumentPage() {
  const dict = useDict();
  const router = useRouter();
  const [docType, setDocType] = useState('');
  const [docName, setDocName] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [status, setStatus] = useState('valid');
  const [flowInstanceId, setFlowInstanceId] = useState('');
  const [notes, setNotes] = useState('');
  const [flowInstances, setFlowInstances] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadFlows() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('flow_instances')
        .select('id, flow_variant:flow_variant_id(base_flow:base_flow_id(title))')
        .eq('user_id', user.id);
      if (data) setFlowInstances(data);
    }
    loadFlows();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!docType || !docName) {
      setError(dict.docs.selectTypeAndName);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error: insertError } = await supabase.from('documents').insert({
      user_id: user.id,
      doc_type: docType,
      doc_name: docName,
      issue_date: issueDate || null,
      expiry_date: expiryDate || null,
      status,
      flow_instance_id: flowInstanceId || null,
      notes: notes || null,
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push('/documents');
  };

  return (
    <div className="max-w-lg mx-auto">
      <Link href="/documents" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1 mb-4">
        &larr; {dict.docs.backToDocuments}
      </Link>

      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-6">{dict.docs.addNewDocument}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 text-red-600 text-sm rounded-lg p-3">{error}</div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{dict.docs.docType}</label>
            <select
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">{dict.docs.docTypePlaceholder}</option>
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{dict.docs.docName}</label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder={dict.docs.docNamePlaceholder}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{dict.docs.issueDate}</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{dict.docs.expiryDate}</label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{dict.docs.status}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              {DOCUMENT_STATUSES.map((s) => (
                <option key={s} value={s}>{(dict.docs as any)[s] || s}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{dict.docs.linkToFlow}</label>
            <select
              value={flowInstanceId}
              onChange={(e) => setFlowInstanceId(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
            >
              <option value="">{dict.docs.none}</option>
              {flowInstances.map((fi) => (
                <option key={fi.id} value={fi.id}>
                  {fi.flow_variant?.base_flow?.title || fi.id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{dict.docs.notes}</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={dict.docs.notesPlaceholder}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none h-20"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? dict.common.loading : dict.docs.addDocument}
          </button>
        </form>
      </div>
    </div>
  );
}
