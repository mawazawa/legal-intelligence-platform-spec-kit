"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { EvidenceStats } from '@/lib/types/evidence';
import { formatFileSize } from '../utils';

interface StatsCardsProps {
  stats: EvidenceStats;
}

export const StatsCards = React.memo<StatsCardsProps>(({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Total Evidence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.total_files}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {formatFileSize(stats.total_size_bytes)} total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Authenticated</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.authenticated_count}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Ready for court filing
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">FL-320 Exhibits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{stats.by_filing['fl-320'] || 0}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Responsive declaration
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Evidence Types</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(stats.by_type).map(([type, count]) => (
              <Badge key={type} variant="secondary" className="text-xs">
                {type}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
});

StatsCards.displayName = 'StatsCards';
