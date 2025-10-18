"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Gavel } from 'lucide-react';
import { SECTIONS } from '../constants';

export const LegalDocsSection = React.memo(() => {
  return (
    <section id={SECTIONS.LEGAL_DOCS} className="scroll-mt-20">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 flex items-center gap-3">
          <FileText className="h-8 w-8 text-purple-600" />
          Legal Documents
        </h2>
        <p className="text-slate-600">Court-ready pleadings and declarations</p>
      </div>

      <div id={SECTIONS.RESPONSIVE_DECLARATION} className="mb-12 scroll-mt-24">
        <Card className="bg-white/80 backdrop-blur-sm legal-document">
          <CardHeader>
            <CardTitle className="text-2xl">FL-320 Responsive Declaration</CardTitle>
          </CardHeader>
          <CardContent className="print-pleading">
            <p className="text-sm text-slate-600 mb-4">Respondent&apos;s responsive declaration to Petitioner&apos;s RFO regarding property division</p>
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              View Full Declaration
            </Button>
          </CardContent>
        </Card>
      </div>

      <div id={SECTIONS.ROTERT_DECLARATION} className="mb-12 scroll-mt-24">
        <Card className="bg-white/80 backdrop-blur-sm legal-document">
          <CardHeader>
            <CardTitle className="text-2xl">Thomas J. Rotert Declaration</CardTitle>
          </CardHeader>
          <CardContent className="print-pleading">
            <p className="text-sm text-slate-600 mb-4">Attorney declaration in support of Respondent&apos;s opposition</p>
            <Button variant="outline" size="sm">
              <Gavel className="h-4 w-4 mr-2" />
              View Attorney Declaration
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
});

LegalDocsSection.displayName = 'LegalDocsSection';
