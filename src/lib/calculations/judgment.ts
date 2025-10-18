/**
 * Judgment Calculation Business Logic
 * Pure functions for judgment payout calculations
 * Extracted from JudgmentCalculator component for better testability and reusability
 */

export interface JudgmentAdjustment {
  id: string;
  type: 'watts' | 'tax' | 'arrears' | 'other';
  amount: number;
  description: string;
  party: 'petitioner' | 'respondent' | 'both';
}

export interface JudgmentCalculationInputs {
  netProceeds: number;
  petitionerPercentage: number;
  respondentPercentage: number;
  adjustments: JudgmentAdjustment[];
}

export interface JudgmentCalculationResults {
  basePetitioner: number;
  baseRespondent: number;
  petitionerTotal: number;
  respondentTotal: number;
  totalDistributed: number;
  discrepancy: number;
  petitionerAdjustments: number;
  respondentAdjustments: number;
}

/**
 * Calculate judgment distribution based on inputs
 *
 * @param inputs - Calculation inputs (net proceeds, percentages, adjustments)
 * @returns Detailed calculation results
 *
 * @example
 * const result = calculateJudgmentDistribution({
 *   netProceeds: 280355.83,
 *   petitionerPercentage: 35,
 *   respondentPercentage: 65,
 *   adjustments: []
 * });
 */
export function calculateJudgmentDistribution(
  inputs: JudgmentCalculationInputs
): JudgmentCalculationResults {
  // Calculate base amounts from percentages
  const basePetitioner = inputs.netProceeds * (inputs.petitionerPercentage / 100);
  const baseRespondent = inputs.netProceeds * (inputs.respondentPercentage / 100);

  // Calculate adjustment totals for each party
  let petitionerAdjustments = 0;
  let respondentAdjustments = 0;

  inputs.adjustments.forEach(adj => {
    if (adj.party === 'petitioner' || adj.party === 'both') {
      petitionerAdjustments += adj.amount;
    }
    if (adj.party === 'respondent' || adj.party === 'both') {
      respondentAdjustments += adj.amount;
    }
  });

  // Calculate final totals
  const petitionerTotal = basePetitioner + petitionerAdjustments;
  const respondentTotal = baseRespondent + respondentAdjustments;
  const totalDistributed = petitionerTotal + respondentTotal;

  // Calculate discrepancy (should ideally be zero)
  const discrepancy = Math.abs(totalDistributed - inputs.netProceeds);

  return {
    basePetitioner,
    baseRespondent,
    petitionerTotal,
    respondentTotal,
    totalDistributed,
    discrepancy,
    petitionerAdjustments,
    respondentAdjustments,
  };
}

/**
 * Validate calculation inputs
 *
 * @param inputs - Calculation inputs to validate
 * @returns Validation errors (empty array if valid)
 */
export function validateCalculationInputs(
  inputs: JudgmentCalculationInputs
): string[] {
  const errors: string[] = [];

  // Validate net proceeds
  if (inputs.netProceeds <= 0) {
    errors.push('Net proceeds must be greater than zero');
  }

  // Validate percentages
  if (inputs.petitionerPercentage < 0 || inputs.petitionerPercentage > 100) {
    errors.push('Petitioner percentage must be between 0 and 100');
  }

  if (inputs.respondentPercentage < 0 || inputs.respondentPercentage > 100) {
    errors.push('Respondent percentage must be between 0 and 100');
  }

  const totalPercentage = inputs.petitionerPercentage + inputs.respondentPercentage;
  if (Math.abs(totalPercentage - 100) > 0.01) {
    errors.push(`Percentages must sum to 100% (currently ${totalPercentage.toFixed(2)}%)`);
  }

  // Validate adjustments
  inputs.adjustments.forEach((adj, index) => {
    if (!adj.description || adj.description.trim() === '') {
      errors.push(`Adjustment ${index + 1} must have a description`);
    }
  });

  return errors;
}

/**
 * Generate AI assistance response based on calculation state
 * Simulated AI logic extracted from component
 *
 * @param inputs - Current calculation inputs
 * @param results - Current calculation results
 * @param query - User's query
 * @returns AI-generated response text
 */
export function generateAIResponse(
  inputs: JudgmentCalculationInputs,
  results: JudgmentCalculationResults,
  query: string
): string {
  const response = `Based on the judgment analysis and your query "${query}", here are the key considerations:

1. **Net Proceeds Calculation**: The judgment specifies using actual net proceeds of $${inputs.netProceeds.toLocaleString()} from the closing statement.

2. **Percentage Split**: The ${inputs.petitionerPercentage}%/${inputs.respondentPercentage}% split is clearly established in the Statement of Decision.

3. **Adjustments**: Consider whether any additional adjustments are needed based on:
   - Watts charges symmetry
   - Tax withholding credits
   - Post-closing expenses

   Current adjustments: ${inputs.adjustments.length} item(s)
   - Petitioner adjustments: $${results.petitionerAdjustments.toLocaleString()}
   - Respondent adjustments: $${results.respondentAdjustments.toLocaleString()}

4. **Recommendation**: ${
    results.discrepancy > 100
      ? '⚠️ Review adjustments to minimize discrepancy of $' + results.discrepancy.toLocaleString()
      : '✓ Calculation appears balanced with minimal discrepancy'
  }

5. **Distribution Summary**:
   - Petitioner: $${results.petitionerTotal.toLocaleString()} (${inputs.petitionerPercentage}% base + adjustments)
   - Respondent: $${results.respondentTotal.toLocaleString()} (${inputs.respondentPercentage}% base + adjustments)
   - Total: $${results.totalDistributed.toLocaleString()}`;

  return response;
}

/**
 * Create a new adjustment with default values
 *
 * @returns New adjustment object with unique ID
 */
export function createAdjustment(): JudgmentAdjustment {
  return {
    id: `adj-${Date.now()}`,
    type: 'other',
    amount: 0,
    description: '',
    party: 'both',
  };
}

/**
 * Update an adjustment in the adjustments array
 *
 * @param adjustments - Current adjustments array
 * @param id - ID of adjustment to update
 * @param field - Field to update
 * @param value - New value
 * @returns Updated adjustments array
 */
export function updateAdjustment<K extends keyof JudgmentAdjustment>(
  adjustments: JudgmentAdjustment[],
  id: string,
  field: K,
  value: JudgmentAdjustment[K]
): JudgmentAdjustment[] {
  return adjustments.map(adj =>
    adj.id === id ? { ...adj, [field]: value } : adj
  );
}

/**
 * Remove an adjustment from the adjustments array
 *
 * @param adjustments - Current adjustments array
 * @param id - ID of adjustment to remove
 * @returns Updated adjustments array
 */
export function removeAdjustment(
  adjustments: JudgmentAdjustment[],
  id: string
): JudgmentAdjustment[] {
  return adjustments.filter(adj => adj.id !== id);
}
