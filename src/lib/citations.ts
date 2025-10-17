import path from 'node:path';
import fs from 'node:fs/promises';
import { parseAllEmails, type EmailEvent } from '@/lib/ingestion/email-parser';

export interface Citation {
  id: string;
  type: 'email' | 'graph';
  title: string;
  date?: string;
  detail: string;
  file?: string;
}

function matchEmailsByKeywords(emails: EmailEvent[], keywords: string[]): EmailEvent[] {
  const k = keywords.map((w) => w.toLowerCase());
  return emails.filter((e) => {
    const hay = `${e.subject} ${e.body} ${e.snippet}`.toLowerCase();
    return k.some((kw) => hay.includes(kw));
  });
}

export async function buildCitations() {
  // Parse emails from local mbox files
  const mailDir = path.resolve(process.cwd(), '..', 'Mail');
  let mboxPath = path.join(mailDir, 'LEGAL-DIVORCE STUFF-EVIDENCE.mbox');
  try {
    const entries = await fs.readdir(mailDir);
    const mbox = entries.find((f) => f.endsWith('.mbox'));
    if (mbox) mboxPath = path.join(mailDir, mbox);
  } catch {}
  const emails = await parseAllEmails(mboxPath);

  // Heuristic keyword buckets tied to the declaration claims
  const buckets: Record<string, string[]> = {
    mortgage_relief: ['mortgage relief', '$49,262.84', 'california mortgage relief'],
    appraisal: ['appraisal', '3525 8th', 'baldino'],
    continuance: ['continuance', 'postpone', 'reschedule', 'adjourn'],
    counsel_referral: ['berman', 'proos', 'anderson', 'paralegal', 'marias', 'macias'],
    escrow_sale: ['escrow', 'close of escrow', 'sale price', 'closing statement'],
  };

  const emailCitations: Citation[] = [];
  for (const [bucket, kws] of Object.entries(buckets)) {
    const matches = matchEmailsByKeywords(emails, kws).slice(0, 10);
    matches.forEach((m, i) => {
      emailCitations.push({
        id: `${bucket}_${i}_${m.id}`,
        type: 'email',
        title: m.subject || 'Email',
        date: m.date,
        detail: `${m.from} → ${m.to?.join(', ')} | ${m.snippet}`,
        file: path.relative(process.cwd(), m.sourcePath),
      });
    });
  }

  // Neo4j graph (best-effort)
  const graphCitations: Citation[] = [];
  try {
    const { getNeo4jClient } = await import('@/lib/neo4j');
    const neo = getNeo4jClient();
    await neo.connect();
    const events = await neo.getEvents();
    events.slice(0, 25).forEach((e: any, i: number) => {
      const node = e.e || e;
      graphCitations.push({
        id: `graph_${i}_${node.externalId || node.id || ''}`,
        type: 'graph',
        title: `${node.type || 'Event'} — ${node.actor || ''}`.trim(),
        date: node.date,
        detail: node.description || node.snippet || '',
        file: node.sourcePath,
      });
    });
  } catch {
    // Neo4j not configured; omit gracefully
  }

  return { emailCitations, graphCitations };
}
