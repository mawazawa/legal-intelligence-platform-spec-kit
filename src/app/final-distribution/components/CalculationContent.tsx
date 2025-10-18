import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Scale, FileText, Eye, EyeOff, ScrollText, ScaleIcon, CheckCircle2 } from 'lucide-react';
import { CalculationStep as CalculationStepType, SellerDeduction, BrokerageAllocation, SODAdjustments as SODAdjustmentsType, NegotiableParameter } from '@/types/calculations';
import { CalculationStepComponent } from './CalculationStep';
import { SellerDeductionItem } from './SellerDeductionItem';
import { BrokerageAllocationItem } from './BrokerageAllocationItem';
import { SODAdjustments } from './SODAdjustments';
import { NegotiableParameters } from './NegotiableParameters';
import { LegalAnalysis } from './LegalAnalysis';
import { Signatures } from './Signatures';
import { CourtFooter } from './CourtFooter';
import { SignatureType } from '../hooks/useSignatures';

interface CalculationContentProps {
  printRef: React.RefObject<HTMLDivElement | null>;
  printCalculation: () => void;
  calculationResult: {
    summary: {
      rosannaFinalDistribution: number;
      mathieuFinalDistribution: number;
    };
    reasoningPath: CalculationStepType[];
  };
  showDetailedBreakdown: boolean;
  setShowDetailedBreakdown: (show: boolean) => void;
  sellerDeductions: SellerDeduction[];
  brokerageAllocations: BrokerageAllocation[];
  sodAdjustments: SODAdjustmentsType;
  negotiableParams: NegotiableParameter[];
  updateParameter: (id: string, value: number) => void;
  // Signature props
  respSigImage: string | null;
  petSigImage: string | null;
  respTypedName: string;
  petTypedName: string;
  respSignedAt: string | null;
  petSignedAt: string | null;
  setRespTypedName: (name: string) => void;
  setPetTypedName: (name: string) => void;
  preventDefaults: (e: React.DragEvent) => void;
  handleDrop: (e: React.DragEvent, type: SignatureType) => void;
  handlePick: (e: React.ChangeEvent<HTMLInputElement>, type: SignatureType) => void;
  signTyped: (type: SignatureType) => void;
  clearSignature: (type: SignatureType) => void;
}

export const CalculationContent = React.memo(({
  printRef,
  printCalculation,
  calculationResult,
  showDetailedBreakdown,
  setShowDetailedBreakdown,
  sellerDeductions,
  brokerageAllocations,
  sodAdjustments,
  negotiableParams,
  updateParameter,
  respSigImage,
  petSigImage,
  respTypedName,
  petTypedName,
  respSignedAt,
  petSignedAt,
  setRespTypedName,
  setPetTypedName,
  preventDefaults,
  handleDrop,
  handlePick,
  signTyped,
  clearSignature
}: CalculationContentProps) => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
    {/* Export/Print Controls */}
    <div className="fixed top-20 right-4 z-50 flex gap-2 no-print">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => window.open('/analytics/continuances', '_blank')}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="sm"
          >
            <Scale className="h-4 w-4 mr-2" />
            Continuances Analysis
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View continuances attribution analysis</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => window.open('/analytics/claims', '_blank')}
            className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Claims Analysis
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Analyze opposing party claims with evidence</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={printCalculation}
            className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            size="sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Print / Save as PDF
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Print calculation or save as PDF</p>
        </TooltipContent>
      </Tooltip>
    </div>

    {/* Court-Ready Document Layout */}
    <div className="court-document bg-white shadow-2xl mx-auto my-8 max-w-4xl" ref={printRef}>
      {/* Sophisticated Page Edge Shading */}
      <div className="relative">
        {/* Top Edge Shading */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-slate-100 to-transparent pointer-events-none"></div>
        {/* Bottom Edge Shading */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-100 to-transparent pointer-events-none"></div>
        {/* Left Edge Shading */}
        <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-slate-100 to-transparent pointer-events-none"></div>
        {/* Right Edge Shading */}
        <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-slate-100 to-transparent pointer-events-none"></div>

        {/* Court Page Content */}
        <div className="court-page relative z-10 bg-white min-h-[11in] p-16 calculation">
          {/* Professional Court Header */}
          <div className="court-header text-center mb-12">
            <div className="mb-6">
              <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">FINAL DISTRIBUTION CALCULATION</h1>
              <h2 className="text-xl font-bold text-slate-700 mb-4">Statement of Decision Implementation</h2>
              <div className="flex justify-center items-center gap-8 text-sm text-slate-600">
                <div>
                  <span className="font-semibold">Case:</span> Wauters v. Alvero
                </div>
                <div>
                  <span className="font-semibold">Date:</span> {new Date().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div>
                  <span className="font-semibold">Generated:</span> {new Date().toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* FINAL DISTRIBUTION SUMMARY - THE BOTTOM LINE */}
          <div className="court-calculation mb-12">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">FINAL DISTRIBUTION SUMMARY</h3>
              <p className="text-xl font-medium text-slate-700">Statement of Decision Allocation with Adjustments</p>
            </div>

            {/* DISTRIBUTION AMOUNTS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Alvero Distribution */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 p-6 md:p-8 text-center shadow-lg">
                <h4 className="text-lg md:text-xl font-bold text-slate-800 mb-4">ROSANNA ALVERO</h4>
                <div className="text-3xl md:text-5xl font-black text-slate-900 mb-3">
                  ${calculationResult?.summary?.rosannaFinalDistribution?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}
                </div>
                <p className="text-xs md:text-sm text-slate-600 font-medium">35% SOD Allocation + Net Adjustments</p>
                <div className="mt-3 text-xs text-slate-500">
                  <CheckCircle2 className="h-3 w-3 mr-1 inline text-green-600" />
                  <span className="text-green-600 font-medium">Correct Calculation</span>
                </div>
              </div>

              {/* Wauters Distribution */}
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 p-6 md:p-8 text-center shadow-lg">
                <h4 className="text-lg md:text-xl font-bold text-slate-800 mb-4">MATHIEU WAUTERS</h4>
                <div className="text-3xl md:text-5xl font-black text-slate-900 mb-3">
                  ${calculationResult?.summary?.mathieuFinalDistribution?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}
                </div>
                <p className="text-xs md:text-sm text-slate-600 font-medium">65% SOD Allocation - Net Adjustments</p>
                <div className="mt-3 text-xs text-slate-500">
                  <CheckCircle2 className="h-3 w-3 mr-1 inline text-green-600" />
                  <span className="text-green-600 font-medium">Correct Calculation</span>
                </div>
              </div>
            </div>
          </div>

          {/* DETAILED CALCULATION BREAKDOWN */}
          <div className="court-calculation mb-12">
            <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">DETAILED CALCULATION BREAKDOWN</h3>

            {/* Calculation Steps */}
            <div className="space-y-6">
              {calculationResult?.reasoningPath?.map((step, index) => (
                <CalculationStepComponent key={index} step={step} />
              ))}
            </div>
          </div>

          {/* Seller Deductions Breakdown */}
          {showDetailedBreakdown && (
            <div className="mb-12">
              <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
                <ScrollText className="h-5 w-5 mr-2 text-blue-600" />
                SELLER DEDUCTIONS BREAKDOWN
              </h3>
              <div className="space-y-4">
                {sellerDeductions.map((deduction, index) => (
                  <SellerDeductionItem key={deduction.id} deduction={deduction} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* Brokerage Cost Allocation */}
          {showDetailedBreakdown && (
            <div className="mb-12">
              <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
                <ScaleIcon className="h-5 w-5 mr-2 text-blue-600" />
                BROKERAGE COST ALLOCATION
              </h3>
              <div className="space-y-4">
                {brokerageAllocations.map((allocation, index) => (
                  <BrokerageAllocationItem key={allocation.id} allocation={allocation} index={index} />
                ))}
              </div>
            </div>
          )}

          {/* SOD Adjustments */}
          {showDetailedBreakdown && (
            <div className="mb-12">
              <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
                <ScaleIcon className="h-5 w-5 mr-2 text-blue-600" />
                STATEMENT OF DECISION ADJUSTMENTS
              </h3>
              <SODAdjustments sodAdjustments={sodAdjustments} />
            </div>
          )}

          {/* Negotiable Parameters */}
          {showDetailedBreakdown && (
            <div className="mb-12">
              <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
                <ScaleIcon className="h-5 w-5 mr-2 text-blue-600" />
                NEGOTIATION PARAMETERS
              </h3>
              <NegotiableParameters negotiableParams={negotiableParams} updateParameter={updateParameter} />
            </div>
          )}

          {/* Legal Analysis */}
          {showDetailedBreakdown && (
            <div className="mb-12">
              <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
                <FileText className="h-5 w-5 mr-2 text-blue-600" />
                LEGAL ANALYSIS & CITATIONS
              </h3>
              <LegalAnalysis />
            </div>
          )}

          {/* Toggle Detailed Breakdown Button */}
          <div className="text-center mt-12 no-print">
            <Button
              onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
              className="bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transition-all duration-200"
            >
              {showDetailedBreakdown ? (
                <>
                  <EyeOff className="h-4 w-4 mr-2" /> Hide Detailed Breakdown
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4 mr-2" /> Show Detailed Breakdown
                </>
              )}
            </Button>
          </div>

          {/* SIGNATURES */}
          <Signatures
            respSigImage={respSigImage}
            petSigImage={petSigImage}
            respTypedName={respTypedName}
            petTypedName={petTypedName}
            respSignedAt={respSignedAt}
            petSignedAt={petSignedAt}
            setRespTypedName={setRespTypedName}
            setPetTypedName={setPetTypedName}
            preventDefaults={preventDefaults}
            handleDrop={handleDrop}
            handlePick={handlePick}
            signTyped={signTyped}
            clearSignature={clearSignature}
          />

          {/* Court Footer */}
          <CourtFooter />
        </div>
      </div>
    </div>
  </div>
));

CalculationContent.displayName = 'CalculationContent';
