import React from 'react';
import { FINANCIAL_DATA } from '../../data/case-data';

const TaxWithholdingSection: React.FC = () => {
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-base font-bold border-l-4 border-indigo-600 pl-3 py-1 bg-indigo-50">
        5. TAX WITHHOLDING ANALYSIS - CONTRADICTORY CLAIMS AND LACK OF EVIDENCE
      </h3>

      <div className="ml-4 space-y-4">
        <p className="leading-relaxed">
          <span className="font-semibold">5.1 Petitioner&apos;s Contradictory Position.</span>{' '}
          Petitioner&apos;s RFO contains internally inconsistent statements regarding tax
          withholding responsibility:
        </p>

        <div className="ml-8 my-3 space-y-3">
          <div className="border-l-4 border-green-500 bg-green-50 p-3">
            <p className="font-semibold text-green-900 text-sm mb-1">Statement #1 (RFO ¶ __)</p>
            <p className="text-sm italic text-green-700">
              &quot;I will take full responsibility for the tax withholding&quot;
            </p>
          </div>
          <div className="flex items-center justify-center">
            <span className="text-lg text-red-600 font-bold">[CONTRADICTION]</span>
          </div>
          <div className="border-l-4 border-red-500 bg-red-50 p-3">
            <p className="font-semibold text-red-900 text-sm mb-1">Statement #2 (RFO ¶ __)</p>
            <p className="text-sm italic text-red-700">
              &quot;Respondent shall reimburse me 65% of tax withholding ($
              {FINANCIAL_DATA.taxWithholdingRespondent.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
              )&quot;
            </p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-400 rounded p-4">
          <p className="font-bold text-yellow-900 text-sm mb-2">[WARNING] LOGICAL CONTRADICTION</p>
          <p className="text-xs text-yellow-800">
            One cannot simultaneously &quot;take full responsibility&quot; for an obligation AND
            demand reimbursement for that same obligation. These positions are mutually exclusive
            and demonstrate the internally inconsistent nature of Petitioner&apos;s RFO.
          </p>
        </div>

        <p className="leading-relaxed">
          <span className="font-semibold">5.2 Lack of Supporting Documentation.</span> Petitioner
          provides <strong>zero evidence</strong> for her claimed tax withholding amount of $
          {FINANCIAL_DATA.taxWithholding.toLocaleString('en-US', { minimumFractionDigits: 2 })},
          including:
        </p>

        <div className="ml-8 my-3 grid grid-cols-2 gap-3">
          <div className="bg-red-50 border-l-4 border-red-500 p-3">
            <p className="font-semibold text-xs text-red-900 mb-2">[MISSING] Missing Evidence</p>
            <ul className="text-xs text-red-700 space-y-1">
              <li>• Tax return calculations</li>
              <li>• IRS Form 593 documentation</li>
              <li>• Capital gains worksheets</li>
              <li>• Actual tax liability proof</li>
            </ul>
          </div>
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-sm">
            <p className="font-semibold text-xs text-slate-900 mb-2">[DOCS] Required Documentation</p>
            <ul className="text-xs text-slate-700 space-y-1">
              <li>• Basis calculation</li>
              <li>• Gain/loss determination</li>
              <li>• Payment confirmation</li>
              <li>• Tax professional opinion</li>
            </ul>
          </div>
        </div>

        <p className="leading-relaxed">
          <span className="font-semibold">5.3 Proportional vs. Disproportionate Allocation.</span>{' '}
          Tax withholding obligations in community property sales are typically allocated based on
          ownership percentages:
        </p>

        <div className="ml-8 my-3 bg-white border-2 border-indigo-300 rounded overflow-hidden">
          <div className="bg-indigo-600 text-white px-4 py-2 font-bold text-sm">
            PROPORTIONAL TAX ALLOCATION ANALYSIS
          </div>
          <div className="p-4">
            <table className="w-full text-xs">
              <thead className="border-b-2 border-indigo-300">
                <tr className="text-left">
                  <th className="pb-2">Ownership</th>
                  <th className="pb-2 text-right">Percentage</th>
                  <th className="pb-2 text-right">Proportional Share</th>
                  <th className="pb-2 text-right">Petitioner Claims</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-200">
                <tr>
                  <td className="py-2">Respondent (me)</td>
                  <td className="py-2 text-right font-mono">65%</td>
                  <td className="py-2 text-right font-mono bg-green-50">
                    ${FINANCIAL_DATA.taxWithholdingRespondent.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 text-right font-mono bg-red-50 font-bold">
                    ${FINANCIAL_DATA.taxWithholdingRespondent.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Petitioner</td>
                  <td className="py-2 text-right font-mono">35%</td>
                  <td className="py-2 text-right font-mono bg-green-50">
                    ${FINANCIAL_DATA.taxWithholdingPetitioner.toLocaleString('en-US', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="py-2 text-right font-mono bg-green-50">
                    $0 (seeks reimbursement)
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="mt-3 text-xs bg-indigo-50 p-2 rounded">
              <strong>Note:</strong> While proportional allocation matches Petitioner&apos;s
              requested amount, she provides no evidence this tax liability actually exists or that
              she paid it.
            </p>
          </div>
        </div>

        <p className="leading-relaxed">
          <span className="font-semibold">5.4 Timing and Payment Questions.</span> Petitioner fails
          to address critical timing issues:
        </p>

        <ul className="ml-12 list-decimal space-y-2 text-sm text-slate-700">
          <li>When was the withholding allegedly paid? (No date provided)</li>
          <li>To which taxing authority? (IRS, FTB, or both?)</li>
          <li>What was the actual sale-year tax liability vs. withholding?</li>
          <li>Will Petitioner receive a refund when taxes are filed?</li>
        </ul>

        <p className="leading-relaxed mt-3">
          <span className="font-semibold">5.5 Requested Relief.</span> I request that the Court
          deny Petitioner&apos;s tax withholding claim unless and until she provides:
        </p>

        <div className="ml-8 my-2 bg-blue-50 border-l-4 border-blue-500 p-3">
          <p className="text-xs text-gray-600 mb-2 italic">
            See Exhibit C for detailed timeline analysis.
          </p>
          <ul className="text-sm space-y-1 text-blue-900">
            <li>[OK] Proof of actual tax liability</li>
            <li>[OK] Evidence of payment (cancelled check, wire confirmation)</li>
            <li>[OK] Tax professional analysis</li>
            <li>[OK] IRS/FTB correspondence confirming obligation</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaxWithholdingSection);
