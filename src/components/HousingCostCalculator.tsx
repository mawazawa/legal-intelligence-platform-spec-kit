'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import {
  Calculator,
  FileText,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Info,
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
  Key,
  CircleQuestionMark
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

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    finalDistribution: false,
    detailedBreakdown: false,
    closingData: true,
    mortgageBreakdown: true,
    costAllocations: false,
    legalAnalysis: false
  });

  const [negotiableParams, setNegotiableParams] = useState<NegotiableParameters>({
    totalCommissionRate: 0.05, // 5% of sale price
    listingAgentSplit: 0.5, // 50% of total commission
    buyerAgentSplit: 0.5, // 50% of total commission
    agentBrokerSplit: 0.7, // 70% agent, 30% brokerage
    wattsChargesRate: 5000, // $5,000 per month
    exclusivePossessionMonths: 6.7 // months for exclusive possession credit
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
              excerpt: "Rosanna's 35% share plus net adjustments"
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

  const handleClosingDataChange = (field: keyof ClosingData, value: number) => {
    setClosingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleMortgageBreakdownChange = (field: keyof MortgageBreakdown, value: number) => {
    setMortgageBreakdown(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSODAdjustmentsChange = (field: keyof SODAdjustments, value: number) => {
    setSodAdjustments(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const updateNegotiableParam = (param: keyof NegotiableParameters, value: number) => {
    setNegotiableParams(prev => ({
      ...prev,
      [param]: value
    }));
  };

  const adjustParam = (param: keyof NegotiableParameters, delta: number) => {
    setNegotiableParams(prev => ({
      ...prev,
      [param]: Math.max(0, prev[param] + delta)
    }));
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* PRIMARY HEADER - FINAL DISTRIBUTION */}
          <div className="text-center mb-16">
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-16 shadow-2xl border border-slate-200 animate-in fade-in-0 slide-in-from-top-4 duration-700">
              <div className="mb-12">
                <h1 className="text-6xl font-black text-slate-900 mb-6 tracking-tight">Final Distribution</h1>
                <p className="text-2xl font-medium text-slate-700 leading-relaxed">Statement of Decision Allocation with Adjustments</p>
              </div>

              {/* THE TWO BIG NUMBERS - IMMEDIATE VISUAL IMPACT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                {/* Alvero's Cut */}
                <div className="bg-gradient-to-br from-purple-50 via-purple-100 to-purple-200 rounded-3xl p-10 border-2 border-purple-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-left-4 duration-500 delay-200">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-purple-900 mb-6 tracking-wide">Alvero</h2>
                    <div className="text-8xl font-black text-purple-900 mb-4 tracking-tight drop-shadow-sm">
                      ${calculationResult.summary.rosannaFinalDistribution.toLocaleString()}
                    </div>
                    <p className="text-xl text-purple-800 font-bold tracking-wide">35% SOD + Adjustments</p>
                  </div>
                </div>

                {/* Wauters' Cut */}
                <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-3xl p-10 border-2 border-blue-300 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 animate-in fade-in-0 slide-in-from-right-4 duration-500 delay-300">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-blue-900 mb-6 tracking-wide">Wauters</h2>
                    <div className="text-8xl font-black text-blue-900 mb-4 tracking-tight drop-shadow-sm">
                      ${calculationResult.summary.mathieuFinalDistribution.toLocaleString()}
                    </div>
                    <p className="text-xl text-blue-800 font-bold tracking-wide">65% SOD + Adjustments</p>
                  </div>
                </div>
              </div>

              {/* Click to Expand Reasoning */}
              <div
                className="cursor-pointer transition-all duration-300 hover:scale-105 bg-gradient-to-r from-slate-100 to-slate-200 rounded-2xl p-8 border-2 border-slate-400 shadow-md hover:shadow-lg"
                onClick={() => toggleSection('finalDistribution')}
              >
                <div className="flex items-center justify-center gap-4 text-xl text-slate-800">
                  <span className="font-bold tracking-wide">View Calculation Breakdown</span>
                  {expandedSections.finalDistribution ?
                    <ChevronDown className="h-7 w-7" /> :
                    <ChevronRight className="h-7 w-7" />
                  }
                </div>
                <p className="text-base text-slate-600 mt-3 font-medium">Click to see step-by-step reasoning with document sources</p>
              </div>

              {/* Expanded Reasoning Path */}
              {expandedSections.finalDistribution && (
                <div className="mt-8 p-8 bg-slate-50 rounded-2xl border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 text-center">Step-by-Step Calculation</h3>
                  
                  {/* Reasoning Path Steps */}
                  <div className="space-y-4">
                    {calculationResult.reasoningPath.map((step, index) => (
                      <div key={index} className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                              <span className="text-lg font-bold text-blue-600">{step.stepNumber}</span>
                            </div>
                            <div>
                              <h4 className="text-lg font-semibold text-slate-800">{step.stepName}</h4>
                              <p className="text-sm text-slate-600">{step.explanation}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-slate-800">
                              ${step.amount.toLocaleString()}
                            </div>
                            {step.formula && (
                              <div className="text-xs text-slate-500 mt-1 font-mono">
                                {step.formula}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Document Sources */}
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-slate-700 mb-2">Sources:</h5>
                          <div className="flex flex-wrap gap-2">
                            {step.sources.map((source, sourceIndex) => (
                              <div key={sourceIndex} className="bg-slate-100 rounded-lg px-3 py-2 text-xs">
                                <div className="font-semibold text-slate-700">{source.documentName}</div>
                                <div className="text-slate-500">{source.documentDate}</div>
                                {source.sectionName && (
                                  <div className="text-slate-500">{source.sectionName}</div>
                                )}
                                {source.excerpt && (
                                  <div className="text-slate-600 mt-1 italic">"{source.excerpt}"</div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Sub-steps */}
                        {step.subSteps && step.subSteps.length > 0 && (
                          <div className="ml-6 space-y-2">
                            <h6 className="text-sm font-semibold text-slate-700">Breakdown:</h6>
                            {step.subSteps.map((subStep, subIndex) => (
                              <div key={subIndex} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <span className="text-sm font-medium text-slate-700 mr-2">
                                      {subStep.stepNumber}
                                    </span>
                                    <span className="text-sm text-slate-600">{subStep.stepName}</span>
                                  </div>
                                  <span className="text-lg font-bold text-slate-800">
                                    ${subStep.amount.toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">{subStep.explanation}</p>
                                {subStep.sources && subStep.sources.length > 0 && (
                                  <div className="mt-2">
                                    <div className="text-xs font-semibold text-slate-600">Source:</div>
                                    <div className="text-xs text-slate-500">
                                      {subStep.sources[0].documentName} - {subStep.sources[0].excerpt}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                </div>
              )}
            </div>
          </div>

          {/* Visual Separator */}
          <hr className="my-8 border-t border-slate-200" />

          {/* Main Calculator Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Input Panel */}
            <div className="space-y-8">
              {/* Closing Data Input */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg cursor-pointer"
                  onClick={() => toggleSection('closingData')}
                >
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Banknote className="h-6 w-6 mr-3" />
                      Closing Statement Data
                    </div>
                    {expandedSections.closingData ?
                      <ChevronDown className="h-6 w-6" /> :
                      <ChevronRight className="h-6 w-6" />
                    }
                  </CardTitle>
                  <p className="text-blue-100 text-sm">Source: Final Sellers Closing Statement (05/30/2025)</p>
                </CardHeader>
                {expandedSections.closingData && (
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Sale Price */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="salePrice" className="text-base font-semibold text-slate-700">
                            Sale Price
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">The total sale price of the property at 3525 8th Avenue.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Input
                            id="salePrice"
                            type="number"
                            value={closingData.salePrice}
                            onChange={(e) => handleClosingDataChange('salePrice', parseFloat(e.target.value) || 0)}
                            className="pl-10 text-xl font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-14"
                          />
                          <DollarSign className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">Source: Final Sellers Closing Statement</p>
                      </div>

                      {/* Lender Payoff */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="lenderPayoff" className="text-base font-semibold text-slate-700">
                            Lender Payoff
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Total amount paid to Mr. Cooper for Lakeview Loan Servicing, LLC.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Input
                            id="lenderPayoff"
                            type="number"
                            value={closingData.lenderPayoff}
                            onChange={(e) => handleClosingDataChange('lenderPayoff', parseFloat(e.target.value) || 0)}
                            className="pl-10 text-xl font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-14"
                          />
                          <CreditCard className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">Source: Final Sellers Closing Statement - Payoffs/Payments</p>
                      </div>

                      {/* Net Proceeds */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="netProceeds" className="text-base font-semibold text-slate-700">
                            Net Proceeds to Sellers
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Amount due to sellers after all deductions.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Input
                            id="netProceeds"
                            type="number"
                            value={closingData.netProceeds}
                            onChange={(e) => handleClosingDataChange('netProceeds', parseFloat(e.target.value) || 0)}
                            className="pl-10 text-xl font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-14"
                          />
                          <Banknote className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">Source: Final Sellers Closing Statement</p>
                      </div>

                      {/* Rosanna's Withholding */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="rosannaWithholding" className="text-base font-semibold text-slate-700">
                            Rosanna's FTB Withholding
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Real Estate Withholding 593 sent to Franchise Tax Board.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Input
                            id="rosannaWithholding"
                            type="number"
                            value={closingData.rosannaWithholding}
                            onChange={(e) => handleClosingDataChange('rosannaWithholding', parseFloat(e.target.value) || 0)}
                            className="pl-10 text-xl font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-14"
                          />
                          <Landmark className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">Source: Final Sellers Closing Statement - Real Estate Withholding 593</p>
                      </div>

                      {/* Mathieu's Tax Obligation */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="mathieuTaxObligation" className="text-base font-semibold text-slate-700">
                            Mathieu's Estimated Tax Obligation
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">User-provided estimate of tax liability from the sale.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Input
                            id="mathieuTaxObligation"
                            type="number"
                            value={closingData.mathieuTaxObligation}
                            onChange={(e) => handleClosingDataChange('mathieuTaxObligation', parseFloat(e.target.value) || 0)}
                            className="pl-10 text-xl font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-14"
                          />
                          <FileText className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">Source: User Input</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Mortgage Breakdown Input */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg cursor-pointer"
                  onClick={() => toggleSection('mortgageBreakdown')}
                >
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Calculator className="h-6 w-6 mr-3" />
                      Lender Payoff Breakdown
                    </div>
                    {expandedSections.mortgageBreakdown ?
                      <ChevronDown className="h-6 w-6" /> :
                      <ChevronRight className="h-6 w-6" />
                    }
                  </CardTitle>
                  <p className="text-green-100 text-sm">Source: Final Sellers Closing Statement - Lender Payoff Details</p>
                </CardHeader>
                {expandedSections.mortgageBreakdown && (
                  <CardContent className="p-8 space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                      {/* Principal */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="principal" className="text-base font-semibold text-slate-700">
                            Principal Balance
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Outstanding principal balance on the loan.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Input
                            id="principal"
                            type="number"
                            value={mortgageBreakdown.principal}
                            onChange={(e) => handleMortgageBreakdownChange('principal', parseFloat(e.target.value) || 0)}
                            className="pl-10 text-xl font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-14"
                          />
                          <DollarSign className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">Source: Final Sellers Closing Statement</p>
                      </div>

                      {/* Interest */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="interest" className="text-base font-semibold text-slate-700">
                            Interest & Additional Interest
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Interest to 6/1/2025 plus additional interest for 6/1-6/2.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Input
                            id="interest"
                            type="number"
                            value={mortgageBreakdown.interest}
                            onChange={(e) => handleMortgageBreakdownChange('interest', parseFloat(e.target.value) || 0)}
                            className="pl-10 text-xl font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-14"
                          />
                          <TrendingUp className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">Source: Final Sellers Closing Statement</p>
                      </div>

                      {/* Escrow Advances */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="escrowAdvances" className="text-base font-semibold text-slate-700">
                            Escrow Advances
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Escrow advances made by the lender.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Input
                            id="escrowAdvances"
                            type="number"
                            value={mortgageBreakdown.escrowAdvances}
                            onChange={(e) => handleMortgageBreakdownChange('escrowAdvances', parseFloat(e.target.value) || 0)}
                            className="pl-10 text-xl font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-14"
                          />
                          <Receipt className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">Source: Final Sellers Closing Statement</p>
                      </div>

                      {/* Late Fees */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="lateFees" className="text-base font-semibold text-slate-700">
                            Late Fees & Administrative Costs
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Deferred late fees, check fees, and other administrative costs.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Input
                            id="lateFees"
                            type="number"
                            value={mortgageBreakdown.lateFees + mortgageBreakdown.checkFees + mortgageBreakdown.otherFees + mortgageBreakdown.recordingFees + mortgageBreakdown.reconveyanceFee}
                            onChange={(e) => {
                              const total = parseFloat(e.target.value) || 0;
                              const currentTotal = mortgageBreakdown.lateFees + mortgageBreakdown.checkFees + mortgageBreakdown.otherFees + mortgageBreakdown.recordingFees + mortgageBreakdown.reconveyanceFee;
                              const difference = total - currentTotal;
                              handleMortgageBreakdownChange('lateFees', mortgageBreakdown.lateFees + difference);
                            }}
                            className="pl-10 text-xl font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-14"
                          />
                          <AlertTriangle className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">Source: Final Sellers Closing Statement</p>
                      </div>

                      {/* Lender Paid Expenses */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="lenderPaidExpenses" className="text-base font-semibold text-slate-700">
                            Lender Paid Expenses & Legal Fees
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">Lender paid expenses and legal fees.</p>
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <div className="relative">
                          <Input
                            id="lenderPaidExpenses"
                            type="number"
                            value={mortgageBreakdown.lenderPaidExpenses + mortgageBreakdown.legalFees}
                            onChange={(e) => {
                              const total = parseFloat(e.target.value) || 0;
                              const currentTotal = mortgageBreakdown.lenderPaidExpenses + mortgageBreakdown.legalFees;
                              const difference = total - currentTotal;
                              handleMortgageBreakdownChange('lenderPaidExpenses', mortgageBreakdown.lenderPaidExpenses + difference);
                            }}
                            className="pl-10 text-xl font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500 h-14"
                          />
                          <CreditCard className="absolute left-4 top-4 h-6 w-6 text-slate-400" />
                        </div>
                        <p className="text-sm text-slate-500">Source: Final Sellers Closing Statement</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            </div>

            {/* Results Panel */}
            <div className="space-y-8">
              {/* Fair Allocation Results */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <Users className="h-6 w-6 mr-3" />
                    Fair Allocation Results
                  </CardTitle>
                  <p className="text-green-100 text-sm">Equal division methodology (50/50)</p>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Total Lender Payoff */}
                  <div className="text-center p-8 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <p className="text-base text-slate-600">Total Lender Payoff</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Total amount paid to lender from Final Sellers Closing Statement.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <p className="text-5xl font-black text-slate-800">
                      ${calculationResult.summary.totalLenderPayoff.toLocaleString()}
                    </p>
                  </div>

                  {/* Individual Allocations */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-center mb-3">
                        <Users className="h-5 w-5 text-blue-600 mr-2" />
                        <p className="text-base font-semibold text-blue-800">Mathieu Wauters</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-blue-400 cursor-help ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">50% of the lender payoff amount - equal responsibility for community debt.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                             <p className="text-4xl font-black text-blue-900">
                               ${calculationResult.summary.mathieuFinalDistribution.toLocaleString()}
                             </p>
                      <Badge variant="outline" className="mt-3 text-sm px-4 py-2">50% Equal Responsibility</Badge>
                    </div>

                    <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center justify-center mb-3">
                        <Users className="h-5 w-5 text-green-600 mr-2" />
                        <p className="text-base font-semibold text-green-800">Rosanna Alvero</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-green-400 cursor-help ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">50% of the lender payoff amount - equal responsibility for community debt.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                             <p className="text-4xl font-black text-green-900">
                               ${calculationResult.summary.rosannaFinalDistribution.toLocaleString()}
                             </p>
                      <Badge variant="outline" className="mt-3 text-sm px-4 py-2">50% Equal Responsibility</Badge>
                    </div>
                  </div>

                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <AlertDescription className="text-orange-800 text-base">
                      <strong>SOD Net Adjustment:</strong> ${calculationResult.summary.netAdjustment.toLocaleString()} - This represents the net amount owed between parties after SOD adjustments.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>

              {/* Final Net Distribution */}
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-t-lg">
                  <CardTitle className="flex items-center">
                    <DollarSign className="h-6 w-6 mr-3" />
                    Final Net Distribution
                  </CardTitle>
                  <p className="text-gray-100 text-sm">After tax obligations from net proceeds</p>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                  {/* Net Proceeds After Taxes */}
                  <div className="text-center p-8 bg-slate-50 rounded-xl">
                    <div className="flex items-center justify-center gap-2 mb-3">
                      <p className="text-base text-slate-600">Net Proceeds After Tax Obligations</p>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <HelpCircle className="h-5 w-5 text-slate-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs">Net proceeds minus both parties' tax obligations.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                           <p className="text-5xl font-black text-slate-800">
                             ${calculationResult.summary.netProceedsBeforeSOD.toLocaleString()}
                           </p>
                  </div>

                  {/* Individual Final Distributions */}
                  <div className="grid grid-cols-1 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-center mb-3">
                        <Users className="h-5 w-5 text-blue-600 mr-2" />
                        <p className="text-base font-semibold text-blue-800">Mathieu Wauters</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-blue-400 cursor-help ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">50% of the Net Proceeds After Tax Obligations.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-4xl font-black text-blue-900">
                        ${calculationResult.summary.mathieuFinalDistribution.toLocaleString()}
                      </p>
                      <Badge variant="outline" className="mt-3 text-sm px-4 py-2">50% of Net After Taxes</Badge>
                    </div>

                    <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center justify-center mb-3">
                        <Users className="h-5 w-5 text-green-600 mr-2" />
                        <p className="text-base font-semibold text-green-800">Rosanna Alvero</p>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <HelpCircle className="h-4 w-4 text-green-400 cursor-help ml-2" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">50% of the Net Proceeds After Tax Obligations.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-4xl font-black text-green-900">
                        ${calculationResult.summary.rosannaFinalDistribution.toLocaleString()}
                      </p>
                      <Badge variant="outline" className="mt-3 text-sm px-4 py-2">50% of Net After Taxes</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Visual Separator */}
          <hr className="my-8 border-t border-slate-200" />

          {/* Enhanced Detailed Breakdown */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader
              className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg cursor-pointer"
              onClick={() => toggleSection('costAllocations')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calculator className="h-6 w-6 mr-3" />
                  Interactive Cost Breakdown
                </div>
                {expandedSections.costAllocations ?
                  <ChevronDown className="h-6 w-6" /> :
                  <ChevronRight className="h-6 w-6" />
                }
              </CardTitle>
              <p className="text-slate-200 text-sm">Click to expand with interactive negotiation controls</p>
            </CardHeader>
            {expandedSections.costAllocations && (
              <CardContent className="p-8">
                <div className="space-y-8">
                  {/* Realtor Commission Breakdown */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center mb-6">
                      <Building className="h-6 w-6 text-blue-600 mr-3" />
                      <h3 className="text-xl font-bold text-blue-800">Real Estate Commission Breakdown</h3>
                    </div>
                    
                    {/* Commission Rate Control */}
                    <div className="mb-6 p-4 bg-white rounded-xl border border-blue-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Percent className="h-5 w-5 text-blue-600 mr-2" />
                          <span className="font-semibold text-blue-800">Total Commission Rate</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustParam('totalCommissionRate', -0.001)}
                            className="h-10 w-10 p-0 bg-blue-50 hover:bg-blue-100 border-blue-300 hover:border-blue-400 transition-all duration-200 hover:scale-110"
                          >
                            <ArrowDown className="h-5 w-5 text-blue-700" />
                          </Button>
                          <span className="text-3xl font-black text-blue-900 min-w-[100px] text-center tracking-tight">
                            {(negotiableParams.totalCommissionRate * 100).toFixed(1)}%
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustParam('totalCommissionRate', 0.001)}
                            className="h-10 w-10 p-0 bg-blue-50 hover:bg-blue-100 border-blue-300 hover:border-blue-400 transition-all duration-200 hover:scale-110"
                          >
                            <ArrowUp className="h-5 w-5 text-blue-700" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-blue-600">
                        Total Commission: ${(closingData.salePrice * negotiableParams.totalCommissionRate).toLocaleString()}
                      </p>
                    </div>

                    {/* Realtor Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {realtorInfo.map((realtor, index) => {
                        const totalCommission = closingData.salePrice * negotiableParams.totalCommissionRate;
                        const realtorShare = totalCommission * (realtor.role === 'listing' ? negotiableParams.listingAgentSplit : negotiableParams.buyerAgentSplit);
                        const agentAmount = realtorShare * negotiableParams.agentBrokerSplit;
                        const brokerageAmount = realtorShare * (1 - negotiableParams.agentBrokerSplit);
                        
                        return (
                          <div key={index} className="bg-white rounded-xl p-4 border border-blue-200">
                            <div className="flex items-center mb-3">
                              <User className="h-5 w-5 text-blue-600 mr-2" />
                              <div>
                                <h4 className="font-semibold text-blue-800">{realtor.name}</h4>
                                <p className="text-sm text-blue-600">{realtor.brokerage}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Total Share:</span>
                                <span className="font-bold text-blue-900">${realtorShare.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Agent Portion:</span>
                                <span className="font-semibold text-green-700">${agentAmount.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-sm text-slate-600">Brokerage Portion:</span>
                                <span className="font-semibold text-purple-700">${brokerageAmount.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Watts Charges Breakdown */}
                  <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 border border-red-200">
                    <div className="flex items-center mb-6">
                      <Home className="h-6 w-6 text-red-600 mr-3" />
                      <h3 className="text-xl font-bold text-red-800">Watts Charges (Exclusive Possession)</h3>
                    </div>
                    
                    {/* Watts Rate Control */}
                    <div className="mb-6 p-4 bg-white rounded-xl border border-red-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <DollarSign className="h-5 w-5 text-red-600 mr-2" />
                          <span className="font-semibold text-red-800">Monthly Rate</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustParam('wattsChargesRate', -100)}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <span className="text-2xl font-bold text-red-900 min-w-[100px] text-center">
                            ${negotiableParams.wattsChargesRate.toLocaleString()}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustParam('wattsChargesRate', 100)}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-red-600">
                        Total Watts Charges: ${(negotiableParams.wattsChargesRate * 32.5).toLocaleString()} (32.5 months)
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-red-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                          <span className="font-semibold text-red-800">Mathieu Owes Rosanna</span>
                        </div>
                        <span className="text-2xl font-bold text-red-900">
                          ${(negotiableParams.wattsChargesRate * 32.5).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-red-600">
                        Jan 2021-Sept 2023: $46,200 + Oct 2023-May 2025: $2,440 = $48,640
                      </p>
                    </div>
                  </div>

                  {/* Exclusive Possession Credit */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center mb-6">
                      <Calendar className="h-6 w-6 text-green-600 mr-3" />
                      <h3 className="text-xl font-bold text-green-800">Exclusive Possession Credit</h3>
                    </div>
                    
                    {/* Months Control */}
                    <div className="mb-6 p-4 bg-white rounded-xl border border-green-200">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          <Calendar className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-semibold text-green-800">Months in Home</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustParam('exclusivePossessionMonths', -0.1)}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <span className="text-2xl font-bold text-green-900 min-w-[80px] text-center">
                            {negotiableParams.exclusivePossessionMonths.toFixed(1)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => adjustParam('exclusivePossessionMonths', 0.1)}
                            className="h-8 w-8 p-0"
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-green-600">
                        Credit: ${(negotiableParams.exclusivePossessionMonths * 5000 * 0.65).toLocaleString()} (65% of $5,000/month)
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-green-200">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                          <span className="font-semibold text-green-800">Rosanna Owes Mathieu</span>
                        </div>
                        <span className="text-2xl font-bold text-green-900">
                          ${(negotiableParams.exclusivePossessionMonths * 5000 * 0.65).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-sm text-green-600">
                        Equal treatment under Watts doctrine - Rosanna's exclusive possession credit
                      </p>
                    </div>
                  </div>

                  {/* Other SOD Adjustments */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Rental Income */}
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                      <div className="flex items-center mb-3">
                        <Receipt className="h-5 w-5 text-blue-600 mr-2" />
                        <span className="font-semibold text-blue-800">Rental Income Share</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-blue-900">${sodAdjustments.rentalIncomeShare.toLocaleString()}</span>
                        <p className="text-sm text-blue-600">Rosanna's 35% share</p>
                      </div>
                    </div>

                    {/* Motorcycle */}
                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                      <div className="flex items-center mb-3">
                        <CreditCard className="h-5 w-5 text-green-600 mr-2" />
                        <span className="font-semibold text-green-800">Motorcycle Share</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-green-900">${sodAdjustments.motorcycleShare.toLocaleString()}</span>
                        <p className="text-sm text-green-600">Rosanna's share of Ural</p>
                      </div>
                    </div>

                    {/* Furniture */}
                    <div className="bg-orange-50 rounded-xl p-4 border border-orange-200">
                      <div className="flex items-center mb-3">
                        <FileCheck className="h-5 w-5 text-orange-600 mr-2" />
                        <span className="font-semibold text-orange-800">Furniture Share</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-orange-900">${sodAdjustments.furnitureShare.toLocaleString()}</span>
                        <p className="text-sm text-orange-600">Disputed - Rosanna's share</p>
                      </div>
                    </div>

                    {/* Furniture Correction */}
                    <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-200">
                      <div className="flex items-center mb-3">
                        <Users className="h-5 w-5 text-indigo-600 mr-2" />
                        <span className="font-semibold text-indigo-800">Furniture Correction</span>
                      </div>
                      <div className="text-right">
                        <span className="text-xl font-bold text-indigo-900">${sodAdjustments.furnitureCorrection.toLocaleString()}</span>
                        <p className="text-sm text-indigo-600">$15,000 swing credit</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Visual Separator */}
          <hr className="my-8 border-t border-slate-200" />

          {/* Legal Analysis Section */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader
              className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-t-lg cursor-pointer"
              onClick={() => toggleSection('legalAnalysis')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Scale className="h-6 w-6 mr-3" />
                  Legal Analysis & Citations
                </div>
                {expandedSections.legalAnalysis ?
                  <ChevronDown className="h-6 w-6" /> :
                  <ChevronRight className="h-6 w-6" />
                }
              </CardTitle>
              <p className="text-indigo-200 text-sm">Click to expand legal basis and citations</p>
            </CardHeader>
            {expandedSections.legalAnalysis && (
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <Building className="h-5 w-5 text-blue-600 mr-2" />
                        <h3 className="font-semibold text-blue-900">Equal Division of Community Property</h3>
                      </div>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        California Family Code § 2550 mandates equal division of community property. The lender payoff of $759,364.32 represents a community debt that should be divided equally between both parties.
                      </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <Receipt className="h-5 w-5 text-green-600 mr-2" />
                        <h3 className="font-semibold text-green-900">Property Tax Obligations</h3>
                      </div>
                      <p className="text-sm text-green-800 leading-relaxed">
                        Revenue and Taxation Code § 2187 establishes joint liability for property taxes. Escrow advances of $38,924.96 represent community property tax obligations.
                      </p>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                        <h3 className="font-semibold text-orange-900">Administrative Costs</h3>
                      </div>
                      <p className="text-sm text-orange-800 leading-relaxed">
                        California Civil Code § 1717 establishes joint and several liability for contract damages. Late fees and administrative costs totaling $657.80 are community obligations.
                      </p>
                    </div>

                    <div className="bg-red-50 border border-red-200 rounded-xl p-6">
                      <div className="flex items-center mb-4">
                        <CreditCard className="h-5 w-5 text-red-600 mr-2" />
                        <h3 className="font-semibold text-red-900">Foreclosure-Related Expenses</h3>
                      </div>
                      <p className="text-sm text-red-800 leading-relaxed">
                        Lender paid expenses and legal fees totaling $5,694.71 represent foreclosure-related costs that are community obligations under Family Code § 2550.
                      </p>
                    </div>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-xl p-6 mt-6">
                    <div className="flex items-center mb-4">
                      <Landmark className="h-5 w-5 text-purple-600 mr-2" />
                      <h3 className="font-semibold text-purple-900">Tax Withholding from Community Asset</h3>
                    </div>
                    <p className="text-sm text-purple-800 leading-relaxed">
                      Tax liabilities arising from the sale of a community property asset are community debts. Both parties' tax obligations should be settled from the sale proceeds before the final, equal division of the remaining net proceeds.
                    </p>
                  </div>

                  <Alert className="border-emerald-200 bg-emerald-50 mt-6">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <AlertDescription className="text-emerald-800 text-base">
                      <strong>Legal Conclusion:</strong> The lender payoff amount of $759,364.32, along with both parties' tax obligations, should be paid from the gross sale proceeds. The remaining net proceeds of $280,355.83 should then be divided equally after accounting for tax obligations.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            )}
          </Card>

          {/* Footer */}
          <div className="text-center mt-8 p-8 bg-white/50 rounded-xl">
            <p className="text-slate-600 text-base">
              This calculator provides a comprehensive analysis for FL-320 declaration purposes. All calculations are based on the Final Sellers Closing Statement dated 05/30/2025.
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default HousingCostCalculator;