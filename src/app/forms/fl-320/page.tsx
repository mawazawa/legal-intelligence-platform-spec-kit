'use client';

/**
 * FL-320 Form Demo Page
 * Demonstrates the FL-320 Responsive Declaration form component
 */

import React from 'react';
import FL320Form from '@/components/forms/FL320Form';

export default function FL320Page() {
  // Sample data for demonstration
  const sampleData = {
    caseNumber: 'FDI-21-794666',
    attorney: {
      name: 'Tom Rotert',
      barNumber: '123456',
      firmName: 'Rotert Law Firm',
      address: '123 Main Street',
      city: 'Sacramento',
      state: 'CA',
      zipCode: '95814',
      telephone: '(916) 555-1234',
      fax: '(916) 555-5678',
      email: 'trotert@example.com',
      attorneyFor: 'Respondent',
    },
    court: {
      county: 'SACRAMENTO',
      streetAddress: '720 9th Street',
      mailingAddress: 'Same',
      cityZip: 'Sacramento, CA 95814',
      branchName: 'Main',
    },
    parties: {
      petitioner: 'John Doe',
      respondent: 'Jane Doe',
      otherParent: '',
    },
    hearing: {
      date: '01/15/2026',
      time: '9:00 AM',
      department: 'Dept 53',
    },
    responses: {
      restrainingOrder: 'none' as const,
      childCustody: 'do-not-consent' as const,
      childCustodyAgreement: 'Joint legal custody with primary physical custody to Respondent',
      childSupport: 'guideline' as const,
      childSupportAgreement: '',
      spousalSupport: 'do-not-consent' as const,
      spousalSupportAgreement: 'No spousal support requested',
    },
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold mb-4">FL-320 Form</h1>
          <p className="text-gray-600 mb-4">
            Responsive Declaration to Request for Order - California Judicial Council Form
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.print()}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Print Form
            </button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700">
              Save as PDF
            </button>
          </div>
        </div>

        <div className="flex justify-center">
          <FL320Form data={sampleData} />
        </div>
      </div>

      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
