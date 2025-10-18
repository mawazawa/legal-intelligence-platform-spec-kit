'use client';

import React from 'react';
import { CheckCircle2, Info, Scale } from 'lucide-react';

export default function RespondentCalculationView() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-green-900 mb-2">
          RESPONDENT'S CORRECT DISTRIBUTION
        </h2>
        <p className="text-lg text-green-700">
          Mathieu Wauters' Calculation (FL-320 Response)
        </p>
      </div>

      {/* Success Box */}
      <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-r-lg">
        <div className="flex items-start">
          <CheckCircle2 className="h-6 w-6 text-green-600 mr-3 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold text-green-900 mb-2 text-lg">
              Correct Legal Calculation
            </h3>
            <p className="text-green-800 text-sm leading-relaxed">
              This calculation follows California Family Code § 2550 (equal division) and the Court's
              Statement of Decision ordering 65/35 allocation. All mortgage obligations were paid at
              closing and cannot be "added back" to proceeds.
            </p>
          </div>
        </div>
      </div>

      {/* Step-by-Step Calculation */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-slate-900 border-b-2 border-green-300 pb-2">
          Correct Calculation Steps
        </h3>

        {/* Step 1 */}
        <div className="bg-white border-2 border-green-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-800 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                1
              </div>
              <h4 className="font-bold text-lg text-slate-900">Establish Net Proceeds</h4>
            </div>
            <div className="text-2xl font-mono font-bold text-slate-900">
              $280,355.83
            </div>
          </div>
          <p className="text-sm text-slate-700 ml-13 mb-3">
            Net escrow proceeds after ALL obligations paid (including $77,779.88 mortgage arrears)
          </p>
          <div className="ml-13 bg-slate-50 border border-slate-200 rounded p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Gross Sale Price:</span>
              <span className="font-mono font-semibold">$1,050,000.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Less: Closing Costs</span>
              <span className="font-mono text-red-700">($10,280.05)</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-600">Less: Mortgage Payoff</span>
              <span className="font-mono text-red-700">($759,364.32)</span>
            </div>
            <div className="text-xs text-slate-500 ml-4 mb-1">
              ↳ Principal: $681,584.44
            </div>
            <div className="text-xs text-slate-500 ml-4">
              ↳ Arrears/Late Charges: $77,779.88
            </div>
            <div className="border-t border-slate-300 pt-2 mt-2"></div>
            <div className="flex justify-between text-base font-bold">
              <span>NET PROCEEDS AVAILABLE:</span>
              <span className="font-mono text-green-700">$280,355.83</span>
            </div>
          </div>
          <div className="mt-3 bg-blue-50 border-l-4 border-blue-400 p-3 rounded ml-13">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">
                <strong>Source:</strong> Final Sellers Closing Statement, Line 603. The $77,779.88
                arrears were paid to Citibank at closing and are NOT available for distribution.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="bg-green-50 border-2 border-green-400 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-600 text-white font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                2
              </div>
              <h4 className="font-bold text-lg text-green-900">Apply Court-Ordered 65/35 Split</h4>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-sm text-green-700">Statement of Decision</span>
              <Scale className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="ml-13 space-y-4">
            <p className="text-sm text-slate-700 mb-3">
              <strong>Court Order:</strong> Property proceeds to be divided 65% to Respondent (Mathieu),
              35% to Petitioner (Rosanna), per Statement of Decision filed [date].
            </p>

            {/* Respondent's 65% */}
            <div className="bg-white border-2 border-green-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-bold text-green-800">Respondent (Mathieu Wauters)</h5>
                <span className="text-lg font-black text-green-900">65%</span>
              </div>
              <div className="text-sm font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">$280,355.83 × 0.65 =</span>
                  <span className="font-bold text-green-900">$182,231.29</span>
                </div>
              </div>
            </div>

            {/* Petitioner's 35% */}
            <div className="bg-white border-2 border-slate-300 rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h5 className="font-bold text-slate-700">Petitioner (Rosanna Alvero)</h5>
                <span className="text-lg font-black text-slate-900">35%</span>
              </div>
              <div className="text-sm font-mono space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-600">$280,355.83 × 0.35 =</span>
                  <span className="font-bold text-slate-900">$98,124.54</span>
                </div>
              </div>
            </div>

            {/* Verification */}
            <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
              <div className="flex items-start">
                <CheckCircle2 className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-semibold text-blue-900">Verification:</p>
                  <p className="text-blue-800 font-mono">$182,231.29 + $98,124.54 = $280,355.83 ✓</p>
                  <p className="text-blue-700 italic">Total equals actual net proceeds (no double-counting)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 - Optional Adjustments */}
        <div className="bg-white border-2 border-slate-200 rounded-lg p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="bg-slate-100 text-slate-800 font-bold rounded-full w-10 h-10 flex items-center justify-center text-lg">
                3
              </div>
              <h4 className="font-bold text-lg text-slate-900">Potential Adjustments (If Any)</h4>
            </div>
            <div className="text-sm text-slate-500 italic">
              Subject to Court Review
            </div>
          </div>
          <div className="ml-13 space-y-3">
            <p className="text-sm text-slate-700">
              Any legitimate adjustments (e.g., verified Watts charges, confirmed tax liabilities)
              should be applied <strong>proportionally</strong> to each party's share, not through
              artificial "add-back" schemes.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 rounded">
              <p className="text-xs text-yellow-900">
                <strong>Note on Petitioner's Claims:</strong> Petitioner seeks adjustments for:
                (1) $77,779.88 "add-back" [<em>mathematically impossible</em>], (2) Watts charges
                during her own exclusive possession [<em>legally barred</em>], (3) unverified tax
                withholding [<em>no evidence provided</em>].
              </p>
            </div>
          </div>
        </div>

        {/* Final Result */}
        <div className="bg-gradient-to-br from-green-100 to-green-200 border-4 border-green-500 rounded-lg p-8 text-center">
          <h3 className="text-sm font-bold text-green-800 mb-2 uppercase tracking-wide">
            Respondent's Correct Distribution
          </h3>
          <div className="text-5xl font-black text-green-900 mb-4">
            $182,231.29
          </div>
          <div className="flex items-center justify-center gap-2 text-green-700 mb-4">
            <CheckCircle2 className="h-5 w-5" />
            <span className="text-sm font-semibold">
              Exact 65% of actual net proceeds
            </span>
          </div>
          <div className="text-xs text-green-800 bg-white bg-opacity-50 rounded px-4 py-2 inline-block">
            Complies with Statement of Decision + Family Code § 2550
          </div>
        </div>
      </div>

      {/* Legal Authority */}
      <div className="bg-slate-50 border-2 border-slate-300 rounded-lg p-6">
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Scale className="h-5 w-5 text-blue-600" />
          Legal Authority & Principles
        </h3>
        <div className="space-y-3 text-sm text-slate-700">
          <div className="bg-white p-4 rounded border-l-4 border-blue-500">
            <p className="font-semibold text-blue-900 mb-1">California Family Code § 2550</p>
            <p className="text-slate-700 text-xs italic">
              "...the court shall... divide the community estate of the parties equally"
            </p>
            <p className="text-slate-600 text-xs mt-2">
              Unless there is a valid reason for unequal division, community property must be split
              equally. The Court's 65/35 order in the Statement of Decision controls this division.
            </p>
          </div>

          <div className="bg-white p-4 rounded border-l-4 border-purple-500">
            <p className="font-semibold text-purple-900 mb-1">Basic Accounting Principles</p>
            <p className="text-slate-600 text-xs">
              <strong>Available Proceeds = Gross Sale - All Obligations Paid</strong>
              <br/>
              Once a debt is paid from sale proceeds, it cannot be "added back" to create artificial
              distributable amounts. This violates fundamental accounting standards and creates
              mathematical impossibilities.
            </p>
          </div>

          <div className="bg-white p-4 rounded border-l-4 border-green-500">
            <p className="font-semibold text-green-900 mb-1">Respondent's Position</p>
            <p className="text-slate-600 text-xs">
              The $280,355.83 net proceeds figure already reflects payment of all obligations,
              including the $77,779.88 mortgage arrears. The correct distribution is simply:
              <strong> 65% to Respondent ($182,231.29)</strong> and <strong>35% to Petitioner
              ($98,124.54)</strong>, with any verified adjustments applied proportionally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
