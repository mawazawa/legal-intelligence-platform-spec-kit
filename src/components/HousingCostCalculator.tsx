'use client';

import React, { useState, useMemo, useRef, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
// Removed PDF generation dependencies - using browser print-to-PDF instead
import {
  Calculator,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
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
  Printer
} from 'lucide-react';

interface ClosingData {
  salePrice: number;
  lenderPayoff: number;
  netProceeds: number;
  rosannaWithholding: number;
  mathieuTaxObligation: number;
  commissions: number;
  transferTaxes: number;
  countyTaxes: number;
  sellerCredits: number;
}

interface MortgageBreakdown {
  principal: number;
  interest: number;
  escrowAdvances: number;
  lateFees: number;
  checkFees: number;
  lenderPaidExpenses: number;
  legalFees: number;
  otherFees: number;
  recordingFees: number;
  reconveyanceFee: number;
}

interface CostAllocation {
  category: string;
  totalAmount: number;
  mathieuShare: number;
  rosannaShare: number;
  justification: string;
  legalBasis: string;
  source: string;
  icon: React.ReactNode;
  color: string;
}

interface SODAdjustments {
  // Mathieu owes Rosanna (from SOD)
  wattsChargesOriginal: number; // $48,640 from SOD
  rentalIncomeShare: number; // $5,761.81
  motorcycleShare: number; // $5,855
  furnitureShare: number; // $7,500 (disputed)

  // Rosanna owes Mathieu (adjustments)
  rosannaExclusivePossession: number; // 6.7 months × $5,000 = $33,500, Mathieu's 65% = $21,775
  furnitureCorrection: number; // $15,000 swing (she kept furniture)

  // Other adjustments
  rosannaWithholding: number; // $13,694.62 FTB withholding
  mathieuTaxObligation: number; // Estimated $25,000
}

interface RealtorInfo {
  name: string;
  role: 'listing' | 'buying';
  brokerage: string;
  agentSplit: number; // percentage agent gets (e.g., 0.7 for 70%)
  totalCommission: number;
}

interface NegotiableParameters {
  totalCommissionRate: number; // percentage of sale price (e.g., 0.05 for 5%)
  listingAgentSplit: number; // percentage of total commission (e.g., 0.5 for 50%)
  buyerAgentSplit: number; // percentage of total commission (e.g., 0.5 for 50%)
  agentBrokerSplit: number; // percentage agent gets vs brokerage (e.g., 0.7 for 70%)
  wattsChargesRate: number; // monthly rate for Watts charges (e.g., 5000)
  exclusivePossessionMonths: number; // months for exclusive possession credit
}

interface DocumentSource {
  documentName: string;
  documentDate: string;
  pageNumber?: string;
  lineNumber?: string;
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
}

interface CalculationResult {
  closingData: ClosingData;
  mortgageBreakdown: MortgageBreakdown;
  sodAdjustments: SODAdjustments;
  summary: {
    // Step 1: Gross sale price
    grossSalePrice: number;

    // Step 2: Selling concessions and costs
    sellingConcessions: number;
    realEstateCommissions: number;
    escrowFees: number;
    transferTaxes: number;
    otherClosingCosts: number;

    // Step 3: Lender payoff
    totalLenderPayoff: number;

    // Step 4: Net proceeds before SOD
    netProceedsBeforeSOD: number;

    // Step 5: SOD allocation (65%/35%)
    mathieuSODShare: number;
    rosannaSODShare: number;

    // Step 6: SOD adjustments
    mathieuOwesRosanna: number;
    rosannaOwesMathieu: number;
    netAdjustment: number;

    // Step 7: Final distribution
    mathieuFinalDistribution: number;
    rosannaFinalDistribution: number;

    // Additional info
    rosannaFTBCredit: number;
  };
  reasoningPath: CalculationStep[];
}

const HousingCostCalculator: React.FC = () => {
  const pdfRef = useRef<HTMLDivElement>(null);
  // Removed PDF generation state - using browser print instead
  
  const [closingData, setClosingData] = useState<ClosingData>({
    salePrice: 1175000.00, // From Final Sellers Closing Statement
    lenderPayoff: 759364.32, // From Final Sellers Closing Statement
    netProceeds: 280355.83, // From Final Sellers Closing Statement
    rosannaWithholding: 13694.62, // Real Estate Withholding 593 from closing statement
    mathieuTaxObligation: 25000, // User's estimated tax obligation
    commissions: 58750.00, // Total commissions from closing statement
    transferTaxes: 6580.00, // City + County transfer taxes
    countyTaxes: 1107.75, // County tax proration
    sellerCredits: 26991.01, // Seller credits to buyer
  });

  const [mortgageBreakdown, setMortgageBreakdown] = useState<MortgageBreakdown>({
    principal: 681774.56, // From lender payoff breakdown
    interest: 32332.29, // Interest to 6/1/2025 + additional interest
    escrowAdvances: 38924.96, // Escrow advances
    lateFees: 307.80, // Deferred late fees
    checkFees: 50.00, // Deferred check fees
    lenderPaidExpenses: 4747.95, // Lender paid expenses
    legalFees: 946.76, // Legal fees
    otherFees: 85.00, // Quote fee + expedited delivery + other fees
    recordingFees: 190.00, // County recording fee
    reconveyanceFee: 25.00, // Third party reconveyance fee
  });

  const [sodAdjustments, setSodAdjustments] = useState<SODAdjustments>({
    // Mathieu owes Rosanna (from SOD)
    wattsChargesOriginal: 48640.00, // $48,640 from SOD
    rentalIncomeShare: 5761.81, // $5,761.81
    motorcycleShare: 5855.00, // $5,855
    furnitureShare: 7500.00, // $7,500 (disputed)
    
    // Rosanna owes Mathieu (adjustments)
    rosannaExclusivePossession: 21775.00, // 6.7 months × $5,000 = $33,500, Mathieu's 65% = $21,775
    furnitureCorrection: 15000.00, // $15,000 swing (she kept furniture)
    
    // Other adjustments
    rosannaWithholding: 13694.62, // $13,694.62 FTB withholding
    mathieuTaxObligation: 25000.00, // Estimated $25,000
  });

  const [realtorInfo] = useState<RealtorInfo[]>([
    {
      name: "Stephanie Younger",
      role: "listing",
      brokerage: "Compass - Stephanie Younger Group",
      agentSplit: 0.7,
      totalCommission: 29375.00
    },
    {
      name: "Compass Beverly Hills Agent",
      role: "buying", 
      brokerage: "Compass Beverly Hills",
      agentSplit: 0.7,
      totalCommission: 29375.00
    }
  ]);

  const calculationResult = useMemo((): CalculationResult => {
    // Step 1: Gross sale price
    const grossSalePrice = closingData.salePrice;

    // Step 2: Selling concessions and costs
    const sellingConcessions = closingData.sellerCredits; // $26,991.01
    const realEstateCommissions = closingData.commissions; // $58,750.00
    const escrowFees = 0; // Not separately itemized in closing statement
    const transferTaxes = closingData.transferTaxes; // $6,580.00
    const otherClosingCosts = closingData.countyTaxes; // $1,107.75

    // Step 3: Lender payoff
    const totalLenderPayoff = closingData.lenderPayoff; // $759,364.32

    // Step 4: Net proceeds before SOD (use actual closing statement amount)
    const netProceedsBeforeSOD = closingData.netProceeds; // $280,355.83 from closing statement

    // Step 5: SOD allocation (65%/35%)
    const mathieuSODShare = netProceedsBeforeSOD * 0.65;
    const rosannaSODShare = netProceedsBeforeSOD * 0.35;

    // Step 6: SOD adjustments
    const mathieuOwesRosanna = sodAdjustments.wattsChargesOriginal + sodAdjustments.rentalIncomeShare + sodAdjustments.motorcycleShare + sodAdjustments.furnitureShare;
    const rosannaOwesMathieu = sodAdjustments.rosannaExclusivePossession + sodAdjustments.furnitureCorrection;
    const netAdjustment = mathieuOwesRosanna - rosannaOwesMathieu;

    // Step 7: Final distribution
    const mathieuFinalDistribution = mathieuSODShare - netAdjustment;
    const rosannaFinalDistribution = rosannaSODShare + netAdjustment;

    // Build reasoning path with document sources
    const reasoningPath: CalculationStep[] = [
      {
        stepNumber: 1,
        stepName: "Gross Sale Price",
        amount: grossSalePrice,
        sources: [{
          documentName: "Final Sellers Closing Statement",
          documentDate: "05/30/2025",
          sectionName: "Sale Price",
          excerpt: "Sale Price: $1,175,000.00"
        }],
        explanation: "The total sale price of the property as agreed upon by buyer and seller."
      },
      {
        stepNumber: 2,
        stepName: "Selling Concessions & Costs",
        amount: sellingConcessions + realEstateCommissions + transferTaxes + otherClosingCosts,
        formula: `${sellingConcessions} + ${realEstateCommissions} + ${transferTaxes} + ${otherClosingCosts}`,
        sources: [
          {
            documentName: "Final Sellers Closing Statement",
            documentDate: "05/30/2025",
            sectionName: "Seller Credits",
            excerpt: "Seller Credits to Buyer: $26,991.01"
          },
          {
            documentName: "Final Sellers Closing Statement",
            documentDate: "05/30/2025",
            sectionName: "Commissions",
            excerpt: "Total Commissions: $58,750.00"
          },
          {
            documentName: "Final Sellers Closing Statement",
            documentDate: "05/30/2025",
            sectionName: "Transfer Taxes",
            excerpt: "City Transfer Tax: $5,875.00, County Transfer Tax: $705.00"
          },
          {
            documentName: "Final Sellers Closing Statement",
            documentDate: "05/30/2025",
            sectionName: "County Tax Proration",
            excerpt: "County Tax Proration: $1,107.75"
          }
        ],
        explanation: "All costs associated with selling the property, including concessions to buyer, real estate commissions, transfer taxes, and tax prorations.",
        subSteps: [
          {
            stepNumber: 2.1,
            stepName: "Seller Credits to Buyer",
            amount: sellingConcessions,
            sources: [{
              documentName: "Final Sellers Closing Statement",
              documentDate: "05/30/2025",
              sectionName: "Seller Credits",
              excerpt: "Seller Credits to Buyer: $26,991.01"
            }],
            explanation: "Concessions made to the buyer as part of the sale agreement."
          },
          {
            stepNumber: 2.2,
            stepName: "Real Estate Commissions",
            amount: realEstateCommissions,
            sources: [{
              documentName: "Final Sellers Closing Statement",
              documentDate: "05/30/2025",
              sectionName: "Commissions",
              excerpt: "Total Commissions: $58,750.00"
            }],
            explanation: "Commissions paid to real estate agents for facilitating the sale."
          },
          {
            stepNumber: 2.3,
            stepName: "Transfer Taxes",
            amount: transferTaxes,
            sources: [{
              documentName: "Final Sellers Closing Statement",
              documentDate: "05/30/2025",
              sectionName: "Transfer Taxes",
              excerpt: "City Transfer Tax: $5,875.00, County Transfer Tax: $705.00"
            }],
            explanation: "Government taxes on the transfer of property ownership."
          },
          {
            stepNumber: 2.4,
            stepName: "County Tax Proration",
            amount: otherClosingCosts,
            sources: [{
              documentName: "Final Sellers Closing Statement",
              documentDate: "05/30/2025",
              sectionName: "County Tax Proration",
              excerpt: "County Tax Proration: $1,107.75"
            }],
            explanation: "Prorated county taxes for the period of ownership."
          }
        ]
      },
      {
        stepNumber: 3,
        stepName: "Lender Payoff",
        amount: totalLenderPayoff,
        sources: [
          {
            documentName: "Final Sellers Closing Statement",
            documentDate: "05/30/2025",
            sectionName: "Payoffs/Payments",
            excerpt: "Lakeview Mortgage payoff: $759,364.32"
          },
          {
            documentName: "Lakeview Mortgage payoff statement",
            documentDate: "05/20/2025",
            sectionName: "Reinstatement Amount Due",
            excerpt: "Reinstatement Amount Due: $95,962.46"
          }
        ],
        explanation: "Total amount paid to clear the outstanding mortgage loan, including principal, interest, fees, and lender-paid expenses.",
        subSteps: [
          {
            stepNumber: 3.1,
            stepName: "Principal Balance",
            amount: mortgageBreakdown.principal,
            sources: [{
              documentName: "Final Sellers Closing Statement",
              documentDate: "05/30/2025",
              sectionName: "Lender Payoff Breakdown",
              excerpt: "Principal Balance: $681,774.56"
            }],
            explanation: "Outstanding principal amount of the mortgage loan."
          },
          {
            stepNumber: 3.2,
            stepName: "Interest & Additional Interest",
            amount: mortgageBreakdown.interest,
            sources: [{
              documentName: "Final Sellers Closing Statement",
              documentDate: "05/30/2025",
              sectionName: "Lender Payoff Breakdown",
              excerpt: "Interest to 6/1/2025: $32,332.29"
            }],
            explanation: "Accrued interest up to the payoff date."
          },
          {
            stepNumber: 3.3,
            stepName: "Escrow Advances",
            amount: mortgageBreakdown.escrowAdvances,
            sources: [{
              documentName: "Final Sellers Closing Statement",
              documentDate: "05/30/2025",
              sectionName: "Lender Payoff Breakdown",
              excerpt: "Escrow Advances: $38,924.96"
            }],
            explanation: "Funds advanced by lender for property taxes and insurance."
          },
          {
            stepNumber: 3.4,
            stepName: "Late Fees & Administrative Costs",
            amount: mortgageBreakdown.lateFees + mortgageBreakdown.checkFees + mortgageBreakdown.otherFees + mortgageBreakdown.recordingFees + mortgageBreakdown.reconveyanceFee,
            sources: [{
              documentName: "Final Sellers Closing Statement",
              documentDate: "05/30/2025",
              sectionName: "Lender Payoff Breakdown",
              excerpt: "Late Fees: $307.80, Check Fees: $50.00, Other Fees: $85.00, Recording Fees: $190.00, Reconveyance Fee: $25.00"
            }],
            explanation: "Fees for overdue payments and administrative costs."
          },
          {
            stepNumber: 3.5,
            stepName: "Lender Paid Expenses & Legal Fees",
            amount: mortgageBreakdown.lenderPaidExpenses + mortgageBreakdown.legalFees,
            sources: [{
              documentName: "Final Sellers Closing Statement",
              documentDate: "05/30/2025",
              sectionName: "Lender Payoff Breakdown",
              excerpt: "Lender Paid Expenses: $4,747.95, Legal Fees: $946.76"
            }],
            explanation: "Expenses covered by the lender, including property inspections and legal fees."
          }
        ]
      },
      {
        stepNumber: 4,
        stepName: "Net Proceeds Before SOD",
        amount: netProceedsBeforeSOD,
        formula: `From closing statement: $280,355.83`,
        sources: [
          {
            documentName: "Final Sellers Closing Statement",
            documentDate: "05/30/2025",
            sectionName: "Due to Seller",
            excerpt: "Due to Seller: $280,355.83"
          }
        ],
        explanation: "The amount available for distribution after all sale costs and lender payoff, before applying Statement of Decision allocations."
      },
      {
        stepNumber: 5,
        stepName: "SOD Allocation (65%/35%)",
        amount: netProceedsBeforeSOD,
        formula: `Mathieu: ${netProceedsBeforeSOD} × 0.65 = ${mathieuSODShare}, Rosanna: ${netProceedsBeforeSOD} × 0.35 = ${rosannaSODShare}`,
        sources: [
          {
            documentName: "Statement of Decision",
            documentDate: "Court Order",
            sectionName: "Property Division",
            excerpt: "65% allocation to Mathieu Wauters, 35% allocation to Rosanna Alvero"
          }
        ],
        explanation: "Court-ordered allocation of net proceeds based on the Statement of Decision.",
        subSteps: [
          {
            stepNumber: 5.1,
            stepName: "Mathieu's SOD Share (65%)",
            amount: mathieuSODShare,
            sources: [{
              documentName: "Statement of Decision",
              documentDate: "Court Order",
              sectionName: "Property Division",
              excerpt: "65% allocation to Mathieu Wauters"
            }],
            explanation: "Mathieu's share of net proceeds per Statement of Decision."
          },
          {
            stepNumber: 5.2,
            stepName: "Rosanna's SOD Share (35%)",
            amount: rosannaSODShare,
            sources: [{
              documentName: "Statement of Decision",
              documentDate: "Court Order",
              sectionName: "Property Division",
              excerpt: "35% allocation to Rosanna Alvero"
            }],
            explanation: "Rosanna's share of net proceeds per Statement of Decision."
          }
        ]
      },
      {
        stepNumber: 6,
        stepName: "SOD Adjustments",
        amount: netAdjustment,
        formula: `Mathieu owes Rosanna: ${mathieuOwesRosanna}, Rosanna owes Mathieu: ${rosannaOwesMathieu}, Net: ${mathieuOwesRosanna} - ${rosannaOwesMathieu} = ${netAdjustment}`,
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
        explanation: "Adjustments based on Statement of Decision and subsequent court orders, including Watts charges, rental income, motorcycle, and furniture allocations.",
        subSteps: [
          {
            stepNumber: 6.1,
            stepName: "Mathieu Owes Rosanna",
            amount: mathieuOwesRosanna,
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
            explanation: "Total amount Mathieu owes Rosanna per Statement of Decision."
          },
          {
            stepNumber: 6.2,
            stepName: "Rosanna Owes Mathieu",
            amount: rosannaOwesMathieu,
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
            explanation: "Total amount Rosanna owes Mathieu based on post-SOD adjustments."
          }
        ]
      },
      {
        stepNumber: 7,
        stepName: "Final Distribution",
        amount: mathieuFinalDistribution + rosannaFinalDistribution,
        formula: `Mathieu: ${mathieuSODShare} - ${netAdjustment} = ${mathieuFinalDistribution}, Rosanna: ${rosannaSODShare} + ${netAdjustment} = ${rosannaFinalDistribution}`,
        sources: [
          {
            documentName: "Final Sellers Closing Statement",
            documentDate: "05/30/2025",
            sectionName: "Net Proceeds to Sellers",
            excerpt: "Net Proceeds to Sellers: $280,355.83"
          },
          {
            documentName: "Final Sellers Closing Statement",
            documentDate: "05/30/2025",
            sectionName: "Real Estate Withholding 593",
            excerpt: "Real Estate Withholding 593: $13,694.62"
          }
        ],
        explanation: "Final distribution amounts after applying Statement of Decision allocation and all adjustments.",
        subSteps: [
          {
            stepNumber: 7.1,
            stepName: "Mathieu's Final Distribution",
            amount: mathieuFinalDistribution,
            sources: [{
              documentName: "Calculation",
              documentDate: "Current",
              sectionName: "SOD Allocation + Adjustments",
              excerpt: "Mathieu's 65% share minus net adjustments"
            }],
            explanation: "Mathieu's final distribution after SOD allocation and adjustments."
          },
          {
            stepNumber: 7.2,
            stepName: "Rosanna's Final Distribution",
            amount: rosannaFinalDistribution,
            sources: [{
              documentName: "Calculation",
              documentDate: "Current",
              sectionName: "SOD Allocation + Adjustments",
              excerpt: "Rosanna&apos;s 35% share plus net adjustments"
            }],
            explanation: "Rosanna's final distribution after SOD allocation and adjustments."
          }
        ]
      }
    ];

    return {
      closingData,
      mortgageBreakdown,
      sodAdjustments,
      summary: {
        grossSalePrice,
        sellingConcessions,
        realEstateCommissions,
        escrowFees,
        transferTaxes,
        otherClosingCosts,
        totalLenderPayoff,
        netProceedsBeforeSOD,
        mathieuSODShare,
        rosannaSODShare,
        mathieuOwesRosanna,
        rosannaOwesMathieu,
        netAdjustment,
        mathieuFinalDistribution,
        rosannaFinalDistribution,
        rosannaFTBCredit: sodAdjustments.rosannaWithholding,
      },
      reasoningPath
    };
  }, [closingData, mortgageBreakdown, sodAdjustments]);

  // Removed unused handler functions following YAGNI principles

  const printCalculation = () => {
    window.print();
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 cv-auto">
        {/* Export/Print Controls */}
        <div className="fixed top-4 right-4 z-50 flex gap-2 no-print">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                onClick={printCalculation}
                disabled={false}
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
        <div className="court-document bg-white shadow-2xl mx-auto my-8 max-w-4xl" ref={pdfRef}>
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
            <div className="court-page cost-breakdown relative z-10 bg-white min-h-[11in] p-16">
              {/* Professional Court Header */}
              <div className="court-header text-center mb-12">
                <div className="mb-6">
                  <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">HOUSING COST DISTRIBUTION CALCULATION</h1>
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

              {/* FINAL DISTRIBUTION SUMMARY */}
              <div className="court-calculation mb-12">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">FINAL DISTRIBUTION SUMMARY</h3>
                  <p className="text-lg font-medium text-slate-700">Statement of Decision Allocation with Adjustments</p>
                </div>

                {/* DISTRIBUTION AMOUNTS */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  {/* Alvero Distribution */}
                  <div className="bg-slate-50 border-2 border-slate-300 p-6 text-center">
                    <h4 className="text-lg font-bold text-slate-800 mb-3">ROSANNA ALVERO</h4>
                    <div className="text-4xl font-black text-slate-900 mb-2">
                      ${calculationResult.summary.rosannaFinalDistribution.toLocaleString()}
                    </div>
                    <p className="text-sm text-slate-600 font-medium">35% SOD Allocation + Net Adjustments</p>
                  </div>

                  {/* Wauters Distribution */}
                  <div className="bg-slate-50 border-2 border-slate-300 p-6 text-center">
                    <h4 className="text-lg font-bold text-slate-800 mb-3">MATHIEU WAUTERS</h4>
                    <div className="text-4xl font-black text-slate-900 mb-2">
                      ${calculationResult.summary.mathieuFinalDistribution.toLocaleString()}
                    </div>
                    <p className="text-sm text-slate-600 font-medium">65% SOD Allocation + Net Adjustments</p>
                  </div>
                </div>
              </div>

              {/* DETAILED CALCULATION BREAKDOWN */}
              <div className="court-calculation mb-12">
                <h3 className="text-xl font-bold text-slate-800 mb-6 text-center">DETAILED CALCULATION BREAKDOWN</h3>

                {/* Calculation Steps */}
                <div className="space-y-6">
                  {calculationResult.reasoningPath.map((step, index) => (
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
                            ${step.amount.toLocaleString()}
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
                      {step.subSteps && step.subSteps.length > 0 && (
                        <div className="ml-6 mt-4">
                          <h6 className="text-sm font-bold text-slate-700 mb-2">SUB-CALCULATIONS:</h6>
                          <div className="space-y-2">
                            {step.subSteps.map((subStep, subIndex) => (
                              <div key={subIndex} className="bg-slate-50 border border-slate-200 rounded p-3 text-sm">
                                <div className="flex justify-between items-center">
                                  <span className="text-slate-700 font-medium">{subStep.stepName}</span>
                                  <span className="font-bold text-slate-800">${subStep.amount.toLocaleString()}</span>
                                </div>
                                {subStep.explanation && (
                                  <p className="text-slate-600 mt-1 text-xs">{subStep.explanation}</p>
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
                    <p><strong>Document Sources:</strong> Final Sellers Closing Statement, Lakeview Mortgage Payoff Statement, Statement of Decision</p>
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

export default memo(HousingCostCalculator);
