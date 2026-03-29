// @ts-nocheck
'use client';

// ============================================================================
// Onboarding form — collects visa_type, first_vs_renewal, city, zip, expiry
// ============================================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Card } from '@/components/ui/Card';
import {
  VISA_TYPE_OPTIONS,
  APPLICATION_TYPE_OPTIONS,
  GERMAN_CITIES,
} from '@/lib/constants';
import type { VisaType, ApplicationType, Profile } from '@/lib/types';

interface OnboardingFormProps {
  profile: Profile;
  userId: string;
}

export function OnboardingForm({ profile, userId }: OnboardingFormProps) {
  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState(profile.full_name || '');
  const [visaType, setVisaType] = useState<VisaType | ''>(
    profile.visa_type || ''
  );
  const [applicationType, setApplicationType] = useState<ApplicationType | ''>(
    profile.application_type || ''
  );
  const [city, setCity] = useState(profile.city || '');
  const [zipCode, setZipCode] = useState(profile.zip_code || '');
  const [visaExpiryDate, setVisaExpiryDate] = useState(
    profile.visa_expiry_date || ''
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const totalSteps = 3;

  const handleNext = () => {
    setError(null);
    if (step === 1) {
      if (!fullName.trim()) {
        setError('Please enter your name.');
        return;
      }
      if (!visaType) {
        setError('Please select your visa type.');
        return;
      }
      if (!applicationType) {
        setError('Please select whether this is a first application or renewal.');
        return;
      }
    }
    if (step === 2) {
      if (!city) {
        setError('Please select or enter your city.');
        return;
      }
    }
    setStep((s) => Math.min(s + 1, totalSteps));
  };

  const handleBack = () => {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    try {
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          full_name: fullName.trim(),
          visa_type: visaType as VisaType,
          application_type: applicationType as ApplicationType,
          city,
          zip_code: zipCode,
          visa_expiry_date: visaExpiryDate || null,
          onboarding_completed: true,
        })
        .eq('id', userId);

      if (updateError) {
        setError(updateError.message);
        return;
      }

      // Auto-assign matching flow variants
      await assignFlows();

      // Auto-create visa expiry deadline
      if (visaExpiryDate) {
        await createVisaDeadline();
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const assignFlows = async () => {
    if (!visaType || !applicationType) return;

    // Find matching flow variants
    const { data: variants } = await supabase
      .from('flow_variants')
      .select('id, base_flow_id')
      .eq('visa_type', visaType)
      .eq('application_type', applicationType)
      .eq('is_active', true);

    if (!variants || variants.length === 0) return;

    // Check existing instances
    const { data: existing } = await supabase
      .from('user_flow_instances')
      .select('flow_variant_id')
      .eq('user_id', userId);

    const existingVariantIds = new Set(
      existing?.map((e) => e.flow_variant_id) || []
    );

    for (const variant of variants) {
      if (existingVariantIds.has(variant.id)) continue;

      // Create flow instance
      const { data: instance } = await supabase
        .from('user_flow_instances')
        .insert({
          user_id: userId,
          flow_variant_id: variant.id,
          base_flow_id: variant.base_flow_id,
          status: 'active',
          snapshot_meta: {
            visa_type: visaType,
            application_type: applicationType,
            city,
            zip_code: zipCode,
            assigned_at: new Date().toISOString(),
          },
        })
        .select('id')
        .single();

      if (!instance) continue;

      // Get steps for this variant
      const { data: steps } = await supabase
        .from('flow_steps')
        .select('id')
        .eq('flow_variant_id', variant.id)
        .order('step_number');

      if (!steps || steps.length === 0) continue;

      // Create step progress entries
      const stepProgressEntries = steps.map((step) => ({
        user_id: userId,
        flow_instance_id: instance.id,
        flow_step_id: step.id,
        status: 'not_started' as const,
      }));

      await supabase.from('user_step_progress').insert(stepProgressEntries);
    }
  };

  const createVisaDeadline = async () => {
    if (!visaExpiryDate) return;

    // Check for existing visa expiry deadline
    const { data: existing } = await supabase
      .from('deadlines')
      .select('id')
      .eq('user_id', userId)
      .eq('source_type', 'visa_expiry')
      .limit(1);

    if (existing && existing.length > 0) {
      // Update existing
      await supabase
        .from('deadlines')
        .update({
          due_date: visaExpiryDate,
          remind_at: calculateRemindDate(visaExpiryDate, 90),
          title: 'Visa Expiry Date',
          description:
            'Your residence permit expires on this date. Start renewal 3-4 months before.',
        })
        .eq('id', existing[0].id);
    } else {
      // Create new
      await supabase.from('deadlines').insert({
        user_id: userId,
        title: 'Visa Expiry Date',
        description:
          'Your residence permit expires on this date. Start renewal 3-4 months before.',
        due_date: visaExpiryDate,
        remind_at: calculateRemindDate(visaExpiryDate, 90),
        source_type: 'visa_expiry',
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      {/* Progress indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-bold text-gray-900">
            {profile.onboarding_completed ? 'Update Profile' : 'Welcome! Let\u2019s Set You Up'}
          </h1>
          <span className="text-sm text-gray-500">
            Step {step} of {totalSteps}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        {/* Step 1: Visa info */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                About You & Your Visa
              </h2>
              <p className="text-sm text-gray-500">
                This helps us personalize your flow with the right steps.
              </p>
            </div>

            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Your full name"
              required
            />

            <Select
              label="Visa Type"
              value={visaType}
              onChange={(e) => setVisaType(e.target.value as VisaType)}
              options={VISA_TYPE_OPTIONS}
              placeholder="Select your visa type"
              required
            />

            <Select
              label="Application Type"
              value={applicationType}
              onChange={(e) =>
                setApplicationType(e.target.value as ApplicationType)
              }
              options={APPLICATION_TYPE_OPTIONS}
              placeholder="First application or renewal?"
              required
            />
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Your Location in Germany
              </h2>
              <p className="text-sm text-gray-500">
                Helps us provide city-specific information.
              </p>
            </div>

            <Select
              label="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              options={GERMAN_CITIES.map((c) => ({ value: c, label: c }))}
              placeholder="Select your city"
              required
            />

            <Input
              label="ZIP Code (Postleitzahl)"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="e.g., 10115"
              maxLength={5}
              hint="Optional — 5-digit German postal code"
            />
          </div>
        )}

        {/* Step 3: Visa expiry */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Visa Expiry Date
              </h2>
              <p className="text-sm text-gray-500">
                We&apos;ll remind you to start renewal well before it expires.
              </p>
            </div>

            <Input
              label="Visa / Residence Permit Expiry Date"
              type="date"
              value={visaExpiryDate}
              onChange={(e) => setVisaExpiryDate(e.target.value)}
              hint="Leave blank if you haven't received your permit yet"
            />

            <div className="p-4 bg-primary-50 border border-primary-100 rounded-lg">
              <h3 className="text-sm font-medium text-primary-900 mb-1">
                📋 What happens next?
              </h3>
              <ul className="text-sm text-primary-700 space-y-1">
                <li>
                  • We&apos;ll create personalized step-by-step flows for your{' '}
                  <strong>
                    {VISA_TYPE_OPTIONS.find((v) => v.value === visaType)?.label ||
                      'visa'}
                  </strong>
                </li>
                <li>• You can track progress, take notes, and mark steps as done</li>
                <li>
                  • Your document vault will help you keep everything organized
                </li>
                {visaExpiryDate && (
                  <li>
                    • We&apos;ll remind you before your visa expires on{' '}
                    <strong>{visaExpiryDate}</strong>
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-4 p-3 bg-danger-50 border border-danger-200 rounded-lg text-sm text-danger-700">
            {error}
          </div>
        )}

        {/* Navigation buttons */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          {step > 1 ? (
            <Button variant="outline" onClick={handleBack}>
              ← Back
            </Button>
          ) : (
            <div />
          )}
          {step < totalSteps ? (
            <Button onClick={handleNext}>Next →</Button>
          ) : (
            <Button onClick={handleSubmit} loading={loading}>
              {profile.onboarding_completed ? 'Save Changes' : 'Complete Setup'} ✓
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

// Helper
function calculateRemindDate(dueDate: string, daysBefore: number): string {
  const date = new Date(dueDate);
  date.setDate(date.getDate() - daysBefore);
  return date.toISOString().split('T')[0];
}