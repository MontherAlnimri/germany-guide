'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useDict } from '@/lib/i18n/context';

export default function DocumentsPage() {
  const dict = useDict();
  const [docs, setDocs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from('documents').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) setDocs(data);
      setLoading(false);
    }
    load();
  }, []);

  const getStatusBadge = (doc: any) => {
    if (doc.expiry_date) {
      const days = Math.ceil((new Date(doc.expiry_date).getTime() - Date.now()) / 86400000);
      if (days < 0) return { label: dict.docs.expired, cls: 'bg-red-100 text-red-700' };
      if (days <= 30) return { label: dict.docs.expiringSoon, cls: 'bg-amber-100 text-amber-700' };
    }
    if (doc.status === 'valid') return { label: dict.docs.valid, cls: 'bg-green-100 text-green-700' };
    if (doc.status === 'pending') return { label: dict.docs.pending, cls: 'bg-blue-100 text-blue-700' };
    return { label: dict.docs.notUploaded, cls: 'bg-gray-100 text-gray-600' };
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{dict.docs.documentVault}</h1>
          <p className="text-gray-600 mt-1">{dict.docs.documentVaultDesc}</p>
        </div>
        <Link href="/documents/new" className="px-4 py-2 bg-blue-600 text-white text-sm rounded-xl font-medium hover:bg-blue-700 transition-colors">{dict.docs.addDocument}</Link>
      </div>

      {docs.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-xl mb-2">{'\uD83D\uDCC1'}</p>
          <h3 className="font-medium text-gray-900">{dict.docs.noDocuments}</h3>
          <p className="text-sm text-gray-500 mt-1">{dict.docs.noDocumentsDesc}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {docs.map((doc) => {
            const badge = getStatusBadge(doc);
            return (
              <div key={doc.id} className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-gray-900">{doc.doc_name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5">{doc.doc_type}</p>
                  </div>
                  <span className={'text-xs font-medium px-2 py-1 rounded-full ' + badge.cls}>{badge.label}</span>
                </div>
                <div className="mt-3 flex gap-4 text-xs text-gray-500">
                  {doc.issue_date && <span>{dict.docs.issued} {new Date(doc.issue_date).toLocaleDateString()}</span>}
                  {doc.expiry_date && <span>{dict.docs.expires} {new Date(doc.expiry_date).toLocaleDateString()}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}