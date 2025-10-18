import { useMemo } from 'react';
import {
  CalculationStep,
  SODAdjustments,
} from '@/types/calculations';
import {
  PROPERTY_SALE,
  SOD_ALLOCATION,
  TAX_DATA,
  SOD_ADJUSTMENTS,
  DOCUMENT_SOURCES,
  calculateNetAdjustment,
  calculateMathieuFinalDistribution,
  calculateRosannaFinalDistribution,
} from '@/constants/case-data';

export const useCalculationResult = () => {
  return useMemo(() => {
    // Load property and financial data from constants
    const grossSalePrice = PROPERTY_SALE.GROSS_SALE_PRICE;
    const netProceedsToSellers = PROPERTY_SALE.NET_PROCEEDS_TO_SELLERS;
    const lenderPayoff = PROPERTY_SALE.LENDER_PAYOFF;
    const mathieuSODShare = netProceedsToSellers * SOD_ALLOCATION.MATHIEU_PERCENTAGE;
    const rosannaSODShare = netProceedsToSellers * SOD_ALLOCATION.ROSANNA_PERCENTAGE;
    const rosannaWithholding = TAX_DATA.ROSANNA_FTB_WITHHOLDING;
    const mathieuTaxObligation = TAX_DATA.MATHIEU_TAX_OBLIGATION;

    // SOD Adjustments from constants
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
};
