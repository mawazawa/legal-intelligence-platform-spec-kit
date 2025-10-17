import { parseAllEmails, type EmailEvent } from '@/lib/ingestion/email-parser';
import fs from 'node:fs/promises';
import path from 'node:path';

function normalizeSubject(subject: string): string {
  let s = (subject || '').toLowerCase();
  s = s.replace(/^\s*(re|fwd|fw):\s*/g, '');
  s = s.replace(/\s+/g, ' ').trim();
  return s;
}

function parseDate(d: string): number {
  const t = Date.parse(d);
  return isNaN(t) ? 0 : t;
}

async function resolveMboxPath(): Promise<string> {
  const mailDir = path.resolve(process.cwd(), '..', 'Mail');
  try {
    const entries = await fs.readdir(mailDir);
    const mbox = entries.find((f) => f.endsWith('.mbox'));
    if (mbox) return path.join(mailDir, mbox);
  } catch {}
  return path.join(mailDir, 'LEGAL-DIVORCE STUFF-EVIDENCE.mbox');
}

export async function getEmailStats() {
  const mboxPath = await resolveMboxPath();
  const emails = await parseAllEmails(mboxPath);
  // Threading by normalized subject
  const threads = new Map<string, EmailEvent[]>();
  for (const e of emails as EmailEvent[]) {
    const key = normalizeSubject(e.subject || '');
    const arr = threads.get(key) || [];
    arr.push(e);
    threads.set(key, arr);
  }

  // Compute response latencies by actor
  const latencies: Record<string, number[]> = {};
  const countsByActor: Record<string, number> = {};
  const continuancesByActor: Record<string, number> = {};

  for (const list of threads.values()) {
    list.sort((a, b) => parseDate(a.date) - parseDate(b.date));
    for (let i = 1; i < list.length; i++) {
      const prev = list[i - 1];
      const curr = list[i];
      if (prev.actor !== curr.actor) {
        const dt = (parseDate(curr.date) - parseDate(prev.date)) / (1000 * 60 * 60 * 24); // days
        if (!isNaN(dt) && dt >= 0 && dt < 60) {
          (latencies[curr.actor] ||= []).push(dt);
        }
      }
    }
  }

  for (const e of emails as EmailEvent[]) {
    countsByActor[e.actor] = (countsByActor[e.actor] || 0) + 1;
    const text = `${e.subject} ${e.body}`.toLowerCase();
    if (/(continuance|postpone|reschedule|adjourn)/i.test(text)) {
      continuancesByActor[e.actor] = (continuancesByActor[e.actor] || 0) + 1;
    }
  }

  const avgDaysByActor: Record<string, number> = {};
  for (const [actor, arr] of Object.entries(latencies)) {
    const avg = arr.reduce((a, b) => a + b, 0) / Math.max(1, arr.length);
    avgDaysByActor[actor] = Number(avg.toFixed(2));
  }

  return { countsByActor, continuancesByActor, avgDaysByActor };
}
