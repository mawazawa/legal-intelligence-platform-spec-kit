'use client';

import React from 'react';
import { AlertTriangle, Info } from 'lucide-react';

export default function PetitionerCalculationView() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-red-900 mb-2">
          PETITIONER'S CLAIMED DISTRIBUTION
        </h2>
        <p className="text-lg text-red-700">
          Rosanna Alvero's Calculation (RFO Attachment 7)
        </p>
      </div>

      {/* Warning Box */}
      <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-r-lg">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-red-900 mb-2 text-lg">
              Mathematical Impossibility Alert
            </h3>
            <p className="text-red-800 text-sm leading-relaxed">
              Petitioner's calculation attempts to both <strong>deduct</strong> $77,779.88 from net proceeds
              <em> and </em><strong>add it back</strong> to create an artificial total. This violates
              fundamental arithmetic principles and California family law.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Calculation */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 border-b-2 border-red-300 pb-2">
          Petitioner's Flawed Calculation Steps
        </h3>

        {/* Step 1 */}
        <div className="bg-white border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 text-red-800 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                1
              </div>
              <h4 className="font-bold text-lg text-slate-900">Starting Point: Net Proceeds</h4>
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900">
              $280,355.83
            </div>
          </div>
          <p className="text-sm text-slate-700 ml-13">
            Actual net escrow proceeds from property sale (May 30, 2025)
          </p>
          <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                <strong>Source:</strong> Final Sellers Closing Statement, Line 603
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 - THE ERROR */}
        <div className="bg-red-50 border-4 border-red-500 rounded-lg p-6 relative">
          <div className="absolute -top-3 left-6 bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold">
            ⚠️ MATHEMATICAL ERROR
          </div>
          <div className="flex items-start justify-between mb-4 mt-2">
            <div className="flex items-center gap-3">
              <div className="bg-red-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                2
              </div>
              <h4 className="font-bold text-lg text-red-900">"Add Back" Mortgage Arrears</h4>
            </div>
            <div className="text-2xl font-mono font-bold text-red-900">
              + $77,779.88
            </div>
          </div>
          <p className="text-sm text-red-800 ml-13 mb-3">
            <strong>FLAW:</strong> Petitioner adds back arrears that were already paid from proceeds
          </p>
          <div className="bg-white border-2 border-red-300 p-4 rounded ml-13">
            <p className="text-sm font-mono text-red-900 mb-2">
              $280,355.83 + $77,779.88 = <span className="font-black">$358,155.71</span>
            </p>
            <p className="text-xs text-red-700 italic">
              This "artificial total" ignores that the $77,779.88 was already paid to the mortgage lender at closing
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="bg-white border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 text-red-800 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                3
              </div>
              <h4 className="font-bold text-lg text-slate-900">Calculate Petitioner's 35% Share</h4>
            </div>
            <div className="text-2xl font-mono font-bold text-red-900">
              $125,354.50
            </div>
          </div>
          <div className="ml-13 space-y-2">
            <p className="text-sm font-mono text-slate-700">
              35% × $358,155.71 = $125,354.50
            </p>
            <p className="text-xs text-slate-600 italic">
              Based on the artificially inflated total from Step 2
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="bg-white border-2 border-red-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-100 text-red-800 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                4
              </div>
              <h4 className="font-bold text-lg text-slate-900">Deduct Tax Withholding Credit</h4>
            </div>
            <div className="text-2xl font-mono font-bold text-red-900">
              - $8,901.50
            </div>
          </div>
          <div className="ml-13 space-y-2">
            <p className="text-sm font-mono text-slate-700">
              $125,354.50 - $8,901.50 = <span className="font-black">$116,453.00</span>
            </p>
            <p className="text-xs text-slate-600 italic">
              65% of $13,694.62 FTB withholding (claimed but unverified)
            </p>
          </div>
        </div>

        {/* Final Result */}
        <div className="bg-gradient-to-br from-red-100 to-red-200 border-4 border-red-500 rounded-lg p-8 text-center">
          <h3 className="text-sm font-bold text-red-800 mb-2 uppercase tracking-wide">
            Petitioner's Final Claim
          </h3>
          <div className="text-5xl font-black text-red-900 mb-4">
            $116,453.00
          </div>
          <div className="flex items-center justify-center gap-2 text-red-700">
            <AlertTriangle className="h-5 w-5" />
            <span className="text-sm font-semibold">
              $27,229.96 MORE than entitled 35% share
            </span>
          </div>
        </div>
      </div>

      {/* The Mathematical Impossibility Explained */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          Why This Calculation Is Impossible
        </h3>
        <div className="space-y-3 text-sm text-slate-700">
          <p>
            <strong>The Core Problem:</strong> Petitioner's formula simplifies to:
          </p>
          <div className="bg-white p-4 rounded border-l-4 border-red-500 font-mono text-xs">
            <div>Available Funds = (Gross Sale - Debt Paid) + Debt Paid</div>
            <div className="text-slate-500 mt-2">↓ Simplifies to</div>
            <div className="text-red-900 font-bold">Available Funds = Gross Sale</div>
          </div>
          <p>
            This would mean <strong>no debts were ever paid</strong>, which contradicts the closing statement
            showing $759,364.32 paid to the mortgage lender.
          </p>
          <p>
            <strong>Legal Precedent:</strong> No California case law supports "adding back" debts already
            paid from community property proceeds. This methodology would create an impermissible windfall
            to the non-paying spouse.
          </p>
        </div>
      </div>
    </div>
  );
}
