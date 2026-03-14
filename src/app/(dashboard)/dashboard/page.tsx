'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useUser } from '@/hooks/useUser';
import { useProfile } from '@/hooks/useProfile';
import { useSubscription } from '@/hooks/useSubscription';
import { useDict } from '@/lib/i18n/context';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import UsageBar from '@/components/ui/UsageBar';
import AdBanner from '@/components/AdBanner';
import EmailVerificationBanner from '@/components/EmailVerificationBanner';

interface DashboardStats {
  activeFlows: number;
  totalDocuments: number;
  upcomingDeadlines: number;
  completedSteps: number;
  totalSteps: number;
}

interface RecentFlow {
  id: string;
  status: string;
  progress: number;
  created_at: string;
  flow_variant: {
    base_flow: {
      title: string;
      icon: string;
    };
  };
}

interface UpcomingDeadline {
  id: string;
  title: string;
  due_date: string;
  is_done: boolean;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading } = useProfile();
  const { subscription } = useSubscription();
  const dict = useDict();
  const [stats, setStats] = useState<DashboardStats>({
    activeFlows: 0,
    totalDocuments: 0,
    upcomingDeadlines: 0,
    completedSteps: 0,
    totalSteps: 0,
  });
  const [recentFlows, setRecentFlows] = useState<RecentFlow[]>([]);
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading || profileLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }
    if (profile && !profile.onboarding_complete) {
      router.push('/onboarding');
      return;
    }

    async function fetchDashboardData() {
      const supabase = createClient();

      const [flowsRes, docsRes, deadlinesRes] = await Promise.all([
        supabase
          .from('flow_instances')
          .select('id, status, progress, created_at, step_snapshot, flow_variant:flow_variants(base_flow:base_flows(title, icon))')
          .eq('user_id', user!.id)
          .order('updated_at', { ascending: false })
          .limit(5),
        supabase
          .from('documents')
          .select('id', { count: 'exact' })
          .eq('user_id', user!.id),
        supabase
          .from('deadlines')
          .select('id, title, due_date, is_done')
          .eq('user_id', user!.id)
          .eq('is_done', false)
          .gte('due_date', new Date().toISOString().split('T')[0])
          .order('due_date', { ascending: true })
          .limit(5),
      ]);

      const flows = (flowsRes.data || []) as unknown as RecentFlow[];
      const activeFlows = flows.filter(f => f.status !== 'completed').length;

      let completedSteps = 0;
      let totalSteps = 0;
      if (flowsRes.data) {
        for (const flow of flowsRes.data) {
          const snapshot = (flow as Record<string, unknown>).step_snapshot;
          if (Array.isArray(snapshot)) {
            totalSteps += snapshot.length;
            completedSteps += snapshot.filter((s: Record<string, unknown>) => s.is_done).length;
          }
        }
      }

      setStats({
        activeFlows,
        totalDocuments: docsRes.count || 0,
        upcomingDeadlines: deadlinesRes.data?.length || 0,
        completedSteps,
        totalSteps,
      });

      setRecentFlows(flows);
      setUpcomingDeadlines(deadlinesRes.data || []);
      setLoading(false);
    }

    fetchDashboardData();
  }, [user, userLoading, profile, profileLoading, router]);

  if (userLoading || profileLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{dict.common?.loading ?? 'Loading...'}</p>
        </div>
      </div>
    );
  }

  const isPremium = subscription?.plan === 'monthly' || subscription?.plan === 'yearly';
  const overallProgress = stats.totalSteps > 0 ? Math.round((stats.completedSteps / stats.totalSteps) * 100) : 0;

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      <EmailVerificationBanner />

      {!isPremium && (
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 sm:p-6 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-bold truncate">
                {dict.premium?.title ?? 'Upgrade to Premium'}
              </h3>
              <p className="text-blue-100 text-sm mt-1 line-clamp-2">
                {dict.premium?.subtitle ?? 'Unlock all features'}
              </p>
            </div>
            <Button
              onClick={() => router.push('/premium')}
              className="bg-white text-blue-600 hover:bg-blue-50 flex-shrink-0 w-full sm:w-auto"
            >
              {dict.premium?.subscribe ?? 'Go Premium'}
            </Button>
          </div>
        </div>
      )}

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">
          {dict.dashboard?.welcome ?? 'Welcome back'}{profile?.full_name ? `, ${profile.full_name}` : ''}!
        </h1>
        <p className="text-gray-600 text-sm mt-1">
          {dict.dashboard?.yourProgress ?? 'Your progress overview'}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg flex-shrink-0">
              <span className="text-lg sm:text-xl">{"\uD83D\uDCCB"}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">{dict.dashboard?.activeFlows ?? 'Active Flows'}</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.activeFlows}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg flex-shrink-0">
              <span className="text-lg sm:text-xl">{"\uD83D\uDCC4"}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">{dict.dashboard?.totalDocuments ?? 'Documents'}</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.totalDocuments}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-amber-100 rounded-lg flex-shrink-0">
              <span className="text-lg sm:text-xl">{"\u23F0"}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">{dict.dashboard?.upcomingDeadlines ?? 'Deadlines'}</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{stats.upcomingDeadlines}</p>
            </div>
          </div>
        </Card>
        <Card className="p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg flex-shrink-0">
              <span className="text-lg sm:text-xl">{"\u2705"}</span>
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">{dict.dashboard?.yourProgress ?? 'Progress'}</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{overallProgress}%</p>
            </div>
          </div>
        </Card>
      </div>

      {stats.totalSteps > 0 && (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
              {dict.dashboard?.yourProgress ?? 'Overall Progress'}
            </h2>
            <span className="text-sm text-gray-600">
              {stats.completedSteps}/{stats.totalSteps} {dict.dashboard?.completedSteps ?? 'steps completed'}
            </span>
          </div>
          <ProgressBar value={overallProgress} showLabel={false} />
        </Card>
      )}

      {!isPremium && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3">
            {dict.dashboard?.overview ?? 'Usage'}
          </h2>
          <div className="space-y-3">
            <UsageBar
              isPremium={isPremium}
              label={dict.dashboard?.activeFlows ?? 'Flows used'}
              current={stats.activeFlows}
              max={3}
            />
            <UsageBar
              isPremium={isPremium}
              label={dict.dashboard?.totalDocuments ?? 'Documents'}
              current={stats.totalDocuments}
              max={10}
            />
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            {dict.dashboard?.quickActions ?? 'Quick Actions'}
          </h2>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
            <Button
              onClick={() => router.push('/flow')}
              variant="outline"
              className="justify-start min-h-[44px] text-sm"
            >
              {"\uD83D\uDCCB"} {dict.dashboard?.startFlow ?? 'Start Flow'}
            </Button>
            <Button
              onClick={() => router.push('/documents/new')}
              variant="outline"
              className="justify-start min-h-[44px] text-sm"
            >
              {"\uD83D\uDCC4"} {dict.dashboard?.totalDocuments ?? 'Add Document'}
            </Button>
            <Button
              onClick={() => router.push('/deadlines')}
              variant="outline"
              className="justify-start min-h-[44px] text-sm"
            >
              {"\u23F0"} {dict.dashboard?.upcomingDeadlines ?? 'Add Deadline'}
            </Button>
            <Button
              onClick={() => router.push('/premium')}
              variant="outline"
              className="justify-start min-h-[44px] text-sm"
            >
              {"\u2B50"} {dict.premium?.upgradeNow ?? 'Go Premium'}
            </Button>
          </div>
        </Card>

        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            {dict.dashboard?.upcomingDeadlines ?? 'Upcoming Deadlines'}
          </h2>
          {upcomingDeadlines.length === 0 ? (
            <p className="text-gray-500 text-sm">{dict.dashboard?.noDeadlines ?? 'No upcoming deadlines'}</p>
          ) : (
            <div className="space-y-2 sm:space-y-3">
              {upcomingDeadlines.map((d) => {
                const daysUntil = Math.ceil(
                  (new Date(d.due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                );
                return (
                  <div key={d.id} className="flex items-center justify-between gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">{d.title}</p>
                      <p className="text-xs text-gray-500">{d.due_date}</p>
                    </div>
                    <Badge variant={daysUntil <= 3 ? 'danger' : daysUntil <= 7 ? 'warning' : 'success'} className="flex-shrink-0">
                      {daysUntil}d
                    </Badge>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      {recentFlows.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
            {dict.dashboard?.recentFlows ?? 'Recent Flows'}
          </h2>
          <div className="space-y-2 sm:space-y-3">
            {recentFlows.map((flow) => (
              <button
                key={flow.id}
                onClick={() => router.push(`/flow/${flow.id}`)}
                className="w-full flex items-center justify-between gap-3 p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors min-h-[44px] text-left"
              >
                <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                  <span className="text-lg sm:text-xl flex-shrink-0">
                    {flow.flow_variant?.base_flow?.icon ?? '\uD83D\uDCCB'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {flow.flow_variant?.base_flow?.title ?? 'Flow'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {flow.status === 'completed'
                        ? (dict.flows?.completed ?? 'Completed')
                        : `${flow.progress}% ${dict.flows?.inProgress ?? 'complete'}`}
                    </p>
                  </div>
                </div>
                <div className="flex-shrink-0 w-16 sm:w-24">
                  <ProgressBar value={flow.progress} showLabel={false} size="sm" />
                </div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {!isPremium && <AdBanner slot="dashboard-bottom" />}
    </div>
  );
}