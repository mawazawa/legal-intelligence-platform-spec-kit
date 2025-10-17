"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Printer, Download, FileText } from 'lucide-react';

const PleadingPaperPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const printDocument = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Pleading Paper Generator</h1>
          <p className="text-slate-600">Generate properly formatted legal documents with court-ready pleading paper</p>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex gap-4">
          <Button onClick={printDocument} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Print / Save as PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>

        {/* Pleading Paper Document */}
        <div ref={printRef} className="pleading-paper legal-document bg-white shadow-lg">
          {/* Court Header */}
          <div className="text-center mb-8 pt-8">
            <div className="text-sm font-bold text-slate-900 mb-2">
              SUPERIOR COURT OF CALIFORNIA
            </div>
            <div className="text-sm font-bold text-slate-900 mb-2">
              COUNTY OF SANTA CLARA
            </div>
            <div className="text-sm text-slate-700 mb-4">
              Family Court Division
            </div>
          </div>

          {/* Case Information */}
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-sm font-bold text-slate-900">
                  MATHIEU WAUTERS,
                </div>
                <div className="text-sm text-slate-700 ml-4">
                  Petitioner,
                </div>
              </div>
              <div className="text-sm text-slate-700 text-right">
                <div>Case No. FDI-21-794666</div>
                <div>Judge: Hon. [Judge Name]</div>
              </div>
            </div>
            <div className="text-center text-sm font-bold text-slate-900 mb-2">vs.</div>
            <div className="text-sm font-bold text-slate-900">
              ROSANNA ALVERO,
            </div>
            <div className="text-sm text-slate-700 ml-4">
              Respondent.
            </div>
          </div>

          {/* Document Title */}
          <div className="text-center mb-8">
            <div className="text-lg font-bold text-slate-900 mb-2">
              RESPONSIVE DECLARATION OF MATHIEU WAUTERS
            </div>
            <div className="text-sm text-slate-700">
              IN SUPPORT OF FL-320 RESPONSIVE DECLARATION
            </div>
            <div className="text-sm text-slate-700">
              Hearing Date: August 28, 2025 at 9:00 AM
            </div>
          </div>

          {/* Pleading Lines */}
          <div className="pleading-content space-y-6">
            {/* Line 1 */}
            <div className="flex">
              <div className="w-16 text-right pr-2 text-xs text-slate-500">1</div>
              <div className="flex-1 border-b border-slate-300 min-h-[1.5em]"></div>
            </div>

            {/* Line 2 */}
            <div className="flex">
              <div className="w-16 text-right pr-2 text-xs text-slate-500">2</div>
              <div className="flex-1 border-b border-slate-300 min-h-[1.5em]"></div>
            </div>

            {/* Line 3 */}
            <div className="flex">
              <div className="w-16 text-right pr-2 text-xs text-slate-500">3</div>
              <div className="flex-1 border-b border-slate-300 min-h-[1.5em]"></div>
            </div>

            {/* Sample Content */}
            <div className="mt-8">
              <div className="text-sm text-slate-700 leading-relaxed">
                <p className="mb-4">
                  <strong>1.</strong> I am the Respondent in this action. I have personal knowledge of the facts set forth in this declaration and, if called as a witness, I could and would competently testify to them.
                </p>
                <p className="mb-4">
                  <strong>2.</strong> I submit this declaration in response to Petitioner&apos;s Request for Order filed on June 26, 2025. I respectfully request that the Court deny Petitioner&apos;s requests for the reasons set forth below.
                </p>
                <p className="mb-4">
                  <strong>3.</strong> Regarding the property division calculations, Petitioner has incorrectly applied the Statement of Decision by adding mortgage arrears back to net proceeds, then deducting them entirely from my share. This creates an unfair double-counting that violates the Court&apos;s 65/35 allocation.
                </p>
                <p className="mb-4">
                  <strong>4.</strong> The correct calculation should apply the 65/35 split to the actual net proceeds of $280,355.83, resulting in $182,231.29 for Respondent and $98,124.54 for Petitioner, before any adjustments.
                </p>
                <p className="mb-4">
                  <strong>5.</strong> I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.
                </p>
              </div>
            </div>

            {/* Signature Block */}
            <div className="mt-12">
              <div className="text-sm text-slate-700">
                <div className="mb-4">
                  DATED: {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric'
                  })}
                </div>
                <div className="text-center">
                  <div className="mb-2">Respectfully submitted,</div>
                  <div className="mb-8">
                    <div className="border-b border-slate-300 w-64 mx-auto mb-2"></div>
                    <div className="text-sm font-bold">MATHIEU WAUTERS</div>
                    <div className="text-xs text-slate-600">Respondent, in pro per</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-slate-300 text-center text-xs text-slate-500">
            <div>Page 1 of 1</div>
            <div className="mt-2">
              <strong>Case:</strong> Wauters v. Alvero | <strong>Case Number:</strong> FDI-21-794666
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PleadingPaperPage;
