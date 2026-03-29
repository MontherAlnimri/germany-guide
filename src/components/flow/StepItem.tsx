// @ts-nocheck
'use client';

// ============================================================================
// Individual step item with toggle, notes, details
// ============================================================================

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { STEP_STATUS_LABELS, DOCUMENT_TYPES } from '@/lib/constants';
import type { UserStepProgress, FlowStep, StepStatus, ExternalLink } from '@/lib/types';

interface StepItemProps {
  stepProgress: UserStepProgress & { flow_step: FlowStep };
  stepNumber: number;
  totalSteps: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  flowInstanceId: string;
  userId: string;
}

export function StepItem({
  stepProgress,
  stepNumber,
  totalSteps,
  isExpanded,
  onToggleExpand,
  flowInstanceId,
  userId,
}: StepItemProps) {
  const step = stepProgress.flow_step;
  const [status, setStatus] = useState<StepStatus>(stepProgress.status);
  const [notes, setNotes] = useState(stepProgress.notes || '');
  const [saving, setSaving] = useState(false);
  const [notesDirty, setNotesDirty] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const updateStatus = useCallback(
    async (newStatus: StepStatus) => {
      setSaving(true);
      setStatus(newStatus);

      const updateData: Record<string, unknown> = {
        status: newStatus,
        updated_at: new Date().toISOString(),
      };

      if (newStatus === 'done') {
        updateData.completed_at = new Date().toISOString();
      } else {
        updateData.completed_at = null;
      }

      await supabase
        .from('user_step_progress')
        .update(updateData)
        .eq('id', stepProgress.id);

      setSaving(false);
      router.refresh();
    },
    [stepProgress.id, supabase, router]
  );

  const saveNotes = useCallback(async () => {
    setSaving(true);
    await supabase
      .from('user_step_progress')
      .update({
        notes: notes.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', stepProgress.id);
    setNotesDirty(false);
    setSaving(false);
  }, [notes, stepProgress.id, supabase]);

  const isDone = status === 'done';
  const isSkipped = status === 'skipped';

  const statusIcon =
    status === 'done'
      ? '✅'
      : status === 'skipped'
        ? '⏭️'
        : status === 'in_progress'
          ? '🔄'
          : '⬜';

  const getDocLabel = (docSlug: string) => {
    return DOCUMENT_TYPES.find((d) => d.value === docSlug)?.label || docSlug;
  };

  return (
    <div
      className={cn(
        'card-padded transition-all',
        isDone && 'bg-success-50/50 border-success-200',
        isSkipped && 'bg-gray-50 border-gray-200 opacity-60'
      )}
    >
      {/* Step header */}
      <div
        className="flex items-start gap-3 cursor-pointer"
        onClick={onToggleExpand}
      >
        {/* Status indicator */}
        <div className="flex-shrink-0 mt-0.5">
          <span className="text-xl">{statusIcon}</span>
        </div>

        {/* Title area */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-xs text-gray-400 font-medium">
                STEP {stepNumber} OF {totalSteps}
              </span>
              <h3
                className={cn(
                  'font-semibold text-gray-900',
                  isDone && 'line-through text-gray-500',
                  isSkipped && 'line-through text-gray-400'
                )}
              >
                {step.title}
              </h3>
              {step.description && (
                <p className="text-sm text-gray-500 mt-0.5">
                  {step.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {!step.is_required && (
                <Badge variant="neutral">Optional</Badge>
              )}
              {step.estimated_duration && (
                <span className="text-xs text-gray-400 hidden sm:inline">
                  ⏱️ {step.estimated_duration}
                </span>
              )}
              <span
                className={cn(
                  'text-gray-400 transition-transform',
                  isExpanded && 'rotate-180'
                )}
              >
                ▼
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Expanded content */}
      {isExpanded && (
        <div className="mt-4 ml-9 space-y-4">
          {/* Detailed instructions */}
          {step.detailed_instructions && (
            <div className="prose prose-sm max-w-none">
              <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {step.detailed_instructions}
              </div>
            </div>
          )}

          {/* Tips */}
          {step.tips && (
            <div className="bg-primary-50 border border-primary-100 rounded-lg p-3">
              <p className="text-sm text-primary-800">
                <span className="font-medium">💡 Tip:</span> {step.tips}
              </p>
            </div>
          )}

          {/* Required documents */}
          {step.required_documents && step.required_documents.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                📄 Required Documents
              </h4>
              <div className="flex flex-wrap gap-2">
                {step.required_documents.map((doc) => (
                  <Badge key={doc} variant="info">
                    {getDocLabel(doc)}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* External links */}
          {step.external_links &&
            (step.external_links as ExternalLink[]).length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  🔗 Useful Links
                </h4>
                <div className="space-y-1">
                  {(step.external_links as ExternalLink[]).map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-primary-600 hover:text-primary-700 hover:underline"
                    >
                      {link.label} ↗
                    </a>
                  ))}
                </div>
              </div>
            )}

          {/* Notes */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              📝 Your Notes
            </h4>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                setNotesDirty(true);
              }}
              placeholder="Add personal notes, appointment dates, reference numbers..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:outline-none resize-y min-h-[80px]"
              rows={3}
            />
            {notesDirty && (
              <div className="mt-2">
                <Button size="sm" variant="secondary" onClick={saveNotes} loading={saving}>
                  Save Notes
                </Button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-2 pt-2 border-t">
            {status !== 'done' && (
              <Button
                size="sm"
                onClick={() => updateStatus('done')}
                loading={saving}
              >
                ✅ Mark as Done
              </Button>
            )}
            {status === 'done' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => updateStatus('not_started')}
                loading={saving}
              >
                ↩️ Undo
              </Button>
            )}
            {status !== 'in_progress' && status !== 'done' && (
              <Button
                size="sm"
                variant="secondary"
                onClick={() => updateStatus('in_progress')}
                loading={saving}
              >
                🔄 In Progress
              </Button>
            )}
            {!step.is_required && status !== 'skipped' && status !== 'done' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => updateStatus('skipped')}
                loading={saving}
              >
                ⏭️ Skip
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}