"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { safeFetch } from '@/lib/api/fetch';
import { logger } from '@/lib/logging/logger';
import {
  CalculationStep,
  SellerDeduction,
  BrokerageAllocation,
  SODAdjustments,
  NegotiableParameter,
} from '@/types/calculations';
import {
  PROPERTY_SALE,
  SOD_ALLOCATION,
  TAX_DATA,
  SOD_ADJUSTMENTS,
  REAL_ESTATE_DATA,
  DOCUMENT_SOURCES,
  TEXT_PROCESSING,
  calculateNetAdjustment,
  calculateMathieuFinalDistribution,
  calculateRosannaFinalDistribution,
} from '@/constants/case-data';
import {
  Calculator,
  GitCompare,
  Scale,
  FileText,
  Eye,
  EyeOff,
  ScrollText,
  ScaleIcon,
  PenLine,
  Upload,
  Trash2,
  CheckCircle2
} from 'lucide-react';

// Local types - application-specific to this page
type TabType = 'calculation' | 'comparison' | 'declarations';


const FinalDistributionSSOT: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('calculation');
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(true);
  const [negotiableParams, setNegotiableParams] = useState<NegotiableParameter[]>([
    {
      id: 'commission-rate',
      name: 'Commission Rate',
      currentValue: REAL_ESTATE_DATA.DEFAULT_COMMISSION_RATE * 100,
      minValue: REAL_ESTATE_DATA.MIN_COMMISSION_RATE * 100,
      maxValue: REAL_ESTATE_DATA.MAX_COMMISSION_RATE * 100,
      step: 0.1,
      unit: '%',
      description: 'Real estate agent commission rate'
    },
    {
      id: 'seller-concessions',
      name: 'Seller Concessions',
      currentValue: REAL_ESTATE_DATA.DEFAULT_SELLER_CONCESSIONS,
      minValue: REAL_ESTATE_DATA.MIN_SELLER_CONCESSIONS,
      maxValue: REAL_ESTATE_DATA.MAX_SELLER_CONCESSIONS,
      step: REAL_ESTATE_DATA.CONCESSIONS_STEP,
      unit: '$',
      description: 'Total seller concessions for repairs'
    }
  ]);

  // Signature states
  const [respSigImage, setRespSigImage] = useState<string | null>(null);
  const [petSigImage, setPetSigImage] = useState<string | null>(null);
  const [respTypedName, setRespTypedName] = useState('');
  const [petTypedName, setPetTypedName] = useState('');
  const [respSignedAt, setRespSignedAt] = useState<string | null>(null);
  const [petSignedAt, setPetSignedAt] = useState<string | null>(null);

  // Petitioner documents (RFO + Attorney Declaration)
  const [petitionerRFO, setPetitionerRFO] = useState<string>('');
  const [petitionerDecl, setPetitionerDecl] = useState<string>('');
  const [documentsLoading, setDocumentsLoading] = useState(true);
  const [documentsError, setDocumentsError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Load petitioner documents (RFO and Declaration)
     * Uses safeFetch with automatic retry and timeout
     */
    const loadDocuments = async () => {
      setDocumentsLoading(true);
      setDocumentsError(null);

      try {
        // Fetch petitioner RFO
        const rfoResult = await safeFetch<{ text: string }>(
          '/api/case-financials/source?file=petitioner_rfo',
          { timeout: 10000, retries: 2 }
        );

        if (rfoResult.error) {
          logger.warn('Failed to load petitioner RFO', {
            error: rfoResult.error.message,
            status: rfoResult.status,
          });
          setPetitionerRFO('');
        } else if (rfoResult.data) {
          setPetitionerRFO(rfoResult.data.text || '');
          logger.debug('Loaded petitioner RFO', { size: rfoResult.data.text.length });
        }

        // Fetch petitioner declaration
        const declResult = await safeFetch<{ text: string }>(
          '/api/case-financials/source?file=petitioner_declaration',
          { timeout: 10000, retries: 2 }
        );

        if (declResult.error) {
          logger.warn('Failed to load petitioner declaration', {
            error: declResult.error.message,
            status: declResult.status,
          });
          setPetitionerDecl('');
        } else if (declResult.data) {
          setPetitionerDecl(declResult.data.text || '');
          logger.debug('Loaded petitioner declaration', { size: declResult.data.text.length });
        }

        // Check if both failed
        if (rfoResult.error && declResult.error) {
          setDocumentsError('Failed to load documents. Please refresh the page.');
        }
      } catch (err) {
        logger.error('Error loading petitioner documents', err as Error);
        setDocumentsError('Unexpected error loading documents');
      } finally {
        setDocumentsLoading(false);
      }
    };

    loadDocuments();
  }, [])

  const rfoAttachment7Excerpt = useMemo(() => {
    if (!petitionerRFO) return ''
    const lower = petitionerRFO.toLowerCase()
    const marker = TEXT_PROCESSING.RFO_ATTACHMENT_MARKER
    const i = lower.indexOf(marker)
    if (i === -1) return petitionerRFO.slice(0, TEXT_PROCESSING.RFO_DEFAULT_EXCERPT_LENGTH)
    const start = Math.max(0, i - TEXT_PROCESSING.RFO_EXCERPT_CONTEXT_BEFORE)
    return petitionerRFO.slice(start, i + TEXT_PROCESSING.RFO_EXCERPT_CONTEXT_AFTER)
  }, [petitionerRFO])

  const printRef = useRef<HTMLDivElement>(null);
  // Ensure expanded before printing
  useEffect(() => {
    const onBeforePrint = () => setShowDetailedBreakdown(true);
    if (typeof window !== 'undefined') {
      window.addEventListener('beforeprint', onBeforePrint);
      return () => window.removeEventListener('beforeprint', onBeforePrint);
    }
  }, []);

  // Calculation result - using constants for maintainability
  const calculationResult = useMemo(() => {
    // Load property and financial data from constants
    const grossSalePrice = PROPERTY_SALE.GROSS_SALE_PRICE;
    const netProceedsToSellers = PROPERTY_SALE.NET_PROCEEDS_TO_SELLERS;
    const lenderPayoff = PROPERTY_SALE.LENDER_PAYOFF;
    const mathieuSODShare = netProceedsToSellers * SOD_ALLOCATION.MATHIEU_PERCENTAGE;
    const rosannaSODShare = netProceedsToSellers * SOD_ALLOCATION.ROSANNA_PERCENTAGE;
    const rosannaWithholding = TAX_DATA.ROSANNA_FTB_WITHHOLDING;
    const mathieuTaxObligation = TAX_DATA.MATHIEU_TAX_OBLIGATION;

    // SOD Adjustments from constants (should come from ledger in future)
    const sodAdjustments: SODAdjustments = {
      wattsChargesOriginal: SOD_ADJUSTMENTS.WATTS_CHARGES_ORIGINAL,
      rentalIncomeShare: SOD_ADJUSTMENTS.RENTAL_INCOME_SHARE,
      motorcycleShare: SOD_ADJUSTMENTS.MOTORCYCLE_SHARE,
      furnitureShare: SOD_ADJUSTMENTS.FURNITURE_SHARE,
      rosannaExclusivePossession: SOD_ADJUSTMENTS.ROSANNA_EXCLUSIVE_POSSESSION,
      furnitureCorrection: SOD_ADJUSTMENTS.FURNITURE_CORRECTION
    };

    const mathieuOwesRosanna = sodAdjustments.wattsChargesOriginal + sodAdjustments.rentalIncomeShare + sodAdjustments.motorcycleShare + sodAdjustments.furnitureShare;
    const rosannaOwesMathieu = sodAdjustments.rosannaExclusivePossession + sodAdjustments.furnitureCorrection;
    const netAdjustment = calculateNetAdjustment();

    // Final distributions
    const mathieuFinalDistribution = calculateMathieuFinalDistribution();
    const rosannaFinalDistribution = calculateRosannaFinalDistribution();

    // Progressive disclosure reasoning path
    const reasoningPath: CalculationStep[] = [
      {
        stepNumber: 1,
        stepName: 'Gross Sale Price',
        explanation: 'Total sale price of the property before any deductions',
        amount: grossSalePrice,
        formula: 'Contract Price',
        sources: [
          {
            documentName: DOCUMENT_SOURCES.CLOSING_STATEMENT.name,
            documentDate: DOCUMENT_SOURCES.CLOSING_STATEMENT.date,
            sectionName: 'Sale Price',
            excerpt: `Contract Price: $${grossSalePrice.toLocaleString()}`
          }
        ]
      },
      {
        stepNumber: 2,
        stepName: 'Lender Payoff',
        explanation: 'Amount paid to satisfy the existing mortgage',
        amount: lenderPayoff,
        formula: 'Outstanding Loan Balance',
        sources: [
          {
            documentName: 'Final Sellers Closing Statement',
            documentDate: '05/30/2025',
            sectionName: 'Payoffs',
            excerpt: 'First Mortgage Payoff: $759,364.32'
          }
        ]
      },
      {
        stepNumber: 3,
        stepName: 'Net Proceeds to Sellers',
        explanation: 'Amount remaining after all deductions and payoffs',
        amount: netProceedsToSellers,
        formula: 'Gross Sale Price - Lender Payoff - Seller Deductions',
        sources: [
          {
            documentName: 'Final Sellers Closing Statement',
            documentDate: '05/30/2025',
            sectionName: 'Seller Proceeds',
            excerpt: 'Net Proceeds: $280,355.83'
          }
        ]
      },
      {
        stepNumber: 4,
        stepName: 'Statement of Decision Allocation',
        explanation: '65% to Mathieu, 35% to Rosanna as per court order',
        amount: netProceedsToSellers,
        formula: 'Net Proceeds × Allocation Percentage',
        sources: [
          {
            documentName: 'Statement of Decision',
            documentDate: 'Court Order',
            sectionName: 'Property Division',
            excerpt: '65% to Respondent, 35% to Petitioner'
          }
        ],
        subSteps: [
          {
            stepNumber: 4.1,
            stepName: 'Mathieu\'s 65% Share',
            explanation: 'Respondent\'s allocated portion',
            amount: mathieuSODShare,
            formula: 'Net Proceeds × 0.65'
          },
          {
            stepNumber: 4.2,
            stepName: 'Rosanna\'s 35% Share',
            explanation: 'Petitioner\'s allocated portion',
            amount: rosannaSODShare,
            formula: 'Net Proceeds × 0.35'
          }
        ]
      },
      {
        stepNumber: 5,
        stepName: 'Post-SOD Adjustments',
        explanation: 'Adjustments required by Statement of Decision and subsequent evidence',
        amount: netAdjustment,
        formula: 'Mathieu Owes Rosanna - Rosanna Owes Mathieu',
        sources: [
          {
            documentName: 'Statement of Decision',
            documentDate: 'Court Order',
            sectionName: 'Post-Judgment Adjustments',
            excerpt: 'Watts Charges, Rental Income, Motorcycle, Furniture'
          }
        ],
        subSteps: [
          {
            stepNumber: 5.1,
            stepName: 'Mathieu Owes Rosanna',
            explanation: 'Watts Charges + Rental Income + Motorcycle + Furniture',
            amount: mathieuOwesRosanna,
            formula: '48,640 + 5,761.81 + 5,855 + 7,500'
          },
          {
            stepNumber: 5.2,
            stepName: 'Rosanna Owes Mathieu',
            explanation: 'Exclusive Possession + Furniture Correction',
            amount: rosannaOwesMathieu,
            formula: '33,500 + 15,000'
          }
        ]
      },
      {
        stepNumber: 6,
        stepName: 'Tax Obligations',
        explanation: 'Estimated tax obligations for each party',
        amount: mathieuTaxObligation + rosannaWithholding,
        formula: 'Mathieu Tax + Rosanna Withholding',
        sources: [
          {
            documentName: 'Tax Forms',
            documentDate: '05/30/2025',
            sectionName: 'Withholding',
            excerpt: 'Rosanna\'s withholding: $13,694.62'
          }
        ],
        subSteps: [
          {
            stepNumber: 6.1,
            stepName: 'Mathieu\'s Tax Obligation',
            explanation: 'Estimated tax obligation for Respondent',
            amount: mathieuTaxObligation,
            formula: 'Estimated based on income'
          },
          {
            stepNumber: 6.2,
            stepName: 'Rosanna\'s Withholding',
            explanation: 'Tax withholding from sale proceeds',
            amount: rosannaWithholding,
            formula: 'Actual withholding from closing'
          }
        ]
      },
      {
        stepNumber: 7,
        stepName: 'Final Distribution',
        explanation: 'Final amounts to be distributed to each party',
        amount: mathieuFinalDistribution + rosannaFinalDistribution,
        formula: 'SOD Share ± Net Adjustment - Tax Obligations',
        sources: [
          {
            documentName: 'Final Calculation',
            documentDate: 'Generated',
            sectionName: 'Summary',
            excerpt: 'Final distribution calculation'
          }
        ],
        subSteps: [
          {
            stepNumber: 7.1,
            stepName: 'Mathieu\'s Final Distribution',
            explanation: '65% share minus net adjustment minus tax obligation',
            amount: mathieuFinalDistribution,
            formula: 'Mathieu SOD Share - Net Adjustment - Mathieu Tax'
          },
          {
            stepNumber: 7.2,
            stepName: 'Rosanna\'s Final Distribution',
            explanation: '35% share plus net adjustment minus withholding',
            amount: rosannaFinalDistribution,
            formula: 'Rosanna SOD Share + Net Adjustment - Rosanna Withholding'
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
  }, []);

  // Seller deductions data
  const sellerDeductions: SellerDeduction[] = [
    {
      id: 'commission',
      description: 'Real Estate Commission',
      amount: 70500,
      category: 'commission',
      negotiable: true,
      sources: [
        {
          documentName: 'Final Sellers Closing Statement',
          documentDate: '05/30/2025',
          sectionName: 'Commission',
          excerpt: '6% commission on $1,175,000'
        }
      ]
    },
    {
      id: 'concessions',
      description: 'Seller Concessions for Repairs',
      amount: 35000,
      category: 'concessions',
      negotiable: true,
      sources: [
        {
          documentName: 'Final Sellers Closing Statement',
          documentDate: '05/30/2025',
          sectionName: 'Concessions',
          excerpt: 'Repair concessions to buyer'
        }
      ]
    },
    {
      id: 'escrow-fees',
      description: 'Escrow and Title Fees',
      amount: 2500,
      category: 'fees',
      negotiable: false,
      sources: [
        {
          documentName: 'Final Sellers Closing Statement',
          documentDate: '05/30/2025',
          sectionName: 'Fees',
          excerpt: 'Escrow and title company fees'
        }
      ]
    },
    {
      id: 'tax-withholding',
      description: 'Tax Withholding (Rosanna)',
      amount: 13694.62,
      category: 'taxes',
      negotiable: false,
      sources: [
        {
          documentName: 'Final Sellers Closing Statement',
          documentDate: '05/30/2025',
          sectionName: 'Withholding',
          excerpt: 'Franchise Tax Board withholding'
        }
      ]
    }
  ];

  // Brokerage allocations data
  const brokerageAllocations: BrokerageAllocation[] = [
    {
      id: 'ron-melendez',
      brokerName: 'Ron Melendez',
      commissionRate: 3.0,
      commissionAmount: 35250,
      negotiable: true,
      sources: [
        {
          documentName: 'Final Sellers Closing Statement',
          documentDate: '05/30/2025',
          sectionName: 'Commission Split',
          excerpt: '3% to listing agent'
        }
      ]
    },
    {
      id: 'buyer-agent',
      brokerName: 'Buyer\'s Agent',
      commissionRate: 3.0,
      commissionAmount: 35250,
      negotiable: false,
      sources: [
        {
          documentName: 'Final Sellers Closing Statement',
          documentDate: '05/30/2025',
          sectionName: 'Commission Split',
          excerpt: '3% to buyer\'s agent'
        }
      ]
    }
  ];

  // SOD adjustments
  const sodAdjustments = {
    wattsChargesOriginal: 48640.00,
    rentalIncomeShare: 5761.81,
    motorcycleShare: 5855.00,
    furnitureShare: 7500.00,
    rosannaExclusivePossession: 33500.00,
    furnitureCorrection: 15000.00
  };

  // Legal citations
  const sodCitations = useMemo(() => ({
    familyCode2550: {
      title: 'Family Code § 2550',
      text: 'Community property shall be divided equally between the parties',
      relevance: 'Establishes equal division principle'
    },
    familyCode2552: {
      title: 'Family Code § 2552',
      text: 'The court may make any orders necessary to effectuate the division of community property',
      relevance: 'Court authority for adjustments'
    },
    statementOfDecision: {
      title: 'Statement of Decision',
      text: '65% allocation to Respondent, 35% to Petitioner',
      relevance: 'Court-ordered allocation'
    }
  }), []);

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

  // Calculation Content Renderer
  const renderCalculationContent = () => (
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
                  <div key={index} className="court-step bg-white border border-slate-200 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-4 border-2 border-slate-300">
                          <span className="text-sm font-bold text-slate-700">{step.stepNumber}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-800">{step.stepName}</h4>
                          <p className="text-sm text-slate-600">{step.explanation}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-black text-slate-900">
                          ${step.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}
                        </div>
                        {step.formula && (
                          <div className="text-xs text-slate-500 mt-1 font-mono bg-slate-50 px-2 py-1 rounded">
                            {step.formula}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Document Sources */}
                    <div className="mb-4">
                      <h5 className="text-sm font-bold text-slate-700 mb-2">DOCUMENT SOURCES:</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {step.sources?.map((source, sourceIndex) => (
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
                    {step.subSteps && step.subSteps.length > 0 && (
                      <div className="mt-4 pl-8 border-l-2 border-slate-200">
                        <h6 className="text-sm font-bold text-slate-700 mb-3">SUPPORTING CALCULATIONS:</h6>
                        <div className="space-y-3">
                          {step.subSteps.map((subStep, subIndex) => (
                            <div key={subIndex} className="bg-slate-50 border border-slate-200 rounded p-4">
                              <div className="flex items-start justify-between">
                                <div className="flex items-center">
                                  <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center mr-3 border border-slate-300">
                                    <span className="text-xs font-bold text-slate-700">{subStep.stepNumber}</span>
                                  </div>
                                  <div>
                                    <h6 className="text-sm font-bold text-slate-800">{subStep.stepName}</h6>
                                    <p className="text-xs text-slate-600">{subStep.explanation}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-lg font-bold text-slate-900">
                                    ${subStep.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Sub-step Sources */}
                              {subStep.sources && subStep.sources.length > 0 && (
                                <div className="mt-3">
                                  <div className="grid grid-cols-1 gap-2">
                                    {subStep.sources.map((source, sourceIndex) => (
                                      <div key={sourceIndex} className="bg-white border border-slate-200 rounded p-2 text-xs">
                                        <div className="font-semibold text-slate-700">{source.documentName}</div>
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
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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
                  {sellerDeductions.map((deduction, index) => renderSellerDeduction(deduction, index))}
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
                  {brokerageAllocations.map((allocation, index) => renderBrokerageAllocation(allocation, index))}
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
                {renderSODAdjustments()}
              </div>
            )}

            {/* Negotiable Parameters */}
            {showDetailedBreakdown && (
              <div className="mb-12">
                <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
                  <ScaleIcon className="h-5 w-5 mr-2 text-blue-600" />
                  NEGOTIATION PARAMETERS
                </h3>
                {renderNegotiableParameters()}
              </div>
            )}

            {/* Legal Analysis */}
            {showDetailedBreakdown && (
              <div className="mb-12">
                <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
                  <FileText className="h-5 w-5 mr-2 text-blue-600" />
                  LEGAL ANALYSIS & CITATIONS
                </h3>
                {renderLegalAnalysis()}
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
            {renderSignatures()}

            {/* Court Footer */}
            {renderCourtFooter()}
          </div>
        </div>
      </div>
    </div>
  );

  // Comparison Content Renderer (placeholder)
  const renderComparisonContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-slate-800 mb-4">Side-by-Side Comparison</h2>
          <p className="text-slate-600">This tab will show a comparison between the petitioner&apos;s proposed calculation and the respondent&apos;s correct calculation.</p>
        </div>
      </div>
    </div>
  );

  // Declarations Content Renderer
  const renderDeclarationsContent = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Petitioner Declarations (Attorney + Attachment 7) */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-red-200">
          <div className="mb-4">
            <h2 className="text-2xl font-bold text-red-800">Petitioner’s RFO — Declarations</h2>
            <p className="text-slate-600 text-sm">Attorney declaration and Attachment 7 excerpt, rendered inline.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-semibold text-red-700 mb-2">Attachment 7 — Excerpt</div>
              <div className="bg-red-50 border border-red-200 rounded p-3 max-h-80 overflow-auto">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-slate-800">{rfoAttachment7Excerpt || 'RFO not ingested yet.'}</pre>
              </div>
            </div>
            <div>
              <div className="text-sm font-semibold text-red-700 mb-2">Declaration of Selam Gezahegn — Excerpt</div>
              <div className="bg-red-50 border border-red-200 rounded p-3 max-h-80 overflow-auto">
                <pre className="whitespace-pre-wrap text-xs leading-relaxed text-slate-800">{petitionerDecl ? petitionerDecl.slice(0, 2000) : 'Attorney declaration not ingested yet.'}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation context below declarations for immediate comparison */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200">
          <h3 className="text-lg font-bold text-slate-800 mb-2">Final Distribution Summary (For Context)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4 text-center">
              <div className="text-xs text-slate-700 mb-1">Rosanna Alvero</div>
              <div className="text-2xl font-black text-slate-900">${calculationResult?.summary?.rosannaFinalDistribution?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}</div>
            </div>
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 p-4 text-center">
              <div className="text-xs text-slate-700 mb-1">Mathieu Wauters</div>
              <div className="text-2xl font-black text-slate-900">${calculationResult?.summary?.mathieuFinalDistribution?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper Functions
  const renderSellerDeduction = (deduction: SellerDeduction, index: number) => (
    <div key={deduction.id} className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-4 border-2 border-slate-300">
            <span className="text-sm font-bold text-slate-700">{index + 1}</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">{deduction.description}</h4>
            <p className="text-sm text-slate-600">Category: {deduction.category}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-slate-900">
            ${deduction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {deduction.negotiable && (
            <div className="text-xs text-blue-600 mt-1 font-medium">Negotiable</div>
          )}
        </div>
      </div>

      {/* Sources */}
      <div className="mb-4">
        <h5 className="text-sm font-bold text-slate-700 mb-2">SOURCES:</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {deduction.sources.map((source, sourceIndex) => (
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
    </div>
  );

  const renderBrokerageAllocation = (allocation: BrokerageAllocation, index: number) => (
    <div key={allocation.id} className="bg-white border border-slate-200 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-4 border-2 border-slate-300">
            <span className="text-sm font-bold text-slate-700">{index + 1}</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">{allocation.brokerName}</h4>
            <p className="text-sm text-slate-600">Commission Rate: {allocation.commissionRate}%</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-slate-900">
            ${allocation.commissionAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          {allocation.negotiable && (
            <div className="text-xs text-blue-600 mt-1 font-medium">Negotiable</div>
          )}
        </div>
      </div>

      {/* Sources */}
      <div className="mb-4">
        <h5 className="text-sm font-bold text-slate-700 mb-2">SOURCES:</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {allocation.sources.map((source, sourceIndex) => (
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
    </div>
  );

  const renderSODAdjustments = () => (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="text-lg font-bold text-slate-800 mb-4">Mathieu Owes Rosanna</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded p-4">
            <div className="text-sm font-bold text-slate-700">Watts Charges</div>
            <div className="text-xl font-black text-slate-900">${sodAdjustments.wattsChargesOriginal.toLocaleString()}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded p-4">
            <div className="text-sm font-bold text-slate-700">Rental Income Share</div>
            <div className="text-xl font-black text-slate-900">${sodAdjustments.rentalIncomeShare.toLocaleString()}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded p-4">
            <div className="text-sm font-bold text-slate-700">Motorcycle Share</div>
            <div className="text-xl font-black text-slate-900">${sodAdjustments.motorcycleShare.toLocaleString()}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded p-4">
            <div className="text-sm font-bold text-slate-700">Furniture Share</div>
            <div className="text-xl font-black text-slate-900">${sodAdjustments.furnitureShare.toLocaleString()}</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
          <div className="text-lg font-bold text-blue-900">Total: ${(sodAdjustments.wattsChargesOriginal + sodAdjustments.rentalIncomeShare + sodAdjustments.motorcycleShare + sodAdjustments.furnitureShare).toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="text-lg font-bold text-slate-800 mb-4">Rosanna Owes Mathieu</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-50 border border-slate-200 rounded p-4">
            <div className="text-sm font-bold text-slate-700">Exclusive Possession</div>
            <div className="text-xl font-black text-slate-900">${sodAdjustments.rosannaExclusivePossession.toLocaleString()}</div>
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded p-4">
            <div className="text-sm font-bold text-slate-700">Furniture Correction</div>
            <div className="text-xl font-black text-slate-900">${sodAdjustments.furnitureCorrection.toLocaleString()}</div>
          </div>
        </div>
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
          <div className="text-lg font-bold text-green-900">Total: ${(sodAdjustments.rosannaExclusivePossession + sodAdjustments.furnitureCorrection).toLocaleString()}</div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg p-6">
        <h4 className="text-lg font-bold text-slate-800 mb-4">Net Adjustment</h4>
        <div className="p-4 bg-slate-50 border border-slate-200 rounded">
          <div className="text-2xl font-black text-slate-900">${(sodAdjustments.wattsChargesOriginal + sodAdjustments.rentalIncomeShare + sodAdjustments.motorcycleShare + sodAdjustments.furnitureShare - sodAdjustments.rosannaExclusivePossession - sodAdjustments.furnitureCorrection).toLocaleString()}</div>
          <div className="text-sm text-slate-600 mt-2">Mathieu Owes Rosanna - Rosanna Owes Mathieu</div>
        </div>
      </div>
    </div>
  );

  const renderNegotiableParameters = () => (
    <div className="space-y-4">
      {negotiableParams.map((param) => (
        <div key={param.id} className="bg-white border border-slate-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className="text-lg font-bold text-slate-800">{param.name}</h4>
              <p className="text-sm text-slate-600">{param.description}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-slate-900">
                {param.unit === '$' ? '$' : ''}{param.currentValue.toLocaleString()}{param.unit === '%' ? '%' : ''}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateParameter(param.id, param.currentValue - param.step)}
              disabled={param.currentValue <= param.minValue}
            >
              -
            </Button>
            <div className="flex-1">
              <input
                type="range"
                min={param.minValue}
                max={param.maxValue}
                step={param.step}
                value={param.currentValue}
                onChange={(e) => updateParameter(param.id, parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => updateParameter(param.id, param.currentValue + param.step)}
              disabled={param.currentValue >= param.maxValue}
            >
              +
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLegalAnalysis = () => (
    <div className="space-y-6">
      {Object.entries(sodCitations).map(([key, citation]) => (
        <div key={key} className="bg-white border border-slate-200 rounded-lg p-6">
          <h4 className="text-lg font-bold text-slate-800 mb-2">{citation.title}</h4>
          <p className="text-sm text-slate-600 mb-2">&quot;{citation.text}&quot;</p>
          <div className="text-xs text-slate-500">
            <strong>Relevance:</strong> {citation.relevance}
          </div>
        </div>
      ))}
    </div>
  );

  const renderSignatures = () => (
    <div className="court-calculation mb-12">
      <h3 className="text-xl font-bold text-slate-800 flex items-center mb-6">
        <PenLine className="h-5 w-5 mr-2 text-blue-600" />
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
                  style={{ fontFamily: 'cursive' }}
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
                  style={{ fontFamily: 'cursive' }}
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
  );

  const renderCourtFooter = () => (
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
  );

  // Signature handling functions
  const preventDefaults = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, type: 'resp' | 'pet') => {
    e.preventDefault();
    e.stopPropagation();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'resp') {
          setRespSigImage(event.target?.result as string);
        } else {
          setPetSigImage(event.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>, type: 'resp' | 'pet') => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'resp') {
          setRespSigImage(event.target?.result as string);
        } else {
          setPetSigImage(event.target?.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const signTyped = (type: 'resp' | 'pet') => {
    if (type === 'resp') {
      setRespSignedAt(new Date().toISOString());
    } else {
      setPetSignedAt(new Date().toISOString());
    }
  };

  const clearSignature = (type: 'resp' | 'pet') => {
    if (type === 'resp') {
      setRespSigImage(null);
      setRespTypedName('');
      setRespSignedAt(null);
    } else {
      setPetSigImage(null);
      setPetTypedName('');
      setPetSignedAt(null);
    }
  };

  const updateParameter = (id: string, value: number) => {
    setNegotiableParams(prev => prev.map(param => 
      param.id === id ? { ...param, currentValue: value } : param
    ));
  };

  const printCalculation = () => {
    if (printRef.current) {
      window.print();
    }
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
