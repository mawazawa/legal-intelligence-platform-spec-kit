"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Printer, Download, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { parseAllEmails } from '@/lib/ingestion/email-parser';
import { buildCitations } from '@/lib/citations';

const ResponsiveDeclarationPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);
  const [declarationContent, setDeclarationContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const printDocument = () => {
    window.print();
  };

  // Load declaration content
  useEffect(() => {
    const loadDeclaration = async () => {
      try {
        // Try to load from API first
        const response = await fetch('/api/case-financials/source?file=responsive_declaration');
        if (response.ok) {
          const data = await response.json();
          setDeclarationContent(data.text || '');
        } else {
          // Fallback to default content
          setDeclarationContent(getDefaultDeclarationContent());
        }
      } catch (error) {
        console.error('Error loading declaration:', error);
        setDeclarationContent(getDefaultDeclarationContent());
      } finally {
        setIsLoading(false);
      }
    };

    loadDeclaration();
  }, []);

  const getDefaultDeclarationContent = () => {
    return `RESPONSIVE DECLARATION OF MATHIEU WAUTERS
IN SUPPORT OF FL-320 RESPONSIVE DECLARATION

I, MATHIEU WAUTERS, declare as follows:

1. I am the Respondent in this action. I have personal knowledge of the facts set forth in this declaration and, if called as a witness, I could and would competently testify to them.

2. I submit this declaration in response to Petitioner's Request for Order filed on June 26, 2025. I respectfully request that the Court deny Petitioner's requests for the reasons set forth below.

3. PROPERTY DIVISION CALCULATIONS

a. Petitioner's Calculation Errors
Petitioner has incorrectly applied the Statement of Decision by adding mortgage arrears back to net proceeds, then deducting them entirely from my share. This creates an unfair double-counting that violates the Court's 65/35 allocation.

b. Correct Calculation Methodology
The correct calculation should apply the 65/35 split to the actual net proceeds of $280,355.83, resulting in:
- Respondent (65%): $182,231.29
- Petitioner (35%): $98,124.54

4. STATEMENT OF DECISION COMPLIANCE

a. The Court's Statement of Decision clearly allocates 65% to Respondent and 35% to Petitioner based on the constructive net value.

b. Petitioner's methodology violates this allocation by manipulating the base amount through arrears add-back.

5. WATTS CHARGES AND ADJUSTMENTS

a. Petitioner's Watts charges calculation includes items that should be excluded under the $122/month cutoff established by the Court.

b. The household items allocation should be reversed, resulting in a $15,000 credit to Respondent.

6. TAX WITHHOLDING TREATMENT

a. Both parties should receive equal treatment regarding tax withholding credits.

b. Petitioner's request for exclusive credit violates the principle of equal treatment.

7. I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.

DATED: ${new Date().toLocaleDateString('en-US', { 
  year: 'numeric', 
  month: 'long', 
  day: 'numeric'
})}

Respectfully submitted,

MATHIEU WAUTERS
Respondent, in pro per`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-semibold text-slate-700">Loading declaration...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Responsive Declaration (FL-320)</h1>
          <p className="text-slate-600">Court-ready responsive declaration with Tom Rotert's points and authorities</p>
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

        {/* Declaration Document */}
        <div ref={printRef} className="declaration legal-document bg-white shadow-lg">
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

          {/* Declaration Content */}
          <div className="declaration-content">
            <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
              {declarationContent}
            </div>
          </div>

          {/* Tom Rotert's Points and Authorities */}
          <div className="mt-12">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  TOM ROTERT'S POINTS AND AUTHORITIES
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Point 1 */}
                  <div className="border-l-4 border-blue-200 pl-4">
                    <h4 className="font-semibold text-blue-900 mb-2">POINT I: PROPERTY DIVISION CALCULATIONS</h4>
                    <p className="text-sm text-slate-700 mb-2">
                      Petitioner's methodology violates the Statement of Decision by double-counting mortgage arrears.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Family Code § 2550</Badge>
                      <Badge variant="outline" className="text-xs">Statement of Decision</Badge>
                      <Badge variant="outline" className="text-xs">Closing Statement</Badge>
                    </div>
              </div>

                  {/* Point 2 */}
                  <div className="border-l-4 border-blue-200 pl-4">
                    <h4 className="font-semibold text-blue-900 mb-2">POINT II: WATTS CHARGES CALCULATION</h4>
                    <p className="text-sm text-slate-700 mb-2">
                      Petitioner's Watts charges include items exceeding the $122/month cutoff established by the Court.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Watts v. Watts</Badge>
                      <Badge variant="outline" className="text-xs">Statement of Decision</Badge>
                      <Badge variant="outline" className="text-xs">Court Order</Badge>
              </div>
            </div>

                  {/* Point 3 */}
                  <div className="border-l-4 border-blue-200 pl-4">
                    <h4 className="font-semibold text-blue-900 mb-2">POINT III: TAX WITHHOLDING TREATMENT</h4>
                    <p className="text-sm text-slate-700 mb-2">
                      Both parties should receive equal treatment regarding tax withholding credits per Form 593.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Form 593</Badge>
                      <Badge variant="outline" className="text-xs">Closing Statement</Badge>
                      <Badge variant="outline" className="text-xs">Equal Treatment</Badge>
              </div>
            </div>

                  {/* Point 4 */}
                  <div className="border-l-4 border-blue-200 pl-4">
                    <h4 className="font-semibold text-blue-900 mb-2">POINT IV: HOUSEHOLD ITEMS ALLOCATION</h4>
                    <p className="text-sm text-slate-700 mb-2">
                      The $15,000 household items allocation should be reversed to correct the Statement of Decision.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="text-xs">Statement of Decision</Badge>
                      <Badge variant="outline" className="text-xs">Correction</Badge>
                      <Badge variant="outline" className="text-xs">$15,000 Reversal</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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

export default ResponsiveDeclarationPage;