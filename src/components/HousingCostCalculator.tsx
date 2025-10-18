'use client';

import React, { useState, useMemo, useRef, memo } from 'react';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  DEFAULT_CLOSING_DATA,
  DEFAULT_MORTGAGE_BREAKDOWN,
  DEFAULT_SOD_ADJUSTMENTS,
  DEFAULT_REALTOR_INFO,
  PRINT_STYLES
} from './housing-calculator/constants';
import { calculateHousingDistribution } from './housing-calculator/utils/calculations';
import { DistributionSummary } from './housing-calculator/components/DistributionSummary';
import { DocumentHeader } from './housing-calculator/components/DocumentHeader';
import { DocumentFooter } from './housing-calculator/components/DocumentFooter';
import { PrintControls } from './housing-calculator/components/PrintControls';
import { CalculationStepDisplay } from './housing-calculator/components/CalculationStepDisplay';
import type { ClosingData, MortgageBreakdown, RealtorInfo } from './housing-calculator/types';
import type { SODAdjustments } from '@/types/calculations';

const HousingCostCalculator: React.FC = () => {
  const pdfRef = useRef<HTMLDivElement>(null);

  const [closingData] = useState<ClosingData>(DEFAULT_CLOSING_DATA);
  const [mortgageBreakdown] = useState<MortgageBreakdown>(DEFAULT_MORTGAGE_BREAKDOWN);
  const [sodAdjustments] = useState<SODAdjustments>(DEFAULT_SOD_ADJUSTMENTS);
  const [realtorInfo] = useState<RealtorInfo[]>(DEFAULT_REALTOR_INFO);

  const calculationResult = useMemo(
    () => calculateHousingDistribution(closingData, mortgageBreakdown, sodAdjustments),
    [closingData, mortgageBreakdown, sodAdjustments]
  );

  const printCalculation = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{PRINT_STYLES}</style>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 cv-auto">
          <PrintControls onPrint={printCalculation} />

          {/* Court-Ready Document Layout */}
          <div className="court-document bg-white shadow-2xl mx-auto my-8 max-w-4xl" ref={pdfRef}>
            {/* Sophisticated Page Edge Shading */}
            <div className="relative">
              <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-slate-100 to-transparent pointer-events-none"></div>
              <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none"></div>

              {/* Court Page Content */}
              <div className="court-page cost-breakdown relative z-10 bg-white min-h-[11in] p-16">
                <DocumentHeader />

                <DistributionSummary summary={calculationResult.summary} />

                {/* Detailed Calculation Breakdown */}
                <div className="court-calculation mb-12">
                  <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">
                    DETAILED CALCULATION BREAKDOWN
                  </h3>

                  <div className="space-y-6">
                    {calculationResult.reasoningPath.map((step, index) => (
                      <CalculationStepDisplay key={index} step={step} />
                    ))}
                  </div>
                </div>

                <DocumentFooter />
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default memo(HousingCostCalculator);
