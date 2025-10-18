/**
 * Tax Withholding Calculation Logic
 * Pure functions for financial computations (SOLID: Single Responsibility)
 */

import { FinancialInputs, FinancialBreakdown } from '@/types/tax-withholding'

/**
 * Calculate financial breakdown for property sale proceeds
 *
 * @param inputs - Financial input parameters
 * @returns Complete financial breakdown with net distributions
 */
export function calculateFinancialBreakdown(inputs: FinancialInputs): FinancialBreakdown {
  const mathieuBase = inputs.totalProceeds * (inputs.mathieuPercentage / 100)
  const rosannaBase = inputs.totalProceeds * (inputs.rosannaPercentage / 100)

  // Mathieu's franchise tax reversal: Rosanna took hers out ($8,901.50 - 65% of $13,694.62),
  // so Mathieu does the same with his matching share
  const mathieuFranchiseTaxReversal = 8901.50

  return {
    totalProceeds: inputs.totalProceeds,
    mathieuPercentage: inputs.mathieuPercentage,
    rosannaPercentage: inputs.rosannaPercentage,
    mathieuBase,
    rosannaBase,
    mathieuWithholding: 0,
    rosannaWithholding: inputs.rosannaWithholding,
    mathieuNet: mathieuBase + mathieuFranchiseTaxReversal,
    rosannaNet: rosannaBase - inputs.rosannaWithholding,
    withholdingRate: inputs.caWithholdingRate
  }
}

/**
 * DEPRECATED: Use formatCurrency from @/lib/utils/currency instead
 * @deprecated - Import from centralized utility
 */
export { formatCurrency } from '@/lib/utils/currency';

/**
 * Format percentage for display
 *
 * @param percentage - Percentage value (e.g., 65 for 65%)
 * @returns Formatted string (e.g., "65.00%")
 */
export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(2)}%`
}
