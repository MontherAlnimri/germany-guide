// @ts-nocheck
'use client';

// ============================================================================
// Available flows to start — client component for interactivity
// ============================================================================

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { VISA_TYPE_LABELS } from '@/lib/constants';
import type { FlowVariant, BaseFlow, Profile } from '@/lib/types';

interface FlowListProps {
  matchingVariants: (FlowVariant & { base_flow: BaseFlow })[];
  otherVariants: (FlowVariant & { base_flow: BaseFlow })[];
  userId: string;
  userProfile: Profile;
}

export function FlowList({
  matchingVariants,
  otherVariants,
  userId,
  userProfile,
}: FlowListProps) {
  const [startingId, setStartingId] = useState<string | null>(null);
  const [showOther, setShowOther] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleStartFlow = async (variant: FlowVariant & { base_flow: BaseFlow }) => {
    setStartingId(variant.id);

    try {
      // Create flow instance
      const { data: instance, error: instanceError } = await supabase
        .from('user_flow_instances')
        .insert({
          user_id: userId,
          flow_variant_id: variant.id,
          base_flow_id: variant.base_flow_id,
          status: 'active',
          snapshot_meta: {
            visa_type: userProfile.visa_type,
            application_type: userProfile.application_type,
            city: userProfile.city,
            assigned_at: new Date().toISOString(),
          },
        })
        .select('id')
        .single();

      if (instanceError || !instance) {
        console.error('Failed to create flow instance:', instanceError);
        return;
      }

      // Get steps for this variant
      const { data: steps } = await supabase
        .from('flow_steps')
        .select('id')
        .eq('flow_variant_id', variant.id)
        .order('step_number');

      if (steps && steps.length > 0) {
        const progressEntries = steps.map((step) => ({
          user_id: userId,
          flow_instance_id: instance.id,
          flow_step_id: step.id,
          status: 'not_started' as const,
        }));

        await supabase.from('user_step_progress').insert(progressEntries);
      }

      router.push(`/flow/${instance.id}`);
      router.refresh();
    } catch (err) {
      console.error('Error starting flow:', err);
    } finally {
      setStartingId(null);
    }
  };

  if (matchingVariants.length === 0 && otherVariants.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Matching variants */}
      {matchingVariants.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            📌 Recommended for You
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Based on your{' '}
            {userProfile.visa_type
              ? VISA_TYPE_LABELS[userProfile.visa_type]
              : 'visa type'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matchingVariants.map((variant) => (
              <Card key={variant.id}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">
                    {variant.base_flow?.icon || '📋'}
                  </span>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {variant.base_flow?.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {variant.title}
                    </p>
                    {variant.description && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {variant.description}
                      </p>
                    )}
                    <div className="mt-3">
                      <Button
                        size="sm"
                        loading={startingId === variant.id}
                        onClick={() => handleStartFlow(variant)}
                      >
                        Start Flow →
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Other variants */}
      {otherVariants.length > 0 && (
        <div>
          <button
            onClick={() => setShowOther(!showOther)}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            <span>{showOther ? '▼' : '▶'}</span>
            <span>
              Other Available Flows ({otherVariants.length})
            </span>
          </button>

          {showOther && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              {otherVariants.map((variant) => (
                <Card key={variant.id} className="opacity-75">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl mt-0.5">
                      {variant.base_flow?.icon || '📋'}
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start gap-2">
                        <h3 className="font-semibold text-gray-900">
                          {variant.base_flow?.title}
                        </h3>
                        <Badge variant="neutral">
                          {VISA_TYPE_LABELS[variant.visa_type]}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">
                        {variant.title}
                      </p>
                      <div className="mt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          loading={startingId === variant.id}
                          onClick={() => handleStartFlow(variant)}
                        >
                          Start Flow
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}