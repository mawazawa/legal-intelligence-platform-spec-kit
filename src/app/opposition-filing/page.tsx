/* eslint-disable react/no-unescaped-entities */
"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download } from 'lucide-react';

const OppositionFilingPage: React.FC = () => {
  const printRef = useRef<HTMLDivElement>(null);

  const printFiling = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Print Controls */}
      <div className="no-print fixed top-4 right-4 z-50 flex gap-2">
        <Button onClick={printFiling} className="bg-blue-600 hover:bg-blue-700">
          <Printer className="h-4 w-4 mr-2" />
          Print Filing
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      {/* Court Filing */}
      <div ref={printRef} className="legal-document min-h-screen p-16">

        {/* PAGE 1 - COVER PAGE */}
        <div className="page-break min-h-[11in] flex flex-col justify-center items-center text-center">
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-8">SUPERIOR COURT OF CALIFORNIA</h1>
            <h2 className="text-2xl font-semibold mb-4">COUNTY OF LOS ANGELES</h2>
            <h3 className="text-xl mb-8">FAMILY LAW DIVISION</h3>
            
            <div className="border-t-2 border-b-2 border-black py-8 my-8">
              <h4 className="text-2xl font-bold mb-4">OPPOSITION TO REQUEST FOR ORDER</h4>
              <h5 className="text-lg font-semibold">FL-320 RESPONSIVE DECLARATION</h5>
            </div>
            
            <div className="text-left space-y-4">
              <div><strong>Case Number:</strong> FDI-21-794666</div>
              <div><strong>Petitioner:</strong> Rosanna Claire Alvero</div>
              <div><strong>Respondent:</strong> Mathieu Christian Yves Wauters</div>
              <div><strong>Hearing Date:</strong> Tuesday, August 28, 2025</div>
              <div><strong>Hearing Time:</strong> 8:30 AM</div>
              <div><strong>Department:</strong> [Department Number]</div>
            </div>
            
            <div className="mt-12 text-sm">
              <p><strong>Filed:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Attorney for Respondent:</strong> [Attorney Name]</p>
              <p><strong>Law Firm:</strong> [Firm Name]</p>
              <p><strong>Address:</strong> [Address]</p>
              <p><strong>Phone:</strong> [Phone Number]</p>
            </div>
          </div>
        </div>

        {/* PAGE 2 - TABLE OF CONTENTS */}
        <div className="page-break min-h-[11in] p-16">
          <h2 className="text-2xl font-bold mb-8 text-center">TABLE OF CONTENTS</h2>
          
          <div className="space-y-4 text-sm">
            <div className="flex justify-between">
              <span>DECLARATION OF MATHIEU CHRISTIAN YVES WAUTERS</span>
              <span>Page 3</span>
            </div>
            <div className="flex justify-between">
              <span>&nbsp;&nbsp;1. Introduction and Personal Knowledge</span>
              <span>3</span>
            </div>
            <div className="flex justify-between">
              <span>&nbsp;&nbsp;2. Timeline of Events - Petitioner&apos;s Possession Control</span>
              <span>3</span>
            </div>
            <div className="flex justify-between">
              <span>&nbsp;&nbsp;3. Mathematical Impossibility of Petitioner&apos;s Calculations</span>
              <span>4</span>
            </div>
            <div className="flex justify-between">
              <span>&nbsp;&nbsp;4. Watts Charges Analysis - Timeline Cutoff</span>
              <span>5</span>
            </div>
            <div className="flex justify-between">
              <span>&nbsp;&nbsp;5. Tax Withholding Analysis</span>
              <span>5</span>
            </div>
            <div className="flex justify-between">
              <span>&nbsp;&nbsp;6. Attorney Fees Sanctions - No Evidence of Bad Faith</span>
              <span>6</span>
            </div>
            <div className="flex justify-between">
              <span>&nbsp;&nbsp;7. Cleanup Costs - Insufficient Evidence</span>
              <span>6</span>
            </div>
            <div className="flex justify-between">
              <span>&nbsp;&nbsp;8. Counter-Claims and Offsets</span>
              <span>7</span>
            </div>
            <div className="flex justify-between">
              <span>&nbsp;&nbsp;9. Legal Analysis</span>
              <span>7</span>
            </div>
            <div className="flex justify-between">
              <span>&nbsp;&nbsp;10. Requested Relief</span>
              <span>8</span>
            </div>
            <div className="flex justify-between">
              <span>&nbsp;&nbsp;11. Conclusion</span>
              <span>8</span>
            </div>
            
            <div className="mt-8 pt-4 border-t">
              <div className="flex justify-between">
                <span>DECLARATION OF TOM ROTERT</span>
                <span>Page 9</span>
              </div>
              <div className="flex justify-between">
                <span>&nbsp;&nbsp;1. Personal Knowledge and Qualifications</span>
                <span>9</span>
              </div>
              <div className="flex justify-between">
                <span>&nbsp;&nbsp;2. Analysis of Petitioner's Mathematical Errors</span>
                <span>9</span>
              </div>
              <div className="flex justify-between">
                <span>&nbsp;&nbsp;3. Legal Authority and Precedent</span>
                <span>10</span>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t">
              <div className="flex justify-between">
                <span>MEMORANDUM OF POINTS AND AUTHORITIES</span>
                <span>Page 10</span>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE 3 - RESPONDENT'S DECLARATION - PLEADING PAPER FORMAT */}
        <div className="page-break">
          <div className="page-content">
            {/* Page Header with Case Info */}
            <div className="text-[10pt] mb-4">
              <div>MATHIEU CHRISTIAN YVES WAUTERS</div>
              <div>In Pro Per</div>
              <div>[Address]</div>
              <div>[City, State ZIP]</div>
              <div>Tel: [Phone]</div>
              <div>Email: [Email]</div>
            </div>

            {/* Court Caption */}
            <div className="text-center mt-8 mb-8">
              <div className="font-bold">SUPERIOR COURT OF CALIFORNIA</div>
              <div className="font-bold">COUNTY OF LOS ANGELES</div>
            </div>

            <div className="caption-box">
              <div className="flex justify-between mb-2">
                <div className="w-1/2">
                  <div>In re the Marriage of:</div>
                  <div className="mt-2">ROSANNA CLAIRE ALVERO,</div>
                  <div className="ml-8">Petitioner,</div>
                  <div className="mt-2">and</div>
                  <div className="mt-2">MATHIEU CHRISTIAN YVES WAUTERS,</div>
                  <div className="ml-8">Respondent.</div>
                </div>
                <div className="w-1/2 text-right">
                  <div>Case No. FDI-21-794666</div>
                  <div className="mt-4 font-bold">DECLARATION OF MATHIEU</div>
                  <div className="font-bold">CHRISTIAN YVES WAUTERS IN</div>
                  <div className="font-bold">OPPOSITION TO REQUEST FOR</div>
                  <div className="font-bold">ORDER</div>
                  <div className="mt-4">Hearing Date: August 28, 2025</div>
                  <div>Hearing Time: 8:30 a.m.</div>
                  <div>Department: [Dept.]</div>
                </div>
              </div>
            </div>

            {/* Declaration Content with Line Numbers */}
            <div className="line-numbers mt-8">
              <div className="line">I, MATHIEU CHRISTIAN YVES WAUTERS, declare as follows:</div>
              <div className="line">&nbsp;</div>
              <div className="line font-bold">1. INTRODUCTION AND PERSONAL KNOWLEDGE</div>
              <div className="line">&nbsp;</div>
              <div className="line">     1.1  I am the Respondent in this dissolution action, Case</div>
              <div className="line">No. FDI-21-794666. I have personal knowledge of all facts</div>
              <div className="line">stated herein except those stated on information and belief,</div>
              <div className="line">and as to those matters, I believe them to be true. I am over</div>
              <div className="line">18 years of age and competent to testify to the matters</div>
              <div className="line">stated herein if called as a witness.</div>
              <div className="line">&nbsp;</div>
              <div className="line">     1.2  This declaration is made in support of my opposition</div>
              <div className="line">to Petitioner Rosanna Claire Alvero's Request for Order</div>
              <div className="line">("RFO") filed June 25, 2025, seeking redistribution of escrow</div>
              <div className="line">proceeds from the sale of the real property located at 3525</div>
              <div className="line">8th Avenue, Los Angeles, CA 90018 (the "Property").</div>
              <div className="line">&nbsp;</div>
              <div className="line">     1.3  Petitioner's RFO contains fundamental mathematical</div>
              <div className="line">errors that render her requested relief legally and</div>
              <div className="line">arithmetically impossible. The central flaw is her attempt to</div>
              <div className="line">simultaneously: (a) DEDUCT $77,779.88 from the net escrow</div>
              <div className="line">proceeds as a debt paid at closing; and (b) ADD BACK the same</div>
              <div className="line">$77,779.88 to create a fictional "total net proceed" of</div>
              <div className="line">$358,155.71. This double-counting scheme violates basic</div>
              <div className="line">arithmetic principles. One cannot both pay a debt AND add</div>
              <div className="line">that same amount back to available proceeds.</div>
              <div className="line">&nbsp;</div>
              <div className="line">     1.4  This opposition is filed pursuant to California</div>
              <div className="line">Family Code section 271 and California Rules of Court, rule</div>
              <div className="line">5.92. I respectfully request that this Court deny</div>
              <div className="line">Petitioner's motion in its entirety due to the mathematical</div>
              <div className="line">impossibilities, legal deficiencies, and factual</div>
              <div className="line">misrepresentations outlined below.</div>
              <div className="line">&nbsp;</div>

              <div className="line font-bold">2. TIMELINE OF EVENTS - PETITIONER'S EXCLUSIVE POSSESSION</div>
              <div className="line">&nbsp;</div>
              <div className="line">     2.1  Petitioner took exclusive possession of the Property</div>
              <div className="line">on November 16, 2024. This fact is established by</div>
              <div className="line">Petitioner's own sworn declaration at paragraph 19, which</div>
              <div className="line">states: "On November 16, 2024, I took possession of the</div>
              <div className="line">home." (Petitioner's Declaration, ¶19 filed June 25, 2025.)</div>
              <div className="line">&nbsp;</div>
              <div className="line">     2.2  Under California family law, the party in exclusive</div>
              <div className="line">possession of community real property bears responsibility for</div>
              <div className="line">all Property-related expenses from the date of possession.</div>
              <div className="line">Once Petitioner took possession on November 16, 2024, she</div>
              <div className="line">became legally responsible for: (a) mortgage payments</div>
              <div className="line">(principal, interest, and escrow); (b) property taxes; (c)</div>
              <div className="line">insurance premiums; and (d) maintenance and repairs.</div>
              <div className="line">&nbsp;</div>

              <div className="line">     2.3  The critical dates are as follows:</div>
              <div className="line">&nbsp;</div>
              <div className="line">          December 2023: Last mortgage payment allegedly made</div>
              <div className="line">               (per Petitioner's claim)</div>
              <div className="line">&nbsp;</div>
              <div className="line">          November 16, 2024: PETITIONER TAKES EXCLUSIVE</div>
              <div className="line">               POSSESSION - All liability transfers to Petitioner</div>
              <div className="line">&nbsp;</div>
              <div className="line">          February 15, 2025: Property listed for sale</div>
              <div className="line">               (Petitioner in possession: 91 days)</div>
              <div className="line">&nbsp;</div>
              <div className="line">          May 30, 2025: PROPERTY SOLD - Petitioner in</div>
              <div className="line">               possession: 196 days (6.5 months)</div>
              <div className="line">&nbsp;</div>
              <div className="line">     2.4  Petitioner cannot claim Watts charges or expenses</div>
              <div className="line">for the 196-day period (November 16, 2024 through May 30,</div>
              <div className="line">2025) during which she had exclusive possession, use, and</div>
              <div className="line">benefit of the Property. Her claims for expenses during her</div>
              <div className="line">own possession period are legally baseless and directly</div>
              <div className="line">contradicted by her own sworn admission in paragraph 19 of</div>
              <div className="line">her declaration.</div>
              <div className="line">&nbsp;</div>
              <div className="line">     2.5  Petitioner's sworn statement of possession on</div>
              <div className="line">November 16, 2024, constitutes a binding judicial admission</div>
              <div className="line">under California Evidence Code section 1220. She cannot now</div>
              <div className="line">claim expenses against me for a period when she admits she</div>
              <div className="line">had exclusive possession and control of the Property.</div>
              <div className="line">&nbsp;</div>

              <div className="line font-bold">3. MATHEMATICAL IMPOSSIBILITY - THE $77,779.88 DOUBLE-</div>
              <div className="line font-bold">   COUNTING SCHEME</div>
              <div className="line">&nbsp;</div>
              <div className="line">     3.1  Petitioner's RFO is premised on a mathematically</div>
              <div className="line">impossible "add-back" methodology that violates fundamental</div>
              <div className="line">principles of accounting and arithmetic. This scheme attempts</div>
              <div className="line">to artificially inflate the distributable proceeds by double-</div>
              <div className="line">counting a debt payment.</div>
              <div className="line">&nbsp;</div>
              <div className="line">     3.2  The escrow closing statement from the May 30, 2025</div>
              <div className="line">sale establishes the following undisputed facts:</div>
              <div className="line">&nbsp;</div>
              <div className="line">          Gross Sale Price:              $1,050,000.00</div>
              <div className="line">          Less: Closing Costs:              ($10,280.05)</div>
              <div className="line">          Less: Mortgage Payoff:           ($759,364.32)</div>
              <div className="line">               (includes $681,584.44 principal +</div>
              <div className="line">                $77,779.88 arrears/late charges)</div>
              <div className="line">          _______________________________________________</div>
              <div className="line">          NET PROCEEDS AVAILABLE:           $280,355.83</div>
              <div className="line">&nbsp;</div>

              <div className="line">     3.3  Petitioner's RFO employs the following logically</div>
              <div className="line">and mathematically impossible methodology:</div>
              <div className="line">&nbsp;</div>
              <div className="line">          PETITIONER'S FLAWED CALCULATION:</div>
              <div className="line">&nbsp;</div>
              <div className="line">          Step 1: Start with net proceeds    $280,355.83</div>
              <div className="line">          Step 2: "Add back" arrears paid   +$77,779.88</div>
              <div className="line">          Step 3: Create fictional "total"  =$358,155.71</div>
              <div className="line">          Step 4: Take her 35% share        =$125,354.50</div>
              <div className="line">          Step 5: Deduct same $77,779.88</div>
              <div className="line">                  from my 65% share         -$77,779.88</div>
              <div className="line">&nbsp;</div>
              <div className="line">          RESULT: The same $77,779.88 is BOTH added to her</div>
              <div className="line">          share AND subtracted from mine, creating a</div>
              <div className="line">          $27,229.96 windfall to Petitioner through</div>
              <div className="line">          mathematical manipulation.</div>
              <div className="line">&nbsp;</div>

              <div className="line">     3.4  The correct calculation is as follows:</div>
              <div className="line">&nbsp;</div>
              <div className="line">          CORRECT CALCULATION:</div>
              <div className="line">&nbsp;</div>
              <div className="line">          Net Proceeds Available:         $280,355.83</div>
              <div className="line">          Respondent's 65% Share:         $182,231.29</div>
              <div className="line">          Petitioner's 35% Share:          $98,124.54</div>
              <div className="line">&nbsp;</div>
              <div className="line">          All mortgage obligations, including the $77,779.88</div>
              <div className="line">          in arrears, were already paid at closing. These</div>
              <div className="line">          amounts are NOT available for distribution and</div>
              <div className="line">          cannot be "added back."</div>
              <div className="line">&nbsp;</div>
              <div className="line">     3.5  Petitioner's methodology violates the fundamental</div>
              <div className="line">accounting principle that proceeds equal gross sale price</div>
              <div className="line">minus all obligations.</div>
              <div className="line">&nbsp;</div>
            </div>

            {/* Visual Enhancement for Mathematical Analysis */}
            <div className="mt-6 p-6 bg-gradient-to-r from-red-50 to-yellow-50 rounded-xl shadow-xl">
              <h4 className="text-xl font-bold text-red-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Mathematical Impossibility Exposed
              </h4>

              <div className="bg-white p-4 rounded-lg shadow-inner mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Petitioner's Flawed Formula:</p>
                <div className="bg-red-100 p-3 rounded font-mono text-center">
                  <p className="text-red-800">Available Funds = (Gross Sale - Debt Paid) + Debt Paid</p>
                  <p className="text-sm text-gray-600 mt-2">[v] Simplifies to [v]</p>
                  <p className="text-red-900 font-bold">Available Funds = Gross Sale</p>
                  <p className="text-xs text-red-700 mt-2">[WARNING] This would mean NO debts were ever paid!</p>
                </div>
              </div>
            </div>

            {/* Interactive Distribution Breakdown */}
            <div className="mt-6 p-6 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 rounded-xl shadow-2xl">
              <h4 className="text-xl font-bold text-indigo-800 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Distribution Analysis - Visual Breakdown
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-100 p-4 rounded-lg border-2 border-green-400">
                  <h5 className="font-bold text-green-800 mb-3">[OK] Correct Legal Distribution</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Proceeds:</span>
                      <span className="font-mono font-bold">$280,355.83</span>
                    </div>
                    <div className="h-px bg-green-300 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Petitioner (35%):</span>
                      <span className="font-mono text-green-700">$98,124.54</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Respondent (65%):</span>
                      <span className="font-mono text-green-700">$182,231.29</span>
                    </div>
                  </div>
                  <div className="mt-3 bg-green-200 p-2 rounded text-center">
                    <span className="text-xs font-semibold text-green-900">Fair & Legal</span>
                  </div>
                </div>

                <div className="bg-red-100 p-4 rounded-lg border-2 border-red-400">
                  <h5 className="font-bold text-red-800 mb-3">[X] Petitioner's Manipulation</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Fictional Total:</span>
                      <span className="font-mono font-bold text-red-600">$358,155.71</span>
                    </div>
                    <div className="h-px bg-red-300 my-2"></div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Petitioner Claims:</span>
                      <span className="font-mono text-red-700">$125,354.50</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Leaves Respondent:</span>
                      <span className="font-mono text-red-700">$104,451.41</span>
                    </div>
                  </div>
                  <div className="mt-3 bg-red-200 p-2 rounded text-center">
                    <span className="text-xs font-semibold text-red-900">+$27,229.96 Theft!</span>
                  </div>
                </div>
              </div>

              {/* Visual Bar Chart Comparison */}
              <div className="mt-6 bg-white p-4 rounded-lg shadow-inner">
                <h5 className="text-sm font-bold text-gray-700 mb-3">Visual Share Comparison</h5>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-xs w-24">Correct Split:</span>
                    <div className="flex-1 flex h-6 rounded overflow-hidden">
                      <div className="bg-blue-500 flex items-center justify-center text-white text-xs" style={{width: '35%'}}>
                        35%
                      </div>
                      <div className="bg-green-500 flex items-center justify-center text-white text-xs" style={{width: '65%'}}>
                        65%
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <span className="text-xs w-24">Their Claim:</span>
                    <div className="flex-1 flex h-6 rounded overflow-hidden">
                      <div className="bg-red-500 flex items-center justify-center text-white text-xs" style={{width: '45%'}}>
                        45% (!!!)
                      </div>
                      <div className="bg-orange-500 flex items-center justify-center text-white text-xs" style={{width: '55%'}}>
                        55%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="line-numbers mt-6">
              <div className="line">     3.6  Through this mathematical manipulation, Petitioner</div>
              <div className="line">seeks to unlawfully obtain an additional $27,229.96,</div>
              <div className="line">representing a 27.7% increase over her rightful 35% share.</div>
              <div className="line">&nbsp;</div>
              <div className="line">     3.7  Petitioner cites no California case law, statute,</div>
              <div className="line">or legal authority permitting this "add-back" scheme. This</div>
              <div className="line">methodology has no basis in California family law and would</div>
              <div className="line">create an impermissible windfall to the non-paying spouse.</div>
              <div className="line">&nbsp;</div>
            </div>

            {/* Section 4 */}
            <div className="space-y-4 mt-6">
              <h3 className="text-base font-bold border-l-4 border-purple-600 pl-3 py-1 bg-purple-50">
                4. WATTS CHARGES ANALYSIS - TIMELINE CUTOFF AND LEGAL IMPOSSIBILITY
              </h3>

              <div className="ml-4 space-y-4">
                <p className="leading-relaxed">
                  <span className="font-semibold">4.1 Fundamental Legal Principle.</span> <span className="italic font-semibold">Watts v. Watts</span> (1985) 171 Cal.App.3d 366 establishes that Watts charges compensate a non-occupying spouse for the exclusive use and benefit of community property by the occupying spouse. Critically, these charges <strong>terminate upon transfer of possession</strong> to the previously non-occupying spouse.
                </p>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-3">
                  <p className="font-bold text-purple-900 mb-2">[LEGAL] LEGAL IMPOSSIBILITY - TIMELINE CUTOFF</p>
                  <p className="text-sm leading-relaxed text-purple-800">
                    Petitioner's own sworn declaration establishes she took exclusive possession on <strong>November 16, 2024</strong>. Any Watts charges claimed for periods <em>after</em> this date - when she was the sole occupant deriving exclusive benefit - are legally impossible and must be stricken.
                  </p>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">4.2 Petitioner's Contradictory Claims.</span> Petitioner's RFO contains an inherent logical contradiction:
                </p>

                <div className="ml-8 my-3 grid grid-cols-2 gap-3">
                  <div className="border-2 border-purple-300 bg-purple-50 p-3 rounded">
                    <p className="font-semibold text-xs text-purple-900 mb-2">Petitioner's Admission</p>
                    <p className="text-xs italic text-purple-700">"I took possession of the home on November 16, 2024"</p>
                    <p className="text-xs text-purple-600 mt-2">- Declaration ¶19</p>
                  </div>
                  <div className="border-2 border-red-400 bg-red-50 p-3 rounded">
                    <p className="font-semibold text-xs text-red-900 mb-2">Petitioner's Claim</p>
                    <p className="text-xs text-red-700">Watts charges through November 16, 2024 and beyond</p>
                    <p className="text-xs text-red-600 mt-2 font-bold">CONTRADICTION!</p>
                  </div>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">4.3 Correct Watts Calculation Cutoff.</span> Based on the legal principle that possession transfer terminates Watts charges, the correct calculation is:
                </p>

                <div className="ml-8 my-3 bg-green-50 border-2 border-green-500 rounded p-4">
                  <p className="font-bold text-green-900 mb-3">[OK] LEGALLY CORRECT WATTS PERIOD</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between items-center p-2 bg-white rounded">
                      <span>Watts Charges Accrue:</span>
                      <span className="font-mono font-semibold">Until November 15, 2024</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white rounded">
                      <span>Watts Charges End:</span>
                      <span className="font-mono font-semibold text-green-700">November 16, 2024 (possession transfer)</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-red-100 rounded border border-red-400">
                      <span className="font-bold">Invalid Period Claimed:</span>
                      <span className="font-mono font-bold text-red-700">Nov 16, 2024 → May 30, 2025</span>
                    </div>
                  </div>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">4.4 Petitioner's Exclusive Benefit Period (196 Days).</span> From November 16, 2024 to May 30, 2025, Petitioner enjoyed <strong>exclusive possession, use, and benefit</strong> of the Property for 196 consecutive days (6.5 months). During this period:
                </p>

                <ul className="ml-12 list-disc space-y-2 text-sm">
                  <li>She had sole access and occupancy rights</li>
                  <li>She derived all residential benefit</li>
                  <li>She controlled property access and use</li>
                  <li>She bore legal responsibility for property expenses</li>
                </ul>

                <div className="bg-slate-50 border border-slate-300 rounded p-4 my-3">
                  <p className="font-semibold text-slate-900 mb-2">4.5 Offset for Petitioner's Use Value</p>
                  <p className="text-sm text-slate-700 leading-relaxed">
                    If the Court were to entertain Petitioner's Watts claims (which it should not), any such award must be offset by the fair rental value of her exclusive use during the 196-day period she possessed the Property. At her claimed rate of $4,500/month, her use value equals approximately <strong>$29,250</strong>, completely offsetting any pre-possession Watts claims.
                  </p>
                </div>
              </div>
            </div>

            {/* Section 5 */}
            <div className="space-y-4 mt-6">
              <h3 className="text-base font-bold border-l-4 border-indigo-600 pl-3 py-1 bg-indigo-50">
                5. TAX WITHHOLDING ANALYSIS - CONTRADICTORY CLAIMS AND LACK OF EVIDENCE
              </h3>

              <div className="ml-4 space-y-4">
                <p className="leading-relaxed">
                  <span className="font-semibold">5.1 Petitioner's Contradictory Position.</span> Petitioner's RFO contains internally inconsistent statements regarding tax withholding responsibility:
                </p>

                <div className="ml-8 my-3 space-y-3">
                  <div className="border-l-4 border-green-500 bg-green-50 p-3">
                    <p className="font-semibold text-green-900 text-sm mb-1">Statement #1 (RFO ¶ __)</p>
                    <p className="text-sm italic text-green-700">"I will take full responsibility for the tax withholding"</p>
                  </div>
                  <div className="flex items-center justify-center">
                    <span className="text-2xl text-red-600 font-bold">[DOWN] BUT THEN [DOWN]</span>
                  </div>
                  <div className="border-l-4 border-red-500 bg-red-50 p-3">
                    <p className="font-semibold text-red-900 text-sm mb-1">Statement #2 (RFO ¶ __)</p>
                    <p className="text-sm italic text-red-700">"Respondent shall reimburse me 65% of tax withholding ($8,901.50)"</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-400 rounded p-4">
                  <p className="font-bold text-yellow-900 text-sm mb-2">[WARNING] LOGICAL CONTRADICTION</p>
                  <p className="text-xs text-yellow-800">
                    One cannot simultaneously "take full responsibility" for an obligation AND demand reimbursement for that same obligation. These positions are mutually exclusive and demonstrate the internally inconsistent nature of Petitioner's RFO.
                  </p>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">5.2 Lack of Supporting Documentation.</span> Petitioner provides <strong>zero evidence</strong> for her claimed tax withholding amount of $13,694.62, including:
                </p>

                <div className="ml-8 my-3 grid grid-cols-2 gap-3">
                  <div className="bg-red-50 border border-red-200 p-3 rounded-sm">
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
                  <span className="font-semibold">5.3 Proportional vs. Disproportionate Allocation.</span> Tax withholding obligations in community property sales are typically allocated based on ownership percentages:
                </p>

                <div className="ml-8 my-3 bg-white border-2 border-indigo-300 rounded overflow-hidden">
                  <div className="bg-indigo-600 text-white px-4 py-2 font-bold text-sm">PROPORTIONAL TAX ALLOCATION ANALYSIS</div>
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
                          <td className="py-2 text-right font-mono bg-green-50">$8,901.50</td>
                          <td className="py-2 text-right font-mono bg-red-50 font-bold">$8,901.50</td>
                        </tr>
                        <tr>
                          <td className="py-2">Petitioner</td>
                          <td className="py-2 text-right font-mono">35%</td>
                          <td className="py-2 text-right font-mono bg-green-50">$4,793.12</td>
                          <td className="py-2 text-right font-mono bg-green-50">$0 (seeks reimbursement)</td>
                        </tr>
                      </tbody>
                    </table>
                    <p className="mt-3 text-xs bg-indigo-50 p-2 rounded">
                      <strong>Note:</strong> While proportional allocation matches Petitioner's requested amount, she provides no evidence this tax liability actually exists or that she paid it.
                    </p>
                  </div>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">5.4 Timing and Payment Questions.</span> Petitioner fails to address critical timing issues:
                </p>

                <ul className="ml-12 list-decimal space-y-2 text-sm text-slate-700">
                  <li>When was the withholding allegedly paid? (No date provided)</li>
                  <li>To which taxing authority? (IRS, FTB, or both?)</li>
                  <li>What was the actual sale-year tax liability vs. withholding?</li>
                  <li>Will Petitioner receive a refund when taxes are filed?</li>
                </ul>

                <p className="leading-relaxed mt-3">
                  <span className="font-semibold">5.5 Requested Relief.</span> I request that the Court deny Petitioner's tax withholding claim unless and until she provides:
                </p>

                <div className="ml-8 my-2 bg-blue-50 border-l-4 border-blue-500 p-3">
                  <ul className="text-sm space-y-1 text-blue-900">
                    <li>[OK] Proof of actual tax liability</li>
                    <li>[OK] Evidence of payment (cancelled check, wire confirmation)</li>
                    <li>[OK] Tax professional analysis</li>
                    <li>[OK] IRS/FTB correspondence confirming obligation</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE 4 - CONTINUATION OF RESPONDENT'S DECLARATION */}
        <div className="page-break min-h-[11in] p-16">
          <div className="text-sm leading-relaxed space-y-4">

            <div>
              <h3 className="font-semibold mb-2">6. ATTORNEY FEES SANCTIONS - NO EVIDENCE OF BAD FAITH</h3>
              <p><strong>No Evidence of "Willful Disregard":</strong> Petitioner seeks $40,000 in attorney fees as sanctions, claiming I "willfully disregarded" court orders. However, she provides no evidence of bad faith or intentional violation of orders.</p>
              
              <p><strong>Exercise of Legal Rights:</strong> My actions were consistent with exercising legal rights, not violating court orders. Disagreement with Petitioner's interpretation of orders does not constitute "willful disregard."</p>
              
              <p><strong>Petitioner's Own Delays:</strong> The record shows Petitioner caused significant delays in the Property sale process, yet she seeks sanctions against me for delays.</p>
              
              <p><strong>Legal Standard for Sanctions:</strong> Family Code section 271 requires a showing of conduct that "frustrates the policy of the law to promote settlement of litigation." Petitioner provides no evidence that my actions frustrated settlement or violated any court orders.</p>
              
              <p><strong>Petitioner's Cooperation Issues:</strong> The record demonstrates that Petitioner was uncooperative during the Property sale process, including delays in signing necessary documents and refusal to work with the realtor. These delays were caused by Petitioner, not me.</p>
              
              <p><strong>No Court Order Violations:</strong> Petitioner fails to identify any specific court orders that I allegedly violated. Her claim of "willful disregard" is unsupported by evidence and appears to be a tactic to shift blame for her own delays.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">7. CLEANUP COSTS - INSUFFICIENT EVIDENCE</h3>
              <p><strong>No Proof of Damage:</strong> Petitioner claims $6,419 in cleanup costs and $2,470 in removal costs, but provides insufficient evidence of actual damage or the condition of the Property before and after my departure.</p>
              
              <p><strong>Normal Wear and Tear:</strong> The photos attached to her declaration appear to show normal wear and tear, not damage requiring $6,419 in repairs.</p>
              
              <p><strong>Petitioner's Use of Property:</strong> After taking possession on November 16, 2024, Petitioner used the Property for her own purposes. Any cleanup costs should be offset by her use and benefit.</p>
              
              <p><strong>Lack of Documentation:</strong> Petitioner provides no receipts, invoices, or other documentation to support her claimed cleanup costs. The amounts appear to be estimates without supporting evidence.</p>
              
              <p><strong>Condition Before Departure:</strong> Petitioner provides no evidence of the Property's condition before my departure. Without baseline documentation, her claims of damage are unsubstantiated.</p>
              
              <p><strong>Petitioner's Responsibility:</strong> As the party in possession from November 16, 2024, Petitioner was responsible for maintaining the Property. Any cleanup costs incurred during her possession period should be her responsibility.</p>
            </div>
          </div>
        </div>

        {/* PAGE 5 - CONTINUATION OF RESPONDENT'S DECLARATION */}
        <div className="page-break min-h-[11in] p-16">
          <div className="text-sm leading-relaxed space-y-4">

            <div>
              <h3 className="font-semibold mb-2">8. COUNTER-CLAIMS AND OFFSETS</h3>
              <p><strong>Petitioner's Possession Period:</strong> From November 16, 2024, to the sale date of May 30, 2025, Petitioner had exclusive possession of the Property. She should be responsible for all Property-related expenses during this period.</p>
              
              <p><strong>Offset for Petitioner's Use:</strong> Petitioner's use of the Property from November 16, 2024, to May 30, 2025, should offset any Watts charges she claims against me.</p>
              
              <p><strong>Petitioner's Delays:</strong> Petitioner's own actions caused delays in the Property sale process, including her refusal to cooperate with the realtor and her delays in signing necessary documents.</p>
              
              <p><strong>Email Evidence of Cooperation:</strong> My email communications with Ron Melendez, the listing realtor, demonstrate my good faith efforts to cooperate with the Property sale. These communications contradict Petitioner's claims of non-cooperation and willful disregard of court orders.</p>
              
              <p><strong>Petitioner's Unreasonable Demands:</strong> Email evidence shows Petitioner made unreasonable demands during the sale process, including insisting on expensive realtor services against the will of the property owner, creating unnecessary delays and costs.</p>
              
              <p><strong>Furniture Fraud Evidence:</strong> Documentary evidence establishes that Petitioner instructed my new wife Piyawan that all jointly purchased furniture must stay in the Property, then charged me $2,000+ for hauling it away while keeping the furniture for herself. This constitutes unjust enrichment and fraud.</p>
            </div>
          </div>
        </div>

        {/* PAGE 6 - CONTINUATION OF RESPONDENT'S DECLARATION */}
        <div className="page-break min-h-[11in] p-16">
          <div className="text-sm leading-relaxed space-y-4">

            <div>
              <h3 className="font-semibold mb-2">9. LEGAL ANALYSIS</h3>
              <p><strong>Family Code Section 2550:</strong> The division of community property must be "equal" unless there is a valid reason for unequal division. Petitioner's requested division is not equal and lacks legal justification.</p>
              
              <p><strong>Family Code Section 271:</strong> Attorney fees sanctions require a showing of conduct that "frustrates the policy of the law to promote settlement of litigation." My actions were consistent with exercising legal rights, not frustrating settlement.</p>
              
              <p><strong>Watts Charges Law:</strong> Watts charges are for exclusive use and possession. Once Petitioner took possession, the charges should end. Her claims for charges after possession are legally unsupportable.</p>
              
              <p><strong>Add-Back Methodology Legal Error:</strong> Petitioner's "add-back" methodology has no legal precedent in California family law. This scheme violates basic accounting principles and creates an impermissible windfall to the non-paying spouse. No California case law supports adding back paid debts to create artificial proceeds.</p>
              
              <p><strong>Double-Counting Prohibition:</strong> California law prohibits double-counting of debts and credits in property division. Petitioner's methodology violates this fundamental principle by both deducting the $77,779.88 from net proceeds AND adding it back to inflate her share.</p>
              
              <p><strong>Equitable Distribution Principles:</strong> Petitioner's requested distribution violates California's equitable distribution principles. She seeks to convert her 35% ownership interest into 95%+ of the actual distribution through mathematical manipulation and inflated claims.</p>
              
              <p><strong>Watts v. Watts (1985) 171 Cal.App.3d 366:</strong> This case establishes that Watts charges are for exclusive use and possession and must end when possession changes. Petitioner's own admission that she took possession on November 16, 2024, legally terminates any Watts charges as of that date.</p>
              
              <p><strong>Expert Testimony Scrutiny:</strong> Petitioner's claim of $4,500/month fair rental value requires scrutiny. The actual rental market for 3525 8th Avenue, Los Angeles, CA 90018 must be verified through comparable properties and market analysis.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">10. REQUESTED RELIEF</h3>
              <p><strong>Denial of RFO:</strong> I request that this Court deny Petitioner's Request for Order in its entirety due to the fundamental mathematical errors and legal deficiencies outlined above.</p>
              
              <p><strong>Correct Distribution:</strong> The escrow proceeds of $280,355.83 should be divided according to the Judgment: 65% to me ($182,231.29) and 35% to Petitioner ($98,124.54).</p>
              
              <p><strong>Offset Claims:</strong> I request that any Watts charges be calculated only through November 15, 2024, and that Petitioner's use of the Property from November 16, 2024, to May 30, 2025, be offset against any charges.</p>
              
              <p><strong>Attorney Fees:</strong> I request that this Court deny Petitioner's request for attorney fees sanctions and instead order her to pay my attorney fees for this unnecessary motion.</p>
              
              <p><strong>Disclosure of Missing Funds:</strong> I request that Petitioner be ordered to disclose the disposition of the $137,245.52 that is unaccounted for in her distribution calculations. This amount represents nearly half of the escrow proceeds and must be explained.</p>
              
              <p><strong>Furniture Fraud Correction:</strong> I request that the Court correct the furniture payment order based on evidence that Petitioner kept the furniture after instructing that it must stay in the Property. This constitutes unjust enrichment and requires correction.</p>
              
              <p><strong>Interest Rate Verification:</strong> I request that Petitioner be required to provide detailed calculations for all interest charges, including the specific dates used and whether simple or compound interest was applied.</p>
              
              <p><strong>Market Value Verification:</strong> I request that Petitioner be required to provide comparable rental properties to support her claimed $4,500/month fair rental value for Watts charges calculations.</p>
            </div>
          </div>
        </div>

        {/* PAGE 7 - CONTINUATION OF RESPONDENT'S DECLARATION */}
        <div className="page-break min-h-[11in] p-16">
          <div className="text-sm leading-relaxed space-y-4">

            <div>
              <h3 className="font-semibold mb-2">11. CONCLUSION</h3>
              <p>Petitioner's Request for Order is based on fundamental mathematical errors and legal misstatements. The core flaw - attempting to both deduct and add back the same $77,779.88 - renders her entire calculation invalid. Her claims for Watts charges after taking possession, attorney fees sanctions without evidence of bad faith, and cleanup costs without proof of damage are all legally unsupportable.</p>
              
              <p>I respectfully request that this Court deny Petitioner's Request for Order and order the escrow proceeds divided according to the Judgment without the mathematical errors and legal deficiencies contained in Petitioner's motion.</p>
              
              <p><strong>Summary of Critical Issues:</strong> Petitioner's motion attempts to convert her 35% ownership interest into 95%+ of the actual distribution through: (1) mathematical manipulation using an impermissible "add-back" methodology; (2) inflated Watts charges extending beyond her possession date; (3) excessive attorney fees sanctions without evidence of bad faith; (4) unsubstantiated cleanup costs; and (5) failure to account for $137,245.52 in missing funds.</p>
              
              <p><strong>Evidence Supporting My Position:</strong> Email communications with the realtor demonstrate my good faith cooperation. Documentary evidence proves Petitioner's furniture fraud. Legal analysis shows no California precedent for the "add-back" methodology. Petitioner's own admission of possession on November 16, 2024, terminates Watts charges as of that date.</p>
              
              <p><strong>Requested Relief:</strong> I request that this Court deny Petitioner's motion in its entirety and order distribution according to the Judgment: 65% to me ($182,231.29) and 35% to Petitioner ($98,124.54), with legitimate offsets applied fairly and transparently.</p>
            </div>
          </div>
        </div>

        {/* PAGE 8 - CONTINUATION OF RESPONDENT'S DECLARATION */}
        <div className="page-break min-h-[11in] p-16">
          <div className="text-sm leading-relaxed space-y-4">

            <div>
              <h3 className="font-semibold mb-2">12. DETAILED FINANCIAL ANALYSIS</h3>
              <p><strong>Petitioner's Mathematical Scheme:</strong> Petitioner's "add-back" methodology violates basic accounting principles and California law. She attempts to:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Claim the mortgage company was paid $759,364.32 at closing</li>
                <li>Identify $77,779.88 as "unpaid mortgage/escrow" costs</li>
                <li>"Add back" this $77,779.88 to net proceeds to create artificial total of $358,155.71</li>
                <li>Take 35% of the inflated amount ($125,354.50)</li>
                <li>Then deduct the same $77,779.88 from my 65% share</li>
                <li><strong>Result: She gets $27,229.96 more than her rightful 35% share</strong></li>
              </ul>
              
              <p><strong>Correct Distribution Calculation:</strong> The escrow proceeds of $280,355.83 already reflect payment of all mortgage obligations. The correct distribution is:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>My 65% share: $182,231.29</li>
                <li>Petitioner's 35% share: $98,124.54</li>
                <li>Any legitimate offsets should be applied proportionally</li>
              </ul>
              
              <p><strong>Petitioner's Windfall:</strong> Through her mathematical manipulation, Petitioner seeks to convert her 35% ownership interest into 95%+ of the actual distribution, representing a theft of approximately $82,619 from my rightful share.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">13. EVIDENCE OF COOPERATION</h3>
              <p><strong>Email Communications with Realtor:</strong> My email correspondence with Ron Melendez, the listing realtor, demonstrates consistent good faith efforts to cooperate with the Property sale process. These communications contradict Petitioner's claims of non-cooperation and willful disregard of court orders.</p>
              
              <p><strong>Timeline of Cooperation:</strong> The email evidence shows my active participation in the sale process, including responding to realtor inquiries, providing necessary information, and attempting to resolve issues that arose during the sale.</p>
              
              <p><strong>Petitioner's Unreasonable Demands:</strong> Email evidence establishes that Petitioner made unreasonable demands during the sale process, including insisting on expensive realtor services against the will of the property owner, creating unnecessary delays and costs.</p>
              
              <p><strong>Good Faith Efforts:</strong> Despite financial hardship, I made good faith efforts to cooperate with the Property sale, including attempting loan modifications and communicating with the lender about payment arrangements.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">14. FURNITURE FRAUD DOCUMENTATION</h3>
              <p><strong>Petitioner's Instructions:</strong> Documentary evidence establishes that Petitioner instructed my new wife Piyawan that all jointly purchased furniture must stay in the Property. This instruction was given after the court ordered me to pay Petitioner $7,500 for furniture.</p>
              
              <p><strong>Subsequent Actions:</strong> Despite instructing that furniture must stay, Petitioner then charged me $2,000+ for hauling the furniture away and kept the furniture for herself. This constitutes unjust enrichment and fraud.</p>
              
              <p><strong>Financial Impact:</strong> Petitioner received both the $7,500 court-ordered payment AND kept furniture worth approximately $15,000, representing a $22,500 windfall at my expense.</p>
              
              <p><strong>Legal Remedy:</strong> This fraud requires correction by reversing the furniture payment order and requiring Petitioner to account for the furniture she retained.</p>
            </div>

            <div className="mt-12">
              <p>I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.</p>
              
              <div className="mt-8">
                <p><strong>DATED:</strong> {new Date().toLocaleDateString()}</p>
                <div className="mt-8">
                  <div className="border-b border-black w-64"></div>
                  <p className="mt-2"><strong>MATHIEU CHRISTIAN YVES WAUTERS</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE 9 - TOM ROTERT DECLARATION */}
        <div className="page-break min-h-[11in] p-16 measure">
          <h2 className="text-xl font-bold mb-6 text-center">DECLARATION OF TOM ROTERT</h2>
          
          <div className="text-sm leading-relaxed space-y-4">
            <p><strong>I, Tom Rotert, declare as follows:</strong></p>
            
            <div>
              <h3 className="font-semibold mb-2">1. PERSONAL KNOWLEDGE AND QUALIFICATIONS</h3>
              <p>I am a licensed attorney in the State of California with over 15 years of experience in family law matters, including complex property division cases. I have reviewed the Petitioner's Request for Order and the Respondent's opposition thereto. I have personal knowledge of the facts stated herein and could competently testify thereto if called as a witness.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. ANALYSIS OF PETITIONER'S MATHEMATICAL ERRORS</h3>
              <p>After reviewing Petitioner's RFO and the supporting documentation, I have identified fundamental mathematical errors that render her requested relief legally impossible. The primary error is Petitioner's attempt to both deduct $77,779.88 from the net proceeds AND add it back to create a fictional "total net proceed" of $358,155.71.</p>
              
              <p>This violates basic principles of accounting and mathematics. You cannot both pay a debt and add it back to your share of proceeds. The escrow proceeds of $280,355.83 already reflect the payment of all mortgage obligations, including the $77,779.88 in arrears.</p>
              
              <p>Petitioner's requested distribution of 35% of $358,155.71 = $125,354.50 is based on this mathematically impossible calculation and must be rejected by this Court.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. LEGAL AUTHORITY AND PRECEDENT</h3>
              <p>Family Code Section 2550 requires equal division of community property unless there is a valid reason for unequal division. Petitioner's requested division violates this requirement and lacks legal justification.</p>
              
              <p>Watts v. Watts (1985) 171 Cal.App.3d 366 establishes that Watts charges are for exclusive use and possession and must end when possession changes. Petitioner's own declaration admits she took possession on November 16, 2024, yet she claims Watts charges through that date, which is legally impossible.</p>
              
              <p>Family Code Section 271 requires a showing of conduct that "frustrates the policy of the law to promote settlement" for attorney fees sanctions. No such evidence exists in this case. Respondent's actions were consistent with exercising legal rights.</p>
            </div>

            <div className="mt-12">
              <p>I declare under penalty of perjury under the laws of the State of California that the foregoing is true and correct.</p>
              
              <div className="mt-8">
                <p><strong>DATED:</strong> {new Date().toLocaleDateString()}</p>
                <div className="mt-8">
                  <div className="border-b border-black w-64"></div>
                  <p className="mt-2"><strong>TOM ROTERT</strong></p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PAGE 10 - MEMORANDUM OF POINTS AND AUTHORITIES */}
        <div className="page-break min-h-[11in] p-16 measure">
          <h2 className="text-xl font-bold mb-6 text-center">MEMORANDUM OF POINTS AND AUTHORITIES</h2>
          
          <div className="text-sm leading-relaxed space-y-4">
            <div>
              <h3 className="font-semibold mb-2">I. INTRODUCTION</h3>
              <p>This memorandum addresses Petitioner's Request for Order seeking redistribution of escrow proceeds. Petitioner's motion is based on fundamental mathematical errors and legal misstatements that render her requested relief impossible and unsupportable.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">II. STATEMENT OF FACTS</h3>
              <p>The Property was sold on May 30, 2025, with net proceeds of $280,355.83. Petitioner took exclusive possession on November 16, 2024. She now seeks to both deduct $77,779.88 from net proceeds AND add it back to create a fictional total of $358,155.71.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">III. ARGUMENT</h3>
              
              <div className="ml-4">
                <h4 className="font-semibold mb-2">A. Petitioner's Mathematical Error Renders Her Request Impossible</h4>
                <p>Petitioner's calculation violates basic arithmetic principles. You cannot both pay a debt and add it back to proceeds. The escrow proceeds already reflect payment of all mortgage obligations.</p>
                
                <h4 className="font-semibold mb-2">B. Watts Charges Must End When Possession Changes</h4>
                <p>Watts v. Watts (1985) 171 Cal.App.3d 366. Petitioner's own admission that she took possession on November 16, 2024, ends any Watts charges claim as of that date.</p>
                
                <h4 className="font-semibold mb-2">C. No Evidence of Bad Faith for Attorney Fees Sanctions</h4>
                <p>Family Code Section 271 requires showing conduct that frustrates settlement policy. No such evidence exists. Respondent's actions were consistent with exercising legal rights.</p>
                
                <h4 className="font-semibold mb-2">D. Equal Division Required Under Family Code Section 2550</h4>
                <p>Community property must be divided equally unless valid reason for unequal division exists. Petitioner's requested division violates this requirement.</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">IV. CONCLUSION</h3>
              <p>Petitioner's Request for Order must be denied due to fundamental mathematical errors and legal deficiencies. The Court should order escrow proceeds divided according to the Judgment: 65% to Respondent ($182,231.29) and 35% to Petitioner ($98,124.54).</p>
            </div>

            <div className="mt-12">
              <p><strong>DATED:</strong> {new Date().toLocaleDateString()}</p>
              <p><strong>Respectfully submitted,</strong></p>
              <div className="mt-8">
                <div className="border-b border-black w-64"></div>
                <p className="mt-2"><strong>[ATTORNEY NAME]</strong></p>
                <p>Attorney for Respondent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dual-Format Styles: Beautiful Web UI + California Rules of Court Print */}
      <style jsx>{`
        /* =================================================================
           PRINT STYLES - California Rules of Court Compliance
           Rules 2.104 (Font), 2.107 (Margins), 2.108 (Line Spacing/Numbers)
           ================================================================= */
        @media print {
          /* Hide print controls */
          .no-print { display: none !important; }

          /* Page breaks */
          .page-break { page-break-before: always; }
          .page-break:first-child { page-break-before: avoid; }

          /* California Rules of Court formatting */
          body {
            margin: 0;
            padding: 0;
            font-family: "Courier New", Courier, monospace;
            font-size: 12pt;
            line-height: 2.0;
          }

          .legal-document {
            font-family: "Courier New", Courier, monospace !important;
            font-size: 12pt !important;
            line-height: 2.0 !important;
            max-width: 8.5in;
            margin: 0;
            padding: 1in 0.5in 1in 1in !important;
            background: white !important;
            box-shadow: none !important;
          }

          /* Strip ALL colorful web styling for court compliance */
          .bg-purple-50, .bg-purple-100, .bg-purple-200,
          .bg-green-50, .bg-green-100, .bg-green-200,
          .bg-red-50, .bg-red-100, .bg-red-200,
          .bg-blue-50, .bg-blue-100, .bg-blue-200,
          .bg-yellow-50, .bg-yellow-100, .bg-yellow-200,
          .bg-indigo-50, .bg-indigo-100, .bg-indigo-200,
          .bg-slate-50, .bg-slate-100, .bg-slate-200 {
            background: white !important;
            border: none !important;
            padding: 0 !important;
            margin: 4pt 0 !important;
          }

          /* Remove rounded corners */
          .rounded, .rounded-lg, .rounded-md {
            border-radius: 0 !important;
          }

          /* Remove decorative borders */
          .border-l-4, .border-2, .border-4 {
            border: none !important;
          }

          /* Convert grids to single column */
          .grid {
            display: block !important;
          }

          .grid > div {
            display: block !important;
            width: 100% !important;
            margin-bottom: 12pt !important;
          }

          /* Pleading paper line numbers (Rule 2.108) */
          .line-numbers {
            counter-reset: line-counter;
          }

          .line-numbers .line {
            position: relative;
            padding-left: 0.75in;
            min-height: 24pt;
          }

          .line-numbers .line::before {
            counter-increment: line-counter;
            content: counter(line-counter);
            position: absolute;
            left: 0.25in;
            width: 0.4in;
            text-align: right;
            font-size: 10pt;
            color: #000;
            font-family: "Courier New", Courier, monospace;
          }

          /* Caption box (keep border for court format) */
          .caption-box {
            border: 2pt solid black !important;
            padding: 12pt;
            margin: 24pt 0;
            background: white !important;
          }

          /* Page footers */
          .footer {
            position: fixed;
            bottom: 0.5in;
            left: 1in;
            right: 0.5in;
            text-align: center;
            font-size: 10pt;
            border-top: 1pt solid black;
            padding-top: 6pt;
          }

          /* Plain text formatting for all elements */
          p, div, span, li {
            font-family: "Courier New", Courier, monospace !important;
            font-size: 12pt !important;
            line-height: 2.0 !important;
          }

          /* Keep headings bold */
          h1, h2, h3, h4, .font-bold {
            font-weight: bold !important;
            font-family: "Courier New", Courier, monospace !important;
          }

          /* Standardize margins */
          .ml-4 { margin-left: 24pt !important; }
          .ml-8 { margin-left: 48pt !important; }
          .ml-12 { margin-left: 72pt !important; }

          /* Remove shadows and effects */
          * {
            box-shadow: none !important;
            text-shadow: none !important;
          }
        }

        /* =================================================================
           SCREEN STYLES - Beautiful, Modern Web UI
           ================================================================= */
        .legal-document {
          font-family: Georgia, "Times New Roman", serif;
          font-size: 15px;
          line-height: 1.7;
          max-width: 8.5in;
          margin: 0 auto;
          background: white;
          box-shadow: 0 0 30px rgba(0,0,0,0.15);
          padding: 3rem;
        }

        /* Subtle line numbers for screen */
        .line-numbers {
          counter-reset: line-counter;
        }

        .line-numbers .line {
          position: relative;
          padding-left: 0.75in;
          min-height: 24pt;
        }

        .line-numbers .line::before {
          counter-increment: line-counter;
          content: counter(line-counter);
          position: absolute;
          left: 0.25in;
          width: 0.4in;
          text-align: right;
          font-size: 9pt;
          color: #e0e0e0;
          font-family: "Courier New", Courier, monospace;
        }

        .page-content {
          padding: 2.5rem;
        }

        .caption-box {
          border: 3px solid #2c3e50;
          padding: 1.5rem;
          margin: 2rem 0;
          background: #f8f9fa;
          border-radius: 4px;
        }

        .centered {
          text-align: center;
        }

        /* Beautiful spacing for web */
        .space-y-4 > * + * {
          margin-top: 1rem;
        }

        .ml-4 { margin-left: 1.5rem; }
        .ml-8 { margin-left: 3rem; }
        .ml-12 { margin-left: 4.5rem; }

        /* Enhanced readability */
        p {
          margin-bottom: 0.75rem;
        }

        h3 {
          margin-top: 1.5rem;
          margin-bottom: 0.75rem;
          color: #2c3e50;
        }

        h4 {
          margin-top: 1rem;
          margin-bottom: 0.5rem;
          color: #34495e;
        }
      `}</style>
      </div>
    );
  };

export default OppositionFilingPage;
