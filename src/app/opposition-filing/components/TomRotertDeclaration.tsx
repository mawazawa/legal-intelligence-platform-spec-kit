import React from 'react';
import { FINANCIAL_DATA } from '../data/case-data';

const TomRotertDeclaration: React.FC = () => {
  return (
    <div className="page-break min-h-[11in] p-16 measure">
      <h2 className="text-xl font-bold mb-6 text-center">DECLARATION OF TOM ROTERT</h2>

      <div className="text-sm leading-relaxed space-y-4">
        <p>
          <strong>I, Tom Rotert, declare as follows:</strong>
        </p>

        <div>
          <h3 className="font-semibold mb-2">1. PERSONAL KNOWLEDGE AND QUALIFICATIONS</h3>
          <p>
            I am a licensed attorney in the State of California with over 15 years of experience
            in family law matters, including complex property division cases. I have reviewed the
            Petitioner&apos;s Request for Order and the Respondent&apos;s opposition thereto. I
            have personal knowledge of the facts stated herein and could competently testify
            thereto if called as a witness.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">
            2. ANALYSIS OF PETITIONER&apos;S MATHEMATICAL ERRORS
          </h3>
          <p>
            After reviewing Petitioner&apos;s RFO and the supporting documentation, I have
            identified fundamental mathematical errors that render her requested relief legally
            impossible. The primary error is Petitioner&apos;s attempt to both deduct $
            {FINANCIAL_DATA.arrears.toLocaleString('en-US', { minimumFractionDigits: 2 })} from
            the net proceeds AND add it back to create a fictional &quot;total net proceed&quot;
            of ${FINANCIAL_DATA.petitionerFictitiousTotal.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}
            .
          </p>

          <p>
            This violates basic principles of accounting and mathematics. You cannot both pay a
            debt and add it back to your share of proceeds. The escrow proceeds of $
            {FINANCIAL_DATA.netProceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
            already reflect the payment of all mortgage obligations, including the $
            {FINANCIAL_DATA.arrears.toLocaleString('en-US', { minimumFractionDigits: 2 })} in
            arrears.
          </p>

          <p>
            Petitioner&apos;s requested distribution of 35% of $
            {FINANCIAL_DATA.petitionerFictitiousTotal.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}{' '}
            = ${FINANCIAL_DATA.petitionerRequestedAmount.toLocaleString('en-US', {
              minimumFractionDigits: 2,
            })}{' '}
            is based on this mathematically impossible calculation and must be rejected by this
            Court.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">3. LEGAL AUTHORITY AND PRECEDENT</h3>
          <p>
            Family Code Section 2550 requires equal division of community property unless there is
            a valid reason for unequal division. Petitioner&apos;s requested division violates this
            requirement and lacks legal justification.
          </p>

          <p>
            Watts v. Watts (1985) 171 Cal.App.3d 366 establishes that Watts charges are for
            exclusive use and possession and must end when possession changes. Petitioner&apos;s
            own declaration admits she took possession on November 16, 2024, yet she claims Watts
            charges through that date, which is legally impossible.
          </p>

          <p>
            Family Code Section 271 requires a showing of conduct that &quot;frustrates the policy
            of the law to promote settlement&quot; for attorney fees sanctions. No such evidence
            exists in this case. Respondent&apos;s actions were consistent with exercising legal
            rights.
          </p>
        </div>

        <div className="mt-12">
          <p>
            I declare under penalty of perjury under the laws of the State of California that the
            foregoing is true and correct.
          </p>

          <div className="mt-8">
            <p>
              <strong>DATED:</strong> {new Date().toLocaleDateString()}
            </p>
            <div className="mt-8">
              <div className="border-b border-black w-64"></div>
              <p className="mt-2">
                <strong>TOM ROTERT</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TomRotertDeclaration);
