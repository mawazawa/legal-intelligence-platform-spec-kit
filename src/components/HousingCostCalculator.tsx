'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ExternalLink,
  HelpCircle
} from 'lucide-react';

interface MortgageBreakdown {
  principal: number;
  interest: number;
  escrow: number;
  fees: number;
  lenderPaidExpenses: number;
  total: number;
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
  expanded?: boolean;
}

interface CalculationResult {
  mortgageBreakdown: MortgageBreakdown;
  costAllocations: CostAllocation[];
  summary: {
    totalMortgageAmount: number;
    mathieuTotalResponsibility: number;
    rosannaTotalResponsibility: number;
    disputedAmount: number;
    agreedAmount: number;
  };
}

const HousingCostCalculator: React.FC = () => {
  const [mortgageData, setMortgageData] = useState({
    principal: 1379.23,
    interest: 1698.76,
    escrow: 3036.71,
    fees: 357.80,
    lenderPaidExpenses: 4717.95,
    overduePayments: 84772.01,
    totalReinstatement: 95962.46
  });

  const [allocationMethod, setAllocationMethod] = useState<'equal' | 'income' | 'usage'>('equal');
  const [incomeRatio, setIncomeRatio] = useState({ mathieu: 50, rosanna: 50 });
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    mortgageBreakdown: true,
    costAllocations: false,
    legalAnalysis: false
  });

  const calculationResult = useMemo((): CalculationResult => {
    const mortgageBreakdown: MortgageBreakdown = {
      principal: mortgageData.principal,
      interest: mortgageData.interest,
      escrow: mortgageData.escrow,
      fees: mortgageData.fees,
      lenderPaidExpenses: mortgageData.lenderPaidExpenses,
      total: mortgageData.totalReinstatement
    };

    const costAllocations: CostAllocation[] = [
      {
        category: 'Principal & Interest (Regular Mortgage Payment)',
        totalAmount: mortgageData.principal + mortgageData.interest,
        mathieuShare: (mortgageData.principal + mortgageData.interest) * 0.5,
        rosannaShare: (mortgageData.principal + mortgageData.interest) * 0.5,
        justification: 'Joint mortgage obligation - both parties equally responsible',
        legalBasis: 'California Family Code § 2550 - Community property presumption',
        source: 'Lakeview Mortgage Statement, Lines 96-97',
        icon: <Building className="h-4 w-4" />,
        color: 'bg-blue-50 border-blue-200 text-blue-800'
      },
      {
        category: 'Property Taxes (Escrow)',
        totalAmount: mortgageData.escrow,
        mathieuShare: mortgageData.escrow * 0.5,
        rosannaShare: mortgageData.escrow * 0.5,
        justification: 'Property taxes are ongoing obligation regardless of foreclosure status',
        legalBasis: 'California Revenue and Taxation Code § 2187 - Joint liability for property taxes',
        source: 'Lakeview Mortgage Statement, Line 98',
        icon: <Receipt className="h-4 w-4" />,
        color: 'bg-green-50 border-green-200 text-green-800'
      },
      {
        category: 'Foreclosure-Related Fees',
        totalAmount: mortgageData.fees,
        mathieuShare: mortgageData.fees * 0.5,
        rosannaShare: mortgageData.fees * 0.5,
        justification: 'Late fees and administrative costs due to joint delinquency',
        legalBasis: 'California Civil Code § 1717 - Joint and several liability for contract damages',
        source: 'Lakeview Mortgage Statement, Line 100',
        icon: <AlertTriangle className="h-4 w-4" />,
        color: 'bg-orange-50 border-orange-200 text-orange-800'
      },
      {
        category: 'Lender Paid Expenses (Legal/Inspection)',
        totalAmount: mortgageData.lenderPaidExpenses,
        mathieuShare: mortgageData.lenderPaidExpenses * 0.5,
        rosannaShare: mortgageData.lenderPaidExpenses * 0.5,
        justification: 'Costs incurred due to joint mortgage delinquency',
        legalBasis: 'California Family Code § 2550 - Community debt presumption',
        source: 'Lakeview Mortgage Statement, Lines 64-82',
        icon: <CreditCard className="h-4 w-4" />,
        color: 'bg-purple-50 border-purple-200 text-purple-800'
      },
      {
        category: 'Overdue Payments (Accumulated)',
        totalAmount: mortgageData.overduePayments,
        mathieuShare: mortgageData.overduePayments * 0.5,
        rosannaShare: mortgageData.overduePayments * 0.5,
        justification: 'Accumulated missed payments - joint responsibility',
        legalBasis: 'California Family Code § 2550 - Community property and debt division',
        source: 'Lakeview Mortgage Statement, Line 101',
        icon: <TrendingUp className="h-4 w-4" />,
        color: 'bg-red-50 border-red-200 text-red-800'
      }
    ];

    const mathieuTotal = costAllocations.reduce((sum, item) => sum + item.mathieuShare, 0);
    const rosannaTotal = costAllocations.reduce((sum, item) => sum + item.rosannaShare, 0);

    return {
      mortgageBreakdown,
      costAllocations,
      summary: {
        totalMortgageAmount: mortgageData.totalReinstatement,
        mathieuTotalResponsibility: mathieuTotal,
        rosannaTotalResponsibility: rosannaTotal,
        disputedAmount: mortgageData.totalReinstatement - (mathieuTotal + rosannaTotal),
        agreedAmount: mathieuTotal + rosannaTotal
      }
    };
  }, [mortgageData, allocationMethod, incomeRatio]);

  const handleInputChange = (field: string, value: number) => {
    setMortgageData(prev => ({
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
        <div className="container mx-auto px-6 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-full mr-4">
              <Scale className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-slate-800">Housing Cost Allocation</h1>
          </div>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Interactive calculator for fair division of mortgage costs in FL-320 declaration
          </p>
        </div>

        {/* Key Insight Banner */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 mb-8">
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Legal Argument Summary</h3>
              <p className="text-blue-800 leading-relaxed">
                The <strong>$95,962.46</strong> mortgage reinstatement amount should be divided equally between both parties, 
                not attributed solely to Respondent Mathieu Wauters. Only foreclosure-related fees 
                (<strong>$4,717.95</strong>) represent additional costs beyond the regular mortgage obligation.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Separator */}
        <hr className="my-8 border-t border-slate-200" />

        {/* Main Calculator Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Input Panel */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Mortgage Data Input
              </CardTitle>
              <p className="text-blue-100 text-sm">Source: Lakeview Mortgage Statement (05/20/2025)</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="principal" className="text-sm font-medium text-slate-700">
                      Principal Payment
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">The portion of your monthly payment that goes toward reducing the loan balance. This is the actual amount borrowed that you're paying back.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      id="principal"
                      type="number"
                      value={mortgageData.principal}
                      onChange={(e) => handleInputChange('principal', parseFloat(e.target.value) || 0)}
                      className="pl-8 text-lg font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">Source: Lakeview Mortgage Statement, Line 96</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="interest" className="text-sm font-medium text-slate-700">
                      Interest Payment
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">The cost of borrowing money, calculated as a percentage of the outstanding loan balance. This is the lender's profit.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      id="interest"
                      type="number"
                      value={mortgageData.interest}
                      onChange={(e) => handleInputChange('interest', parseFloat(e.target.value) || 0)}
                      className="pl-8 text-lg font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <DollarSign className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">Source: Lakeview Mortgage Statement, Line 97</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="escrow" className="text-sm font-medium text-slate-700">
                      Escrow (Property Taxes & Insurance)
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Property taxes and homeowners insurance collected monthly and held in escrow. These are ongoing obligations regardless of foreclosure status.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      id="escrow"
                      type="number"
                      value={mortgageData.escrow}
                      onChange={(e) => handleInputChange('escrow', parseFloat(e.target.value) || 0)}
                      className="pl-8 text-lg font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Receipt className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">Source: Lakeview Mortgage Statement, Line 98</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="fees" className="text-sm font-medium text-slate-700">
                      Late Fees & Administrative Costs
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Penalties charged for late payments and administrative fees. These are additional costs due to delinquency, not regular mortgage obligations.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      id="fees"
                      type="number"
                      value={mortgageData.fees}
                      onChange={(e) => handleInputChange('fees', parseFloat(e.target.value) || 0)}
                      className="pl-8 text-lg font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <AlertTriangle className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">Source: Lakeview Mortgage Statement, Line 100</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="lenderPaidExpenses" className="text-sm font-medium text-slate-700">
                      Lender Paid Expenses (Legal/Inspection)
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Legal fees, property inspections, and other costs incurred by the lender during foreclosure proceedings. These are the true "foreclosure costs" beyond regular mortgage payments.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      id="lenderPaidExpenses"
                      type="number"
                      value={mortgageData.lenderPaidExpenses}
                      onChange={(e) => handleInputChange('lenderPaidExpenses', parseFloat(e.target.value) || 0)}
                      className="pl-8 text-lg font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">Source: Lakeview Mortgage Statement, Lines 64-82</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label htmlFor="overduePayments" className="text-sm font-medium text-slate-700">
                      Overdue Payments (Accumulated)
                    </Label>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">The total amount of missed mortgage payments that have accumulated over time. This represents the core mortgage obligation that was not paid.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <Input
                      id="overduePayments"
                      type="number"
                      value={mortgageData.overduePayments}
                      onChange={(e) => handleInputChange('overduePayments', parseFloat(e.target.value) || 0)}
                      className="pl-8 text-lg font-bold bg-white border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  </div>
                  <p className="text-xs text-slate-500">Source: Lakeview Mortgage Statement, Line 101</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Fair Allocation Results
              </CardTitle>
              <p className="text-green-100 text-sm">Equal division methodology (50/50)</p>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Total Amount */}
              <div className="text-center p-6 bg-slate-50 rounded-xl">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <p className="text-sm text-slate-600">Total Mortgage Amount</p>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-slate-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs">The complete reinstatement amount required to bring the mortgage current, including all overdue payments, fees, and lender expenses.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <p className="text-4xl font-black text-slate-800">
                  ${calculationResult.summary.totalMortgageAmount.toLocaleString()}
                </p>
              </div>

              {/* Individual Allocations */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-4 w-4 text-blue-600 mr-1" />
                    <p className="text-sm font-medium text-blue-800">Mathieu Wauters</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-blue-400 cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Respondent's fair share based on equal division of community property under California Family Code § 2550.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-3xl font-black text-blue-900">
                    ${calculationResult.summary.mathieuTotalResponsibility.toLocaleString()}
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">50% Equal Responsibility</Badge>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center justify-center mb-2">
                    <Users className="h-4 w-4 text-green-600 mr-1" />
                    <p className="text-sm font-medium text-green-800">Rosanna Alvero</p>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <HelpCircle className="h-3 w-3 text-green-400 cursor-help ml-1" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="max-w-xs">Petitioner's fair share based on equal division of community property under California Family Code § 2550.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-3xl font-black text-green-900">
                    ${calculationResult.summary.rosannaTotalResponsibility.toLocaleString()}
                  </p>
                  <Badge variant="outline" className="mt-2 text-xs">50% Equal Responsibility</Badge>
                </div>
              </div>

              {/* Disputed Amount Alert */}
              {calculationResult.summary.disputedAmount > 0 && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    <strong>Disputed Amount:</strong> ${calculationResult.summary.disputedAmount.toLocaleString()} 
                    - This represents the difference between total mortgage amount and fair allocation.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
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
                <FileText className="h-5 w-5 mr-2" />
                Detailed Cost Breakdown
              </div>
              {expandedSections.costAllocations ? 
                <ChevronDown className="h-5 w-5" /> : 
                <ChevronRight className="h-5 w-5" />
              }
            </CardTitle>
            <p className="text-slate-200 text-sm">Click to expand detailed calculations</p>
          </CardHeader>
          {expandedSections.costAllocations && (
            <CardContent className="p-6">
              <div className="space-y-4">
                {calculationResult.costAllocations.map((allocation, index) => (
                  <div key={index} className={`border rounded-xl p-4 ${allocation.color}`}>
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center">
                        {allocation.icon}
                        <h3 className="font-semibold ml-2">{allocation.category}</h3>
                      </div>
                      <Badge variant="secondary" className="text-sm font-mono">
                        ${allocation.totalAmount.toLocaleString()}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-3">
                      <div className="bg-white/50 rounded-lg p-3">
                        <Label className="text-xs font-medium opacity-70">Mathieu Wauters</Label>
                        <div className="font-black text-xl">${allocation.mathieuShare.toLocaleString()}</div>
                      </div>
                      <div className="bg-white/50 rounded-lg p-3">
                        <Label className="text-xs font-medium opacity-70">Rosanna Alvero</Label>
                        <div className="font-black text-xl">${allocation.rosannaShare.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Source:</strong> {allocation.source}
                      </div>
                      <div>
                        <strong>Justification:</strong> {allocation.justification}
                      </div>
                      <div>
                        <strong>Legal Basis:</strong> {allocation.legalBasis}
                      </div>
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
                <Scale className="h-5 w-5 mr-2" />
                Legal Analysis & Citations
              </div>
              {expandedSections.legalAnalysis ? 
                <ChevronDown className="h-5 w-5" /> : 
                <ChevronRight className="h-5 w-5" />
              }
            </CardTitle>
            <p className="text-indigo-200 text-sm">Click to expand legal basis and citations</p>
          </CardHeader>
          {expandedSections.legalAnalysis && (
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <FileCheck className="h-5 w-5 text-blue-600 mr-2" />
                      <h3 className="font-semibold text-blue-900">California Family Code § 2550</h3>
                    </div>
                    <p className="text-sm text-blue-800 leading-relaxed">
                      "Except as otherwise provided by law, in a proceeding for dissolution of marriage, 
                      the court shall divide the community estate equally between the parties."
                    </p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <Users className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-semibold text-green-900">Community Property Presumption</h3>
                    </div>
                    <p className="text-sm text-green-800 leading-relaxed">
                      Mortgage payments made during marriage are presumed to be community property 
                      unless proven otherwise. Both parties are jointly liable for community debts.
                    </p>
                  </div>
                  
                  <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <AlertTriangle className="h-5 w-5 text-orange-600 mr-2" />
                      <h3 className="font-semibold text-orange-900">Joint and Several Liability</h3>
                    </div>
                    <p className="text-sm text-orange-800 leading-relaxed">
                      California Civil Code § 1717 establishes that both parties to a contract 
                      are jointly and severally liable for damages, including foreclosure costs.
                    </p>
                  </div>
                  
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      <Receipt className="h-5 w-5 text-red-600 mr-2" />
                      <h3 className="font-semibold text-red-900">Property Tax Liability</h3>
                    </div>
                    <p className="text-sm text-red-800 leading-relaxed">
                      California Revenue and Taxation Code § 2187 provides that property taxes 
                      are a joint obligation of all property owners, regardless of marital status.
                    </p>
                  </div>
                </div>
                
                <Alert className="border-emerald-200 bg-emerald-50">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <AlertDescription className="text-emerald-800">
                    <strong>Legal Conclusion:</strong> The mortgage reinstatement amount of $95,962.46 should be divided equally 
                    between both parties. Only the foreclosure-related fees ($4,717.95) represent additional costs 
                    beyond the regular mortgage obligation that both parties would have incurred regardless of 
                    foreclosure proceedings.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 p-6 bg-white/50 rounded-xl">
          <p className="text-slate-600 text-sm">
            This calculator provides a comprehensive analysis for FL-320 declaration purposes. 
            All calculations are based on the Lakeview Mortgage Statement dated 05/20/2025.
          </p>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default HousingCostCalculator;
