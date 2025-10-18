/**
 * Case Data Constants - FDI-21-794666
 * Centralized storage for all hardcoded financial and case data
 * Makes case data easily modifiable and maintainable
 */

/**
 * Property Sale Financial Data
 */
export const PROPERTY_SALE = {
  GROSS_SALE_PRICE: 1175000,
  NET_PROCEEDS_TO_SELLERS: 280355.83,
  LENDER_PAYOFF: 759364.32,
  CLOSING_DATE: '05/30/2025',
} as const;

/**
 * Statement of Decision (SOD) Allocation
 * Court-ordered distribution percentages
 */
export const SOD_ALLOCATION = {
  MATHIEU_PERCENTAGE: 0.65,
  ROSANNA_PERCENTAGE: 0.35,
} as const;

/**
 * Tax and Withholding Data
 */
export const TAX_DATA = {
  ROSANNA_FTB_WITHHOLDING: 13694.62,
  MATHIEU_FRANCHISE_TAX_REVERSAL: 8901.50, // 65% of Rosanna's withholding
  MATHIEU_TAX_OBLIGATION_ORIGINAL: 25432.88,
  MATHIEU_TAX_OBLIGATION: 16531.38, // After franchise tax reversal
} as const;

/**
 * Statement of Decision Adjustments (SOD Adjustments)
 * Post-judgment adjustments between parties
 */
export const SOD_ADJUSTMENTS = {
  // Mathieu owes Rosanna
  WATTS_CHARGES_ORIGINAL: 48640.00,
  RENTAL_INCOME_SHARE: 5761.81,
  MOTORCYCLE_SHARE: 5855.00,
  FURNITURE_SHARE: 7500.00,

  // Rosanna owes Mathieu
  ROSANNA_EXCLUSIVE_POSSESSION: 33500.00,
  FURNITURE_CORRECTION: 15000.00, // $15,000 swing due to furniture dispute
} as const;

/**
 * Commission and Real Estate Data
 */
export const REAL_ESTATE_DATA = {
  DEFAULT_COMMISSION_RATE: 0.06, // 6%
  MIN_COMMISSION_RATE: 0.04, // 4%
  MAX_COMMISSION_RATE: 0.08, // 8%
  COMMISSION_STEP: 0.001,

  DEFAULT_SELLER_CONCESSIONS: 35000,
  MIN_SELLER_CONCESSIONS: 25000,
  MAX_SELLER_CONCESSIONS: 50000,
  CONCESSIONS_STEP: 1000,
} as const;

/**
 * Document References and Source Citations
 */
export const DOCUMENT_SOURCES = {
  CLOSING_STATEMENT: {
    name: 'Final Sellers Closing Statement',
    date: '05/30/2025',
  },
  STATEMENT_OF_DECISION: {
    name: 'Statement of Decision',
    date: 'Court Order',
  },
  TAX_FORMS: {
    name: 'Tax Forms',
    date: '05/30/2025',
  },
} as const;

/**
 * Text Processing Constants
 */
export const TEXT_PROCESSING = {
  RFO_ATTACHMENT_MARKER: 'attachment 7',
  RFO_EXCERPT_CONTEXT_BEFORE: 800,
  RFO_EXCERPT_CONTEXT_AFTER: 1600,
  RFO_DEFAULT_EXCERPT_LENGTH: 1500,
} as const;

/**
 * Calculated Values (Derived Constants)
 * These are not hardcoded but derived from the base constants
 */
export const CALCULATED_VALUES = {
  /**
   * Mathieu's SOD share (65% of net proceeds)
   */
  MATHIEU_SOD_SHARE: PROPERTY_SALE.NET_PROCEEDS_TO_SELLERS * SOD_ALLOCATION.MATHIEU_PERCENTAGE,

  /**
   * Rosanna's SOD share (35% of net proceeds)
   */
  ROSANNA_SOD_SHARE: PROPERTY_SALE.NET_PROCEEDS_TO_SELLERS * SOD_ALLOCATION.ROSANNA_PERCENTAGE,

  /**
   * Total amount Mathieu owes Rosanna from SOD
   */
  MATHIEU_OWES_ROSANNA:
    SOD_ADJUSTMENTS.WATTS_CHARGES_ORIGINAL +
    SOD_ADJUSTMENTS.RENTAL_INCOME_SHARE +
    SOD_ADJUSTMENTS.MOTORCYCLE_SHARE +
    SOD_ADJUSTMENTS.FURNITURE_SHARE,

  /**
   * Total amount Rosanna owes Mathieu from SOD
   */
  ROSANNA_OWES_MATHIEU:
    SOD_ADJUSTMENTS.ROSANNA_EXCLUSIVE_POSSESSION + SOD_ADJUSTMENTS.FURNITURE_CORRECTION,
} as const;

/**
 * Calculate net adjustment between parties
 * Positive value means Mathieu owes Rosanna
 * Negative value means Rosanna owes Mathieu
 */
export function calculateNetAdjustment(): number {
  return CALCULATED_VALUES.MATHIEU_OWES_ROSANNA - CALCULATED_VALUES.ROSANNA_OWES_MATHIEU;
}

/**
 * Calculate Mathieu's final distribution
 * SOD share - net adjustment - tax obligation
 */
export function calculateMathieuFinalDistribution(): number {
  return (
    CALCULATED_VALUES.MATHIEU_SOD_SHARE -
    calculateNetAdjustment() -
    TAX_DATA.MATHIEU_TAX_OBLIGATION
  );
}

/**
 * Calculate Rosanna's final distribution
 * SOD share + net adjustment - withholding
 */
export function calculateRosannaFinalDistribution(): number {
  return (
    CALCULATED_VALUES.ROSANNA_SOD_SHARE +
    calculateNetAdjustment() -
    TAX_DATA.ROSANNA_FTB_WITHHOLDING
  );
}
