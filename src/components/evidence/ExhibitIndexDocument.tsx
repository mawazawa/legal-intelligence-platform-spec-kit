/**
 * Exhibit Index Document Component
 * Generates a court-ready exhibit index for filings
 */

'use client';

import { useEffect, useState } from 'react';
import { Download, Printer } from 'lucide-react';
import { logger } from '@/lib/logging/logger';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getExhibitIndex } from '@/lib/services/evidenceService';
import type { ExhibitIndexEntry, FilingType } from '@/lib/types/evidence';

interface ExhibitIndexDocumentProps {
  filingType: FilingType;
  caseNumber?: string;
  title?: string;
}

export function ExhibitIndexDocument({
  filingType,
  caseNumber = 'FDI-21-794666',
  title,
}: ExhibitIndexDocumentProps) {
  const [exhibits, setExhibits] = useState<ExhibitIndexEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Load exhibit index for the specified filing type
     */
    async function loadExhibits() {
      try {
        logger.debug('Loading exhibit index', { filingType });
        const data = await getExhibitIndex(filingType);
        setExhibits(data);
        logger.debug('Exhibit index loaded', { count: data.length });
      } catch (error) {
        logger.error('Error loading exhibit index', error as Error);
      } finally {
        setLoading(false);
      }
    }

    loadExhibits();
  }, [filingType]);

  const handlePrint = () => {
    window.print();
  };

  const getFilingTitle = (type: FilingType): string => {
    const titles: Record<FilingType, string> = {
      'fl-320': 'Responsive Declaration to Request for Order (FL-320)',
      'opposition': 'Opposition to Request for Order',
      'rfo': 'Request for Order',
      'declaration': 'Declaration',
      'brief': 'Brief',
      'motion': 'Motion',
    };
    return titles[type] || type.toUpperCase();
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading exhibit index...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* Actions Bar */}
      <div className="flex justify-end gap-2 print:hidden">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Legal Document */}
      <Card>
        <CardContent className="p-8 md:p-12">
          {/* Court Header */}
          <div className="text-center mb-8 pb-4 border-b-2 border-black">
            <h1 className="text-xl font-bold mb-2">
              SUPERIOR COURT OF THE STATE OF CALIFORNIA
            </h1>
            <h2 className="text-lg font-semibold">
              IN AND FOR THE COUNTY OF SAN FRANCISCO
            </h2>
          </div>

          {/* Case Caption */}
          <div className="grid grid-cols-2 gap-8 mb-8 pb-6 border-b">
            <div className="space-y-2">
              <p className="font-semibold">In Re Marriage of:</p>
              <p className="ml-4">
                <span className="font-semibold">ROSANNA CLAIRE ALVERO</span>
                <br />
                (fka WAUTERS),
              </p>
              <p className="ml-16 text-muted-foreground">Petitioner,</p>
              <p className="ml-4 my-2">vs.</p>
              <p className="ml-4">
                <span className="font-semibold">MATHIEU CHRISTIAN YVES WAUTERS</span>,
              </p>
              <p className="ml-16 text-muted-foreground">Respondent.</p>
            </div>

            <div className="space-y-2 border-l pl-8">
              <p>
                <span className="font-semibold">Case No.:</span> {caseNumber}
              </p>
              <p className="mt-4 font-semibold">EXHIBIT INDEX</p>
              <p className="text-sm">
                {title || getFilingTitle(filingType)}
              </p>
            </div>
          </div>

          {/* Exhibit Index Title */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-center">EXHIBIT INDEX</h2>
          </div>

          {/* Exhibit Table */}
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b-2 border-black">
                <th className="text-left py-3 px-4 font-semibold w-24">
                  Exhibit
                </th>
                <th className="text-left py-3 px-4 font-semibold">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {exhibits.map((exhibit, index) => (
                <tr
                  key={exhibit.id}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  }`}
                >
                  <td className="py-4 px-4 font-bold text-center align-top">
                    {exhibit.exhibit_letter}
                  </td>
                  <td className="py-4 px-4 align-top">
                    <p className="text-sm leading-relaxed">
                      {exhibit.description}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Signature Block */}
          <div className="mt-12 pt-8 border-t">
            <p className="mb-8">
              I declare under penalty of perjury under the laws of the State of California
              that the foregoing exhibit index is true and correct.
            </p>

            <p className="mb-2">
              Executed on _________________, 2025, at _________________, California.
            </p>

            <div className="mt-12 flex justify-between items-end">
              <div className="w-1/2">
                <div className="border-b border-black mb-2"></div>
                <p className="text-sm">
                  MATHIEU CHRISTIAN YVES WAUTERS
                  <br />
                  Respondent
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Simple Exhibit Index List
 * For embedding in other documents
 */
interface SimpleExhibitIndexProps {
  filingType: FilingType;
  className?: string;
}

export function SimpleExhibitIndex({ filingType, className = '' }: SimpleExhibitIndexProps) {
  const [exhibits, setExhibits] = useState<ExhibitIndexEntry[]>([]);

  useEffect(() => {
    /**
     * Load exhibit index for simple display
     */
    async function loadExhibits() {
      try {
        logger.debug('Loading simple exhibit index', { filingType });
        const data = await getExhibitIndex(filingType);
        setExhibits(data);
        logger.debug('Simple exhibit index loaded', { count: data.length });
      } catch (error) {
        logger.error('Error loading exhibit index', error as Error);
      }
    }

    loadExhibits();
  }, [filingType]);

  return (
    <div className={className}>
      <h3 className="font-semibold mb-4">EXHIBIT INDEX</h3>
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-2 text-left font-semibold w-20">
              Exhibit
            </th>
            <th className="border border-gray-300 p-2 text-left font-semibold">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {exhibits.map((exhibit) => (
            <tr key={exhibit.id}>
              <td className="border border-gray-300 p-2 text-center font-bold">
                {exhibit.exhibit_letter}
              </td>
              <td className="border border-gray-300 p-2 text-sm">
                {exhibit.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
