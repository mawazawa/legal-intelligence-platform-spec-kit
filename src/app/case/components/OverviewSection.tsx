"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator, DollarSign, FileText, Scale, ChevronRight } from 'lucide-react';
import { SECTIONS, CASE_INFO } from '../constants';

interface OverviewSectionProps {
  onCardClick: (sectionId: string) => void;
}

const overviewCards = [
  {
    id: SECTIONS.RFO_ANALYSIS,
    title: 'RFO Analysis',
    icon: Calculator,
    iconColor: 'text-red-600',
    description: 'Mathematical error analysis of Petitioner\'s $77,779.88 double-counting claim',
  },
  {
    id: SECTIONS.COST_BREAKDOWN,
    title: 'Cost Breakdown',
    icon: DollarSign,
    iconColor: 'text-green-600',
    description: 'Detailed financial calculations and distribution proposals',
  },
  {
    id: SECTIONS.RESPONSIVE_DECLARATION,
    title: 'Responsive Declaration',
    icon: FileText,
    iconColor: 'text-purple-600',
    description: 'FL-320 responsive declaration with exhibits',
  },
  {
    id: SECTIONS.CLAIMS,
    title: 'Claims Analysis',
    icon: Scale,
    iconColor: 'text-blue-600',
    description: 'Breakdown of valid, invalid, and disputed claims',
  },
];

export const OverviewSection = React.memo<OverviewSectionProps>(({ onCardClick }) => {
  return (
    <section id={SECTIONS.OVERVIEW} className="scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-black text-slate-900 mb-4">
          {CASE_INFO.title}
        </h2>
        <p className="text-xl text-slate-600">
          Case No. {CASE_INFO.caseNumber} | {CASE_INFO.court}
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Hearing: {CASE_INFO.hearingDate} | Department {CASE_INFO.department}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map(({ id, title, icon: Icon, iconColor, description }) => (
          <Card
            key={id}
            className="hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => onCardClick(id)}
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Icon className={`h-5 w-5 ${iconColor}`} />
                {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">{description}</p>
              <ChevronRight className="h-4 w-4 text-blue-600 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
});

OverviewSection.displayName = 'OverviewSection';
