import { trackEvent } from "@/lib/analytics";

export function trackStepCompleted(flowTitle: string, stepTitle: string, stepOrder: number) {
  trackEvent("step_completed", {
    flow_title: flowTitle,
    step_title: stepTitle,
    step_order: stepOrder,
  });
}

export function trackFlowStarted(flowTitle: string, visaType?: string) {
  trackEvent("flow_started", {
    flow_title: flowTitle,
    visa_type: visaType,
  });
}

export function trackFlowCompleted(flowTitle: string, visaType?: string) {
  trackEvent("flow_completed", {
    flow_title: flowTitle,
    visa_type: visaType,
  });
}

export function trackDocumentAdded(docType: string) {
  trackEvent("document_added", { doc_type: docType });
}

export function trackDeadlineAdded() {
  trackEvent("deadline_added", {});
}

export function trackPdfExported(type: "flow" | "documents") {
  trackEvent("pdf_exported", { type });
}