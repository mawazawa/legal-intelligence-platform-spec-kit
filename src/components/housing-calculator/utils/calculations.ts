import { ClosingData, MortgageBreakdown, CalculationResult } from '../types';
import { SODAdjustments, CalculationStep } from '@/types/calculations';

export function calculateHousingDistribution(
  closingData: ClosingData,
  mortgageBreakdown: MortgageBreakdown,
  sodAdjustments: SODAdjustments
): CalculationResult {
  // Step 1: Gross sale price
  const grossSalePrice = closingData.salePrice;

  // Step 2: Selling concessions and costs
  const sellingConcessions = closingData.sellerCredits;
  const realEstateCommissions = closingData.commissions;
  const escrowFees = 0;
  const transferTaxes = closingData.transferTaxes;
  const otherClosingCosts = closingData.countyTaxes;

  // Step 3: Lender payoff
  const totalLenderPayoff = closingData.lenderPayoff;

  // Step 4: Net proceeds before SOD
  const netProceedsBeforeSOD = closingData.netProceeds;

  // Step 5: SOD allocation (65%/35%)
  const mathieuSODShare = netProceedsBeforeSOD * 0.65;
  const rosannaSODShare = netProceedsBeforeSOD * 0.35;

  // Step 6: SOD adjustments
  const mathieuOwesRosanna =
    sodAdjustments.wattsChargesOriginal +
    sodAdjustments.rentalIncomeShare +
    sodAdjustments.motorcycleShare +
    sodAdjustments.furnitureShare;

  const rosannaOwesMathieu =
    sodAdjustments.rosannaExclusivePossession +
    sodAdjustments.furnitureCorrection;

  const netAdjustment = mathieuOwesRosanna - rosannaOwesMathieu;

  // Step 7: Final distribution
  const mathieuFinalDistribution = mathieuSODShare - netAdjustment;
  const rosannaFinalDistribution = rosannaSODShare + netAdjustment;

  // Build reasoning path
  const reasoningPath = buildReasoningPath(
    grossSalePrice,
    sellingConcessions,
    realEstateCommissions,
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
    mortgageBreakdown
  );

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
      rosannaFTBCredit: sodAdjustments.rosannaWithholding || 0,
    },
    reasoningPath
  };
}

function buildReasoningPath(
  grossSalePrice: number,
  sellingConcessions: number,
  realEstateCommissions: number,
  transferTaxes: number,
  otherClosingCosts: number,
  totalLenderPayoff: number,
  netProceedsBeforeSOD: number,
  mathieuSODShare: number,
  rosannaSODShare: number,
  mathieuOwesRosanna: number,
  rosannaOwesMathieu: number,
  netAdjustment: number,
  mathieuFinalDistribution: number,
  rosannaFinalDistribution: number,
  mortgageBreakdown: MortgageBreakdown
): CalculationStep[] {
  return [
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
      sources: [{
        documentName: "Final Sellers Closing Statement",
        documentDate: "05/30/2025",
        sectionName: "Due to Seller",
        excerpt: "Due to Seller: $280,355.83"
      }],
      explanation: "The amount available for distribution after all sale costs and lender payoff, before applying Statement of Decision allocations."
    },
    {
      stepNumber: 5,
      stepName: "SOD Allocation (65%/35%)",
      amount: netProceedsBeforeSOD,
      formula: `Mathieu: ${netProceedsBeforeSOD} × 0.65 = ${mathieuSODShare}, Rosanna: ${netProceedsBeforeSOD} × 0.35 = ${rosannaSODShare}`,
      sources: [{
        documentName: "Statement of Decision",
        documentDate: "Court Order",
        sectionName: "Property Division",
        excerpt: "65% allocation to Mathieu Wauters, 35% allocation to Rosanna Alvero"
      }],
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
}
