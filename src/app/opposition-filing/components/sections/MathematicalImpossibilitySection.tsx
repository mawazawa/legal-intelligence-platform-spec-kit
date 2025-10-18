import React from 'react';
import { FINANCIAL_DATA } from '../../data/case-data';

const MathematicalImpossibilitySection: React.FC = () => {
  return (
    <>
      <div className="line-numbers">
        <div className="line font-bold">3. MATHEMATICAL IMPOSSIBILITY - THE $77,779.88 DOUBLE-</div>
        <div className="line font-bold">   COUNTING SCHEME</div>
        <div className="line">&nbsp;</div>
        <div className="line">     3.1  Petitioner&apos;s RFO is premised on a mathematically</div>
        <div className="line">impossible "add-back" methodology that violates fundamental</div>
        <div className="line">principles of accounting and arithmetic. This scheme attempts</div>
        <div className="line">to artificially inflate the distributable proceeds by double-</div>
        <div className="line">counting a debt payment.</div>
        <div className="line">&nbsp;</div>
        <div className="line">     3.2  The escrow closing statement from the May 30, 2025</div>
        <div className="line">sale establishes the following undisputed facts:</div>
        <div className="line">&nbsp;</div>
        <div className="line">          Gross Sale Price:              ${FINANCIAL_DATA.grossSalePrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="line">          Less: Closing Costs:              (${ FINANCIAL_DATA.closingCosts.toLocaleString('en-US', { minimumFractionDigits: 2 })})</div>
        <div className="line">          Less: Mortgage Payoff:           (${FINANCIAL_DATA.totalMortgagePayoff.toLocaleString('en-US', { minimumFractionDigits: 2 })})</div>
        <div className="line">               (includes ${FINANCIAL_DATA.mortgagePrincipal.toLocaleString('en-US', { minimumFractionDigits: 2 })} principal +</div>
        <div className="line">                ${FINANCIAL_DATA.arrears.toLocaleString('en-US', { minimumFractionDigits: 2 })} arrears/late charges)</div>
        <div className="line">          _______________________________________________</div>
        <div className="line">          NET PROCEEDS AVAILABLE:           ${FINANCIAL_DATA.netProceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="line">&nbsp;</div>
        <div className="line">     3.3  Petitioner&apos;s RFO employs the following logically</div>
        <div className="line">and mathematically impossible methodology:</div>
        <div className="line">&nbsp;</div>
        <div className="line">          PETITIONER&apos;S FLAWED CALCULATION:</div>
        <div className="line">&nbsp;</div>
        <div className="line">          Step 1: Start with net proceeds    ${FINANCIAL_DATA.netProceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="line">          Step 2: "Add back" arrears paid   +${FINANCIAL_DATA.arrears.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="line">          Step 3: Create fictional "total"  =${FINANCIAL_DATA.petitionerFictitiousTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="line">          Step 4: Take her 35% share        =${FINANCIAL_DATA.petitionerRequestedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="line">          Step 5: Deduct same ${FINANCIAL_DATA.arrears.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="line">                  from my 65% share         -${FINANCIAL_DATA.arrears.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="line">&nbsp;</div>
        <div className="line">          RESULT: The same ${FINANCIAL_DATA.arrears.toLocaleString('en-US', { minimumFractionDigits: 2 })} is BOTH added to her</div>
        <div className="line">          share AND subtracted from mine, creating a</div>
        <div className="line">          ${FINANCIAL_DATA.petitionerWindfall.toLocaleString('en-US', { minimumFractionDigits: 2 })} windfall to Petitioner through</div>
        <div className="line">          mathematical manipulation.</div>
        <div className="line">&nbsp;</div>
        <div className="line">     3.4  The correct calculation is as follows:</div>
        <div className="line">&nbsp;</div>
        <div className="line">          CORRECT CALCULATION:</div>
        <div className="line">&nbsp;</div>
        <div className="line">          Net Proceeds Available:         ${FINANCIAL_DATA.netProceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="line">          Respondent&apos;s 65% Share:         ${FINANCIAL_DATA.respondentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="line">          Petitioner&apos;s 35% Share:          ${FINANCIAL_DATA.petitionerAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="line">&nbsp;</div>
        <div className="line">          All mortgage obligations, including the ${FINANCIAL_DATA.arrears.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
        <div className="line">          in arrears, were already paid at closing. These</div>
        <div className="line">          amounts are NOT available for distribution and</div>
        <div className="line">          cannot be "added back."</div>
        <div className="line">&nbsp;</div>
        <div className="line">     3.5  Petitioner&apos;s methodology violates the fundamental</div>
        <div className="line">accounting principle that proceeds equal gross sale price</div>
        <div className="line">minus all obligations.</div>
        <div className="line">&nbsp;</div>
      </div>

      {/* Visual Enhancement for Mathematical Analysis */}
      <div className="mt-6 p-4 border-l-4 border-red-500 bg-red-50">
        <h4 className="text-lg font-bold text-red-800 mb-2">
          Mathematical Impossibility Exposed
        </h4>
        <p className="text-sm text-gray-700 mb-2">Petitioner&apos;s Flawed Formula:</p>
        <p className="text-sm font-mono text-red-800">Available Funds = (Gross Sale - Debt Paid) + Debt Paid</p>
        <p className="text-xs text-gray-600 mt-1">[Simplifies to]</p>
        <p className="text-sm font-bold text-red-900">Available Funds = Gross Sale</p>
        <p className="text-xs text-red-700 mt-1">[WARNING] This would mean NO debts were ever paid!</p>
        <p className="text-xs text-gray-600 mt-2 italic">See Exhibit A for detailed visual analysis.</p>
      </div>

      {/* Distribution Analysis Reference */}
      <div className="mt-6 p-4 border-l-4 border-blue-500 bg-blue-50">
        <h4 className="text-lg font-bold text-blue-800 mb-2">
          Distribution Analysis
        </h4>
        <p className="text-sm text-gray-700 mb-2">Correct Legal Distribution:</p>
        <p className="text-sm">Total Proceeds: ${FINANCIAL_DATA.netProceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        <p className="text-sm">Petitioner (35%): ${FINANCIAL_DATA.petitionerAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        <p className="text-sm">Respondent (65%): ${FINANCIAL_DATA.respondentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
        <p className="text-xs text-gray-600 mt-2 italic">See Exhibit B for detailed distribution comparison charts.</p>
      </div>

      <div className="line-numbers mt-6">
        <div className="line">     3.6  Through this mathematical manipulation, Petitioner</div>
        <div className="line">seeks to unlawfully obtain an additional ${FINANCIAL_DATA.petitionerWindfall.toLocaleString('en-US', { minimumFractionDigits: 2 })},</div>
        <div className="line">representing a 27.7% increase over her rightful 35% share.</div>
        <div className="line">&nbsp;</div>
        <div className="line">     3.7  Petitioner cites no California case law, statute,</div>
        <div className="line">or legal authority permitting this "add-back" scheme. This</div>
        <div className="line">methodology has no basis in California family law and would</div>
        <div className="line">create an impermissible windfall to the non-paying spouse.</div>
        <div className="line">&nbsp;</div>
      </div>
    </>
  );
};

export default React.memo(MathematicalImpossibilitySection);
