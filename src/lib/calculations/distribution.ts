/**
 * Distribution Constants and Calculations
 * Centralized definitions for SOD (Statement of Decision) distribution percentages
 */

/**
 * Statement of Decision distribution percentages
 * Respondent (Mathieu): 65%, Petitioner (Rosanna): 35%
 */
export const SOD_DISTRIBUTION = {
  respondent: 0.65,
  petitioner: 0.35,
} as const;

/**
 * Calculate distribution shares based on net proceeds
 * Returns object with respondent and petitioner shares
 */
export function calculateDistribution(netProceeds: number) {
  return {
    respondent: netProceeds * SOD_DISTRIBUTION.respondent,
    petitioner: netProceeds * SOD_DISTRIBUTION.petitioner,
    total: netProceeds,
  };
}

/**
 * Verify distribution totals match (for validation)
 */
export function validateDistribution(
  respondentShare: number,
  petitionerShare: number,
  tolerance: number = 0.01
): boolean {
  const total = respondentShare + petitionerShare;
  const expectedRatio = SOD_DISTRIBUTION.respondent;
  const actualRatio = respondentShare / total;
  return Math.abs(actualRatio - expectedRatio) < tolerance;
}

/**
 * Get distribution description for UI/documentation
 */
export function getDistributionDescription(): string {
  return `${(SOD_DISTRIBUTION.respondent * 100).toFixed(0)}% Respondent (Mathieu) / ${(SOD_DISTRIBUTION.petitioner * 100).toFixed(0)}% Petitioner (Rosanna) per Statement of Decision`;
}
