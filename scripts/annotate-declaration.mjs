#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';

async function readFirst(...candidates) {
  for (const p of candidates) {
    try {
      return { content: await fs.readFile(p, 'utf8'), path: p };
    } catch {}
  }
  return null;
}

function parseMboxContent(content) {
  const blocks = content.split(/^From /m).filter((b) => b.trim());
  const emails = [];
  for (const block of blocks) {
    const lines = block.split('\n');
    const headers = {};
    let bodyStart = -1;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.trim() === '') { bodyStart = i + 1; break; }
      const idx = line.indexOf(':');
      if (idx > -1) headers[line.slice(0, idx).toLowerCase()] = line.slice(idx + 1).trim();
    }
    if (bodyStart === -1) continue;
    const body = lines.slice(bodyStart).join('\n').trim();
    emails.push({
      subject: headers['subject'] || '',
      from: headers['from'] || '',
      to: (headers['to'] || '').split(',').map((s) => s.trim()).filter(Boolean),
      date: headers['date'] || '',
      messageId: headers['message-id'] || '',
      body,
      source: ''
    });
  }
  return emails;
}

async function parseAllEmails(mailDir) {
  try {
    const entries = await fs.readdir(mailDir);
    const mboxes = entries.filter((f) => f.endsWith('.mbox'));
    const emails = [];
    for (const f of mboxes) {
      const p = path.join(mailDir, f);
      const raw = await fs.readFile(p, 'utf8');
      const parsed = parseMboxContent(raw).map((e) => ({ ...e, source: p }));
      emails.push(...parsed);
    }
    return emails;
  } catch {
    return [];
  }
}

function buildEmailCitations(emails) {
  const buckets = {
    mortgage_relief: ['mortgage relief', '$49,262.84', 'california mortgage relief'],
    appraisal: ['appraisal', '3525 8th', 'baldino'],
    continuance: ['continuance', 'postpone', 'reschedule', 'adjourn'],
    counsel_referral: ['berman', 'proos', 'anderson', 'marias', 'macias'],
    escrow_sale: ['escrow', 'close of escrow', 'closing statement'],
  };
  const citations = [];
  for (const [bucket, kws] of Object.entries(buckets)) {
    const matches = emails.filter((e) => kws.some((kw) => (e.subject + ' ' + e.body).toLowerCase().includes(kw))).slice(0, 10);
    matches.forEach((m, i) => {
      citations.push({
        id: `${bucket}_${i}_${m.messageId || ''}`,
        title: m.subject || 'Email',
        date: m.date,
        detail: `${m.from} → ${m.to.join(', ')} | ${m.body.substring(0, 160).replace(/\s+/g, ' ')}...`,
        file: m.source,
      });
    });
  }
  return citations;
}

async function main() {
  const root = process.cwd();
  const mailDir = path.resolve(root, '..', 'Mail');
  const source = await readFirst(
    path.join(root, 'RESPONSIVE_DECLARATION_FL320_FINAL.md'),
    path.join(root, 'RESPONSIVE_DECLARATION_FL320.md'),
  );
  if (!source) throw new Error('Declaration markdown not found');

  const emails = await parseAllEmails(mailDir);
  const emailCitations = buildEmailCitations(emails);

  const lines = [];
  lines.push(source.content.trim());
  lines.push('\n---\n');
  lines.push('## Evidence Citations (Auto-Generated)');
  lines.push('\n### Emails');
  if (!emailCitations.length) {
    lines.push('- No email citations found.');
  } else {
    for (const c of emailCitations) {
      lines.push(`- ${c.title} (${c.date || ''}) — ${c.detail}${c.file ? ` — ${c.file}` : ''}`);
    }
  }
  lines.push('\n> Note: Graph citations are available in-app when Neo4j is configured.');

  const outPath = path.join(root, 'RESPONSIVE_DECLARATION_FL320_ANNOTATED.md');
  await fs.writeFile(outPath, lines.join('\n'));
  console.log('✅ Wrote annotated declaration →', path.basename(outPath));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
