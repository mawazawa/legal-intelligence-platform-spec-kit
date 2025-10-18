import { DeclarationPoint } from '../types';
import { evidenceDatabase } from './evidenceDatabase';

export const declarationPoints: DeclarationPoint[] = [
  {
    id: 'math-error',
    title: 'Mathematical Impossibility of Petitioner\'s Calculation',
    petitionerClaim: 'Petitioner claims she can both deduct $77,779.88 from net proceeds AND add it back to create a fictional "total net proceed" of $358,155.71, then take 35% of this impossible figure.',
    respondentRebuttal: 'This is mathematically impossible. You cannot both pay a debt and add it back to your share. The escrow proceeds of $280,355.83 already reflect the payment of all mortgage obligations. Petitioner\'s calculation violates basic arithmetic principles.',
    evidence: evidenceDatabase.filter(e => e.tags.includes('mathematical error') || e.tags.includes('double-counting')),
    legalAnalysis: 'Family Code Section 2550 requires equal division of community property. Petitioner\'s requested division is based on a mathematically impossible calculation and violates this requirement.',
    strength: 'airtight',
    category: 'mathematical'
  },
  {
    id: 'possession-timeline',
    title: 'Petitioner\'s Possession Control and Watts Charges Cutoff',
    petitionerClaim: 'Petitioner claims Watts charges through November 16, 2024, despite admitting she took possession on that exact date.',
    respondentRebuttal: 'Petitioner\'s own declaration admits she took possession on November 16, 2024. Watts charges are for exclusive use and possession - once she took possession, the charges must end. Her claims for November 16, 2024, and beyond are legally impossible.',
    evidence: evidenceDatabase.filter(e => e.tags.includes('possession date') || e.tags.includes('watts charges')),
    legalAnalysis: 'Watts v. Watts (1985) 171 Cal.App.3d 366 establishes that Watts charges end when possession changes. Petitioner cannot both owe Watts charges for exclusive use AND have taken possession on the same date.',
    strength: 'airtight',
    category: 'possession'
  },
  {
    id: 'attorney-fees',
    title: 'Attorney Fees Sanctions Without Evidence of Bad Faith',
    petitionerClaim: 'Petitioner seeks $40,000 in attorney fees as sanctions, claiming Respondent "willfully disregarded" court orders.',
    respondentRebuttal: 'Petitioner provides no evidence of bad faith or intentional violation of orders. Respondent\'s actions were consistent with exercising legal rights. Disagreement with Petitioner\'s interpretation does not constitute "willful disregard."',
    evidence: evidenceDatabase.filter(e => e.tags.includes('attorney fees') || e.tags.includes('bad faith')),
    legalAnalysis: 'Family Code Section 271 requires showing conduct that "frustrates the policy of the law to promote settlement." No such evidence exists. Petitioner\'s own delays and cooperation attempts show good faith.',
    strength: 'strong',
    category: 'legal'
  },
  {
    id: 'cleanup-costs',
    title: 'Insufficient Evidence for Cleanup and Damage Claims',
    petitionerClaim: 'Petitioner claims $6,419 in cleanup costs and $2,470 in removal costs, alleging damage to the property.',
    respondentRebuttal: 'Petitioner provides insufficient evidence of actual damage or the condition of the property before and after Respondent\'s departure. The photos show normal wear and tear, not damage requiring $8,889 in repairs.',
    evidence: evidenceDatabase.filter(e => e.tags.includes('cleanup') || e.tags.includes('damage')),
    legalAnalysis: 'Burden of proof requires clear evidence of damage and causation. Petitioner\'s claims lack the required specificity and documentation.',
    strength: 'moderate',
    category: 'damages'
  },
  {
    id: 'tax-withholding',
    title: 'Proportional Tax Withholding Responsibility',
    petitionerClaim: 'Petitioner claims $13,694.62 in tax withholding and seeks Respondent\'s 65% share ($8,901.50).',
    respondentRebuttal: 'Tax withholding should be split proportionally based on ownership interests (65/35). Petitioner\'s admission that she will "take full responsibility" contradicts her request for reimbursement.',
    evidence: evidenceDatabase.filter(e => e.tags.includes('tax withholding')),
    legalAnalysis: 'Tax obligations are typically shared proportionally unless there is a specific agreement otherwise. Petitioner\'s contradictory statements undermine her claim.',
    strength: 'moderate',
    category: 'financial'
  }
];
