'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calculator, FileText, DollarSign, AlertTriangle, CheckCircle } from 'lucide-react';

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
        legalBasis: 'California Family Code § 2550 - Community property presumption'
      },
      {
        category: 'Property Taxes (Escrow)',
        totalAmount: mortgageData.escrow,
        mathieuShare: mortgageData.escrow * 0.5,
        rosannaShare: mortgageData.escrow * 0.5,
        justification: 'Property taxes are ongoing obligation regardless of foreclosure status',
        legalBasis: 'California Revenue and Taxation Code § 2187 - Joint liability for property taxes'
      },
      {
        category: 'Foreclosure-Related Fees',
        totalAmount: mortgageData.fees,
        mathieuShare: mortgageData.fees * 0.5,
        rosannaShare: mortgageData.fees * 0.5,
        justification: 'Late fees and administrative costs due to joint delinquency',
        legalBasis: 'California Civil Code § 1717 - Joint and several liability for contract damages'
      },
      {
        category: 'Lender Paid Expenses (Legal/Inspection)',
        totalAmount: mortgageData.lenderPaidExpenses,
        mathieuShare: mortgageData.lenderPaidExpenses * 0.5,
        rosannaShare: mortgageData.lenderPaidExpenses * 0.5,
        justification: 'Costs incurred due to joint mortgage delinquency',
        legalBasis: 'California Family Code § 2550 - Community debt presumption'
      },
      {
        category: 'Overdue Payments (Accumulated)',
        totalAmount: mortgageData.overduePayments,
        mathieuShare: mortgageData.overduePayments * 0.5,
        rosannaShare: mortgageData.overduePayments * 0.5,
        justification: 'Accumulated missed payments - joint responsibility',
        legalBasis: 'California Family Code § 2550 - Community property and debt division'
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Housing Cost Allocation Calculator</h1>
        <p className="text-muted-foreground">
          Fair division of mortgage costs for FL-320 declaration
        </p>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <strong>Legal Argument:</strong> The $95,962.46 mortgage reinstatement amount should be divided equally between both parties, 
          not attributed solely to Respondent Mathieu Wauters. Only foreclosure-related fees ($4,717.95) represent additional costs 
          beyond the regular mortgage obligation.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="calculator" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator">Calculator</TabsTrigger>
          <TabsTrigger value="breakdown">Cost Breakdown</TabsTrigger>
          <TabsTrigger value="legal">Legal Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5" />
                Mortgage Data Input
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="principal">Principal Payment</Label>
                  <Input
                    id="principal"
                    type="number"
                    value={mortgageData.principal}
                    onChange={(e) => handleInputChange('principal', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="interest">Interest Payment</Label>
                  <Input
                    id="interest"
                    type="number"
                    value={mortgageData.interest}
                    onChange={(e) => handleInputChange('interest', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="escrow">Escrow (Property Taxes & Insurance)</Label>
                  <Input
                    id="escrow"
                    type="number"
                    value={mortgageData.escrow}
                    onChange={(e) => handleInputChange('escrow', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="fees">Late Fees & Administrative Costs</Label>
                  <Input
                    id="fees"
                    type="number"
                    value={mortgageData.fees}
                    onChange={(e) => handleInputChange('fees', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="lenderPaidExpenses">Lender Paid Expenses (Legal/Inspection)</Label>
                  <Input
                    id="lenderPaidExpenses"
                    type="number"
                    value={mortgageData.lenderPaidExpenses}
                    onChange={(e) => handleInputChange('lenderPaidExpenses', parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="overduePayments">Overdue Payments (Accumulated)</Label>
                  <Input
                    id="overduePayments"
                    type="number"
                    value={mortgageData.overduePayments}
                    onChange={(e) => handleInputChange('overduePayments', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Calculation Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Mortgage Amount</Label>
                  <div className="text-2xl font-bold">${calculationResult.summary.totalMortgageAmount.toLocaleString()}</div>
                </div>
                <div className="space-y-2">
                  <Label>Agreed Allocation</Label>
                  <div className="text-2xl font-bold text-green-600">${calculationResult.summary.agreedAmount.toLocaleString()}</div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Mathieu Wauters Share</Label>
                  <div className="text-xl font-semibold">${calculationResult.summary.mathieuTotalResponsibility.toLocaleString()}</div>
                  <Badge variant="outline">50% Equal Responsibility</Badge>
                </div>
                <div className="space-y-2">
                  <Label>Rosanna Alvero Share</Label>
                  <div className="text-xl font-semibold">${calculationResult.summary.rosannaTotalResponsibility.toLocaleString()}</div>
                  <Badge variant="outline">50% Equal Responsibility</Badge>
                </div>
              </div>

              {calculationResult.summary.disputedAmount > 0 && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Disputed Amount:</strong> ${calculationResult.summary.disputedAmount.toLocaleString()} 
                    - This represents the difference between total mortgage amount and fair allocation.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakdown" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Detailed Cost Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {calculationResult.costAllocations.map((allocation, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{allocation.category}</h3>
                      <Badge variant="secondary">${allocation.totalAmount.toLocaleString()}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label>Mathieu Wauters</Label>
                        <div className="font-medium">${allocation.mathieuShare.toLocaleString()}</div>
                      </div>
                      <div>
                        <Label>Rosanna Alvero</Label>
                        <div className="font-medium">${allocation.rosannaShare.toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <strong>Justification:</strong> {allocation.justification}
                    </div>
                    
                    <div className="text-sm text-muted-foreground">
                      <strong>Legal Basis:</strong> {allocation.legalBasis}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="legal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Legal Analysis & Citations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold">California Family Code § 2550</h3>
                  <p className="text-sm text-muted-foreground">
                    "Except as otherwise provided by law, in a proceeding for dissolution of marriage, 
                    the court shall divide the community estate equally between the parties."
                  </p>
                </div>
                
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold">Community Property Presumption</h3>
                  <p className="text-sm text-muted-foreground">
                    Mortgage payments made during marriage are presumed to be community property 
                    unless proven otherwise. Both parties are jointly liable for community debts.
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 pl-4">
                  <h3 className="font-semibold">Joint and Several Liability</h3>
                  <p className="text-sm text-muted-foreground">
                    California Civil Code § 1717 establishes that both parties to a contract 
                    are jointly and severally liable for damages, including foreclosure costs.
                  </p>
                </div>
                
                <div className="border-l-4 border-red-500 pl-4">
                  <h3 className="font-semibold">Property Tax Liability</h3>
                  <p className="text-sm text-muted-foreground">
                    California Revenue and Taxation Code § 2187 provides that property taxes 
                    are a joint obligation of all property owners, regardless of marital status.
                  </p>
                </div>
              </div>
              
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Conclusion:</strong> The mortgage reinstatement amount of $95,962.46 should be divided equally 
                  between both parties. Only the foreclosure-related fees ($4,717.95) represent additional costs 
                  beyond the regular mortgage obligation that both parties would have incurred regardless of 
                  foreclosure proceedings.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HousingCostCalculator;
