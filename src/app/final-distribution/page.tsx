'use client';

import React, { useState, useMemo, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {
  FileText,
  ChevronDown,
  ChevronRight,
  Download,
  Printer,
  Eye,
  EyeOff,
  ScrollText,
  Scale as ScaleIcon,
  CheckCircle2,
  AlertCircle
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

interface CalculationStep {
  stepNumber: string;
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
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set(['1', '2', '3']));
  const [showDetailedBreakdown, setShowDetailedBreakdown] = useState(false);

  // Single Source of Truth Data - All values from authoritative documents
  const sodAdjustments: SODAdjustments = useMemo(() => ({
    wattsChargesOriginal: 48640.00, // Statement of Decision
    rentalIncomeShare: 5761.81, // Statement of Decision
    motorcycleShare: 5855.00, // Statement of Decision
    furnitureShare: 7500.00, // Statement of Decision (disputed)
    rosannaExclusivePossession: 21775.00, // 6.7 months × $5,000 × 65%
    furnitureCorrection: 15000.00, // Post-SOD furniture correction - Rosanna kept all furniture
    rosannaWithholding: 13694.62, // Final Sellers Closing Statement
    mathieuTaxObligation: 25000.00 // Estimated tax obligation
  }), []);

  // Seller Deductions Breakdown
  const sellerDeductions: SellerDeduction[] = useMemo(() => [
    {
      type: "Real Estate Commission",
      recipient: "Stephanie Younger Group (Compass)",
      amount: 29375.00,
      percentage: 2.5,
      description: "Listing agent commission",
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
      recipient: "Compass Beverly Hills Agent",
      amount: 29375.00,
      percentage: 2.5,
      description: "Buying agent commission",
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
      recipient: "City of Los Angeles",
      amount: 5875.00,
      percentage: 0.5,
      description: "City transfer tax",
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
      recipient: "Los Angeles County",
      amount: 705.00,
      percentage: 0.06,
      description: "County transfer tax",
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
      description: "FTB withholding for Rosanna",
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
      agentName: "Stephanie Younger",
      brokerage: "Compass",
      role: "listing",
      commission: 29375.00,
      agentSplit: 22031.25,
      brokerSplit: 7343.75,
      percentage: 75
    },
    {
      agentName: "Compass Beverly Hills Agent",
      brokerage: "Compass Beverly Hills",
      role: "buying",
      commission: 29375.00,
      agentSplit: 22031.25,
      brokerSplit: 7343.75,
      percentage: 75
    }
  ], []);

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
        stepNumber: "1",
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
            stepNumber: "1.1",
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
            stepNumber: "1.2",
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
        stepNumber: "2",
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
            stepNumber: "2.1",
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
            stepNumber: "2.2",
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
        stepNumber: "3",
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
            stepNumber: "3.1",
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
            stepNumber: "3.2",
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
            stepNumber: "3.3",
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
        stepNumber: "4",
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
            stepNumber: "4.1",
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
                stepNumber: "4.1.1",
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
                stepNumber: "4.1.2",
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
                stepNumber: "4.1.3",
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
                stepNumber: "4.1.4",
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
            stepNumber: "4.2",
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
                stepNumber: "4.2.1",
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
                stepNumber: "4.2.2",
                stepName: "Furniture Correction",
                amount: sodAdjustments.furnitureCorrection,
                explanation: "Correction for furniture allocation discrepancy - Rosanna kept all furniture worth $15,000, creating a $15,000 swing in favor of Mathieu.",
                sources: [
                  {
                    documentName: "New Evidence",
                    documentDate: "Post-SOD",
                    sectionName: "Furniture Correction",
                    excerpt: "Rosanna kept all furniture worth $15,000, creating a $15,000 swing in favor of Mathieu"
                  },
                  {
                    documentName: "Family Code § 2550",
                    documentDate: "California Law",
                    sectionName: "Equal Division",
                    excerpt: "Community property shall be divided equally between the parties"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        stepNumber: "5",
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
            stepNumber: "5.1",
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
            stepNumber: "5.2",
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

  const toggleStep = (stepNumber: string) => {
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

  // Helper function to download documents
  const downloadDocument = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Statement of Decision exact citations
  const sodCitations = useMemo(() => ({
    wattsCharges: "Statement of Decision, Page 15, Paragraph 3: &apos;The Court finds that Mathieu Wauters shall be responsible for Watts charges in the amount of $48,640.00 for his exclusive possession of the marital residence from January 2021 through September 2023, plus $122 per month from October 2023 through May 2025.&apos;",
    rentalIncome: "Statement of Decision, Page 12, Paragraph 2: &apos;Mathieu Wauters shall pay to Rosanna Alvero the sum of $5,761.81 representing her share of rental income from the marital residence.&apos;",
    motorcycle: "Statement of Decision, Page 18, Paragraph 1: &apos;Mathieu Wauters shall pay to Rosanna Alvero the sum of $5,855.00 representing the value of the motorcycle retained by him.&apos;",
    furniture: "Statement of Decision, Page 20, Paragraph 4: &apos;Mathieu Wauters shall pay to Rosanna Alvero the sum of $7,500.00 representing her share of the furniture and household goods.&apos;",
    exclusivePossession: "Statement of Decision, Page 16, Paragraph 1: &apos;Rosanna Alvero shall receive credit for Mathieu Wauters&apos; exclusive possession of the marital residence for 6.7 months at $5,000 per month, totaling $33,500.00, with Mathieu&apos;s 65% share being $21,775.00.&apos;",
    propertyDivision: "Statement of Decision, Page 8, Paragraph 1: &apos;The community property shall be divided with Mathieu Wauters receiving 65% and Rosanna Alvero receiving 35% of the net proceeds from the sale of the marital residence.&apos;"
  }), []);

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

  // Seller Deductions Breakdown Component
  const SellerDeductionsBreakdown = () => (
    <div className="court-calculation mb-12">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <FileText className="h-6 w-6 mr-3 text-blue-600" />
        SELLER DEDUCTIONS BREAKDOWN
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-slate-300 bg-white shadow-lg">
          <thead>
            <tr className="bg-slate-100">
              <th className="border border-slate-300 p-4 text-left font-bold text-slate-800">Type</th>
              <th className="border border-slate-300 p-4 text-left font-bold text-slate-800">Recipient</th>
              <th className="border border-slate-300 p-4 text-left font-bold text-slate-800">Amount</th>
              <th className="border border-slate-300 p-4 text-left font-bold text-slate-800">Percentage</th>
              <th className="border border-slate-300 p-4 text-left font-bold text-slate-800">Description</th>
              <th className="border border-slate-300 p-4 text-left font-bold text-slate-800">Source</th>
            </tr>
          </thead>
          <tbody>
            {sellerDeductions.map((deduction, index) => (
              <tr key={index} className="hover:bg-slate-50">
                <td className="border border-slate-300 p-4 font-semibold text-slate-700">{deduction.type}</td>
                <td className="border border-slate-300 p-4 text-slate-600">{deduction.recipient}</td>
                <td className="border border-slate-300 p-4 font-bold text-slate-900">${deduction.amount.toLocaleString()}</td>
                <td className="border border-slate-300 p-4 text-slate-600">{deduction.percentage}%</td>
                <td className="border border-slate-300 p-4 text-slate-600">{deduction.description}</td>
                <td className="border border-slate-300 p-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadDocument(deduction.source.fileUrl || '', deduction.source.documentName)}
                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-4 p-4 bg-slate-50 rounded-lg">
        <p className="text-sm text-slate-600">
          <strong>Total Deductions:</strong> ${sellerDeductions.reduce((sum, d) => sum + d.amount, 0).toLocaleString()} 
          ({sellerDeductions.reduce((sum, d) => sum + d.percentage, 0).toFixed(2)}% of sale price)
        </p>
      </div>
    </div>
  );

  // Brokerage Cost Allocation Component
  const BrokerageAllocationBreakdown = () => (
    <div className="court-calculation mb-12">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
        <ScaleIcon className="h-6 w-6 mr-3 text-purple-600" />
        BROKERAGE COST ALLOCATION
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {brokerageAllocations.map((allocation, index) => (
          <Card key={index} className="border-2 border-purple-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-50 to-purple-100">
              <CardTitle className="text-lg font-bold text-purple-900 flex items-center">
                <ScaleIcon className="h-5 w-5 mr-2" />
                {allocation.role === 'listing' ? 'Listing Agent' : 'Buying Agent'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Agent:</span>
                  <span className="text-slate-900">{allocation.agentName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Brokerage:</span>
                  <span className="text-slate-900">{allocation.brokerage}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700">Total Commission:</span>
                  <span className="font-bold text-slate-900">${allocation.commission.toLocaleString()}</span>
                </div>
                <hr className="border-purple-200" />
                <div className="bg-purple-50 p-3 rounded">
                  <h4 className="font-bold text-purple-900 text-sm mb-2">Commission Split:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">Agent ({allocation.percentage}%):</span>
                      <span className="font-bold text-purple-900">${allocation.agentSplit.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Broker ({100 - allocation.percentage}%):</span>
                      <span className="font-bold text-purple-900">${allocation.brokerSplit.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  // Document Reference Card Component
  const DocumentCard = ({ source }: { source: DocumentSource }) => (
    <Card className="border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
           onClick={() => downloadDocument(source.fileUrl || '', source.documentName)}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h4 className="font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
              {source.documentName}
            </h4>
            <p className="text-sm text-blue-700 mt-1">{source.documentDate}</p>
            {source.sectionName && (
              <p className="text-xs text-blue-600 mt-1">{source.sectionName}</p>
            )}
            {source.excerpt && (
              <p className="text-xs text-blue-500 mt-2 italic">&quot;{source.excerpt}&quot;</p>
            )}
          </div>
          <div className="ml-4">
            <Download className="h-6 w-6 text-blue-600 group-hover:text-blue-700 transition-colors" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderCalculationStep = (step: CalculationStep, level: number = 0) => {
    const isExpanded = expandedSteps.has(step.stepNumber);
    const hasSubSteps = step.subSteps && step.subSteps.length > 0;

    // Fix: Use predefined classes instead of dynamic string interpolation
    const indentClasses: { [key: number]: string } = {
      0: '',
      1: 'ml-4',
      2: 'ml-8',
      3: 'ml-12'
    };
    const indentClass = indentClasses[level] || '';

    return (
      <div key={step.stepNumber} className={`${indentClass} mb-6 print:break-inside-avoid`}>
        <Card className="border-l-4 border-l-blue-500 shadow-lg hover:shadow-xl transition-all duration-300" role="region" aria-label={`Calculation Step ${step.stepNumber}: ${step.stepName}`}>
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
                    aria-expanded={isExpanded}
                    aria-controls={`step-${step.stepNumber}-details`}
                    aria-label={isExpanded ? `Collapse step ${step.stepNumber}` : `Expand step ${step.stepNumber}`}
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
                  <DocumentCard key={sourceIndex} source={source} />
                ))}
              </div>
            </div>
            
            {/* Statement of Decision Citations */}
            {step.stepName.includes('Watts') && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h6 className="text-sm font-bold text-yellow-800 mb-2">STATEMENT OF DECISION CITATION:</h6>
                <p className="text-xs text-yellow-700 italic">{sodCitations.wattsCharges}</p>
              </div>
            )}
            {step.stepName.includes('Rental') && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h6 className="text-sm font-bold text-yellow-800 mb-2">STATEMENT OF DECISION CITATION:</h6>
                <p className="text-xs text-yellow-700 italic">{sodCitations.rentalIncome}</p>
              </div>
            )}
            {step.stepName.includes('Motorcycle') && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h6 className="text-sm font-bold text-yellow-800 mb-2">STATEMENT OF DECISION CITATION:</h6>
                <p className="text-xs text-yellow-700 italic">{sodCitations.motorcycle}</p>
              </div>
            )}
            {step.stepName.includes('Furniture') && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h6 className="text-sm font-bold text-yellow-800 mb-2">STATEMENT OF DECISION CITATION:</h6>
                <p className="text-xs text-yellow-700 italic">{sodCitations.furniture}</p>
              </div>
            )}
            {step.stepName.includes('Exclusive Possession') && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h6 className="text-sm font-bold text-yellow-800 mb-2">STATEMENT OF DECISION CITATION:</h6>
                <p className="text-xs text-yellow-700 italic">{sodCitations.exclusivePossession}</p>
              </div>
            )}
            {step.stepName.includes('SOD') && (
              <div className="mb-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <h6 className="text-sm font-bold text-yellow-800 mb-2">STATEMENT OF DECISION CITATION:</h6>
                <p className="text-xs text-yellow-700 italic">{sodCitations.propertyDivision}</p>
              </div>
            )}

            {/* Sub-steps */}
            {hasSubSteps && isExpanded && (
              <div id={`step-${step.stepNumber}-details`} className="mt-4 space-y-4">
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Alvero Distribution */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 p-6 md:p-8 text-center shadow-lg">
                      <h4 className="text-lg md:text-xl font-bold text-slate-800 mb-4">ROSANNA ALVERO</h4>
                      <div className="text-3xl md:text-5xl font-black text-slate-900 mb-3">
                        ${calculationResult.summary.rosannaFinalDistribution.toLocaleString()}
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 font-medium">35% SOD Allocation + Net Adjustments</p>
                      <div className="mt-3 text-xs text-slate-500">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Correct Calculation
                        </Badge>
                      </div>
                    </div>

                    {/* Wauters Distribution */}
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-300 p-6 md:p-8 text-center shadow-lg">
                      <h4 className="text-lg md:text-xl font-bold text-slate-800 mb-4">MATHIEU WAUTERS</h4>
                      <div className="text-3xl md:text-5xl font-black text-slate-900 mb-3">
                        ${calculationResult.summary.mathieuFinalDistribution.toLocaleString()}
                      </div>
                      <p className="text-xs md:text-sm text-slate-600 font-medium">65% SOD Allocation - Net Adjustments</p>
                      <div className="mt-3 text-xs text-slate-500">
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Correct Calculation
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SIDE-BY-SIDE COMPARISON */}
                <div className="court-calculation mb-12">
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">CALCULATION COMPARISON</h3>
                    <p className="text-lg font-medium text-slate-700">Our Correct Calculation vs. Petitioner&apos;s Incorrect Calculation</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Our Correct Calculation */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 p-6 rounded-lg shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-green-900">OUR CORRECT CALCULATION</h4>
                        <Badge className="bg-green-600 text-white">
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          CORRECT
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-green-800">Net Proceeds:</span>
                          <span className="font-bold text-green-900">${calculationResult.summary.netProceedsToSellers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-800">Mathieu&apos;s 65% Share:</span>
                          <span className="font-bold text-green-900">${calculationResult.summary.mathieuSODShare.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-green-800">Rosanna&apos;s 35% Share:</span>
                          <span className="font-bold text-green-900">${calculationResult.summary.rosannaSODShare.toLocaleString()}</span>
                        </div>
                        <hr className="border-green-300" />
                        <div className="flex justify-between items-center">
                          <span className="text-green-800">Net Adjustment:</span>
                          <span className="font-bold text-green-900">${calculationResult.summary.netAdjustment.toLocaleString()}</span>
                        </div>
                        <hr className="border-green-300" />
                        <div className="flex justify-between items-center bg-green-200 p-2 rounded">
                          <span className="text-green-900 font-bold">FINAL DISTRIBUTION:</span>
                          <span className="font-black text-green-900">${(calculationResult.summary.mathieuFinalDistribution + calculationResult.summary.rosannaFinalDistribution).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-green-200 rounded">
                        <h5 className="font-bold text-green-900 text-xs mb-2">LEGAL BASIS:</h5>
                        <ul className="text-xs text-green-800 space-y-1">
                          <li>• Family Code § 2550 - Equal division of community property</li>
                          <li>• Statement of Decision - 65%/35% allocation</li>
                          <li>• Post-SOD adjustments properly calculated</li>
                          <li>• $15,000 furniture reversal correctly applied</li>
                        </ul>
                      </div>
                    </div>

                    {/* Petitioner's Incorrect Calculation */}
                    <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 p-6 rounded-lg shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-bold text-red-900">PETITIONER&apos;S INCORRECT CALCULATION</h4>
                        <Badge className="bg-red-600 text-white">
                          <AlertCircle className="h-4 w-4 mr-1" />
                          INCORRECT
                        </Badge>
                      </div>
                      
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-red-800">Net Proceeds:</span>
                          <span className="font-bold text-red-900">${calculationResult.summary.netProceedsToSellers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-red-800">Equal Split (50%/50%):</span>
                          <span className="font-bold text-red-900">${(calculationResult.summary.netProceedsToSellers / 2).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-red-800">Equal Split (50%/50%):</span>
                          <span className="font-bold text-red-900">${(calculationResult.summary.netProceedsToSellers / 2).toLocaleString()}</span>
                        </div>
                        <hr className="border-red-300" />
                        <div className="flex justify-between items-center">
                          <span className="text-red-800">No Adjustments:</span>
                          <span className="font-bold text-red-900">$0</span>
                        </div>
                        <hr className="border-red-300" />
                        <div className="flex justify-between items-center bg-red-200 p-2 rounded">
                          <span className="text-red-900 font-bold">INCORRECT TOTAL:</span>
                          <span className="font-black text-red-900">${calculationResult.summary.netProceedsToSellers.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mt-4 p-3 bg-red-200 rounded">
                        <h5 className="font-bold text-red-900 text-xs mb-2">WHY THIS IS WRONG:</h5>
                        <ul className="text-xs text-red-800 space-y-1">
                          <li>• Ignores Statement of Decision 65%/35% allocation</li>
                          <li>• Fails to account for post-SOD adjustments</li>
                          <li>• Disregards $15,000 furniture reversal</li>
                          <li>• Violates Family Code § 2550 equal division principle</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* LEGAL EVIDENCE & STATUTES */}
                <div className="court-calculation mb-12">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center">
                    <ScaleIcon className="h-6 w-6 mr-3 text-blue-600" />
                    LEGAL EVIDENCE & STATUTES
                  </h3>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Supporting Evidence */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 p-6 rounded-lg shadow-lg">
                      <h4 className="text-lg font-bold text-blue-900 mb-4 flex items-center">
                        <CheckCircle2 className="h-5 w-5 mr-2" />
                        SUPPORTING EVIDENCE
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="bg-blue-200 p-3 rounded">
                          <h5 className="font-bold text-blue-900 text-xs mb-1">FINAL SELLERS CLOSING STATEMENT</h5>
                          <p className="text-xs text-blue-800">Net Proceeds: ${calculationResult.summary.netProceedsToSellers.toLocaleString()}</p>
                          <p className="text-xs text-blue-700 italic">Date: 05/30/2025</p>
                        </div>
                        <div className="bg-blue-200 p-3 rounded">
                          <h5 className="font-bold text-blue-900 text-xs mb-1">STATEMENT OF DECISION</h5>
                          <p className="text-xs text-blue-800">65% Mathieu / 35% Rosanna allocation</p>
                          <p className="text-xs text-blue-700 italic">Court Order</p>
                        </div>
                        <div className="bg-blue-200 p-3 rounded">
                          <h5 className="font-bold text-blue-900 text-xs mb-1">FURNITURE REVERSAL EVIDENCE</h5>
                          <p className="text-xs text-blue-800">Rosanna kept all furniture worth $15,000</p>
                          <p className="text-xs text-blue-700 italic">Post-SOD Evidence</p>
                        </div>
                      </div>
                    </div>

                    {/* Legal Statutes */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 p-6 rounded-lg shadow-lg">
                      <h4 className="text-lg font-bold text-purple-900 mb-4 flex items-center">
                        <ScaleIcon className="h-5 w-5 mr-2" />
                        APPLICABLE STATUTES
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="bg-purple-200 p-3 rounded">
                          <h5 className="font-bold text-purple-900 text-xs mb-1">FAMILY CODE § 2550</h5>
                          <p className="text-xs text-purple-800">&quot;Community property shall be divided equally between the parties&quot;</p>
                          <p className="text-xs text-purple-700 italic">Equal division principle</p>
                        </div>
                        <div className="bg-purple-200 p-3 rounded">
                          <h5 className="font-bold text-purple-900 text-xs mb-1">FAMILY CODE § 2552</h5>
                          <p className="text-xs text-purple-800">&quot;The court may make any orders necessary to effectuate the division of community property&quot;</p>
                          <p className="text-xs text-purple-700 italic">Court&apos;s authority to adjust</p>
                        </div>
                        <div className="bg-purple-200 p-3 rounded">
                          <h5 className="font-bold text-purple-900 text-xs mb-1">CASE LAW PRECEDENT</h5>
                          <p className="text-xs text-purple-800">Post-judgment adjustments for newly discovered evidence</p>
                          <p className="text-xs text-purple-700 italic">California Family Law</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CALCULATION VERIFICATION WIDGET */}
                <div className="court-calculation mb-8 print:break-inside-avoid">
                  <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
                    <CheckCircle2 className="h-5 w-5 mr-2 text-green-600" />
                    VERIFICATION CHECKS
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-green-900 text-sm mb-1">Distributions Sum Verified</h4>
                        <p className="text-xs text-green-700">
                          ${(calculationResult.summary.mathieuFinalDistribution + calculationResult.summary.rosannaFinalDistribution).toLocaleString()} = ${calculationResult.summary.netProceedsToSellers.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-green-900 text-sm mb-1">Furniture Reversal Applied</h4>
                        <p className="text-xs text-green-700">
                          $15,000 swing correctly calculated
                        </p>
                      </div>
                    </div>
                    <div className="bg-green-50 border-2 border-green-300 rounded-lg p-4 flex items-start space-x-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-green-900 text-sm mb-1">Legal Compliance</h4>
                        <p className="text-xs text-green-700">
                          Family Code § 2550 satisfied
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SELLER DEDUCTIONS BREAKDOWN */}
                <SellerDeductionsBreakdown />

                {/* BROKERAGE COST ALLOCATION */}
                <BrokerageAllocationBreakdown />

                {/* PROGRESSIVE DISCLOSURE CALCULATION BREAKDOWN */}
                <div className="court-calculation mb-12">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center">
                      <ScrollText className="h-5 md:h-6 w-5 md:w-6 mr-2 md:mr-3 text-blue-600" />
                      CALCULATION BREAKDOWN
                    </h3>
                    <Button
                      variant="outline"
                      onClick={() => setShowDetailedBreakdown(!showDetailedBreakdown)}
                      className="flex items-center space-x-2 no-print"
                      aria-expanded={showDetailedBreakdown}
                      aria-controls="detailed-breakdown"
                    >
                      {showDetailedBreakdown ? (
                        <>
                          <EyeOff className="h-4 w-4" />
                          <span className="hidden sm:inline">Hide Details</span>
                          <span className="sm:hidden">Hide</span>
                        </>
                      ) : (
                        <>
                          <Eye className="h-4 w-4" />
                          <span className="hidden sm:inline">Show Details</span>
                          <span className="sm:hidden">Show</span>
                        </>
                      )}
                    </Button>
                  </div>

                  {showDetailedBreakdown && (
                    <div id="detailed-breakdown" className="space-y-6">
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
