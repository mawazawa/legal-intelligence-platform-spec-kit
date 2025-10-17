import fs from 'node:fs/promises';
import path from 'node:path';
import { parseAllEmails, EmailEvent } from '@/lib/ingestion/email-parser';

export type ClaimKey =
  | 'mortgage_relief'
  | 'appraisal_fmv'
  | 'escrow_closing'
  | 'continuances'
  | 'counsel_diligence'
  | 'math_errors'
  | 'exclusive_possession_watts';

export interface EvidenceClusterCell {
  claim: ClaimKey;
  type: 'emails' | 'documents' | 'graph';
  count: number;
  samples: Array<{ title: string; date?: string; note?: string; path?: string }>; 
}

export interface SuggestedEvidenceItem {
  claim: ClaimKey;
  title: string;
  why: string;
  path?: string;
  date?: string;
}

const CLAIM_LABELS: Record<ClaimKey, string> = {
  mortgage_relief: 'Mortgage Relief ($49,262.84)',
  appraisal_fmv: 'Appraisal / FMV (3525 8th Ave.)',
  escrow_closing: 'Escrow / Closing Statement',
  continuances: 'Continuances Attribution',
  counsel_diligence: 'Counsel Diligence (referrals)',
  math_errors: 'Mathematical Errors in RFO',
  exclusive_possession_watts: 'Exclusive Possession (Watts)'
};

export function claimLabel(k: ClaimKey) { return CLAIM_LABELS[k]; }

function hasAny(haystack: string, terms: string[]) {
  const low = haystack.toLowerCase();
  return terms.some((t) => low.includes(t.toLowerCase()));
}

function loadExhibitsJsonPath() {
  return path.resolve(process.cwd(), '..', 'case-financials', 'exhibits', 'exhibits.json');
}

export async function readExhibits() {
  try {
    const raw = await fs.readFile(loadExhibitsJsonPath(), 'utf8');
    const data = JSON.parse(raw);
    return (data?.exhibits ?? []) as Array<any>;
  } catch {
    return [];
  }
}

export async function buildEvidenceClusters() {
  const emails = await parseAllEmails();
  const exhibits = await readExhibits();

  const emailMatchers: Record<ClaimKey, string[]> = {
    mortgage_relief: ['mortgage relief', 'california mortgage relief', '$49,262.84'],
    appraisal_fmv: ['appraisal', 'baldino', '3525 8th'],
    escrow_closing: ['escrow', 'closing statement', 'settlement statement', 'hud-1'],
    continuances: ['continuance', 'postpone', 'reschedule', 'adjourn'],
    counsel_diligence: ['berman', 'proos', 'anderson', 'paralegal', 'macias'],
    math_errors: ['double-count', 'math', 'calculation error', 'overstate'],
    exclusive_possession_watts: ['exclusive possession', 'watts charge']
  };

  const exhibitMatchers: Record<ClaimKey, (x: any) => boolean> = {
    mortgage_relief: (x) => hasAny(`${x.title} ${x.path}`, ['593', 'withholding', 'irs 593', 'mortgage relief']),
    appraisal_fmv: (x) => hasAny(`${x.title} ${x.path}`, ['appraisal', 'baldino', 'valuation']),
    escrow_closing: (x) => hasAny(`${x.title} ${x.path}`, ['closing statement', 'settlement statement', 'hud']),
    continuances: (x) => hasAny(`${x.title} ${x.path}`, ['roa', 'register of actions']),
    counsel_diligence: (x) => hasAny(`${x.title} ${x.path}`, ['retainer', 'intake', 'engagement', 'paralegal']),
    math_errors: (x) => hasAny(`${x.title} ${x.path}`, ['rfo', 'points & authorities']),
    exclusive_possession_watts: (x) => hasAny(`${x.title} ${x.path}`, ['possession', 'watts'])
  };

  const claims = Object.keys(CLAIM_LABELS) as ClaimKey[];
  const cells: EvidenceClusterCell[] = [];

  for (const claim of claims) {
    // Emails
    const eMatches = emails.filter((e) => hasAny(`${e.metadata.subject} ${e.snippet} ${e.description}`, emailMatchers[claim]));
    cells.push({
      claim,
      type: 'emails',
      count: eMatches.length,
      samples: eMatches.slice(0, 5).map((m) => ({ title: m.metadata.subject || 'Email', date: m.date, note: m.snippet, path: m.sourcePath }))
    });

    // Exhibits (documents)
    const dMatches = exhibits.filter(exhibitMatchers[claim]);
    cells.push({
      claim,
      type: 'documents',
      count: dMatches.length,
      samples: dMatches.slice(0, 5).map((m: any) => ({ title: m.title, date: m.date, path: m.path }))
    });

    // Graph: leave zero by default; page may fill if Neo4j is wired on client
    cells.push({ claim, type: 'graph', count: 0, samples: [] });
  }

  // Suggested evidence list, dry/technical: top items per claim
  const suggestions: SuggestedEvidenceItem[] = [];
  for (const claim of claims) {
    const emailTop = cells.find((c) => c.claim === claim && c.type === 'emails')!;
    const docTop = cells.find((c) => c.claim === claim && c.type === 'documents')!;

    if (docTop.count > 0) {
      suggestions.push({
        claim,
        title: docTop.samples[0]?.title || 'Document evidence',
        path: docTop.samples[0]?.path,
        date: docTop.samples[0]?.date,
        why: `Primary documentary support for ${CLAIM_LABELS[claim]}`
      });
    }
    if (emailTop.count > 0) {
      suggestions.push({
        claim,
        title: emailTop.samples[0]?.title || 'Email evidence',
        path: emailTop.samples[0]?.path,
        date: emailTop.samples[0]?.date,
        why: `Contemporaneous communication corroborating ${CLAIM_LABELS[claim]}`
      });
    }
  }

  return { cells, suggestions };
}

