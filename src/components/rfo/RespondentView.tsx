"use client";

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '@/lib/transforms/dataTransform';
import { PageView } from '@/components/case/PageView';

interface LedgerValue {
  due_to_seller?: number;
  respondent?: number;
  petitioner?: number;
  r65?: number;
  p35?: number;
  constructive_net?: number;
  [key: string]: number | undefined;
}

interface LedgerNode {
  value?: LedgerValue;
  children?: LedgerNode[];
}

interface Ledger {
  root?: LedgerNode;
}

interface RespondentViewProps {
  fl320Content: {
    text: string;
    meta: Record<string, unknown>;
    pages: number;
  } | null;
  ledger: Ledger | null;
}

const RespondentView = React.memo<RespondentViewProps>(({ fl320Content, ledger }) => {
  if (!fl320Content && !ledger) {
    return (
      <div className="text-center text-slate-500 py-8">
        <CheckCircle2 className="h-8 w-8 mx-auto mb-2" />
        <p>Respondent FL-320 content not available</p>
      </div>
    );
  }

  // Safe accessor for nested ledger values
  const d2s = ledger?.root?.children?.[0]?.value?.due_to_seller;
  const r65 = ledger?.root?.children?.[1]?.value?.r65;
  const p35 = ledger?.root?.children?.[1]?.value?.p35;
  const fr = ledger?.root?.value?.respondent;
  const fp = ledger?.root?.value?.petitioner;
  const cn = ledger?.root?.children?.[1]?.value?.constructive_net;
  const outlinePages: string[] = [
    [
      'RESPONSIVE DECLARATION (FL-320) — Computation Outline',
      '',
      'From‑the‑Pot Final Distribution (ledger-based):',
      `  Respondent: ${fmt(fr)}`,
      `  Petitioner: ${fmt(fp)}`,
      '  Split: 65% / 35% per Statement of Decision',
      '',
      'Key Corrections:',
      '  • Do not add arrears back to net proceeds; they were already paid at close.',
      '  • Apply 65/35 to constructive net, then share arrears equally.',
      '  • Mirror Form 593 treatment for both parties for symmetry.',
      '',
      'Citations: Statement of Decision (65/35, Watts, items), Closing Statement (Due to Seller).',
    ].join('\n'),
    [
      'CALCULATION SNAPSHOT',
      '',
      `Net proceeds (Due to Seller): ${fmt(d2s)}`,
      `Constructive net: ${fmt(cn)}`,
      `SOD 65% (Respondent): ${fmt(r65)}`,
      `SOD 35% (Petitioner): ${fmt(p35)}`,
      '',
      'Adjustments (selected):',
      '  • Watts fixed; $122/mo cutoff; symmetry credit.',
      '  • Household items flip (+$15,000 to Respondent).',
    ].join('\n'),
  ];

  return (
    <div
      role="tabpanel"
      id="respondent-tabpanel"
      aria-labelledby="respondent-tab"
      className="space-y-4 text-sm leading-relaxed"
    >
      {/* Document Information - Compact for Letter Size */}
      <div className="bg-white border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-700 font-bold text-lg mb-3 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          RESPONDENT'S RESPONSIVE DECLARATION (FL-320)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2 text-sm">DOCUMENT INFORMATION</h4>
            <div className="text-xs text-slate-700 space-y-1">
              <div><strong>Filed:</strong> {new Date().toLocaleDateString()}</div>
              <div><strong>Pages:</strong> {fl320Content?.pages || 'TBD'}</div>
              <div><strong>Respondent:</strong> Mathieu Wauters</div>
              <div><strong>Hearing:</strong> August 28, 2025</div>
              <div><strong>Case No:</strong> FDI-21-794666</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2 text-sm">KEY REBUTTALS</h4>
            <div className="text-xs text-slate-700 space-y-1">
              <div>• Correct net proceeds calculation</div>
              <div>• Proper 65/35 Statement of Decision application</div>
              <div>• Watts charges symmetry and cutoff</div>
              <div>• Tax withholding equal treatment</div>
              <div>• Household items reversal (+$15,000)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Correct Calculation - Compact for Letter Size */}
      <div className="bg-white border border-blue-200 rounded-lg p-4">
        <h3 className="text-blue-700 font-bold text-lg mb-3">RESPONDENT'S CORRECT CALCULATION</h3>
        <div className="space-y-3">
          <div className="bg-blue-100 p-3 rounded border border-blue-200 text-xs">
            <strong>Step 1:</strong> Use actual net proceeds from closing statement<br/>
            <span className="ml-4">Net proceeds: $280,355.83 (per closing statement)</span>
          </div>
          <div className="bg-blue-100 p-3 rounded border border-blue-200 text-xs">
            <strong>Step 2:</strong> Divide 65/35 per Statement of Decision<br/>
            <span className="ml-4">Petitioner (35%): $280,355.83 × 0.35 = $98,124.54</span><br/>
            <span className="ml-4">Respondent (65%): $280,355.83 × 0.65 = $182,231.29</span>
          </div>
          <div className="bg-blue-100 p-3 rounded border border-blue-200 text-xs">
            <strong>Step 3:</strong> Apply Statement of Decision adjustments<br/>
            <span className="ml-4">Watts charges, furniture, rental income offsets</span>
          </div>
          <div className="bg-blue-100 p-3 rounded border border-blue-200 text-xs">
            <strong>Step 4:</strong> Account for tax obligations<br/>
            <span className="ml-4">Petitioner's withholding: $13,694.62</span><br/>
            <span className="ml-4">Respondent's estimated tax: $25,432.88</span>
          </div>
        </div>
      </div>

      {/* Financial Summary - Compact for Letter Size */}
      {ledger && (
        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-700 font-bold text-lg mb-3">FINANCIAL SUMMARY</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2 text-sm">FROM LEDGER</h4>
              <div className="text-xs text-slate-700 space-y-1">
                <div><strong>Net Proceeds:</strong> {fmt((ledger as any)?.root?.children?.[0]?.value?.due_to_seller)}</div>
                <div><strong>Respondent (65%):</strong> {fmt((ledger as any)?.root?.value?.respondent)}</div>
                <div><strong>Petitioner (35%):</strong> {fmt((ledger as any)?.root?.value?.petitioner)}</div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2 text-sm">KEY ADJUSTMENTS</h4>
              <div className="text-xs text-slate-700 space-y-1">
                <div>• Watts charges: Fixed cutoff, symmetry credit</div>
                <div>• Household items: +$15,000 to Respondent</div>
                <div>• Tax withholding: Equal treatment</div>
                <div>• Rental income: Proper offset calculations</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Page View - Compact for Letter Size */}
      {ledger && (
        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-700 font-bold text-lg mb-3">FL‑320 — PAGE VIEW (Computed Outline)</h3>
          <PageView pages={outlinePages} />
        </div>
      )}

      {/* Content Preview - Compact for Letter Size */}
      {fl320Content && (
        <div className="bg-white border border-blue-200 rounded-lg p-4">
          <h3 className="text-blue-700 font-bold text-lg mb-3">FL-320 CONTENT PREVIEW</h3>
          <div className="bg-slate-50 p-3 rounded border border-blue-200 max-h-64 overflow-y-auto">
            <pre className="text-xs text-slate-700 whitespace-pre-wrap font-mono">
              {fl320Content.text.substring(0, 2000)}
              {(fl320Content.text.length > 2000) && '\n\n[... Content truncated for display ...]'}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
});
RespondentView.displayName = 'RespondentView';

export default RespondentView;
