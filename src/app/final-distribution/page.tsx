"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
// Removed PDF generation dependencies - using browser print-to-PDF instead
import {
  FileText,
  Printer,
  Eye,
  EyeOff,
  ScrollText,
  Scale as ScaleIcon,
  Upload,
  PenLine,
  Trash2,
  Calculator,
  GitCompare,
  Scale
} from 'lucide-react';

interface DocumentSource {
  documentName: string;
  documentDate: string;
  sectionName?: string;
  excerpt?: string;
  fileUrl?: string;
}

interface SellerDeduction {
  type: string;
  recipient: string;
  amount: number;
  percentage: number;
  description: string;
  source: DocumentSource;
}

interface BrokerageAllocation {
  agentName: string;
  brokerage: string;
  role: 'listing' | 'buying';
  commission: number;
  agentSplit: number;
  brokerSplit: number;
  percentage: number;
}

// Removed unused CalculationStep interface

// Removed unused SODAdjustments interface

type TabType = 'calculation' | 'comparison' | 'declarations';

const FinalDistributionSSOT: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calculation');
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  // Simple e-signature state (drag-drop image OR typed name rendered in cursive)
  const [respTypedName, setRespTypedName] = useState('');
  const [petTypedName, setPetTypedName] = useState('');
  const [respSigImage, setRespSigImage] = useState<string | null>(null);
  const [petSigImage, setPetSigImage] = useState<string | null>(null);
  const [respSignedAt, setRespSignedAt] = useState<string | null>(null);
  const [petSignedAt, setPetSignedAt] = useState<string | null>(null);

  // Handwriting font for typed signatures
  const handwritingFont = 'Brush Script MT, cursive';

  // Seller Deductions Data
  const sellerDeductions: SellerDeduction[] = useMemo(() => [
    {
      type: "Real Estate Commission",
      recipient: "Listing Agent",
      amount: 29375.00,
      percentage: 2.5,
      description: "Listing agent commission for property sale",
      source: {
        documentName: "Final Sellers Closing Statement",
        documentDate: "05/30/2025",
        sectionName: "Commissions",
        excerpt: "Listing Agent Commission: $29,375.00",
        fileUrl: "/documents/Final_Sellers_Closing_Statement.pdf"
      }
    },
    {
      type: "Real Estate Commission",
      recipient: "Buying Agent",
      amount: 29375.00,
      percentage: 2.5,
      description: "Buying agent commission for property sale",
      source: {
        documentName: "Final Sellers Closing Statement",
        documentDate: "05/30/2025",
        sectionName: "Commissions",
        excerpt: "Buying Agent Commission: $29,375.00",
        fileUrl: "/documents/Final_Sellers_Closing_Statement.pdf"
      }
    },
    {
      type: "Transfer Tax",
      recipient: "City of San Francisco",
      amount: 5875.00,
      percentage: 0.5,
      description: "City transfer tax on property sale",
      source: {
        documentName: "Final Sellers Closing Statement",
        documentDate: "05/30/2025",
        sectionName: "Transfer Taxes",
        excerpt: "City Transfer Tax: $5,875.00",
        fileUrl: "/documents/Final_Sellers_Closing_Statement.pdf"
      }
    },
    {
      type: "Transfer Tax",
      recipient: "County of San Francisco",
      amount: 705.00,
      percentage: 0.06,
      description: "County transfer tax on property sale",
      source: {
        documentName: "Final Sellers Closing Statement",
        documentDate: "05/30/2025",
        sectionName: "Transfer Taxes",
        excerpt: "County Transfer Tax: $705.00",
        fileUrl: "/documents/Final_Sellers_Closing_Statement.pdf"
      }
    },
    {
      type: "Tax Withholding",
      recipient: "Franchise Tax Board",
      amount: 13694.62,
      percentage: 1.17,
      description: "Real estate withholding tax (Form 593)",
      source: {
        documentName: "Final Sellers Closing Statement",
        documentDate: "05/30/2025",
        sectionName: "Withholding",
        excerpt: "FTB Withholding: $13,694.62",
        fileUrl: "/documents/Final_Sellers_Closing_Statement.pdf"
      }
    }
  ], []);

  // Brokerage Cost Allocation
  const brokerageAllocations: BrokerageAllocation[] = useMemo(() => [
    {
      agentName: "Ron Melendez",
      brokerage: "Coldwell Banker",
      role: "listing",
      commission: 29375.00,
      agentSplit: 22031.25,
      brokerSplit: 7343.75,
      percentage: 75
    },
    {
      agentName: "Buying Agent",
      brokerage: "Buying Brokerage",
      role: "buying",
      commission: 29375.00,
      agentSplit: 22031.25,
      brokerSplit: 7343.75,
      percentage: 75
    }
  ], []);

  const calculationResult = useMemo(() => {
    // Mock calculation result for now - this would come from the ledger API
    return {
      summary: {
        grossSalePrice: 1175000,
        netProceedsToSellers: 280355.83,
        lenderPayoff: 759364.32,
        mathieuFinalDistribution: 182231.29,
        rosannaFinalDistribution: 98124.54,
        rosannaWithholding: 13694.62,
        mathieuTaxObligation: 25432.88
      },
      reasoningPath: [
        {
          stepNumber: "1",
          stepName: "Statement of Decision Property Division",
          amount: 280355.83,
          explanation: "Apply 65/35 allocation per Statement of Decision to net proceeds",
          subSteps: [
            {
              stepNumber: "1.1",
              stepName: "Respondent Share (65%)",
              amount: 182231.29,
              explanation: "Mathieu Wauters receives 65% of net proceeds"
            },
            {
              stepNumber: "1.2",
              stepName: "Petitioner Share (35%)",
              amount: 98124.54,
              explanation: "Rosanna Alvero receives 35% of net proceeds"
            }
          ]
        }
      ]
    };
  }, []);

  const printCalculation = () => {
    window.print();
  };

  // Removed unused toggleStep function

  // Signature handling functions
  function preventDefaults(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
  }
  function handleDrop(e: React.DragEvent, who: 'resp'|'pet') {
    preventDefaults(e);
    const f = e.dataTransfer.files?.[0];
    if (f && f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f);
      if (who==='resp') { setRespSigImage(url); setRespSignedAt(new Date().toISOString()); }
      else { setPetSigImage(url); setPetSignedAt(new Date().toISOString()); }
    }
  }
  function handlePick(e: React.ChangeEvent<HTMLInputElement>, who: 'resp'|'pet') {
    const f = e.target.files?.[0];
    if (f && f.type.startsWith('image/')) {
      const url = URL.createObjectURL(f);
      if (who==='resp') { setRespSigImage(url); setRespSignedAt(new Date().toISOString()); }
      else { setPetSigImage(url); setPetSignedAt(new Date().toISOString()); }
    }
  }

  function signTyped(who: 'resp'|'pet') {
    const hasName = who==='resp' ? respTypedName.trim().length>0 : petTypedName.trim().length>0;
    if (!hasName) return;
    const now = new Date().toISOString();
    if (who==='resp') { setRespSigImage(null); setRespSignedAt(now); }
    else { setPetSigImage(null); setPetSignedAt(now); }
  }

  function clearSignature(who: 'resp'|'pet') {
    if (who==='resp') { setRespSigImage(null); setRespSignedAt(null); }
    else { setPetSigImage(null); setPetSignedAt(null); }
  }

  // Tab Navigation Component
  const TabNavigation = () => {
    const tabs = [
      { id: 'calculation' as TabType, label: 'Final Distribution Calculation', icon: Calculator },
      { id: 'comparison' as TabType, label: 'Side-by-Side Comparison', icon: GitCompare },
      { id: 'declarations' as TabType, label: 'Court Declarations', icon: Scale }
    ];

    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm no-print">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-1 pt-4 pb-2">
            {tabs.map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 text-sm font-medium rounded-t-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500'
                      : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  // Tab Content Renderer
  const renderTabContent = () => {
    switch (activeTab) {
      case 'calculation':
        return renderCalculationContent();
      case 'comparison':
        return renderComparisonContent();
      case 'declarations':
        return renderDeclarationsContent();
      default:
        return renderCalculationContent();
    }
  };

  // Calculation Content (existing content)
  const renderCalculationContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8 rounded-lg shadow-inner">
      <div className="max-w-7xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border border-slate-200 relative print:shadow-none print:border-none">
        {/* Print Button */}
        <div className="fixed top-20 right-4 z-50 no-print">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={printCalculation}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                size="sm"
              >
                <Printer className="h-4 w-4 mr-2" />
                Print / Save as PDF
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Print calculation or save as PDF</p>
            </TooltipContent>
          </Tooltip>
        </div>

        {/* Final Distribution Summary */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-slate-800 mb-6 flex items-center">
            <ScaleIcon className="h-8 w-8 mr-3 text-blue-600" />
            FINAL DISTRIBUTION CALCULATION
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Mathieu's Distribution */}
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
              <h4 className="text-lg font-bold text-blue-800 mb-4 flex items-center">
                <ScaleIcon className="h-5 w-5 mr-2" />
                RESPONDENT (Mathieu Wauters)
              </h4>
              <div className="text-3xl font-black text-blue-900 mb-2">
                ${calculationResult?.summary?.mathieuFinalDistribution?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}
              </div>
              <div className="text-sm text-blue-700">
                65% allocation per Statement of Decision
              </div>
            </div>

            {/* Rosanna's Distribution */}
            <div className="bg-red-50 p-6 rounded-lg border border-red-200">
              <h4 className="text-lg font-bold text-red-800 mb-4 flex items-center">
                <ScaleIcon className="h-5 w-5 mr-2" />
                PETITIONER (Rosanna Alvero)
              </h4>
              <div className="text-3xl font-black text-red-900 mb-2">
                ${calculationResult?.summary?.rosannaFinalDistribution?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}
              </div>
              <div className="text-sm text-red-700">
                35% allocation per Statement of Decision
              </div>
            </div>
          </div>

          {/* Total Verification */}
          <div className="bg-slate-100 p-4 rounded-lg border border-slate-300 text-center">
            <div className="text-sm text-slate-600 mb-1">Total Distribution</div>
            <div className="text-2xl font-bold text-slate-800">
              ${calculationResult?.summary?.mathieuFinalDistribution && calculationResult?.summary?.rosannaFinalDistribution ? 
                (calculationResult.summary.mathieuFinalDistribution + calculationResult.summary.rosannaFinalDistribution).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : 
                '—'
              }
            </div>
          </div>
        </div>

        {/* Calculation Steps */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
            <ScrollText className="h-6 w-6 mr-3 text-blue-600" />
            CALCULATION BREAKDOWN
          </h3>

          <div className="space-y-6">
            {calculationResult?.reasoningPath?.map((step) => (
              <Card key={step.stepNumber} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    Step {step.stepNumber}: {step.stepName}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">{step.explanation}</p>
                  {step.amount && (
                    <div className="text-2xl font-bold text-blue-600">
                      ${step.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Seller Deductions Breakdown */}
        {showDetailedBreakdown && (
          <div className="mb-12">
            <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
              <FileText className="h-6 w-6 mr-3 text-blue-600" />
              SELLER DEDUCTIONS BREAKDOWN
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Realtor Broker Fees */}
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <ScaleIcon className="h-5 w-5 mr-2 text-blue-600" />
                  Realtor Broker Fees
                </h4>
                <div className="space-y-3">
                  {brokerageAllocations.map((allocation, index) => (
                    <div key={index} className="bg-white p-4 rounded border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-slate-700">{allocation.agentName}</div>
                        <div className="text-sm text-slate-600">{allocation.brokerage}</div>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">{allocation.role === 'listing' ? 'Listing Agent' : 'Buying Agent'}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Commission: <span className="font-semibold">${allocation.commission.toLocaleString()}</span></div>
                        <div>Agent Split: <span className="font-semibold">${allocation.agentSplit.toLocaleString()}</span></div>
                        <div>Broker Split: <span className="font-semibold">${allocation.brokerSplit.toLocaleString()}</span></div>
                        <div>Percentage: <span className="font-semibold">{allocation.percentage}%</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Seller Deductions */}
              <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                <h4 className="text-lg font-bold text-slate-800 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  Other Seller Deductions
                </h4>
                <div className="space-y-3">
                  {sellerDeductions.map((deduction, index) => (
                    <div key={index} className="bg-white p-4 rounded border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-slate-700">{deduction.type}</div>
                        <div className="text-sm text-slate-600">{deduction.recipient}</div>
                      </div>
                      <div className="text-sm text-slate-600 mb-2">{deduction.description}</div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>Amount: <span className="font-semibold">${deduction.amount.toLocaleString()}</span></div>
                        <div>Percentage: <span className="font-semibold">{deduction.percentage}%</span></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toggle Detailed Breakdown */}
        <div className="mb-12">
          <Button
            onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
            className="bg-slate-600 hover:bg-slate-700 text-white"
            size="sm"
          >
            {showDetailedBreakdown ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showDetailedBreakdown ? 'Hide' : 'Show'} Detailed Breakdown
          </Button>
        </div>

        {/* SIGNATURES */}
        <div className="mb-12">
          <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
            <PenLine className="h-6 w-6 mr-3 text-blue-600" />
            SIGNATURES (Electronic)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Respondent signature */}
            <div>
              <div className="text-sm text-slate-600 font-medium mb-2">Respondent (Mathieu Wauters)</div>
              <div
                className="relative rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 min-h-[160px] flex items-center justify-center text-center"
                onDragEnter={preventDefaults}
                onDragOver={preventDefaults}
                onDrop={(e)=>handleDrop(e,'resp')}
              >
                {respSigImage ? (
                  <img src={respSigImage} alt="Respondent signature" className="max-h-32 object-contain" />
                ) : respSignedAt && respTypedName ? (
                  <div className="w-full">
                    <div
                      className="text-3xl md:text-4xl leading-tight"
                      style={{ fontFamily: handwritingFont }}
                    >
                      {respTypedName}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500">
                    <Upload className="h-6 w-6 mx-auto mb-2" />
                    <div className="mb-1">Drag & drop a signature image here</div>
                    <div className="text-xs">or use the typed signature below</div>
                  </div>
                )}
                <input className="hidden" type="file" accept="image/*" id="resp-sig-input" onChange={(e)=>handlePick(e,'resp')} />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between no-print">
                  <label htmlFor="resp-sig-input" className="text-xs px-2 py-1 rounded bg-white/80 border border-slate-300 cursor-pointer hover:bg-white">
                    Upload Image
                  </label>
                  {(respSigImage || respSignedAt) && (
                    <button onClick={()=>clearSignature('resp')} className="text-xs px-2 py-1 rounded bg-white/80 border border-slate-300 hover:bg-white flex items-center gap-1">
                      <Trash2 className="h-3 w-3" /> Clear
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 no-print">
                <input
                  type="text"
                  value={respTypedName}
                  onChange={(e)=>setRespTypedName(e.target.value)}
                  placeholder="Type full name (e.g., Mathieu Wauters)"
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <Button size="sm" onClick={()=>signTyped('resp')}>Sign</Button>
              </div>
              <div className="mt-4 text-xs text-slate-600">
                <div className="border-t border-slate-300 pt-1"></div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">/s/ {respTypedName || '________________'}</span>
                  <span>Date: {respSignedAt ? new Date(respSignedAt).toLocaleDateString() : '__________'}</span>
                </div>
              </div>
            </div>

            {/* Petitioner signature */}
            <div>
              <div className="text-sm text-slate-600 font-medium mb-2">Petitioner (Rosanna Alvero)</div>
              <div
                className="relative rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-4 min-h-[160px] flex items-center justify-center text-center"
                onDragEnter={preventDefaults}
                onDragOver={preventDefaults}
                onDrop={(e)=>handleDrop(e,'pet')}
              >
                {petSigImage ? (
                  <img src={petSigImage} alt="Petitioner signature" className="max-h-32 object-contain" />
                ) : petSignedAt && petTypedName ? (
                  <div className="w-full">
                    <div
                      className="text-3xl md:text-4xl leading-tight"
                      style={{ fontFamily: handwritingFont }}
                    >
                      {petTypedName}
                    </div>
                  </div>
                ) : (
                  <div className="text-slate-500">
                    <Upload className="h-6 w-6 mx-auto mb-2" />
                    <div className="mb-1">Drag & drop a signature image here</div>
                    <div className="text-xs">or use the typed signature below</div>
                  </div>
                )}
                <input className="hidden" type="file" accept="image/*" id="pet-sig-input" onChange={(e)=>handlePick(e,'pet')} />
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between no-print">
                  <label htmlFor="pet-sig-input" className="text-xs px-2 py-1 rounded bg-white/80 border border-slate-300 cursor-pointer hover:bg-white">
                    Upload Image
                  </label>
                  {(petSigImage || petSignedAt) && (
                    <button onClick={()=>clearSignature('pet')} className="text-xs px-2 py-1 rounded bg-white/80 border border-slate-300 hover:bg-white flex items-center gap-1">
                      <Trash2 className="h-3 w-3" /> Clear
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2 no-print">
                <input
                  type="text"
                  value={petTypedName}
                  onChange={(e)=>setPetTypedName(e.target.value)}
                  placeholder="Type full name (e.g., Rosanna Alvero)"
                  className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
                />
                <Button size="sm" onClick={()=>signTyped('pet')}>Sign</Button>
              </div>
              <div className="mt-4 text-xs text-slate-600">
                <div className="border-t border-slate-300 pt-1"></div>
                <div className="flex items-center justify-between">
                  <span className="font-medium">/s/ {petTypedName || '________________'}</span>
                  <span>Date: {petSignedAt ? new Date(petSignedAt).toLocaleDateString() : '__________'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-[11px] text-slate-500">
            By clicking Sign or uploading an image, the signer adopts this electronic signature. This is intended to be acceptable for court filing as an electronically signed document.
          </div>
        </div>
      </div>
    </div>
  );

  // Comparison Content (placeholder)
  const renderComparisonContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8 rounded-lg shadow-inner">
      <div className="max-w-7xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border border-slate-200 relative print:shadow-none print:border-none">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Side-by-Side Comparison</h1>
          <p className="text-slate-600">Comparison content will be rendered here</p>
        </div>
      </div>
    </div>
  );

  // Declarations Content (placeholder)
  const renderDeclarationsContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 md:p-8 rounded-lg shadow-inner">
      <div className="max-w-7xl mx-auto bg-white p-6 md:p-10 rounded-xl shadow-lg border border-slate-200 relative print:shadow-none print:border-none">
        <div className="text-center py-20">
          <h1 className="text-3xl font-bold text-slate-800 mb-4">Court Declarations</h1>
          <p className="text-slate-600">Declarations content will be rendered here</p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .bg-gradient-to-br {
            background: white !important;
          }
          .shadow-lg, .shadow-xl, .shadow-2xl {
            box-shadow: none !important;
          }
          .animate-in {
            animation: none !important;
          }
          .hover\\:scale-105:hover {
            transform: none !important;
          }
        }
      `}</style>

      <TooltipProvider>
        {/* Tab Navigation */}
        <TabNavigation />
        
        {/* Main Content with Top Padding for Fixed Tabs */}
        <div className="pt-20">
          {renderTabContent()}
        </div>
      </TooltipProvider>
    </>
  );
};

export default FinalDistributionSSOT;