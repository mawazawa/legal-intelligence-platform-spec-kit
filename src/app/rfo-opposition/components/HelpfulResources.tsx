/**
 * Helpful Resources Component
 * SOLID: Single responsibility for displaying resource links
 */

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileCheck, DollarSign, FileText, Scale } from 'lucide-react';

export const HelpfulResources = React.memo(() => {
  return (
    <Card className="shadow-xl border-0 bg-gradient-to-r from-purple-50 to-purple-100 mt-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-purple-900">Helpful Resources</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link href="/fl320-checklist" target="_blank">
            <Button variant="outline" className="w-full justify-start text-left h-auto p-4">
              <FileCheck className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <div className="font-semibold">Detailed FL-320 Checklist</div>
                <div className="text-xs text-slate-600">Complete filing packet checklist</div>
              </div>
            </Button>
          </Link>

          <Link href="/final-distribution" target="_blank">
            <Button variant="outline" className="w-full justify-start text-left h-auto p-4">
              <DollarSign className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <div className="font-semibold">Financial Calculator</div>
                <div className="text-xs text-slate-600">Property division calculations</div>
              </div>
            </Button>
          </Link>

          <Link href="/documents" target="_blank">
            <Button variant="outline" className="w-full justify-start text-left h-auto p-4">
              <FileText className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <div className="font-semibold">Document Library</div>
                <div className="text-xs text-slate-600">All case documents and evidence</div>
              </div>
            </Button>
          </Link>

          <a href="https://sf.courts.ca.gov/divisions/unified-family-court" target="_blank" rel="noopener noreferrer">
            <Button variant="outline" className="w-full justify-start text-left h-auto p-4">
              <Scale className="h-5 w-5 mr-3 flex-shrink-0" />
              <div>
                <div className="font-semibold">SF Superior Court</div>
                <div className="text-xs text-slate-600">Official family court website</div>
              </div>
            </Button>
          </a>
        </div>
      </CardContent>
    </Card>
  );
});

HelpfulResources.displayName = 'HelpfulResources';
