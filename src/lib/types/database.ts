export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  visa_type: string | null;
  first_vs_renewal: string | null;
  city: string | null;
  zip_code: string | null;
  visa_expiry_date: string | null;
  onboarding_complete: boolean;
  locale: string | null;
  is_premium: boolean;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BaseFlow {
  id: string;
  title: string;
  description: string | null;
  icon: string | null;
  category: string | null;
  created_at: string;
}

export interface FlowVariant {
  id: string;
  base_flow_id: string;
  visa_type: string;
  first_vs_renewal: string;
  created_at: string;
}

export interface FlowStep {
  id: string;
  flow_variant_id: string;
  title: string;
  description: string | null;
  step_order: number;
  required_documents: string[] | null;
  useful_links: { label: string; url: string }[] | null;
  tips: string | null;
  is_optional: boolean;
  created_at: string;
}

export interface FlowInstance {
  id: string;
  user_id: string;
  flow_variant_id: string;
  status: "not_started" | "in_progress" | "completed";
  progress: number;
  step_snapshot: StepSnapshot[] | null;
  created_at: string;
  updated_at: string;
}

export interface StepSnapshot {
  step_id: string;
  title: string;
  description: string | null;
  step_order: number;
  required_documents: string[] | null;
  useful_links: { label: string; url: string }[] | null;
  tips: string | null;
  is_optional: boolean;
  is_done: boolean;
  user_notes: string;
}

export interface Document {
  id: string;
  user_id: string;
  doc_type: string;
  doc_name: string;
  issue_date: string | null;
  expiry_date: string | null;
  status: string;
  flow_instance_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Deadline {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  due_date: string;
  remind_at: string | null;
  is_done: boolean;
  created_at: string;
  updated_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  plan: "free" | "monthly" | "yearly";
  status: "active" | "cancelled" | "expired" | "past_due";
  current_period_start: string | null;
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export interface Tip {
  id: string;
  user_id: string | null;
  amount: number;
  currency: string;
  stripe_payment_intent_id: string;
  status: "pending" | "succeeded" | "failed";
  created_at: string;
}