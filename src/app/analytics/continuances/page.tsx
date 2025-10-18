'use client';
import React, { useEffect, useState, useRef } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { toPng } from 'html-to-image';
import { safeFetch } from '@/lib/api/fetch';
import { logger } from '@/lib/logging/logger';

type Stats = {
  countsByActor: Record<string, number>;
  continuancesByActor: Record<string, number>;
  avgDaysByActor: Record<string, number>;
};

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const pct = max ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <div className="w-40 text-sm text-slate-700 capitalize">{label}</div>
      <div className="h-5 bg-slate-100 rounded w-full">
        <div className="h-5 bg-blue-600 rounded" style={{ width: pct + '%' }} />
      </div>
      <div className="w-12 text-right text-sm tabular-nums">{value}</div>
    </div>
  );
}

export default function ContinuancesPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /**
     * Load continuance statistics from email corpus
     * Analyzes email data for continuance-related communications by actor
     */
    const loadStats = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const result = await safeFetch<Stats>(
          '/api/analytics/email-stats',
          { timeout: 10000, retries: 2 }
        );

        if (result.error) {
          logger.warn('Failed to load continuance stats', {
            error: result.error.message,
            status: result.status,
          });
          setStats(null);
          setLoadError('Failed to load continuance statistics');
        } else if (result.data) {
          setStats(result.data);
          logger.debug('Loaded continuance stats', {
            actors: Object.keys(result.data.continuancesByActor).length
          });
        }
      } catch (err) {
        logger.error('Error loading continuance stats', err as Error);
        setStats(null);
        setLoadError('Unexpected error loading statistics');
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  const handleDownload = async () => {
    if (!ref.current) return;
    const dataUrl = await toPng(ref.current, { cacheBust: true, backgroundColor: '#ffffff' });
    const a = document.createElement('a');
    a.download = 'continuances_attribution.png';
    a.href = dataUrl;
    a.click();
  };

  const entries = Object.entries(stats?.continuancesByActor || {});
  const max = Math.max(1, ...entries.map(([, v]) => v));

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="p-6 mx-auto max-w-4xl">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
              <p className="text-slate-700">Loading continuance statistics...</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 mx-auto max-w-4xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold tracking-tight">Continuances Attribution</h1>
          <button onClick={handleDownload} className="no-print text-xs px-2 py-1 rounded bg-slate-900 text-white">Download PNG</button>
        </div>

        {loadError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded text-red-800 text-sm">
            <p className="font-semibold">Error loading statistics</p>
            <p className="text-xs mt-1">{loadError}</p>
          </div>
        )}

        <div ref={ref} className="printable rounded border bg-white p-6">
          <div className="text-sm text-slate-600 mb-2">Counts of continuance-related communications by actor (email corpus).</div>
          <div className="space-y-2">
            {entries.length ? entries.map(([actor, count]) => (
              <Bar key={actor} label={actor} value={count} max={max} />
            )) : <div className="text-slate-600 text-sm">No continuance keywords detected.</div>}
          </div>
          <div className="mt-3 text-[11px] text-slate-500">Caption: Quantitative attribution of continuances by actor derived from mbox corpus ("continuance", "postpone", "reschedule", "adjourn").</div>
        </div>
      </div>
    </DashboardLayout>
  );
}

