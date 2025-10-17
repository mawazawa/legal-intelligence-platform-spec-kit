"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { PageView } from '@/components/case/PageView';
import { splitPages } from './pageUtils';
import { typography, tx, textColors } from '@/styles/typography';

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
      <div className={tx(typography.body.medium, textColors.tertiary, 'text-center py-8')}>
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
      className="space-y-6"
    >
      {/* Document Information */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            PETITIONER&apos;S REQUEST FOR ORDER
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className={tx(typography.label.medium, 'text-red-700 mb-2')}>DOCUMENT INFORMATION</h4>
              <div className={tx(typography.body.medium, textColors.primary, 'space-y-1')}>
                <div><strong>Filed:</strong> June 26, 2025</div>
                <div><strong>Pages:</strong> {rfoContent.pages}</div>
                <div><strong>Attorney:</strong> Selam Gezahegn, Simon Law</div>
                <div><strong>Hearing:</strong> August 28, 2025</div>
                <div><strong>Case No:</strong> FDI-21-794666</div>
              </div>
            </div>
            <div>
              <h4 className={tx(typography.label.medium, 'text-red-700 mb-2')}>KEY REQUESTS</h4>
              <div className={tx(typography.body.medium, textColors.primary, 'space-y-1')}>
                <div>• Property division with add-back of mortgage arrears</div>
                <div>• Additional Watts charges with interest</div>
                <div>• Tax withholding credit allocation</div>
                <div>• Attorney&apos;s fees and costs</div>
                <div>• Cleanup and repair cost reimbursement</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Page View (component rendering; not a PDF viewer) */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">RFO — PAGE VIEW</CardTitle>
        </CardHeader>
        <CardContent>
          <PageView pages={pages.slice(0, 1)} />
          <div className={tx(typography.caption.small, textColors.tertiary, 'mt-2')}>Showing first page for brevity. See Comparison tab for side‑by‑side navigation.</div>
        </CardContent>
      </Card>

      {/* Calculation Methodology */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">PETITIONER&apos;S CALCULATION METHODOLOGY</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className={tx(typography.body.medium, 'bg-red-100 p-4 rounded border border-red-200')}>
              <strong>Step 1:</strong> Add back mortgage arrears to net proceeds<br/>
              <span className="ml-4">$280,355.83 + $77,779.88 = $358,155.71</span>
            </div>
            <div className={tx(typography.body.medium, 'bg-red-100 p-4 rounded border border-red-200')}>
              <strong>Step 2:</strong> Divide 65/35 per Statement of Decision<br/>
              <span className="ml-4">Petitioner (35%): $358,155.71 × 0.35 = $125,354.50</span><br/>
              <span className="ml-4">Respondent (65%): $358,155.71 × 0.65 = $232,801.21</span>
            </div>
            <div className={tx(typography.body.medium, 'bg-red-100 p-4 rounded border border-red-200')}>
              <strong>Step 3:</strong> Apply tax withholding credit<br/>
              <span className="ml-4">Petitioner: $125,354.50 - $8,910.50 = <strong>$116,453.00</strong></span><br/>
              <span className="ml-4">Respondent: $232,801.21 - $77,779.88 + $8,901.50 = <strong>$163,902.83</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Preview */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-700">RFO CONTENT PREVIEW</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 p-4 rounded border border-red-200 max-h-96 overflow-y-auto">
            <pre className={tx(typography.caption.medium, textColors.primary, 'whitespace-pre-wrap font-mono')}>
              {rfoContent.text.substring(0, 3000)}
              {(rfoContent.text.length > 3000) && '\n\n[... Content truncated for display ...]'}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
});
PetitionerView.displayName = 'PetitionerView';

export default PetitionerView;
