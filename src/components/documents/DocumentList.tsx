// @ts-nocheck
'use client';

// ============================================================================
// Document list with status badges, actions
// ============================================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate, daysUntil, computeDocumentStatus } from '@/lib/utils';
import { DOCUMENT_TYPES, DOCUMENT_STATUS_LABELS } from '@/lib/constants';
import type { Document as DocType, DocumentStatus } from '@/lib/types';

interface DocumentListProps {
  documents: DocType[];
  userId: string;
}

const statusVariant: Record<DocumentStatus, 'success' | 'warning' | 'danger' | 'info' | 'neutral'> = {
  valid: 'success',
  expiring_soon: 'warning',
  expired: 'danger',
  pending: 'info',
  not_uploaded: 'neutral',
};

export function DocumentList({ documents, userId }: DocumentListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);

    await supabase.from('documents').delete().eq('id', deleteId).eq('user_id', userId);

    setDeleteId(null);
    setDeleting(false);
    router.refresh();
  };

  const getDocTypeLabel = (docType: string) => {
    return DOCUMENT_TYPES.find((d) => d.value === docType)?.label || docType;
  };

  if (documents.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <span className="text-4xl">📁</span>
          <h3 className="text-lg font-semibold text-gray-900 mt-4">
            No Documents Yet
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Start adding your important documents to keep them organized.
          </p>
        </div>
      </Card>
    );
  }

  // Group by status
  const expired = documents.filter(
    (d) => computeDocumentStatus(d.expiry_date, d.status) === 'expired'
  );
  const expiringSoon = documents.filter(
    (d) => computeDocumentStatus(d.expiry_date, d.status) === 'expiring_soon'
  );
  const rest = documents.filter((d) => {
    const s = computeDocumentStatus(d.expiry_date, d.status);
    return s !== 'expired' && s !== 'expiring_soon';
  });

  const renderDoc = (doc: DocType) => {
    const computedStatus = computeDocumentStatus(doc.expiry_date, doc.status);
    const days = daysUntil(doc.expiry_date);

    return (
      <div
        key={doc.id}
        className="flex items-start justify-between gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-medium text-gray-900">{doc.doc_name}</h3>
            <Badge variant={statusVariant[computedStatus]}>
              {DOCUMENT_STATUS_LABELS[computedStatus]}
            </Badge>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            {getDocTypeLabel(doc.doc_type)}
          </p>
          <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
            {doc.issue_date && <span>Issued: {formatDate(doc.issue_date)}</span>}
            {doc.expiry_date && (
              <span>
                Expires: {formatDate(doc.expiry_date)}
                {days !== null && (
                  <span
                    className={
                      days <= 0
                        ? ' text-danger-600 font-medium'
                        : days <= 30
                          ? ' text-warning-600 font-medium'
                          : ''
                    }
                  >
                    {' '}
                    ({days <= 0 ? 'Expired' : `${days}d left`})
                  </span>
                )}
              </span>
            )}
          </div>
          {doc.notes && (
            <p className="text-xs text-gray-500 mt-1 line-clamp-1">
              📝 {doc.notes}
            </p>
          )}
        </div>
        <Button
          size="sm"
          variant="ghost"
          className="text-danger-500 hover:text-danger-700 hover:bg-danger-50 flex-shrink-0"
          onClick={() => setDeleteId(doc.id)}
        >
          🗑️
        </Button>
      </div>
    );
  };

  return (
    <>
      <div className="space-y-6">
        {expired.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-danger-700 mb-2">
              🚨 Expired ({expired.length})
            </h2>
            <div className="space-y-2">{expired.map(renderDoc)}</div>
          </div>
        )}

        {expiringSoon.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-warning-700 mb-2">
              ⚠️ Expiring Soon ({expiringSoon.length})
            </h2>
            <div className="space-y-2">{expiringSoon.map(renderDoc)}</div>
          </div>
        )}

        {rest.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">
              📄 All Documents ({rest.length})
            </h2>
            <div className="space-y-2">{rest.map(renderDoc)}</div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Delete Document"
        size="sm"
      >
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete this document? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </>
  );
}