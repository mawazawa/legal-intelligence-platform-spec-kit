"use client";

import React from 'react';
import { AlertCircle } from 'lucide-react';
import { PageView } from '@/components/case/PageView';
import { splitPages } from './pageUtils';

interface PetitionerViewProps {
  rfoContent: {
    text: string;
    meta: Record<string, unknown>;
    pages: number;
  } | null;
}

const PetitionerView = React.memo<PetitionerViewProps>(({ rfoContent }) => {
  if (!rfoContent) {
    return (
      <div className="text-center py-8 text-slate-500">
        <AlertCircle className="h-8 w-8 mx-auto mb-2" />
        <p>Petitioner RFO content not available</p>
      </div>
    );
  }

  const pages = splitPages(rfoContent.text)

  return (
    <div
      role="tabpanel"
      id="petitioner-tabpanel"
      aria-labelledby="petitioner-tab"
      className="space-y-4 text-sm leading-relaxed"
    >
      {/* Document Information - Compact for Letter Size */}
      <div className="bg-white border border-red-200 rounded-lg p-4">
        <h3 className="text-red-700 font-bold text-lg mb-3 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          PETITIONER'S REQUEST FOR ORDER
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="text-red-700 font-semibold text-sm mb-2">DOCUMENT INFORMATION</h4>
            <div className="text-xs text-slate-700 space-y-1">
              <div><strong>Filed:</strong> June 26, 2025</div>
              <div><strong>Pages:</strong> {rfoContent.pages}</div>
              <div><strong>Attorney:</strong> Selam Gezahegn, Simon Law</div>
              <div><strong>Hearing:</strong> August 28, 2025</div>
              <div><strong>Case No:</strong> FDI-21-794666</div>
            </div>
          </div>
          <div>
            <h4 className="text-red-700 font-semibold text-sm mb-2">KEY REQUESTS</h4>
            <div className="text-xs text-slate-700 space-y-1">
              <div>• Property division with add-back of mortgage arrears</div>
              <div>• Additional Watts charges with interest</div>
              <div>• Tax withholding credit allocation</div>
              <div>• Attorney's fees and costs</div>
              <div>• Cleanup and repair cost reimbursement</div>
            </div>
          </div>
        </div>
      </div>

      {/* Page View - Compact for Letter Size */}
      <div className="bg-white border border-red-200 rounded-lg p-4">
        <h3 className="text-red-700 font-bold text-lg mb-3">RFO — PAGE VIEW</h3>
        <PageView pages={pages.slice(0, 1)} />
        <div className="text-xs text-slate-500 mt-2">Showing first page for brevity. See Comparison tab for side‑by‑side navigation.</div>
      </div>

      {/* Calculation Methodology - Compact for Letter Size */}
      <div className="bg-white border border-red-200 rounded-lg p-4">
        <h3 className="text-red-700 font-bold text-lg mb-3">PETITIONER'S CALCULATION METHODOLOGY</h3>
        <div className="space-y-3">
          <div className="bg-red-100 p-3 rounded border border-red-200 text-xs">
            <strong>Step 1:</strong> Add back mortgage arrears to net proceeds<br/>
            <span className="ml-4">$280,355.83 + $77,779.88 = $358,155.71</span>
          </div>
          <div className="bg-red-100 p-3 rounded border border-red-200 text-xs">
            <strong>Step 2:</strong> Divide 65/35 per Statement of Decision<br/>
            <span className="ml-4">Petitioner (35%): $358,155.71 × 0.35 = $125,354.50</span><br/>
            <span className="ml-4">Respondent (65%): $358,155.71 × 0.65 = $232,801.21</span>
          </div>
          <div className="bg-red-100 p-3 rounded border border-red-200 text-xs">
            <strong>Step 3:</strong> Apply tax withholding credit<br/>
            <span className="ml-4">Petitioner: $125,354.50 - $8,910.50 = <strong>$116,453.00</strong></span><br/>
            <span className="ml-4">Respondent: $232,801.21 - $77,779.88 + $8,901.50 = <strong>$163,902.83</strong></span>
          </div>
        </div>
      </div>

      {/* Content Preview - Compact for Letter Size */}
      <div className="bg-white border border-red-200 rounded-lg p-4">
        <h3 className="text-red-700 font-bold text-lg mb-3">RFO CONTENT PREVIEW</h3>
        <div className="bg-slate-50 p-3 rounded border border-red-200 max-h-64 overflow-y-auto">
          <pre className="text-xs whitespace-pre-wrap font-mono text-slate-700">
            {rfoContent.text.substring(0, 2000)}
            {(rfoContent.text.length > 2000) && '\n\n[... Content truncated for display ...]'}
          </pre>
        </div>
      </div>
    </div>
  );
});
PetitionerView.displayName = 'PetitionerView';

export default PetitionerView;
