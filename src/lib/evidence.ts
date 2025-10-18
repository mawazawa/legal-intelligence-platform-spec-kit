// Minimal, stable API used by Evidence Matrix page.

export type ClaimKey =
  | 'mortgage_relief'
  | 'appraisal_fmv'
  | 'escrow_closing'
  | 'continuances'
  | 'counsel_diligence'
  | 'math_errors'
  | 'exclusive_possession_watts';

export function claimLabel(key: ClaimKey): string {
  const labels: Record<ClaimKey, string> = {
    mortgage_relief: 'Mortgage Relief ($49,262.84)',
    appraisal_fmv: 'Appraisal / FMV (3525 8th Ave.)',
    escrow_closing: 'Escrow / Closing Statement',
    continuances: 'Continuances Attribution',
    counsel_diligence: 'Counsel Diligence (referrals)',
    math_errors: 'Mathematical Errors in RFO',
    exclusive_possession_watts: 'Exclusive Possession (Watts)'
  };
  return labels[key] || key;
}

export async function buildEvidenceClusters(): Promise<{
  cells: Array<{ claim: ClaimKey; type: 'emails' | 'documents' | 'graph'; count: number }>;
  suggestions: Array<{ claim: ClaimKey; title: string; why: string; path?: string; date?: string }>;
}> {
  // Lightweight placeholder to satisfy the Evidence Matrix without blocking build or adding heavy deps.
  // When data sources are ready, replace with real aggregation.
  return {
    cells: [],
    suggestions: [],
  };
}
