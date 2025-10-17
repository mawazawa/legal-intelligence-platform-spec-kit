#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..', '..');

async function listPdfs(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const files = await Promise.all(entries.map(async (e) => {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) return listPdfs(p);
      return e.isFile() && e.name.toLowerCase().endsWith('.pdf') ? [p] : [];
    }));
    return files.flat();
  } catch {
    return [];
  }
}

function classify(pdfPath) {
  const name = path.basename(pdfPath).toLowerCase();
  if (name.includes('closing') && name.includes('statement')) return { type: 'closing/statement', title: 'Closing Statement' };
  if (name.includes('payoff') || name.includes('lakeview')) return { type: 'lender/payoff', title: 'Mortgage Payoff Letter/Statement' };
  if (name.includes('rfo') && name.includes('memo')) return { type: 'petitioner/rfo', title: 'Petitioner\'s RFO (MPA)' };
  if (name === 'rfo.pdf') return { type: 'petitioner/rfo', title: 'Petitioner\'s RFO' };
  if (name.includes('declaration') && name.includes('selam')) return { type: 'petitioner/declaration', title: 'Petitioner\'s Attorney Declaration' };
  return { type: 'document', title: path.basename(pdfPath) };
}

async function main() {
  const searchRoots = [repoRoot, path.join(repoRoot, 'closing-attachments'), path.join(repoRoot, 'closing-attachments-mo')];
  const pdfs = (await Promise.all(searchRoots.map(listPdfs))).flat();

  const exhibits = pdfs.map((p) => {
    const meta = classify(p);
    return {
      no: 0,
      title: meta.title,
      type: meta.type,
      path: path.relative(repoRoot, p),
      slug: path.basename(p, path.extname(p)),
    };
  });

  // Stable sort by title then path
  exhibits.sort((a, b) => (a.title || '').localeCompare(b.title || '') || a.path.localeCompare(b.path));
  exhibits.forEach((ex, i) => (ex.no = i + 1));

  const outDir = path.resolve(repoRoot, 'case-financials', 'exhibits');
  await fs.mkdir(outDir, { recursive: true });
  const outPath = path.join(outDir, 'exhibits.json');
  await fs.writeFile(outPath, JSON.stringify({ exhibits, generated_at: new Date().toISOString() }, null, 2));
  console.log(`✅ Wrote ${exhibits.length} exhibits → ${path.relative(repoRoot, outPath)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

