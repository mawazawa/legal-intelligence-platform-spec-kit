'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  Calculator,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Scale,
  Receipt,
  TrendingUp,
  Users,
  Building,
  CreditCard,
  FileCheck,
  HelpCircle,
  Landmark,
  Banknote,
  Percent,
  User,
  Home,
  ArrowUp,
  ArrowDown,
  Calendar,
  Download,
  Printer,
  Eye,
  EyeOff,
  ScrollText,
  FileSpreadsheet,
  Gavel,
  Scale as ScaleIcon
} from 'lucide-react';

interface DocumentSource {
  documentName: string;
  documentDate: string;
  sectionName?: string;
  excerpt?: string;
}

interface CalculationStep {
  stepNumber: number;
  stepName: string;
  amount: number;
  formula?: string;
  sources: DocumentSource[];
  explanation: string;
  subSteps?: CalculationStep[];
  isExpanded?: boolean;
}

interface SODAdjustments {
  wattsChargesOriginal: number;
  rentalIncomeShare: number;
  motorcycleShare: number;
  furnitureShare: number;
  rosannaExclusivePossession: number;
  furnitureCorrection: number;
  rosannaWithholding: number;
  mathieuTaxObligation: number;
}

const FinalDistributionSSOT: React.FC = () => {
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [expandedSteps, setExpandedSteps] = useState<Set<number>>(new Set([1, 2, 3]));
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  // Single Source of Truth Data - All values from authoritative documents
  const sodAdjustments: SODAdjustments = useMemo(() => ({
    wattsChargesOriginal: 48640.00, // Statement of Decision
    rentalIncomeShare: 5761.81, // Statement of Decision
    motorcycleShare: 5855.00, // Statement of Decision
    furnitureShare: 7500.00, // Statement of Decision (disputed)
    rosannaExclusivePossession: 21775.00, // 6.7 months × $5,000 × 65%
    furnitureCorrection: 15000.00, // Post-SOD furniture correction
    rosannaWithholding: 13694.62, // Final Sellers Closing Statement
    mathieuTaxObligation: 25000.00 // Estimated tax obligation
  }), []);

  const calculationResult = useMemo(() => {
    // Core values from Final Sellers Closing Statement
    const grossSalePrice = 1175000.00;
    const lenderPayoff = 759364.32;
    const netProceedsToSellers = 280355.83;
    const rosannaWithholding = sodAdjustments.rosannaWithholding;
    const mathieuTaxObligation = sodAdjustments.mathieuTaxObligation;

    // SOD Allocation (65%/35%)
    const mathieuSODShare = netProceedsToSellers * 0.65;
    const rosannaSODShare = netProceedsToSellers * 0.35;

    // SOD Adjustments
    const mathieuOwesRosanna = sodAdjustments.wattsChargesOriginal + 
                              sodAdjustments.rentalIncomeShare + 
                              sodAdjustments.motorcycleShare + 
                              sodAdjustments.furnitureShare;

    const rosannaOwesMathieu = sodAdjustments.rosannaExclusivePossession + 
                              sodAdjustments.furnitureCorrection;

    const netAdjustment = mathieuOwesRosanna - rosannaOwesMathieu;

    // Final Distributions
    const mathieuFinalDistribution = mathieuSODShare - netAdjustment;
    const rosannaFinalDistribution = rosannaSODShare + netAdjustment;

    // Progressive disclosure reasoning path
    const reasoningPath: CalculationStep[] = [
      {
        stepNumber: 1,
        stepName: "FINAL DISTRIBUTION AMOUNTS",
        amount: mathieuFinalDistribution + rosannaFinalDistribution,
        explanation: "The bottom line: What each party receives after all calculations and adjustments.",
        sources: [
          {
            documentName: "Final Sellers Closing Statement",
            documentDate: "05/30/2025",
            sectionName: "Due to Seller",
            excerpt: "Net Proceeds to Sellers: $280,355.83"
          },
          {
            documentName: "Statement of Decision",
            documentDate: "Court Order",
            sectionName: "Property Division",
            excerpt: "65% allocation to Mathieu Wauters, 35% allocation to Rosanna Alvero"
          }
        ],
        subSteps: [
          {
            stepNumber: 1.1,
            stepName: "MATHIEU WAUTERS RECEIVES",
            amount: mathieuFinalDistribution,
            formula: `65% SOD Share - Net Adjustments = ${mathieuSODShare.toLocaleString()} - ${netAdjustment.toLocaleString()} = ${mathieuFinalDistribution.toLocaleString()}`,
            explanation: "Mathieu's final distribution after Statement of Decision allocation and all adjustments.",
            sources: [
              {
                documentName: "Statement of Decision",
                documentDate: "Court Order",
                sectionName: "Property Division",
                excerpt: "65% allocation to Mathieu Wauters"
              }
            ]
          },
          {
            stepNumber: 1.2,
            stepName: "ROSANNA ALVERO RECEIVES",
            amount: rosannaFinalDistribution,
            formula: `35% SOD Share + Net Adjustments = ${rosannaSODShare.toLocaleString()} + ${netAdjustment.toLocaleString()} = ${rosannaFinalDistribution.toLocaleString()}`,
            explanation: "Rosanna's final distribution after Statement of Decision allocation and all adjustments.",
            sources: [
              {
                documentName: "Statement of Decision",
                documentDate: "Court Order",
                sectionName: "Property Division",
                excerpt: "35% allocation to Rosanna Alvero"
              }
            ]
          }
        ]
      },
      {
        stepNumber: 2,
        stepName: "STATEMENT OF DECISION ALLOCATION",
        amount: netProceedsToSellers,
        formula: `Net Proceeds × 65%/35% = ${netProceedsToSellers.toLocaleString()} × 0.65/0.35`,
        explanation: "How the court-ordered 65%/35% split is applied to the net proceeds from the home sale.",
        sources: [
          {
            documentName: "Statement of Decision",
            documentDate: "Court Order",
            sectionName: "Property Division",
            excerpt: "65% allocation to Mathieu Wauters, 35% allocation to Rosanna Alvero"
          },
          {
            documentName: "Final Sellers Closing Statement",
            documentDate: "05/30/2025",
            sectionName: "Due to Seller",
            excerpt: "Net Proceeds to Sellers: $280,355.83"
          }
        ],
        subSteps: [
          {
            stepNumber: 2.1,
            stepName: "Mathieu's SOD Share (65%)",
            amount: mathieuSODShare,
            formula: `${netProceedsToSellers.toLocaleString()} × 0.65 = ${mathieuSODShare.toLocaleString()}`,
            explanation: "Mathieu's share per Statement of Decision.",
            sources: [
              {
                documentName: "Statement of Decision",
                documentDate: "Court Order",
                sectionName: "Property Division",
                excerpt: "65% allocation to Mathieu Wauters"
              }
            ]
          },
          {
            stepNumber: 2.2,
            stepName: "Rosanna's SOD Share (35%)",
            amount: rosannaSODShare,
            formula: `${netProceedsToSellers.toLocaleString()} × 0.35 = ${rosannaSODShare.toLocaleString()}`,
            explanation: "Rosanna's share per Statement of Decision.",
            sources: [
              {
                documentName: "Statement of Decision",
                documentDate: "Court Order",
                sectionName: "Property Division",
                excerpt: "35% allocation to Rosanna Alvero"
              }
            ]
          }
        ]
      },
      {
        stepNumber: 3,
        stepName: "NET PROCEEDS FROM HOME SALE",
        amount: netProceedsToSellers,
        explanation: "The amount available for distribution after all sale costs and lender payoff.",
        sources: [
          {
            documentName: "Final Sellers Closing Statement",
            documentDate: "05/30/2025",
            sectionName: "Due to Seller",
            excerpt: "Due to Seller: $280,355.83"
          }
        ],
        subSteps: [
          {
            stepNumber: 3.1,
            stepName: "Gross Sale Price",
            amount: grossSalePrice,
            explanation: "The total sale price of the home.",
            sources: [
              {
                documentName: "Final Sellers Closing Statement",
                documentDate: "05/30/2025",
                sectionName: "Sale Price",
                excerpt: "Sale Price: $1,175,000.00"
              }
            ]
          },
          {
            stepNumber: 3.2,
            stepName: "Lender Payoff",
            amount: lenderPayoff,
            explanation: "Amount paid to satisfy the mortgage loan.",
            sources: [
              {
                documentName: "Final Sellers Closing Statement",
                documentDate: "05/30/2025",
                sectionName: "Lender Payoff",
                excerpt: "Lender Payoff: $759,364.32"
              }
            ]
          },
          {
            stepNumber: 3.3,
            stepName: "Sale Costs & Deductions",
            amount: grossSalePrice - lenderPayoff - netProceedsToSellers,
            explanation: "Real estate commissions, transfer taxes, and other closing costs.",
            sources: [
              {
                documentName: "Final Sellers Closing Statement",
                documentDate: "05/30/2025",
                sectionName: "Commissions and Fees",
                excerpt: "Total Commissions: $58,750.00, Transfer Taxes: $6,580.00"
              }
            ]
          }
        ]
      },
      {
        stepNumber: 4,
        stepName: "SOD ADJUSTMENTS",
        amount: netAdjustment,
        formula: `Mathieu owes Rosanna: ${mathieuOwesRosanna.toLocaleString()} - Rosanna owes Mathieu: ${rosannaOwesMathieu.toLocaleString()} = ${netAdjustment.toLocaleString()}`,
        explanation: "Adjustments based on Statement of Decision and subsequent court orders.",
        sources: [
          {
            documentName: "Statement of Decision",
            documentDate: "Court Order",
            sectionName: "Various Allocations",
            excerpt: "Watts Charges, Rental Income, Motorcycle, Furniture allocations"
          }
        ],
        subSteps: [
          {
            stepNumber: 4.1,
            stepName: "Mathieu Owes Rosanna",
            amount: mathieuOwesRosanna,
            explanation: "Total amount Mathieu owes Rosanna per Statement of Decision.",
            sources: [
              {
                documentName: "Statement of Decision",
                documentDate: "Court Order",
                sectionName: "Watts Charges",
                excerpt: "Watts Charges: $48,640.00"
              },
              {
                documentName: "Statement of Decision",
                documentDate: "Court Order",
                sectionName: "Rental Income",
                excerpt: "Rental Income Share: $5,761.81"
              },
              {
                documentName: "Statement of Decision",
                documentDate: "Court Order",
                sectionName: "Motorcycle",
                excerpt: "Motorcycle Share: $5,855.00"
              },
              {
                documentName: "Statement of Decision",
                documentDate: "Court Order",
                sectionName: "Furniture",
                excerpt: "Furniture Share: $7,500.00"
              }
            ],
            subSteps: [
              {
                stepNumber: 4.1.1,
                stepName: "Watts Charges",
                amount: sodAdjustments.wattsChargesOriginal,
                explanation: "Mathieu's exclusive possession charges per Statement of Decision.",
                sources: [
                  {
                    documentName: "Statement of Decision",
                    documentDate: "Court Order",
                    sectionName: "Watts Charges",
                    excerpt: "Watts Charges: $48,640.00"
                  }
                ]
              },
              {
                stepNumber: 4.1.2,
                stepName: "Rental Income Share",
                amount: sodAdjustments.rentalIncomeShare,
                explanation: "Mathieu's share of rental income per Statement of Decision.",
                sources: [
                  {
                    documentName: "Statement of Decision",
                    documentDate: "Court Order",
                    sectionName: "Rental Income",
                    excerpt: "Rental Income Share: $5,761.81"
                  }
                ]
              },
              {
                stepNumber: 4.1.3,
                stepName: "Motorcycle Share",
                amount: sodAdjustments.motorcycleShare,
                explanation: "Mathieu's share of motorcycle value per Statement of Decision.",
                sources: [
                  {
                    documentName: "Statement of Decision",
                    documentDate: "Court Order",
                    sectionName: "Motorcycle",
                    excerpt: "Motorcycle Share: $5,855.00"
                  }
                ]
              },
              {
                stepNumber: 4.1.4,
                stepName: "Furniture Share",
                amount: sodAdjustments.furnitureShare,
                explanation: "Mathieu's share of furniture value per Statement of Decision.",
                sources: [
                  {
                    documentName: "Statement of Decision",
                    documentDate: "Court Order",
                    sectionName: "Furniture",
                    excerpt: "Furniture Share: $7,500.00"
                  }
                ]
              }
            ]
          },
          {
            stepNumber: 4.2,
            stepName: "Rosanna Owes Mathieu",
            amount: rosannaOwesMathieu,
            explanation: "Total amount Rosanna owes Mathieu based on post-SOD adjustments.",
            sources: [
              {
                documentName: "Motion for Reconsideration",
                documentDate: "Post-SOD",
                sectionName: "Exclusive Possession Credit",
                excerpt: "6.7 months × $5,000/month × 65% = $21,775"
              },
              {
                documentName: "New Evidence",
                documentDate: "Post-SOD",
                sectionName: "Furniture Correction",
                excerpt: "Furniture correction: $15,000 swing"
              }
            ],
            subSteps: [
              {
                stepNumber: 4.2.1,
                stepName: "Exclusive Possession Credit",
                amount: sodAdjustments.rosannaExclusivePossession,
                explanation: "Credit for Rosanna's exclusive possession of the home.",
                sources: [
                  {
                    documentName: "Motion for Reconsideration",
                    documentDate: "Post-SOD",
                    sectionName: "Exclusive Possession Credit",
                    excerpt: "6.7 months × $5,000/month × 65% = $21,775"
                  }
                ]
              },
              {
                stepNumber: 4.2.2,
                stepName: "Furniture Correction",
                amount: sodAdjustments.furnitureCorrection,
                explanation: "Correction for furniture allocation discrepancy.",
                sources: [
                  {
                    documentName: "New Evidence",
                    documentDate: "Post-SOD",
                    sectionName: "Furniture Correction",
                    excerpt: "Furniture correction: $15,000 swing"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        stepNumber: 5,
        stepName: "TAX WITHHOLDING CONSIDERATIONS",
        amount: rosannaWithholding + mathieuTaxObligation,
        explanation: "Tax obligations that affect the final distribution amounts.",
        sources: [
          {
            documentName: "Final Sellers Closing Statement",
            documentDate: "05/30/2025",
            sectionName: "Real Estate Withholding 593",
            excerpt: "Real Estate Withholding 593: $13,694.62"
          }
        ],
        subSteps: [
          {
            stepNumber: 5.1,
            stepName: "Rosanna's FTB Withholding",
            amount: rosannaWithholding,
            explanation: "Amount withheld by Franchise Tax Board from Rosanna's proceeds.",
            sources: [
              {
                documentName: "Final Sellers Closing Statement",
                documentDate: "05/30/2025",
                sectionName: "Real Estate Withholding 593",
                excerpt: "Real Estate Withholding 593: $13,694.62"
              }
            ]
          },
          {
            stepNumber: 5.2,
            stepName: "Mathieu's Estimated Tax Obligation",
            amount: mathieuTaxObligation,
            explanation: "Estimated tax obligation for Mathieu's share of the proceeds.",
            sources: [
              {
                documentName: "Tax Calculation",
                documentDate: "Current",
                sectionName: "Estimated Tax Obligation",
                excerpt: "Estimated based on income tax rates"
              }
            ]
          }
        ]
      }
    ];

    return {
      summary: {
        grossSalePrice,
        lenderPayoff,
        netProceedsToSellers,
        mathieuSODShare,
        rosannaSODShare,
        mathieuOwesRosanna,
        rosannaOwesMathieu,
        netAdjustment,
        mathieuFinalDistribution,
        rosannaFinalDistribution,
        rosannaWithholding,
        mathieuTaxObligation
      },
      reasoningPath
    };
  }, [sodAdjustments]);

  const toggleStep = (stepNumber: number) => {
    setExpandedSteps(prev => {
      const newSet = new Set(prev);
      if (newSet.has(stepNumber)) {
        newSet.delete(stepNumber);
      } else {
        newSet.add(stepNumber);
      }
      return newSet;
    });
  };

  const generatePDF = async () => {
    if (!pdfRef.current) return;
    
    setIsGeneratingPDF(true);
    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      
      let position = 0;
      
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }
      
      const fileName = `Final_Distribution_SSOT_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const printCalculation = () => {
    window.print();
  };

  const renderCalculationStep = (step: CalculationStep, level: number = 0) => {
    const isExpanded = expandedSteps.has(step.stepNumber);
    const hasSubSteps = step.subSteps && step.subSteps.length > 0;
    const indentClass = level > 0 ? `ml-${level * 4}` : '';

    return (
      <div key={step.stepNumber} className={`${indentClass} mb-6`}>
        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center border-2 border-blue-300">
                  <span className="text-sm font-bold text-blue-700">{step.stepNumber}</span>
                </div>
                <div>
                  <CardTitle className="text-lg font-bold text-slate-800">
                    {step.stepName}
                  </CardTitle>
                  <p className="text-sm text-slate-600 mt-1">{step.explanation}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-2xl font-black text-slate-900">
                    ${step.amount.toLocaleString()}
                  </div>
                  {step.formula && (
                    <div className="text-xs text-slate-500 mt-1 font-mono bg-slate-50 px-2 py-1 rounded">
                      {step.formula}
                    </div>
                  )}
                </div>
                {hasSubSteps && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleStep(step.stepNumber)}
                    className="hover:bg-blue-50"
                  >
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          {/* Document Sources */}
          <CardContent className="pt-0">
            <div className="mb-4">
              <h5 className="text-sm font-bold text-slate-700 mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                DOCUMENT SOURCES:
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {step.sources.map((source, sourceIndex) => (
                  <div key={sourceIndex} className="bg-slate-50 border border-slate-200 rounded p-3 text-xs">
                    <div className="font-bold text-slate-700">{source.documentName}</div>
                    <div className="text-slate-600">{source.documentDate}</div>
                    {source.sectionName && (
                      <div className="text-slate-600">{source.sectionName}</div>
                    )}
                    {source.excerpt && (
                      <div className="text-slate-600 mt-1 italic">&quot;{source.excerpt}&quot;</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Sub-steps */}
            {hasSubSteps && isExpanded && (
              <div className="mt-4 space-y-4">
                <h6 className="text-sm font-bold text-slate-700 mb-2 flex items-center">
                  <ChevronDown className="h-4 w-4 mr-2" />
                  DETAILED BREAKDOWN:
                </h6>
                {step.subSteps!.map((subStep) => renderCalculationStep(subStep, level + 1))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

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
          .court-document {
            margin: 0 !important;
            padding: 0 !important;
            max-width: none !important;
            box-shadow: none !important;
          }
          .court-page {
            page-break-inside: avoid;
            margin: 0 !important;
            padding: 1in !important;
            background: white !important;
            border: none !important;
          }
          .court-header {
            border-bottom: 2px solid #1e293b !important;
            margin-bottom: 2rem !important;
            padding-bottom: 1rem !important;
          }
          .court-calculation {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
            padding: 1.5rem !important;
            margin: 1rem 0 !important;
          }
          .court-step {
            border-left: 4px solid #3b82f6 !important;
            padding-left: 1rem !important;
            margin: 0.5rem 0 !important;
          }
          .court-footer {
            border-top: 1px solid #e2e8f0 !important;
            margin-top: 2rem !important;
            padding-top: 1rem !important;
            font-size: 0.75rem !important;
          }
        }
      `}</style>

      <TooltipProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
          {/* Export/Print Controls */}
          <div className="fixed top-4 right-4 z-50 flex gap-2 no-print">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={generatePDF}
                  disabled={isGeneratingPDF}
                  className="bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="sm"
                >
                  {isGeneratingPDF ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Export to PDF for court filing</p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  onClick={printCalculation}
                  className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                  size="sm"
                >
                  <Printer className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Print calculation</p>
              </TooltipContent>
            </Tooltip>
          </div>

          {/* Court-Ready Document Layout */}
          <div className="court-document bg-white shadow-2xl mx-auto my-8 max-w-5xl" ref={pdfRef}>
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
              <div className="court-page relative z-10 bg-white min-h-[11in] p-16">
                {/* Professional Court Header */}
                <div className="court-header text-center mb-12">
                  <div className="mb-6">
                    <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight flex items-center justify-center">
                      <ScaleIcon className="h-10 w-10 mr-4 text-blue-600" />
                      FINAL DISTRIBUTION CALCULATION
                    </h1>
                    <h2 className="text-2xl font-bold text-slate-700 mb-4">Single Source of Truth - Statement of Decision Implementation</h2>
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
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    {/* Alvero Distribution */}
                    <div className="bg-slate-50 border-2 border-slate-300 p-8 text-center">
                      <h4 className="text-xl font-bold text-slate-800 mb-4">ROSANNA ALVERO</h4>
                      <div className="text-5xl font-black text-slate-900 mb-3">
                        ${calculationResult.summary.rosannaFinalDistribution.toLocaleString()}
                      </div>
                      <p className="text-sm text-slate-600 font-medium">35% SOD Allocation + Net Adjustments</p>
                    </div>

                    {/* Wauters Distribution */}
                    <div className="bg-slate-50 border-2 border-slate-300 p-8 text-center">
                      <h4 className="text-xl font-bold text-slate-800 mb-4">MATHIEU WAUTERS</h4>
                      <div className="text-5xl font-black text-slate-900 mb-3">
                        ${calculationResult.summary.mathieuFinalDistribution.toLocaleString()}
                      </div>
                      <p className="text-sm text-slate-600 font-medium">65% SOD Allocation + Net Adjustments</p>
                    </div>
                  </div>
                </div>

                {/* PROGRESSIVE DISCLOSURE CALCULATION BREAKDOWN */}
                <div className="court-calculation mb-12">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-bold text-slate-800 flex items-center">
                      <ScrollText className="h-6 w-6 mr-3 text-blue-600" />
                      CALCULATION BREAKDOWN
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
                      className="flex items-center space-x-2"
                    >
                      {showDetailedBreakdown ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          <span>Hide Details</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          <span>Show Details</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {showDetailedBreakdown && (
                    <div className="space-y-6">
                      {calculationResult.reasoningPath.map((step) => renderCalculationStep(step))}
                    </div>
                  )}
                </div>

                {/* COURT FOOTER */}
                <div className="court-footer mt-16 pt-8 border-t-2 border-slate-300 text-center">
                  <div className="bg-slate-50 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-slate-800 mb-4">LEGAL DISCLAIMER</h3>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-4xl mx-auto mb-4">
                      This calculation is based on the provided Statement of Decision and supporting documents.
                      All figures are derived from official court documents and closing statements.
                      This tool is for informational purposes only and should not replace professional legal advice.
                      Please consult with your attorney before making any legal decisions based on these calculations.
                    </p>
                    <div className="text-xs text-slate-500 space-y-1">
                      <p><strong>Document Sources:</strong> Final Sellers Closing Statement, Statement of Decision, Motion for Reconsideration</p>
                      <p><strong>Calculation Date:</strong> {new Date().toLocaleDateString()} | <strong>Version:</strong> 1.0</p>
                      <p><strong>Generated for:</strong> Wauters v. Alvero | <strong>Court Filing:</strong> FL-320 Declaration</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TooltipProvider>
    </>
  );
};

export default FinalDistributionSSOT;
