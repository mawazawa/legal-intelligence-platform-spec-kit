'use client';

import React from 'react';

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="h-6 bg-slate-200 rounded w-1/3 mb-3"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
        </div>
        <div className="w-20 h-20 bg-slate-200 rounded-xl"></div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-200 rounded w-full"></div>
        <div className="h-3 bg-slate-200 rounded w-5/6"></div>
        <div className="h-3 bg-slate-200 rounded w-4/6"></div>
      </div>
    </div>
  );
};

export const MetricCardSkeleton: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 bg-slate-300 rounded-xl"></div>
        <div className="w-16 h-6 bg-slate-300 rounded"></div>
      </div>
      <div className="h-8 bg-slate-300 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-300 rounded w-1/2 mb-1"></div>
      <div className="h-3 bg-slate-300 rounded w-2/3"></div>
    </div>
  );
};

export const ChartSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
      <div className="h-6 bg-slate-200 rounded w-1/4 mb-6"></div>
      <div className="h-64 bg-slate-100 rounded-lg flex items-end justify-around px-8 pb-4">
        <div className="w-16 bg-slate-300 rounded-t" style={{ height: '60%' }}></div>
        <div className="w-16 bg-slate-300 rounded-t" style={{ height: '80%' }}></div>
        <div className="w-16 bg-slate-300 rounded-t" style={{ height: '45%' }}></div>
        <div className="w-16 bg-slate-300 rounded-t" style={{ height: '70%' }}></div>
      </div>
    </div>
  );
};

export const HeaderSkeleton: React.FC = () => {
  return (
    <div className="mb-8 sm:mb-12 animate-pulse">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-14 h-14 bg-slate-300 rounded-2xl"></div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-32 h-6 bg-slate-300 rounded"></div>
            <div className="w-24 h-6 bg-slate-300 rounded"></div>
          </div>
          <div className="h-12 bg-slate-300 rounded w-2/3 mb-2"></div>
          <div className="h-5 bg-slate-200 rounded w-full max-w-4xl"></div>
        </div>
      </div>
    </div>
  );
};

export const PageSkeleton: React.FC<{ type?: 'default' | 'analytics' | 'dashboard' }> = ({
  type = 'default'
}) => {
  if (type === 'analytics') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
        <div className="max-w-7xl mx-auto">
          <HeaderSkeleton />

          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
            <MetricCardSkeleton />
          </div>

          {/* Tab Navigation Skeleton */}
          <div className="mb-8">
            <div className="flex space-x-2 bg-slate-100 p-1 rounded-lg">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-slate-200 rounded-md flex-1 animate-pulse"></div>
              ))}
            </div>
          </div>

          {/* Content Cards */}
          <div className="space-y-6">
            <CardSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-12 bg-slate-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <CardSkeleton />
            <CardSkeleton />
            <CardSkeleton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
