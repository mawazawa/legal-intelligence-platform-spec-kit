import React from 'react';
import { ATTORNEY_INFO, FINANCIAL_DATA } from '../data/case-data';

const MemorandumOfPointsAndAuthorities: React.FC = () => {
  return (
    <div className="page-break min-h-[11in] p-16 measure">
      <h2 className="text-xl font-bold mb-6 text-center">
        MEMORANDUM OF POINTS AND AUTHORITIES
      </h2>

      <div className="text-sm leading-relaxed space-y-4">
        <div>
          <h3 className="font-semibold mb-2">I. INTRODUCTION</h3>
          <p>
            This memorandum addresses Petitioner&apos;s Request for Order seeking redistribution
            of escrow proceeds. Petitioner&apos;s motion is based on fundamental mathematical
            errors and legal misstatements that render her requested relief impossible and
            unsupportable.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">II. STATEMENT OF FACTS</h3>
          <p>
            The Property was sold on May 30, 2025, with net proceeds of $
            {FINANCIAL_DATA.netProceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })}.
            Petitioner took exclusive possession on November 16, 2024. She now seeks to both
            deduct ${FINANCIAL_DATA.arrears.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
            from net proceeds AND add it back to create a fictional total of $
            {FINANCIAL_DATA.petitionerFictitiousTotal.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
            .
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">III. ARGUMENT</h3>

          <div className="ml-4">
            <h4 className="font-semibold mb-2">
              A. Petitioner&apos;s Mathematical Error Renders Her Request Impossible
            </h4>
            <p>
              Petitioner&apos;s calculation violates basic arithmetic principles. You cannot both
              pay a debt and add it back to proceeds. The escrow proceeds already reflect payment
              of all mortgage obligations.
            </p>

            <h4 className="font-semibold mb-2">B. Watts Charges Must End When Possession Changes</h4>
            <p>
              Watts v. Watts (1985) 171 Cal.App.3d 366. Petitioner&apos;s own admission that she
              took possession on November 16, 2024, ends any Watts charges claim as of that date.
            </p>

            <h4 className="font-semibold mb-2">
              C. No Evidence of Bad Faith for Attorney Fees Sanctions
            </h4>
            <p>
              Family Code Section 271 requires showing conduct that frustrates settlement policy.
              No such evidence exists. Respondent&apos;s actions were consistent with exercising
              legal rights.
            </p>

            <h4 className="font-semibold mb-2">
              D. Equal Division Required Under Family Code Section 2550
            </h4>
            <p>
              Community property must be divided equally unless valid reason for unequal division
              exists. Petitioner&apos;s requested division violates this requirement.
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">IV. CONCLUSION</h3>
          <p>
            Petitioner&apos;s Request for Order must be denied due to fundamental mathematical
            errors and legal deficiencies. The Court should order escrow proceeds divided according
            to the Judgment: 65% to Respondent ($
            {FINANCIAL_DATA.respondentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            ) and 35% to Petitioner ($
            {FINANCIAL_DATA.petitionerAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            ).
          </p>
        </div>

        <div className="mt-12">
          <p>
            <strong>DATED:</strong> {new Date().toLocaleDateString()}
          </p>
          <p>
            <strong>Respectfully submitted,</strong>
          </p>
          <div className="mt-8">
            <div className="border-b border-black w-64"></div>
            <p className="mt-2">
              <strong>{ATTORNEY_INFO.name}</strong>
            </p>
            <p>Attorney for Respondent</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MemorandumOfPointsAndAuthorities);
