// @ts-nocheck
'use client';

// ============================================================================
// Step runner — displays and manages steps within a flow instance
// ============================================================================

import { useState } from 'react';
import { StepItem } from './StepItem';
import type { UserStepProgress, FlowStep } from '@/lib/types';

interface StepRunnerProps {
  steps: (UserStepProgress & { flow_step: FlowStep })[];
  flowInstanceId: string;
  userId: string;
}

export function StepRunner({ steps, flowInstanceId, userId }: StepRunnerProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(
    // Auto-expand first non-completed step
    steps.find((s) => s.status !== 'done' && s.status !== 'skipped')?.id || null
  );

  const toggleExpand = (stepId: string) => {
    setExpandedStep((prev) => (prev === stepId ? null : stepId));
  };

  if (steps.length === 0) {
    return (
      <div className="card-padded text-center py-12">
        <p className="text-gray-500">No steps found for this flow.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {steps.map((step, index) => (
        <StepItem
          key={step.id}
          stepProgress={step}
          stepNumber={index + 1}
          totalSteps={steps.length}
          isExpanded={expandedStep === step.id}
          onToggleExpand={() => toggleExpand(step.id)}
          flowInstanceId={flowInstanceId}
          userId={userId}
        />
      ))}
    </div>
  );
}