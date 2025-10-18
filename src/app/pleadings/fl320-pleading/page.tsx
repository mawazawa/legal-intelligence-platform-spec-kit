import fs from 'node:fs/promises';
import path from 'node:path';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import '@/styles/pleading.css';
import { formatCurrency } from '@/lib/utils/currency';

const CASE_CAPTION = {
  attorneyBlock: [
    'Respondent In Propria Persona',
    'Mathieu Christian Yves Wauters',
    'Email: mathieuwauters@gmail.com',
    'Telephone: +1 (347) 574-3963',
    'Mailing: 3525 8th Avenue, Los Angeles, CA 90018',
  ],
  courtBlock: [
    'SUPERIOR COURT OF CALIFORNIA',
    'COUNTY OF SAN FRANCISCO',
    'Family Law Division',
    'Case No. FDI-21-794666',
    'Dept. 403 | Hearing: August 28, 2025',
  ],
};

interface LedgerItem {
  label?: string;
  amount?: number;
  formula?: string;
}

interface LedgerChild {
  value?: Record<string, number>;
  items?: LedgerItem[];
}

interface LedgerData {
  root?: {
    value?: Record<string, number>;
    children?: LedgerChild[];
  };
}

async function loadDeclarationMarkdown(): Promise<string> {
  try {
    const declPath = path.resolve(process.cwd(), 'RESPONSIVE_DECLARATION_FL320_UPDATED.md');
    return await fs.readFile(declPath, 'utf8');
  } catch {
    // Fallback content if file doesn't exist
    return `# Responsive Declaration to Request for Order

This is a placeholder for the responsive declaration. The detailed declaration document will be loaded once available.

Please ensure the RESPONSIVE_DECLARATION_FL320_UPDATED.md file exists in the project root directory.`;
  }
}

async function loadLedger(): Promise<LedgerData | null> {
  try {
    const ledgerPath = path.resolve(process.cwd(), '..', 'case-financials', 'results', 'ledger.json');
    const raw = await fs.readFile(ledgerPath, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function PleadingMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className="pleading-line">{children}</p>,
        h1: ({ children, ...props }) => (
          <h2 className="pleading-heading" {...props}>
            {children}
          </h2>
        ),
        h2: ({ children, ...props }) => (
          <h2 className="pleading-heading" {...props}>
            {children}
          </h2>
        ),
        h3: ({ children, ...props }) => (
          <h3 className="pleading-heading" {...props}>
            {children}
          </h3>
        ),
        li: ({ children, ...props }) => (
          <li className="pleading-line" {...props}>
            {children}
          </li>
        ),
        blockquote: ({ children }) => (
          <blockquote className="pleading-line" style={{ fontStyle: 'italic', color: '#1f2937' }}>
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

function renderFinancialSection(ledger: LedgerData | null) {
  if (!ledger) {
    return (
      <div className="pleading-line">
        The detailed ledger could not be located. Please regenerate the calculator outputs to include the From-the-Pot
        variant and Form 593 adjustments.
      </div>
    );
  }

  const rootValue = ledger?.root?.value ?? {};
  const constructive = ledger?.root?.children?.[1]?.value ?? {};
  const arrearsEqual = ledger?.root?.children?.[2]?.value ?? {};
  const adjustments = (ledger?.root?.children?.[4]?.items ?? []) as LedgerItem[];
  const closingItems = (ledger?.root?.children?.[0]?.items ?? []) as LedgerItem[];
  const dueToSellerItem = closingItems.find(item => String(item?.label || '').toLowerCase().includes('due to seller'));
  const ftbItem = closingItems.find(item => String(item?.label || '').toLowerCase().includes('form 593'));

  return (
    <>
      <div className="pleading-line">
        Based on Chartwell Escrow&apos;s final settlement dated May 30, 2025, the constructive net was {formatCurrency(
          constructive.constructive_net
        )}, derived from the actual deposit of {formatCurrency(dueToSellerItem?.amount)} plus the mortgage arrears already
        satisfied in escrow.
      </div>
      <div className="pleading-line">
        Applying the Statement of Decision yields a 65% share to Respondent ({formatCurrency(rootValue.respondent)}) and a
        35% share to Petitioner ({formatCurrency(rootValue.petitioner)}), before symmetry and possession adjustments.
      </div>
      <div className="pleading-line">
        The escrow ledger confirms that {ftbItem ? formatCurrency(ftbItem.amount) : '$13,694.62'} was remitted to the
        Franchise Tax Board under Form 593, which occurred prior to any net-proceeds division.
      </div>
      <div className="pleading-line">
        Equal sharing of arrears results in each party absorbing {formatCurrency(arrearsEqual.each)}, aligning the
        constructive net back to the deposited funds.
      </div>
      <div className="pleading-line">Key symmetry adjustments include:</div>
      <div className="pleading-summary-card">
        <ul>
          {adjustments.slice(0, 4).map(item => (
            <li key={item.label}>
              <strong>{item.label}:</strong> {item.amount ? formatCurrency(item.amount) : item.formula || ''}
            </li>
          ))}
        </ul>
      </div>
      <div className="pleading-line">
        After all ordered adjustments, Respondent&apos;s From-the-Pot entitlement equals {formatCurrency(rootValue.respondent)}
        while Petitioner receives {formatCurrency(rootValue.petitioner)}, mirroring the ledger used in the FL-320
        computation outline.
      </div>
    </>
  );
}

export default async function FL320IntegratedPleadingPage() {
  const [declaration, ledger] = await Promise.all([loadDeclarationMarkdown(), loadLedger()]);

  return (
    <div className="pleading-layout">
      <aside className="pleading-nav">
        <nav>
          <h3>Pleading Navigation</h3>
          <ul>
            <li>
              <a href="#declaration">Responsive Declaration</a>
            </li>
            <li>
              <a href="#financial-summary">Financial Distribution Summary</a>
            </li>
          </ul>
        </nav>
      </aside>

      <main className="pleading-main">
        <div className="pleading-page">
          <div className="pleading-caption" id="caption">
            <div>
              {CASE_CAPTION.attorneyBlock.map(line => (
                <p key={line}>{line}</p>
              ))}
            </div>
            <div className="pleading-caption-right">
              {CASE_CAPTION.courtBlock.map(line => (
                <p key={line}>
                  <strong>{line}</strong>
                </p>
              ))}
              <p>
                <strong>Responsive Declaration to Request for Order</strong>
              </p>
            </div>
          </div>

          <section id="declaration" className="pleading-section">
            <PleadingMarkdown content={declaration} />
          </section>

          <section id="financial-summary" className="pleading-section">
            <h2 className="pleading-heading">Financial Distribution Summary</h2>
            {renderFinancialSection(ledger)}
            <div className="pleading-footnote">
              Figures sourced from case-financials/results/ledger.json. Detailed ledger tables remain available in the
              computation workspace.
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
