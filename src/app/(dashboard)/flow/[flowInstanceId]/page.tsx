'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useDict } from '@/lib/i18n/context';

interface FlowStep {
  id: string;
  title: string;
  description: string;
  step_order: number;
  required_documents: string[];
  useful_links: string[];
  tips: string;
  is_optional: boolean;
}

interface StepSnapshot {
  step_id: string;
  is_done: boolean;
  notes: string;
}

export default function FlowInstancePage() {
  const dict = useDict();
  const params = useParams();
  const router = useRouter();
  const flowInstanceId = params.flowInstanceId as string;

  const [instance, setInstance] = useState<any>(null);
  const [steps, setSteps] = useState<FlowStep[]>([]);
  const [snapshot, setSnapshot] = useState<StepSnapshot[]>([]);
  const [activeStep, setActiveStep] = useState(0);
  const [noteText, setNoteText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();

      const { data: inst } = await supabase
        .from('flow_instances')
        .select('*, flow_variant:flow_variant_id(*, base_flow:base_flow_id(*))')
        .eq('id', flowInstanceId)
        .single();

      if (!inst) {
        router.push('/flow');
        return;
      }
      setInstance(inst);
      setSnapshot(inst.step_snapshot || []);

      const { data: stepsData } = await supabase
        .from('flow_steps')
        .select('*')
        .eq('flow_variant_id', inst.flow_variant_id)
        .order('step_order');

      if (stepsData) setSteps(stepsData as any);

      const snap = inst.step_snapshot || [];
      const firstIncomplete = snap.findIndex((s: StepSnapshot) => !s.is_done);
      setActiveStep(firstIncomplete >= 0 ? firstIncomplete : 0);

      if (firstIncomplete >= 0 && snap[firstIncomplete]) {
        setNoteText(snap[firstIncomplete].notes || '');
      }

      setLoading(false);
    }
    load();
  }, [flowInstanceId, router]);

  const updateStepStatus = async (stepIndex: number, isDone: boolean) => {
    const supabase = createClient();
    const newSnapshot = [...snapshot];
    newSnapshot[stepIndex] = { ...newSnapshot[stepIndex], is_done: isDone };

    const doneCount = newSnapshot.filter((s) => s.is_done).length;
    const progress = steps.length > 0 ? (doneCount / steps.length) * 100 : 0;
    const status = progress >= 100 ? 'completed' : 'in_progress';

    await supabase
      .from('flow_instances')
      .update({ step_snapshot: newSnapshot, progress, status })
      .eq('id', flowInstanceId);

    setSnapshot(newSnapshot);
    setInstance((prev: any) => ({ ...prev, progress, status }));
  };

  const saveNotes = async () => {
    const supabase = createClient();
    const newSnapshot = [...snapshot];
    newSnapshot[activeStep] = { ...newSnapshot[activeStep], notes: noteText };

    await supabase
      .from('flow_instances')
      .update({ step_snapshot: newSnapshot })
      .eq('id', flowInstanceId);

    setSnapshot(newSnapshot);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  const currentStep = steps[activeStep];
  const currentSnap = snapshot[activeStep];
  const doneCount = snapshot.filter((s) => s.is_done).length;
  const progress = instance?.progress || 0;
  const flowTitle = instance?.flow_variant?.base_flow?.title || 'Flow';
  const flowIcon = instance?.flow_variant?.base_flow?.icon || '';

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/flow" className="text-gray-500 hover:text-gray-700 text-lg">
          &larr;
        </Link>
        <div>
          <h1 className="text-xl font-bold text-gray-900">
            {flowIcon} {flowTitle}
          </h1>
          <p className="text-sm text-gray-500">
            {doneCount}/{steps.length} {dict.flows.stepsCompleted}
          </p>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
          <span>{dict.flows.progress}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: progress + '%' }}
          />
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {steps.map((step, idx) => {
          const snap = snapshot[idx];
          const isActive = idx === activeStep;
          const isDone = snap?.is_done;
          let btnClass = 'bg-gray-100 text-gray-600 hover:bg-gray-200';
          if (isActive) {
            btnClass = 'bg-blue-600 text-white';
          } else if (isDone) {
            btnClass = 'bg-green-100 text-green-700';
          }
          return (
            <button
              key={step.id}
              onClick={() => {
                setActiveStep(idx);
                setNoteText(snapshot[idx]?.notes || '');
              }}
              className={'flex-shrink-0 w-9 h-9 rounded-lg text-sm font-medium transition-colors ' + btnClass}
            >
              {isDone ? '\u2713' : idx + 1}
            </button>
          );
        })}
      </div>

      {currentStep && (
        <div className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase">
              {dict.flows.stepOf
                .replace('{current}', String(activeStep + 1))
                .replace('{total}', String(steps.length))}
            </span>
            {currentStep.is_optional && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                {dict.common.optional}
              </span>
            )}
          </div>

          <h2 className="text-lg font-semibold text-gray-900">{currentStep.title}</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{currentStep.description}</p>

          {currentStep.tips && (
            <div className="bg-amber-50 border border-amber-100 rounded-lg p-3">
              <p className="text-sm text-amber-800">
                <span className="font-medium">{dict.flows.tip}</span> {currentStep.tips}
              </p>
            </div>
          )}

          {currentStep.required_documents && currentStep.required_documents.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">{dict.flows.requiredDocs}</h3>
              <ul className="space-y-1">
                {currentStep.required_documents.map((doc, i) => (
                  <li key={i} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-gray-400">&bull;</span> {doc}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {currentStep.useful_links && currentStep.useful_links.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">{dict.flows.usefulLinks}</h3>
              <ul className="space-y-1">
                {currentStep.useful_links.map((link, i) => (
                  <li key={i}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-700 underline break-all"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">{dict.flows.yourNotes}</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={dict.flows.notesPlaceholder}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none h-20 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <button
              onClick={saveNotes}
              className="mt-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              {dict.flows.saveNotes}
            </button>
          </div>

          <div className="flex gap-3 pt-2">
            {currentSnap?.is_done ? (
              <button
                onClick={() => updateStepStatus(activeStep, false)}
                className="flex-1 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                {dict.flows.undo}
              </button>
            ) : (
              <button
                onClick={() => updateStepStatus(activeStep, true)}
                className="flex-1 py-2.5 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
              >
                {'\u2713'} {dict.flows.markAsDone}
              </button>
            )}
            {activeStep < steps.length - 1 && (
              <button
                onClick={() => {
                  setActiveStep(activeStep + 1);
                  setNoteText(snapshot[activeStep + 1]?.notes || '');
                }}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
              >
                {dict.common.next} &rarr;
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
