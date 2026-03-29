// @ts-nocheck
'use client';

// ============================================================================
// Deadline list with add, complete, delete functionality
// ============================================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { formatDate, daysUntil, cn } from '@/lib/utils';
import type { Deadline } from '@/lib/types';

interface DeadlineListProps {
  deadlines: Deadline[];
  userId: string;
}

export function DeadlineList({ deadlines, userId }: DeadlineListProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('');
  const [newRemindAt, setNewRemindAt] = useState('');
  const [addError, setAddError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const pending = deadlines.filter((d) => !d.is_completed);
  const completed = deadlines.filter((d) => d.is_completed);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError(null);

    if (!newTitle.trim() || !newDueDate) {
      setAddError('Title and due date are required.');
      return;
    }

    setSaving(true);

    const { error } = await supabase.from('deadlines').insert({
      user_id: userId,
      title: newTitle.trim(),
      description: newDescription.trim() || null,
      due_date: newDueDate,
      remind_at: newRemindAt || null,
      source_type: 'manual',
    });

    if (error) {
      setAddError(error.message);
    } else {
      setShowAdd(false);
      setNewTitle('');
      setNewDescription('');
      setNewDueDate('');
      setNewRemindAt('');
      router.refresh();
    }
    setSaving(false);
  };

  const toggleComplete = async (deadline: Deadline) => {
    setTogglingId(deadline.id);
    const newCompleted = !deadline.is_completed;

    await supabase
      .from('deadlines')
      .update({
        is_completed: newCompleted,
        completed_at: newCompleted ? new Date().toISOString() : null,
      })
      .eq('id', deadline.id)
      .eq('user_id', userId);

    setTogglingId(null);
    router.refresh();
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await supabase.from('deadlines').delete().eq('id', id).eq('user_id', userId);
    setDeletingId(null);
    router.refresh();
  };

  const renderDeadline = (deadline: Deadline) => {
    const days = daysUntil(deadline.due_date);
    const isOverdue = days !== null && days < 0 && !deadline.is_completed;
    const isUrgent = days !== null && days <= 7 && days >= 0 && !deadline.is_completed;

    return (
      <div
        key={deadline.id}
        className={cn(
          'flex items-start gap-3 p-4 border rounded-lg transition-colors',
          isOverdue && 'bg-danger-50 border-danger-200',
          isUrgent && 'bg-warning-50 border-warning-200',
          deadline.is_completed && 'bg-gray-50 opacity-60'
        )}
      >
        {/* Checkbox */}
        <button
          onClick={() => toggleComplete(deadline)}
          disabled={togglingId === deadline.id}
          className={cn(
            'flex-shrink-0 w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors',
            deadline.is_completed
              ? 'bg-success-500 border-success-500 text-white'
              : 'border-gray-300 hover:border-primary-500'
          )}
        >
          {deadline.is_completed && (
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3
              className={cn(
                'font-medium text-gray-900',
                deadline.is_completed && 'line-through text-gray-500'
              )}
            >
              {deadline.title}
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!deadline.is_completed && (
                <Badge
                  variant={
                    isOverdue
                      ? 'danger'
                      : isUrgent
                        ? 'warning'
                        : days !== null && days <= 30
                          ? 'info'
                          : 'neutral'
                  }
                >
                  {days !== null
                    ? days < 0
                      ? `${Math.abs(days)}d overdue`
                      : days === 0
                        ? 'Today!'
                        : `${days}d left`
                    : '—'}
                </Badge>
              )}
              {deadline.is_completed && <Badge variant="success">Done</Badge>}
            </div>
          </div>
          {deadline.description && (
            <p className="text-sm text-gray-500 mt-0.5">{deadline.description}</p>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
            <span>Due: {formatDate(deadline.due_date)}</span>
            {deadline.source_type && (
              <span className="capitalize">
                Source: {deadline.source_type.replace('_', ' ')}
              </span>
            )}
          </div>
        </div>

        {/* Delete */}
        <button
          onClick={() => handleDelete(deadline.id)}
          disabled={deletingId === deadline.id}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-danger-500 transition-colors"
          title="Delete deadline"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Add deadline button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowAdd(true)}>+ Add Deadline</Button>
      </div>

      {/* Pending deadlines */}
      {pending.length > 0 ? (
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            📅 Upcoming ({pending.length})
          </h2>
          <div className="space-y-2">{pending.map(renderDeadline)}</div>
        </div>
      ) : (
        <Card>
          <div className="text-center py-12">
            <span className="text-4xl">🎉</span>
            <h3 className="text-lg font-semibold text-gray-900 mt-4">
              No Pending Deadlines
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              You&apos;re all caught up! Add a deadline to stay on track.
            </p>
          </div>
        </Card>
      )}

      {/* Completed */}
      {completed.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-gray-500 mb-3">
            ✅ Completed ({completed.length})
          </h2>
          <div className="space-y-2">{completed.map(renderDeadline)}</div>
        </div>
      )}

      {/* Add deadline modal */}
      <Modal
        isOpen={showAdd}
        onClose={() => {
          setShowAdd(false);
          setAddError(null);
        }}
        title="Add New Deadline"
      >
        <form onSubmit={handleAdd} className="space-y-4">
          <Input
            label="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="e.g., Visa Renewal Appointment"
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Any details about this deadline..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-y"
              rows={2}
            />
          </div>
          <Input
            label="Due Date"
            type="date"
            value={newDueDate}
            onChange={(e) => setNewDueDate(e.target.value)}
            required
          />
          <Input
            label="Start Reminding On (optional)"
            type="date"
            value={newRemindAt}
            onChange={(e) => setNewRemindAt(e.target.value)}
            hint="When should we start reminding you?"
          />

          {addError && (
            <div className="p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-700">
              {addError}
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Add Deadline
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}