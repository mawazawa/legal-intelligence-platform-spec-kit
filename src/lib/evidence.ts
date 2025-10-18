/**
 * Evidence API - Legacy interface for Evidence Matrix
 * Re-exported from new evidence service for backward compatibility
 */

import { buildEvidenceClusters as buildClusters } from './services/evidenceService';
import type { ClaimKey } from './types/evidence';

export type { ClaimKey };

export function claimLabel(key: ClaimKey): string {
  const labels: Record<ClaimKey, string> = {
    mortgage_relief: 'Mortgage Relief ($49,262.84)',
    appraisal_fmv: 'Appraisal / FMV (3525 8th Ave.)',
    escrow_closing: 'Escrow / Closing Statement',
    continuances: 'Continuances Attribution',
    counsel_diligence: 'Counsel Diligence (referrals)',
    math_errors: 'Mathematical Errors in RFO',
    exclusive_possession_watts: 'Exclusive Possession (Watts)',
    foreclosure_timeline: 'Foreclosure Timeline',
    furniture_misrepresentation: 'Furniture Misrepresentation',
    property_access: 'Property Access',
  };
  return labels[key] || key;
}

/**
 * Build evidence clusters for Evidence Matrix
 * @deprecated Use buildEvidenceClusters from evidenceService instead
 */
export async function buildEvidenceClusters(): Promise<{
  cells: Array<{ claim: ClaimKey; type: 'emails' | 'documents' | 'graph'; count: number }>;
  suggestions: Array<{ claim: ClaimKey; title: string; why: string; path?: string; date?: string }>;
}> {
  const clusters = await buildClusters();

  // Transform to legacy format
  const cells = clusters.flatMap(cluster =>
    Object.entries(cluster.evidence_types)
      .filter(([, count]) => count > 0)
      .map(([type, count]) => ({
        claim: cluster.claim_key,
        type: (type === 'pdf' || type === 'document' ? 'documents' : type === 'email' ? 'emails' : 'documents') as 'emails' | 'documents' | 'graph',
        count,
      }))
  );

  const suggestions = clusters.map(cluster => ({
    claim: cluster.claim_key,
    title: claimLabel(cluster.claim_key),
    why: `${cluster.evidence_count} evidence file(s) - ${cluster.strength} support`,
  }));

  return { cells, suggestions };
}
