-- =============================================================================
-- GERMANY MIGRANT/STUDENT GUIDE - FULL DATABASE SCHEMA
-- Run this in your Supabase SQL Editor
-- =============================================================================

-- Enable UUID extension (usually already enabled)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================================
-- ENUM TYPES
-- =============================================================================

-- Visa types supported
CREATE TYPE visa_type_enum AS ENUM (
  'student_visa',
  'job_seeker_visa',
  'blue_card',
  'work_permit',
  'family_reunion',
  'freelance_visa',
  'permanent_residence',
  'other'
);

-- Whether this is a first application or renewal
CREATE TYPE application_type_enum AS ENUM (
  'first',
  'renewal'
);

-- Document status
CREATE TYPE document_status_enum AS ENUM (
  'valid',
  'expiring_soon',
  'expired',
  'pending',
  'not_uploaded'
);

-- Step completion status
CREATE TYPE step_status_enum AS ENUM (
  'not_started',
  'in_progress',
  'done',
  'skipped'
);

-- Flow instance status
CREATE TYPE flow_instance_status_enum AS ENUM (
  'active',
  'completed',
  'abandoned'
);

-- Reminder status
CREATE TYPE reminder_status_enum AS ENUM (
  'pending',
  'sent',
  'dismissed'
);

-- =============================================================================
-- TABLE: profiles
-- Extends Supabase auth.users with app-specific data
-- =============================================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  visa_type visa_type_enum,
  application_type application_type_enum,
  city TEXT,
  zip_code TEXT,
  visa_expiry_date DATE,
  onboarding_completed BOOLEAN NOT NULL DEFAULT FALSE,
  locale TEXT NOT NULL DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_profiles_visa_type ON profiles(visa_type);
CREATE INDEX idx_profiles_onboarding ON profiles(onboarding_completed);
CREATE INDEX idx_profiles_visa_expiry ON profiles(visa_expiry_date);

-- =============================================================================
-- TABLE: base_flows
-- Admin-defined flow templates (e.g., "Student Visa Application")
-- =============================================================================
CREATE TABLE base_flows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- emoji or icon name
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_base_flows_slug ON base_flows(slug);
CREATE INDEX idx_base_flows_active ON base_flows(is_active);

-- =============================================================================
-- TABLE: flow_variants
-- Conditional variants per base flow (visa_type + application_type combo)
-- =============================================================================
CREATE TABLE flow_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  base_flow_id UUID NOT NULL REFERENCES base_flows(id) ON DELETE CASCADE,
  visa_type visa_type_enum NOT NULL,
  application_type application_type_enum NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(base_flow_id, visa_type, application_type)
);

CREATE INDEX idx_flow_variants_lookup ON flow_variants(visa_type, application_type, is_active);
CREATE INDEX idx_flow_variants_base ON flow_variants(base_flow_id);

-- =============================================================================
-- TABLE: flow_steps
-- Steps belonging to a flow variant (the template steps)
-- =============================================================================
CREATE TABLE flow_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  flow_variant_id UUID NOT NULL REFERENCES flow_variants(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  detailed_instructions TEXT, -- rich text / markdown
  estimated_duration TEXT, -- e.g., "2-3 days", "1 hour"
  required_documents TEXT[], -- array of document type slugs
  external_links JSONB DEFAULT '[]'::JSONB, -- [{url, label}]
  tips TEXT, -- helpful tips
  is_required BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(flow_variant_id, step_number)
);

CREATE INDEX idx_flow_steps_variant ON flow_steps(flow_variant_id);
CREATE INDEX idx_flow_steps_order ON flow_steps(flow_variant_id, step_number);

-- =============================================================================
-- TABLE: user_flow_instances
-- Per-user snapshot of an assigned/started flow
-- =============================================================================
CREATE TABLE user_flow_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  flow_variant_id UUID NOT NULL REFERENCES flow_variants(id) ON DELETE CASCADE,
  base_flow_id UUID NOT NULL REFERENCES base_flows(id) ON DELETE CASCADE,
  status flow_instance_status_enum NOT NULL DEFAULT 'active',
  progress_pct NUMERIC(5,2) NOT NULL DEFAULT 0.00,
  snapshot_meta JSONB DEFAULT '{}'::JSONB, -- snapshot of user context at creation
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_ufi_user ON user_flow_instances(user_id);
CREATE INDEX idx_ufi_user_status ON user_flow_instances(user_id, status);
CREATE INDEX idx_ufi_variant ON user_flow_instances(flow_variant_id);

-- =============================================================================
-- TABLE: user_step_progress
-- Per-user step-level progress within a flow instance
-- =============================================================================
CREATE TABLE user_step_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  flow_instance_id UUID NOT NULL REFERENCES user_flow_instances(id) ON DELETE CASCADE,
  flow_step_id UUID NOT NULL REFERENCES flow_steps(id) ON DELETE CASCADE,
  status step_status_enum NOT NULL DEFAULT 'not_started',
  notes TEXT,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(flow_instance_id, flow_step_id)
);

CREATE INDEX idx_usp_user ON user_step_progress(user_id);
CREATE INDEX idx_usp_instance ON user_step_progress(flow_instance_id);
CREATE INDEX idx_usp_status ON user_step_progress(flow_instance_id, status);

-- =============================================================================
-- TABLE: documents
-- User document vault
-- =============================================================================
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  doc_type TEXT NOT NULL, -- e.g., 'passport', 'enrollment_letter', 'health_insurance'
  doc_name TEXT NOT NULL,
  file_url TEXT, -- storage URL (future: Supabase Storage)
  issue_date DATE,
  expiry_date DATE,
  status document_status_enum NOT NULL DEFAULT 'not_uploaded',
  linked_flow_instance_id UUID REFERENCES user_flow_instances(id) ON DELETE SET NULL,
  linked_flow_step_id UUID REFERENCES flow_steps(id) ON DELETE SET NULL,
  notes TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_type ON documents(user_id, doc_type);
CREATE INDEX idx_documents_expiry ON documents(expiry_date);
CREATE INDEX idx_documents_status ON documents(user_id, status);
CREATE INDEX idx_documents_flow ON documents(linked_flow_instance_id);

-- =============================================================================
-- TABLE: deadlines
-- User deadlines (auto-generated or manual)
-- =============================================================================
CREATE TABLE deadlines (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE NOT NULL,
  remind_at DATE, -- when to start reminding (e.g., 30 days before)
  source_type TEXT, -- 'visa_expiry', 'document_expiry', 'flow_step', 'manual'
  source_id UUID, -- references the source record
  linked_flow_instance_id UUID REFERENCES user_flow_instances(id) ON DELETE SET NULL,
  linked_document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deadlines_user ON deadlines(user_id);
CREATE INDEX idx_deadlines_due ON deadlines(due_date);
CREATE INDEX idx_deadlines_remind ON deadlines(remind_at);
CREATE INDEX idx_deadlines_user_pending ON deadlines(user_id, is_completed, due_date);

-- =============================================================================
-- TABLE: reminders (log of generated reminders from cron)
-- =============================================================================
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  deadline_id UUID REFERENCES deadlines(id) ON DELETE CASCADE,
  document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
  reminder_type TEXT NOT NULL, -- 'visa_expiry', 'document_expiry', 'deadline', 'step_reminder'
  title TEXT NOT NULL,
  message TEXT,
  status reminder_status_enum NOT NULL DEFAULT 'pending',
  scheduled_for DATE NOT NULL,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reminders_user ON reminders(user_id);
CREATE INDEX idx_reminders_status ON reminders(status, scheduled_for);
CREATE INDEX idx_reminders_scheduled ON reminders(scheduled_for);

-- =============================================================================
-- FUNCTION: auto-update updated_at timestamp
-- =============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables with updated_at
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_base_flows_updated_at
  BEFORE UPDATE ON base_flows FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_flow_variants_updated_at
  BEFORE UPDATE ON flow_variants FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_flow_steps_updated_at
  BEFORE UPDATE ON flow_steps FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_user_flow_instances_updated_at
  BEFORE UPDATE ON user_flow_instances FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_user_step_progress_updated_at
  BEFORE UPDATE ON user_step_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_documents_updated_at
  BEFORE UPDATE ON documents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_deadlines_updated_at
  BEFORE UPDATE ON deadlines FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- FUNCTION: Auto-create profile on user signup
-- =============================================================================
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- =============================================================================
-- FUNCTION: Calculate and update flow instance progress
-- =============================================================================
CREATE OR REPLACE FUNCTION recalc_flow_progress()
RETURNS TRIGGER AS $$
DECLARE
  total_steps INTEGER;
  done_steps INTEGER;
  new_pct NUMERIC(5,2);
  v_instance_status flow_instance_status_enum;
BEGIN
  SELECT COUNT(*) INTO total_steps
  FROM user_step_progress
  WHERE flow_instance_id = NEW.flow_instance_id;

  SELECT COUNT(*) INTO done_steps
  FROM user_step_progress
  WHERE flow_instance_id = NEW.flow_instance_id
    AND status IN ('done', 'skipped');

  IF total_steps > 0 THEN
    new_pct := (done_steps::NUMERIC / total_steps::NUMERIC) * 100;
  ELSE
    new_pct := 0;
  END IF;

  IF new_pct >= 100 THEN
    v_instance_status := 'completed';
  ELSE
    v_instance_status := 'active';
  END IF;

  UPDATE user_flow_instances
  SET progress_pct = new_pct,
      status = v_instance_status,
      completed_at = CASE WHEN new_pct >= 100 THEN NOW() ELSE NULL END
  WHERE id = NEW.flow_instance_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_recalc_progress
  AFTER INSERT OR UPDATE OF status ON user_step_progress
  FOR EACH ROW EXECUTE FUNCTION recalc_flow_progress();

-- =============================================================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================================================

-- Enable RLS on all user-data tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_flow_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_step_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE deadlines ENABLE ROW LEVEL SECURITY;
ALTER TABLE reminders ENABLE ROW LEVEL SECURITY;

-- Public/read-only tables (admin-seeded, no user writes)
ALTER TABLE base_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_steps ENABLE ROW LEVEL SECURITY;

-- ---- PROFILES ----
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Insert handled by trigger (SECURITY DEFINER), but allow for edge cases
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ---- BASE_FLOWS (read-only for all authenticated) ----
CREATE POLICY "Authenticated users can view active base flows"
  ON base_flows FOR SELECT
  USING (is_active = TRUE);

-- ---- FLOW_VARIANTS (read-only for all authenticated) ----
CREATE POLICY "Authenticated users can view active flow variants"
  ON flow_variants FOR SELECT
  USING (is_active = TRUE);

-- ---- FLOW_STEPS (read-only for all authenticated) ----
CREATE POLICY "Authenticated users can view flow steps"
  ON flow_steps FOR SELECT
  USING (TRUE);

-- ---- USER_FLOW_INSTANCES ----
CREATE POLICY "Users can view own flow instances"
  ON user_flow_instances FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own flow instances"
  ON user_flow_instances FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own flow instances"
  ON user_flow_instances FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own flow instances"
  ON user_flow_instances FOR DELETE
  USING (auth.uid() = user_id);

-- ---- USER_STEP_PROGRESS ----
CREATE POLICY "Users can view own step progress"
  ON user_step_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own step progress"
  ON user_step_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own step progress"
  ON user_step_progress FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own step progress"
  ON user_step_progress FOR DELETE
  USING (auth.uid() = user_id);

-- ---- DOCUMENTS ----
CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (auth.uid() = user_id);

-- ---- DEADLINES ----
CREATE POLICY "Users can view own deadlines"
  ON deadlines FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own deadlines"
  ON deadlines FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own deadlines"
  ON deadlines FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own deadlines"
  ON deadlines FOR DELETE
  USING (auth.uid() = user_id);

-- ---- REMINDERS ----
CREATE POLICY "Users can view own reminders"
  ON reminders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own reminders"
  ON reminders FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Service role inserts reminders (via cron API), so no user INSERT policy needed
-- But allow service_role via default (RLS bypassed for service_role)