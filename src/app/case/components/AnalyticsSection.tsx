"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Scale, Calendar, TrendingUp } from 'lucide-react';
import { SECTIONS, CLAIMS_DATA, CONTINUANCES_DATA } from '../constants';

export const AnalyticsSection = React.memo(() => {
  return (
    <section id={SECTIONS.ANALYTICS} className="scroll-mt-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <BarChart className="h-8 w-8 text-blue-600" />
          Case Analytics
        </h2>
        <p className="text-slate-600">Data-driven insights and pattern analysis</p>
      </div>

      <div id={SECTIONS.CLAIMS} className="mb-12 scroll-mt-24">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Scale className="h-6 w-6 text-blue-600" />
              Claims Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="exhibit">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-red-700">{CLAIMS_DATA.invalid.amount}</div>
                <div className="text-sm text-red-600">Invalid Claims ({CLAIMS_DATA.invalid.percentage}%)</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-green-700">{CLAIMS_DATA.valid.amount}</div>
                <div className="text-sm text-green-600">Valid Claims ({CLAIMS_DATA.valid.percentage}%)</div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-blue-700">{CLAIMS_DATA.netProceeds}</div>
                <div className="text-sm text-blue-600">Net Proceeds</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div id={SECTIONS.CONTINUANCES} className="mb-12 scroll-mt-24">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              Continuances & Delays
            </CardTitle>
          </CardHeader>
          <CardContent className="exhibit">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-purple-700">{CONTINUANCES_DATA.total}</div>
                <div className="text-sm text-purple-600">Total Continuances</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-3xl font-bold text-orange-700">
                  {CONTINUANCES_DATA.petitionerRequests}/{CONTINUANCES_DATA.total}
                </div>
                <div className="text-sm text-orange-600">Petitioner Requests ({CONTINUANCES_DATA.percentage}%)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div id={SECTIONS.TIMELINE} className="mb-12 scroll-mt-24">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-indigo-600" />
              Case Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="exhibit">
            <p className="text-sm text-slate-600">Key events and milestones throughout the case</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
});

AnalyticsSection.displayName = 'AnalyticsSection';
