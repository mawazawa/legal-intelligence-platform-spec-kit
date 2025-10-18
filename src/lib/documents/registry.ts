import fs from 'node:fs';
import path from 'node:path';

export interface CaseDocument {
  id: string;
  title: string;
  filePath: string;
  displayPath: string;
  category: string;
  tags: string[];
  summary?: string;
  source?: string;
  slug?: string;
  href?: string;
  lastModified?: string;
}

export interface DocumentGroup {
  id: string;
  title: string;
  description?: string;
  documents: CaseDocument[];
}

const CASE_ROOT = path.resolve(process.cwd(), '..');

const TYPE_CATEGORY_MAP: Record<string, string> = {
  'closing/statement': 'Financial Evidence',
  'respondent/fl320': 'Responsive Filings',
  'petitioner/rfo': 'Petitioner Filings',
  'lender/payoff': 'Financial Evidence',
  'tax/form': 'Tax & Withholding',
  'tax/withholding': 'Tax & Withholding',
};

const KEYWORD_TAGS: Array<{ test: RegExp; tags: string[] }> = [
  { test: /closing|settlement|escrow|seller/i, tags: ['Closing Statement', 'Financial'] },
  { test: /schedule|ledger|results|calc|variant|from-the-pot/i, tags: ['Calculator', 'Scenario'] },
  { test: /form\s?593|withholding|ftb/i, tags: ['Tax', 'Form 593'] },
  { test: /judgment|statement[-_\s]?of[-_\s]?decision|sod/i, tags: ['Judgment', 'Order'] },
  { test: /rfo|responsive|declaration|fl[-_\s]?320/i, tags: ['RFO', 'Responsive Filing'] },
  { test: /email|mbox|communication/i, tags: ['Email', 'Correspondence'] },
  { test: /timeline|schedule|chronology/i, tags: ['Timeline'] },
  { test: /exhibit|packet/i, tags: ['Exhibit'] },
];

function beautifyFileName(fileName: string): string {
  const name = fileName.replace(/\.[^.]+$/, '');
  const tokens = name
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .split(' ');
  return tokens
    .map(token => {
      if (token.toUpperCase() === token && token.length <= 4) {
        return token.toUpperCase();
      }
      return token.charAt(0).toUpperCase() + token.slice(1).toLowerCase();
    })
    .join(' ');
}

function deriveTags(title: string): string[] {
  const found = new Set<string>();
  KEYWORD_TAGS.forEach(({ test, tags }) => {
    if (test.test(title)) {
      tags.forEach(tag => found.add(tag));
    }
  });
  if (found.size === 0) {
    found.add('General');
  }
  return Array.from(found);
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80);
}

function safeStat(p: string) {
  try {
    return fs.statSync(p);
  } catch {
    return null;
  }
}

function buildDocument(args: {
  relativePath: string;
  category: string;
  summary?: string;
  preferredTitle?: string;
}): CaseDocument {
  const absolutePath = path.resolve(CASE_ROOT, args.relativePath);
  const fileName = path.basename(args.relativePath);
  const title = args.preferredTitle ?? beautifyFileName(fileName);
  const id = slugify(title || fileName || `doc-${Date.now()}`);
  const stat = safeStat(absolutePath);

  return {
    id,
    title,
    filePath: absolutePath,
    displayPath: args.relativePath,
    category: args.category,
    tags: deriveTags(`${title} ${args.relativePath}`),
    summary: args.summary,
    slug: slugify(fileName),
    href: `#doc-${id}`,
    lastModified: stat ? stat.mtime.toISOString() : undefined,
  };
}

function loadJson<T>(relative: string): T | null {
  try {
    const absolute = path.resolve(CASE_ROOT, relative);
    const raw = fs.readFileSync(absolute, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

interface SourceIndexEntry {
  type: string;
  slug: string;
  path: string;
  filename: string;
  pages?: number;
  date?: string;
}

interface ExhibitRegistry {
  exhibits: Array<{
    no: number;
    title: string;
    path: string;
    type: string;
    slug: string;
  }>;
}

export async function loadCaseDocumentRegistry(): Promise<DocumentGroup[]> {
  const documents: CaseDocument[] = [];

  const sourceIndex = loadJson<{ docs: SourceIndexEntry[] }>('case-financials/sources/index.json');
  if (sourceIndex?.docs) {
    sourceIndex.docs.forEach(entry => {
      const category = TYPE_CATEGORY_MAP[entry.type] ?? 'Supporting Evidence';
      const preferredTitle = beautifyFileName(entry.filename);
      const relativePath = path.join('case-financials', 'sources', entry.path, entry.filename);
      documents.push(
        buildDocument({
          relativePath,
          category,
          preferredTitle,
          summary: `${entry.type.replace('/', ' › ')} · ${entry.pages ?? '?'} pages`,
        })
      );
    });
  }

  const exhibitsJson = loadJson<ExhibitRegistry>('case-financials/exhibits/exhibits.json');
  if (exhibitsJson?.exhibits) {
    exhibitsJson.exhibits.slice(0, 25).forEach(ex => {
      documents.push(
        buildDocument({
          relativePath: path.join('case-financials', 'exhibits', ex.path),
          category: 'Exhibits',
          preferredTitle: ex.title || beautifyFileName(ex.slug),
          summary: `Exhibit #${ex.no}`,
        })
      );
    });
  }

  const resultsDir = path.resolve(CASE_ROOT, 'case-financials', 'results');
  const importantResults = [
    'ledger.json',
    'schedule.md',
    'results.json',
    'closing-statement-extract.txt',
    'withholding-evidence.md',
  ];
  importantResults.forEach(file => {
    const absolute = path.join(resultsDir, file);
    if (fs.existsSync(absolute)) {
      documents.push(
        buildDocument({
          relativePath: path.join('case-financials', 'results', file),
          category: 'Calculator Outputs',
          preferredTitle: beautifyFileName(file),
        })
      );
    }
  });

  const judgementDocs = [
    {
      path: 'legal-intelligence-platform/Judgment_copy_2_OCR.txt',
      title: 'Judgment & Statement of Decision (OCR)',
      summary: 'Primary order establishing 65/35 split and arrears rulings.',
      category: 'Judgment & Orders',
    },
    {
      path: 'legal-intelligence-platform/2023-12-28_SOD.txt',
      title: 'Statement of Decision (Structured)',
      summary: 'Structured text extract of Statement of Decision.',
      category: 'Judgment & Orders',
    },
    {
      path: 'legal-intelligence-platform/RESPONSIVE_DECLARATION_FL320_FINAL.md',
      title: 'Responsive Declaration Draft (FL-320)',
      summary: 'Latest responsive declaration outline with citations.',
      category: 'Responsive Filings',
    },
  ];
  judgementDocs.forEach(entry => {
    const absolute = path.resolve(CASE_ROOT, entry.path);
    if (fs.existsSync(absolute)) {
      documents.push(
        buildDocument({
          relativePath: entry.path,
          category: entry.category,
          preferredTitle: entry.title,
          summary: entry.summary,
        })
      );
    }
  });

  const groupsMap = new Map<string, DocumentGroup>();

  documents.forEach(doc => {
    const groupId = slugify(doc.category || 'Supporting Evidence');
    if (!groupsMap.has(groupId)) {
      groupsMap.set(groupId, {
        id: groupId,
        title: doc.category,
        description: groupDescriptions(doc.category),
        documents: [],
      });
    }
    groupsMap.get(groupId)!.documents.push(doc);
  });

  const ordered = Array.from(groupsMap.values()).map(group => ({
    ...group,
    documents: group.documents.sort((a, b) => a.title.localeCompare(b.title)),
  }));

  ordered.sort((a, b) => a.title.localeCompare(b.title));
  return ordered;
}

function groupDescriptions(category: string): string | undefined {
  switch (category) {
    case 'Judgment & Orders':
      return 'Authoritative orders and findings (65/35 split, arrears, Watts, etc.). Keep visible during calculations.';
    case 'Financial Evidence':
      return 'Closing statements, payoff letters, and other financial proof driving the ledger.';
    case 'Calculator Outputs':
      return 'Generated schedules, ledger JSON, and other auto-calculated assets.';
    case 'Tax & Withholding':
      return 'Form 593 and related withholding evidence for both parties.';
    case 'Responsive Filings':
      return 'Draft and filed materials supporting the responsive declaration.';
    case 'Exhibits':
      return 'Indexed exhibits ready for hyperlinking and packet assembly.';
    default:
      return undefined;
  }
}

export async function loadFlattenedDocuments(): Promise<CaseDocument[]> {
  const groups = await loadCaseDocumentRegistry();
  return groups.flatMap(group => group.documents);
}
