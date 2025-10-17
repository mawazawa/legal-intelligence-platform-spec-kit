'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

interface CalculationResult {
  closingData: ClosingData;
  mortgageBreakdown: MortgageBreakdown;
  costAllocations: CostAllocation[];
  summary: {
    totalSalePrice: number;
    totalLenderPayoff: number;
    mathieuTotalResponsibility: number;
    rosannaTotalResponsibility: number;
    netProceedsAfterTaxes: number;
    mathieuFinalDistribution: number;
    rosannaFinalDistribution: number;
    disputedAmount: number;
    rosannaWithholding: number;
    mathieuTaxObligation: number;
  };
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

  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    finalDistribution: false,
    detailedBreakdown: false,
    closingData: true,
    mortgageBreakdown: true,
    costAllocations: false,
    legalAnalysis: false
  });

  const calculationResult = useMemo((): CalculationResult => {
    const costAllocations: CostAllocation[] = [
      {
        category: "Principal Balance",
        totalAmount: mortgageBreakdown.principal,
        mathieuShare: mortgageBreakdown.principal / 2,
        rosannaShare: mortgageBreakdown.principal / 2,
        justification: "Equal responsibility for principal repayment",
        legalBasis: "Family Code § 2550 - Equal division of community property",
        source: "Final Sellers Closing Statement - Lender Payoff Breakdown",
        icon: <DollarSign className="h-5 w-5" />,
        color: "bg-blue-50 border-blue-200 text-blue-800"
      },
      {
        category: "Interest & Additional Interest",
        totalAmount: mortgageBreakdown.interest,
        mathieuShare: mortgageBreakdown.interest / 2,
        rosannaShare: mortgageBreakdown.interest / 2,
        justification: "Equal responsibility for interest on community debt",
        legalBasis: "Family Code § 2550 - Equal division of community property",
        source: "Final Sellers Closing Statement - Interest to 6/1/2025 + Additional Interest",
        icon: <TrendingUp className="h-5 w-5" />,
        color: "bg-green-50 border-green-200 text-green-800"
      },
      {
        category: "Escrow Advances",
        totalAmount: mortgageBreakdown.escrowAdvances,
        mathieuShare: mortgageBreakdown.escrowAdvances / 2,
        rosannaShare: mortgageBreakdown.escrowAdvances / 2,
        justification: "Equal responsibility for escrow advances",
        legalBasis: "Revenue and Taxation Code § 2187 - Community property tax obligations",
        source: "Final Sellers Closing Statement - Escrow Advances",
        icon: <Receipt className="h-5 w-5" />,
        color: "bg-purple-50 border-purple-200 text-purple-800"
      },
      {
        category: "Late Fees & Administrative Costs",
        totalAmount: mortgageBreakdown.lateFees + mortgageBreakdown.checkFees + mortgageBreakdown.otherFees + mortgageBreakdown.recordingFees + mortgageBreakdown.reconveyanceFee,
        mathieuShare: (mortgageBreakdown.lateFees + mortgageBreakdown.checkFees + mortgageBreakdown.otherFees + mortgageBreakdown.recordingFees + mortgageBreakdown.reconveyanceFee) / 2,
        rosannaShare: (mortgageBreakdown.lateFees + mortgageBreakdown.checkFees + mortgageBreakdown.otherFees + mortgageBreakdown.recordingFees + mortgageBreakdown.reconveyanceFee) / 2,
        justification: "Equal responsibility for administrative costs",
        legalBasis: "Family Code § 2550 - Equal division of community property",
        source: "Final Sellers Closing Statement - Various Fees",
        icon: <AlertTriangle className="h-5 w-5" />,
        color: "bg-orange-50 border-orange-200 text-orange-800"
      },
      {
        category: "Lender Paid Expenses & Legal Fees",
        totalAmount: mortgageBreakdown.lenderPaidExpenses + mortgageBreakdown.legalFees,
        mathieuShare: (mortgageBreakdown.lenderPaidExpenses + mortgageBreakdown.legalFees) / 2,
        rosannaShare: (mortgageBreakdown.lenderPaidExpenses + mortgageBreakdown.legalFees) / 2,
        justification: "Equal responsibility for foreclosure-related expenses",
        legalBasis: "Family Code § 2550 - Equal division of community property",
        source: "Final Sellers Closing Statement - Lender Paid Expenses & Legal Fees",
        icon: <CreditCard className="h-5 w-5" />,
        color: "bg-red-50 border-red-200 text-red-800"
      }
    ];

    const mathieuTotal = costAllocations.reduce((sum, item) => sum + item.mathieuShare, 0);
    const rosannaTotal = costAllocations.reduce((sum, item) => sum + item.rosannaShare, 0);

    // Calculate net proceeds after tax obligations
    const netProceedsAfterTaxes = closingData.netProceeds - closingData.rosannaWithholding - closingData.mathieuTaxObligation;
    const mathieuFinalDistribution = netProceedsAfterTaxes / 2;
    const rosannaFinalDistribution = netProceedsAfterTaxes / 2;

    return {
      closingData,
      mortgageBreakdown,
      costAllocations,
      summary: {
        totalSalePrice: closingData.salePrice,
        totalLenderPayoff: closingData.lenderPayoff,
        mathieuTotalResponsibility: mathieuTotal,
        rosannaTotalResponsibility: rosannaTotal,
        netProceedsAfterTaxes: netProceedsAfterTaxes,
        mathieuFinalDistribution: mathieuFinalDistribution,
        rosannaFinalDistribution: rosannaFinalDistribution,
        disputedAmount: closingData.lenderPayoff - (mathieuTotal + rosannaTotal),
        rosannaWithholding: closingData.rosannaWithholding,
        mathieuTaxObligation: closingData.mathieuTaxObligation,
      }
    };
  }, [closingData, mortgageBreakdown]);

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

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          {/* Final Distribution Header - THE MAIN FOCUS */}
          <div className="text-center mb-12">
            <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-12 shadow-2xl border border-slate-200">
              <div className="mb-6">
                <h1 className="text-4xl font-bold text-slate-700 mb-2">Proposed Final Distribution</h1>
                <p className="text-lg text-slate-600">After mortgage payoff and tax obligations</p>
              </div>
              
              {/* The Big Number - Clickable */}
              <div 
                className="cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => toggleSection('finalDistribution')}
              >
                <div className="text-8xl font-black text-blue-600 mb-4">
                  ${calculationResult.summary.mathieuFinalDistribution.toLocaleString()}
                </div>
                <div className="flex items-center justify-center gap-2 text-xl text-slate-600">
                  <span>Each party receives</span>
                  {expandedSections.finalDistribution ? 
                    <ChevronDown className="h-6 w-6" /> : 
                    <ChevronRight className="h-6 w-6" />
                  }
                </div>
                <p className="text-sm text-slate-500 mt-2">Click to expand calculation breakdown</p>
              </div>

              {/* Expanded Breakdown */}
              {expandedSections.finalDistribution && (
                <div className="mt-8 p-8 bg-slate-50 rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {/* Starting Point */}
                    <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-200">
                      <div className="flex items-center justify-center mb-3">
                        <Banknote className="h-5 w-5 text-blue-600 mr-2" />
                        <p className="text-sm font-semibold text-blue-800">Net Proceeds</p>
                      </div>
                      <p className="text-3xl font-bold text-blue-900">
                        ${calculationResult.summary.netProceedsAfterTaxes.toLocaleString()}
                      </p>
                      <p className="text-xs text-blue-600 mt-2">From Final Sellers Closing Statement</p>
                    </div>

                    {/* Mathieu's Share */}
                    <div className="text-center p-6 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center justify-center mb-3">
                        <Users className="h-5 w-5 text-green-600 mr-2" />
                        <p className="text-sm font-semibold text-green-800">Mathieu Wauters</p>
                      </div>
                      <p className="text-3xl font-bold text-green-900">
                        ${calculationResult.summary.mathieuFinalDistribution.toLocaleString()}
                      </p>
                      <p className="text-xs text-green-600 mt-2">50% Equal Share</p>
                    </div>

                    {/* Rosanna's Share */}
                    <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-200">
                      <div className="flex items-center justify-center mb-3">
                        <Users className="h-5 w-5 text-purple-600 mr-2" />
                        <p className="text-sm font-semibold text-purple-800">Rosanna Alvero</p>
                      </div>
                      <p className="text-3xl font-bold text-purple-900">
                        ${calculationResult.summary.rosannaFinalDistribution.toLocaleString()}
                      </p>
                      <p className="text-xs text-purple-600 mt-2">50% Equal Share</p>
                    </div>
                  </div>

                  {/* Detailed Calculation Steps */}
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-slate-800 mb-4">Calculation Steps</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Step 1: Sale Price */}
                      <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-bold text-blue-600">1</span>
                            </div>
                            <span className="font-medium text-slate-700">Sale Price</span>
                          </div>
                          <span className="text-lg font-bold text-slate-800">
                            ${calculationResult.summary.totalSalePrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Step 2: Lender Payoff */}
                      <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-bold text-red-600">2</span>
                            </div>
                            <span className="font-medium text-slate-700">Lender Payoff</span>
                          </div>
                          <span className="text-lg font-bold text-slate-800">
                            -${calculationResult.summary.totalLenderPayoff.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Step 3: Tax Obligations */}
                      <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-bold text-orange-600">3</span>
                            </div>
                            <span className="font-medium text-slate-700">Tax Obligations</span>
                          </div>
                          <span className="text-lg font-bold text-slate-800">
                            -${(calculationResult.summary.rosannaWithholding + calculationResult.summary.mathieuTaxObligation).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Step 4: Net Proceeds */}
                      <div className="p-4 bg-white rounded-lg border border-slate-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                              <span className="text-sm font-bold text-green-600">4</span>
                            </div>
                            <span className="font-medium text-slate-700">Net Proceeds</span>
                          </div>
                          <span className="text-lg font-bold text-slate-800">
                            ${calculationResult.summary.netProceedsAfterTaxes.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Detailed Breakdown */}
                    <div className="mt-6">
                      <button
                        onClick={() => toggleSection('detailedBreakdown')}
                        className="w-full p-4 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors duration-200 flex items-center justify-between"
                      >
                        <span className="font-medium text-slate-700">View Detailed Breakdown</span>
                        {expandedSections.detailedBreakdown ? 
                          <ChevronDown className="h-5 w-5 text-slate-500" /> : 
                          <ChevronRight className="h-5 w-5 text-slate-500" />
                        }
                      </button>
                      
                      {expandedSections.detailedBreakdown && (
                        <div className="mt-4 p-6 bg-white rounded-lg border border-slate-200">
                          <h4 className="text-lg font-semibold text-slate-800 mb-4">Lender Payoff Breakdown</h4>
                          <div className="space-y-3">
                            {calculationResult.costAllocations.map((item, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <div className="flex items-center">
                                  {item.icon}
                                  <span className="ml-3 font-medium text-slate-700">{item.category}</span>
                                </div>
                                <div className="text-right">
                                  <div className="text-sm font-bold text-slate-800">
                                    ${item.totalAmount.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-slate-500">
                                    ${item.mathieuShare.toLocaleString()} each
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
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
                        ${calculationResult.summary.mathieuTotalResponsibility.toLocaleString()}
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
                        ${calculationResult.summary.rosannaTotalResponsibility.toLocaleString()}
                      </p>
                      <Badge variant="outline" className="mt-3 text-sm px-4 py-2">50% Equal Responsibility</Badge>
                    </div>
                  </div>

                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <AlertDescription className="text-orange-800 text-base">
                      <strong>Disputed Amount:</strong> ${calculationResult.summary.disputedAmount.toLocaleString()} - This represents the difference between total lender payoff and fair allocation.
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
                      ${calculationResult.summary.netProceedsAfterTaxes.toLocaleString()}
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

          {/* Detailed Cost Breakdown */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-8">
            <CardHeader
              className="bg-gradient-to-r from-slate-600 to-slate-700 text-white rounded-t-lg cursor-pointer"
              onClick={() => toggleSection('costAllocations')}
            >
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <FileText className="h-6 w-6 mr-3" />
                  Detailed Cost Breakdown
                </div>
                {expandedSections.costAllocations ?
                  <ChevronDown className="h-6 w-6" /> :
                  <ChevronRight className="h-6 w-6" />
                }
              </CardTitle>
              <p className="text-slate-200 text-sm">Click to expand detailed calculations</p>
            </CardHeader>
            {expandedSections.costAllocations && (
              <CardContent className="p-8">
                <div className="space-y-6">
                  {calculationResult.costAllocations.map((item, index) => (
                    <div key={index} className={`p-6 rounded-xl border ${item.color}`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                          {item.icon}
                          <h3 className="text-lg font-semibold ml-3">{item.category}</h3>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">${item.totalAmount.toLocaleString()}</p>
                          <p className="text-sm text-slate-600">Total Amount</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <p className="text-sm font-medium text-blue-800">Mathieu Wauters</p>
                          <p className="text-xl font-bold text-blue-900">${item.mathieuShare.toLocaleString()}</p>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <p className="text-sm font-medium text-green-800">Rosanna Alvero</p>
                          <p className="text-xl font-bold text-green-900">${item.rosannaShare.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm"><strong>Justification:</strong> {item.justification}</p>
                        <p className="text-sm"><strong>Legal Basis:</strong> {item.legalBasis}</p>
                        <p className="text-sm"><strong>Source:</strong> {item.source}</p>
                      </div>
                    </div>
                  ))}
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