"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useDict } from "@/lib/i18n/context";
import { useSubscription } from "@/hooks/useSubscription";
import { exportFlowToPDF } from "@/lib/pdf-export";

interface StepData {
  id: string;
  title: string;
  description: string;
  step_order: number;
  required_documents: string[] | null;
  useful_links: { label: string; url: string }[] | null;
  tips: string | null;
  is_optional: boolean;
  is_done: boolean;
  user_notes: string;
}

interface FlowInstance {
  id: string;
  user_id: string;
  flow_variant_id: string;
  status: string;
  progress: number;
  step_snapshot: StepData[];
}

export default function StepRunnerPage() {
  const dict = useDict();
  const f = dict.flows;
  const router = useRouter();
  const params = useParams();
  const flowInstanceId = params.flowInstanceId as string;
  const { isPremium } = useSubscription();

  const [instance, setInstance] = useState<FlowInstance | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [flowTitle, setFlowTitle] = useState("");

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase.from("flow_instances").select("*").eq("id", flowInstanceId).single();
      if (data) {
        setInstance(data);
        const snapshot = data.step_snapshot as StepData[];
        const firstIncomplete = snapshot.findIndex((s) => !s.is_done);
        setCurrentStepIndex(firstIncomplete >= 0 ? firstIncomplete : 0);
        const { data: variant } = await supabase.from("flow_variants").select("base_flow_id").eq("id", data.flow_variant_id).single();
        if (variant) {
          const { data: base } = await supabase.from("base_flows").select("title").eq("id", variant.base_flow_id).single();
          if (base) setFlowTitle(base.title);
        }
      }
      setLoading(false);
    }
    load();
  }, [flowInstanceId]);

  const updateSnapshot = async (newSnapshot: StepData[]) => {
    if (!instance) return;
    setSaving(true);
    const supabase = createClient();
    const doneCount = newSnapshot.filter((s) => s.is_done).length;
    const progress = Math.round((doneCount / newSnapshot.length) * 100);
    const status = progress === 100 ? "completed" : "in_progress";
    const { data } = await supabase.from("flow_instances").update({ step_snapshot: newSnapshot, progress, status }).eq("id", instance.id).select().single();
    if (data) setInstance(data);
    setSaving(false);
  };

  const toggleDone = async () => {
    if (!instance) return;
    const snapshot = [...(instance.step_snapshot as StepData[])];
    snapshot[currentStepIndex] = { ...snapshot[currentStepIndex], is_done: !snapshot[currentStepIndex].is_done };
    await updateSnapshot(snapshot);
  };

  const updateNotes = async (notes: string) => {
    if (!instance) return;
    const snapshot = [...(instance.step_snapshot as StepData[])];
    snapshot[currentStepIndex] = { ...snapshot[currentStepIndex], user_notes: notes };
    await updateSnapshot(snapshot);
  };

  const handleExportPDF = () => {
    if (!instance) return;
    const snapshot = instance.step_snapshot as StepData[];
    exportFlowToPDF({
      flowTitle: flowTitle || "Flow",
      progress: instance.progress,
      steps: snapshot.map((s) => ({ title: s.title, description: s.description, step_order: s.step_order, is_done: s.is_done, user_notes: s.user_notes || "", required_documents: s.required_documents || [], tips: s.tips || "" })),
      exportDate: new Date().toLocaleDateString(),
    });
  };

  if (loading) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-gray-500">{dict.common?.loading || "Loading..."}</div></div>;
  if (!instance) return <div className="flex items-center justify-center min-h-[60vh]"><div className="text-red-500">Flow not found</div></div>;

  const steps = instance.step_snapshot as StepData[];
  const currentStep = steps[currentStepIndex];
  const isCompleted = instance.progress === 100;

  if (isCompleted) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center py-16">
        <div className="text-6xl mb-6">{"\u{1F389}"}</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">{f?.flowCompleted || "Flow Completed!"}</h1>
        <p className="text-gray-600 mb-4">{flowTitle}</p>
        <p className="text-gray-500 mb-8">{f?.allStepsDone || "You have completed all steps in this flow."}</p>
        <div className="flex justify-center gap-4">
          <button onClick={() => router.push("/flow")} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">{f?.backToFlows || "Back to Flows"}</button>
          {isPremium && <button onClick={handleExportPDF} className="bg-amber-100 text-amber-800 px-6 py-3 rounded-lg font-semibold hover:bg-amber-200 transition-colors">Export PDF</button>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <button onClick={() => router.push("/flow")} className="text-sm text-blue-600 hover:text-blue-800 mb-1 inline-block">{"\u2190"} {f?.backToFlows || "Back to Flows"}</button>
          <h1 className="text-xl font-bold text-gray-900">{flowTitle}</h1>
        </div>
        <div className="flex items-center gap-3">
          {isPremium && <button onClick={handleExportPDF} className="bg-amber-100 text-amber-800 px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-200 transition-colors">Export PDF</button>}
          <div className="text-right">
            <div className="text-sm font-medium text-blue-600">{instance.progress}%</div>
            <div className="w-24 bg-gray-200 rounded-full h-2 mt-1"><div className="bg-blue-600 h-2 rounded-full transition-all" style={{ width: `${instance.progress}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <button key={i} onClick={() => setCurrentStepIndex(i)} className={`flex-shrink-0 w-8 h-8 rounded-full text-xs font-medium flex items-center justify-center transition-colors ${i === currentStepIndex ? "bg-blue-600 text-white" : step.is_done ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
            {step.is_done ? "\u2713" : step.step_order}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-500 mb-1">{f?.stepOf?.replace("{current}", String(currentStepIndex + 1)).replace("{total}", String(steps.length)) || `Step ${currentStepIndex + 1} of ${steps.length}`}</p>
            <h2 className="text-xl font-semibold text-gray-900">{currentStep.title}</h2>
          </div>
          {currentStep.is_optional && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">{f?.optional || "Optional"}</span>}
        </div>

        <p className="text-gray-700 leading-relaxed">{currentStep.description}</p>

        {currentStep.tips && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-800 mb-1">{f?.tips || "Tips"}</h3>
            <p className="text-sm text-blue-700">{currentStep.tips}</p>
          </div>
        )}

        {currentStep.required_documents && currentStep.required_documents.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{f?.requiredDocs || "Required Documents"}</h3>
            <ul className="space-y-1">
              {currentStep.required_documents.map((doc, i) => (
                <li key={i} className="text-sm text-gray-600 flex items-center gap-2"><span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />{doc}</li>
              ))}
            </ul>
          </div>
        )}

        {currentStep.useful_links && currentStep.useful_links.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">{f?.usefulLinks || "Useful Links"}</h3>
            <ul className="space-y-1">
              {currentStep.useful_links.map((link, i) => (
                <li key={i}><a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 hover:text-blue-800 hover:underline">{link.label} {"\u2197"}</a></li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">{f?.yourNotes || "Your Notes"}</h3>
          <textarea value={currentStep.user_notes || ""} onChange={(e) => updateNotes(e.target.value)} placeholder={f?.addNote || "Add a note..."} rows={3} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>

        <button onClick={toggleDone} disabled={saving} className={`w-full py-3 rounded-lg font-semibold transition-colors ${currentStep.is_done ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-blue-600 text-white hover:bg-blue-700"} disabled:opacity-50`}>
          {saving ? dict.common?.loading || "Saving..." : currentStep.is_done ? `\u2713 ${f?.completed || "Completed"} - ${f?.undo || "Undo"}` : f?.markAsDone || "Mark as Done"}
        </button>
      </div>

      <div className="flex justify-between">
        <button onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))} disabled={currentStepIndex === 0} className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 disabled:opacity-30 disabled:cursor-not-allowed">{"\u2190"} {f?.previousStep || "Previous"}</button>
        <button onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))} disabled={currentStepIndex === steps.length - 1} className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800 disabled:opacity-30 disabled:cursor-not-allowed">{f?.nextStep || "Next"} {"\u2192"}</button>
      </div>
    </div>
  );
}