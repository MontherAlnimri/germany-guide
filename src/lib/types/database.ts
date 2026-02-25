export type VisaType = "student_visa" | "job_seeker_visa" | "blue_card" | "work_permit" | "family_reunion" | "freelance_visa" | "permanent_residence" | "other";
export type ApplicationType = "first" | "renewal";
export type DocumentStatus = "valid" | "expiring_soon" | "expired" | "pending" | "not_uploaded";
export type StepStatus = "not_started" | "in_progress" | "done" | "skipped";
export type FlowInstanceStatus = "active" | "completed" | "abandoned";
export type ReminderStatus = "pending" | "sent" | "dismissed";

export interface Profile {
  id: string; email: string; full_name: string | null; visa_type: VisaType | null;
  application_type: ApplicationType | null; city: string | null; zip_code: string | null;
  visa_expiry_date: string | null; onboarding_completed: boolean; locale: string;
  created_at: string; updated_at: string;
}

export interface ProfileUpdate {
  full_name?: string; visa_type?: VisaType; application_type?: ApplicationType;
  city?: string; zip_code?: string; visa_expiry_date?: string; onboarding_completed?: boolean; locale?: string;
}

export interface BaseFlow {
  id: string; slug: string; title: string; description: string | null; icon: string | null;
  sort_order: number; is_active: boolean; created_at: string; updated_at: string;
}

export interface FlowVariant {
  id: string; base_flow_id: string; visa_type: VisaType; application_type: ApplicationType;
  title: string; description: string | null; is_active: boolean; created_at: string; updated_at: string;
  base_flow?: BaseFlow; steps?: FlowStep[];
}

export interface ExternalLink { url: string; label: string; }

export interface FlowStep {
  id: string; flow_variant_id: string; step_number: number; title: string;
  description: string | null; detailed_instructions: string | null; estimated_duration: string | null;
  required_documents: string[]; external_links: ExternalLink[]; tips: string | null;
  is_required: boolean; created_at: string; updated_at: string;
}

export interface UserFlowInstance {
  id: string; user_id: string; flow_variant_id: string; base_flow_id: string;
  status: FlowInstanceStatus; progress_pct: number; snapshot_meta: Record<string, unknown>;
  started_at: string; completed_at: string | null; created_at: string; updated_at: string;
  flow_variant?: FlowVariant; base_flow?: BaseFlow; step_progress?: UserStepProgress[];
}

export interface UserStepProgress {
  id: string; user_id: string; flow_instance_id: string; flow_step_id: string;
  status: StepStatus; notes: string | null; completed_at: string | null;
  created_at: string; updated_at: string; flow_step?: FlowStep;
}

export interface Document {
  id: string; user_id: string; doc_type: string; doc_name: string; file_url: string | null;
  issue_date: string | null; expiry_date: string | null; status: DocumentStatus;
  linked_flow_instance_id: string | null; linked_flow_step_id: string | null;
  notes: string | null; metadata: Record<string, unknown>; created_at: string; updated_at: string;
  flow_instance?: UserFlowInstance;
}

export interface DocumentInsert {
  doc_type: string; doc_name: string; file_url?: string; issue_date?: string; expiry_date?: string;
  status?: DocumentStatus; linked_flow_instance_id?: string; linked_flow_step_id?: string;
  notes?: string; metadata?: Record<string, unknown>;
}

export interface Deadline {
  id: string; user_id: string; title: string; description: string | null; due_date: string;
  remind_at: string | null; source_type: string | null; source_id: string | null;
  linked_flow_instance_id: string | null; linked_document_id: string | null;
  is_completed: boolean; completed_at: string | null; created_at: string; updated_at: string;
}

export interface DeadlineInsert {
  title: string; description?: string; due_date: string; remind_at?: string;
  source_type?: string; source_id?: string; linked_flow_instance_id?: string; linked_document_id?: string;
}

export interface Reminder {
  id: string; user_id: string; deadline_id: string | null; document_id: string | null;
  reminder_type: string; title: string; message: string | null; status: ReminderStatus;
  scheduled_for: string; sent_at: string | null; created_at: string;
}
