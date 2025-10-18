/**
 * Legal Citations for Final Distribution
 * DRY: Single source of truth for legal references
 */

export interface LegalCitation {
  title: string;
  text: string;
  relevance: string;
}

export const SOD_CITATIONS: Record<string, LegalCitation> = {
  familyCode2550: {
    title: 'Family Code § 2550',
    text: 'Community property shall be divided equally between the parties',
    relevance: 'Establishes equal division principle'
  },
  familyCode2552: {
    title: 'Family Code § 2552',
    text: 'The court may make any orders necessary to effectuate the division of community property',
    relevance: 'Court authority for adjustments'
  },
  statementOfDecision: {
    title: 'Statement of Decision',
    text: '65% allocation to Respondent, 35% to Petitioner',
    relevance: 'Court-ordered allocation'
  }
};
