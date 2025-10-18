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
              <span>&nbsp;&nbsp;2. Timeline of Events - Petitioner's Possession Control</span>
              <span>3</span>
            </div>
            <div className="flex justify-between">
              <span>&nbsp;&nbsp;3. Mathematical Impossibility of Petitioner's Calculations</span>
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

        {/* PAGE 3-8 - RESPONDENT'S DECLARATION */}
        <div className="page-break min-h-[11in] p-12">
          <div className="border-b-2 border-gray-800 pb-3 mb-6">
            <h2 className="text-xl font-bold text-center tracking-wide">DECLARATION OF MATHIEU CHRISTIAN YVES WAUTERS</h2>
            <p className="text-center text-xs text-gray-600 mt-1">In Opposition to Petitioner's Request for Order</p>
          </div>

          <div className="text-[13px] leading-[1.7] space-y-5">
            <p className="text-center italic mb-6"><strong>I, Mathieu Christian Yves Wauters, declare under penalty of perjury as follows:</strong></p>

            {/* Section 1 */}
            <div className="space-y-4">
              <h3 className="text-base font-bold border-l-4 border-blue-600 pl-3 py-1 bg-blue-50">
                1. INTRODUCTION AND PERSONAL KNOWLEDGE
              </h3>

              <div className="ml-4 space-y-3">
                <p className="leading-relaxed">
                  <span className="font-semibold">1.1 Standing and Competency.</span> I am the Respondent in this dissolution action, Case No. FDI-21-794666. I have personal knowledge of all facts stated herein except those stated on information and belief, and as to those matters, I believe them to be true. I am over 18 years of age and competent to testify to the matters stated herein if called as a witness.
                </p>

                <p className="leading-relaxed">
                  <span className="font-semibold">1.2 Purpose of Declaration.</span> This declaration is made in support of my opposition to Petitioner Rosanna Claire Alvero's Request for Order (RFO) filed June 25, 2025, seeking redistribution of escrow proceeds from the sale of the real property located at:
                </p>

                <div className="ml-8 my-2 p-3 bg-gray-50 border-l-2 border-gray-400">
                  <p className="font-mono text-xs">3525 8th Avenue, Los Angeles, CA 90018</p>
                  <p className="text-xs text-gray-600 mt-1">(hereinafter "the Property")</p>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">1.3 Core Legal Deficiency.</span> Petitioner's RFO contains fundamental mathematical errors that render her requested relief legally and arithmetically impossible. The central flaw is her attempt to simultaneously:
                </p>

                <div className="ml-8 space-y-2 my-3">
                  <div className="flex items-start">
                    <span className="font-bold mr-3 text-red-600">•</span>
                    <p><strong>DEDUCT</strong> $77,779.88 from the net escrow proceeds (as a debt paid at closing), <em>and</em></p>
                  </div>
                  <div className="flex items-start">
                    <span className="font-bold mr-3 text-red-600">•</span>
                    <p><strong>ADD BACK</strong> the same $77,779.88 to create a fictional "total net proceed" of $358,155.71</p>
                  </div>
                </div>

                <div className="my-4 p-4 bg-yellow-50 border border-yellow-400 rounded">
                  <p className="font-bold text-sm text-yellow-900 mb-2">⚠️ MATHEMATICAL IMPOSSIBILITY</p>
                  <p className="text-xs leading-relaxed">This double-counting scheme violates basic arithmetic principles. One cannot both pay a debt AND add that same amount back to available proceeds. This demonstrates either a fundamental misunderstanding of accounting principles or an intentional attempt to mislead this Court.</p>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">1.4 Legal Authority and Relief Sought.</span> This opposition is filed pursuant to California Family Code § 271 and California Rules of Court, Rule 5.92. I respectfully request that this Court <strong>deny Petitioner's motion in its entirety</strong> due to the mathematical impossibilities, legal deficiencies, and factual misrepresentations outlined below.
                </p>
              </div>
            </div>

            {/* Section 2 */}
            <div className="space-y-4 mt-6">
              <h3 className="text-base font-bold border-l-4 border-blue-600 pl-3 py-1 bg-blue-50">
                2. CHRONOLOGICAL TIMELINE — PETITIONER'S EXCLUSIVE POSSESSION AND CONTROL
              </h3>

              <div className="ml-4 space-y-4">
                <p className="leading-relaxed">
                  <span className="font-semibold">2.1 Critical Possession Date: November 16, 2024.</span> Petitioner took exclusive possession of the Property on November 16, 2024. This fact is established by Petitioner's own sworn declaration at ¶19, which states:
                </p>

                <div className="ml-8 my-3 p-3 bg-gray-100 border-l-4 border-gray-500 italic">
                  <p className="text-sm">"On November 16, 2024, I took possession of the home."</p>
                  <p className="text-xs text-gray-600 mt-1">— Petitioner's Declaration, ¶19 (June 25, 2025)</p>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">2.2 Legal Significance of Possession Transfer.</span> Under California family law, the party in exclusive possession of community real property bears responsibility for all Property-related expenses from the date of possession. Once Petitioner took possession on November 16, 2024, she became legally responsible for:
                </p>

                <div className="ml-8 grid grid-cols-2 gap-3 my-3">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm">
                    <p className="font-semibold text-xs text-blue-900">Mortgage Payments</p>
                    <p className="text-xs text-gray-700 mt-1">Principal, interest, and escrow</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm">
                    <p className="font-semibold text-xs text-blue-900">Property Taxes</p>
                    <p className="text-xs text-gray-700 mt-1">All tax obligations post-possession</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm">
                    <p className="font-semibold text-xs text-blue-900">Insurance Premiums</p>
                    <p className="text-xs text-gray-700 mt-1">Homeowner's and liability coverage</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-sm">
                    <p className="font-semibold text-xs text-blue-900">Maintenance & Repairs</p>
                    <p className="text-xs text-gray-700 mt-1">All upkeep and improvements</p>
                  </div>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">2.3 Complete Property Timeline.</span> The following chronology demonstrates the critical dates and Petitioner's exclusive control:
                </p>

                <div className="ml-8 my-3 space-y-2">
                  <div className="flex items-start border-l-2 border-gray-300 pl-4 py-2">
                    <div className="min-w-[140px] font-mono text-xs font-semibold text-gray-700">Dec 2023</div>
                    <p className="text-sm">Last mortgage payment allegedly made (per Petitioner's claim)</p>
                  </div>
                  <div className="flex items-start border-l-2 border-red-500 pl-4 py-2 bg-red-50">
                    <div className="min-w-[140px] font-mono text-xs font-semibold text-red-700">Nov 16, 2024</div>
                    <p className="text-sm"><strong>PETITIONER TAKES EXCLUSIVE POSSESSION</strong> — All liability transfers to Petitioner</p>
                  </div>
                  <div className="flex items-start border-l-2 border-gray-300 pl-4 py-2">
                    <div className="min-w-[140px] font-mono text-xs font-semibold text-gray-700">Feb 15, 2025</div>
                    <p className="text-sm">Property listed for sale (Petitioner in possession: 91 days)</p>
                  </div>
                  <div className="flex items-start border-l-2 border-green-500 pl-4 py-2 bg-green-50">
                    <div className="min-w-[140px] font-mono text-xs font-semibold text-green-700">May 30, 2025</div>
                    <p className="text-sm"><strong>PROPERTY SOLD</strong> — Petitioner in possession: 196 days (6.5 months)</p>
                  </div>
                </div>

                <div className="my-4 p-4 bg-red-50 border border-red-300 rounded">
                  <p className="font-bold text-sm text-red-900 mb-2">🚫 LEGAL IMPOSSIBILITY</p>
                  <p className="text-xs leading-relaxed">Petitioner cannot claim Watts charges or expenses for the 196-day period (November 16, 2024 → May 30, 2025) during which she had exclusive possession, use, and benefit of the Property. Her claims for expenses during her own possession period are legally baseless and directly contradicted by her own sworn admission.</p>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">2.4 Binding Judicial Admission.</span> Petitioner's sworn statement of possession on November 16, 2024, constitutes a binding judicial admission under California Evidence Code § 1220. She cannot now claim expenses against me for a period when she admits she had exclusive possession and control of the Property.
                </p>
              </div>
            </div>

            {/* Section 3 */}
            <div className="space-y-4 mt-6 page-break-before">
              <h3 className="text-base font-bold border-l-4 border-red-600 pl-3 py-1 bg-red-50">
                3. MATHEMATICAL IMPOSSIBILITY — THE $77,779.88 DOUBLE-COUNTING SCHEME
              </h3>

              <div className="ml-4 space-y-4">
                <p className="leading-relaxed">
                  <span className="font-semibold">3.1 Overview of Fatal Calculation Error.</span> Petitioner's RFO is premised on a mathematically impossible "add-back" methodology that violates fundamental principles of accounting and arithmetic. This scheme attempts to artificially inflate the distributable proceeds by double-counting a debt payment.
                </p>

                <p className="leading-relaxed">
                  <span className="font-semibold">3.2 Actual Escrow Closing Figures.</span> The escrow closing statement from the May 30, 2025 sale establishes the following undisputed facts:
                </p>

                <div className="ml-8 my-3 bg-white border-2 border-gray-300 rounded overflow-hidden">
                  <div className="bg-gray-700 text-white px-4 py-2 font-bold text-sm">ESCROW CLOSING STATEMENT — MAY 30, 2025</div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-sm font-semibold">Gross Sale Price</span>
                      <span className="font-mono text-sm">$1,050,000.00</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-sm">Less: Closing Costs & Commissions</span>
                      <span className="font-mono text-sm text-red-600">($10,280.05)</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                      <span className="text-sm font-semibold">Less: Mortgage Payoff (Total)</span>
                      <span className="font-mono text-sm text-red-600 font-bold">($759,364.32)</span>
                    </div>
                    <div className="ml-6 flex justify-between items-center text-xs text-gray-600 pb-1">
                      <span>→ Principal Balance</span>
                      <span className="font-mono">$681,584.44</span>
                    </div>
                    <div className="ml-6 flex justify-between items-center text-xs text-gray-600 pb-1">
                      <span>→ Arrears & Late Charges</span>
                      <span className="font-mono font-bold text-red-700">$77,779.88</span>
                    </div>
                    <div className="flex justify-between items-center bg-green-50 px-3 py-2 font-bold border-t-2 border-green-600">
                      <span className="text-sm">NET PROCEEDS AVAILABLE</span>
                      <span className="font-mono text-base text-green-700">$280,355.83</span>
                    </div>
                  </div>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">3.3 Petitioner's Impossible "Add-Back" Scheme.</span> Petitioner's RFO employs the following logically and mathematically impossible methodology:
                </p>

                <div className="ml-8 my-4 space-y-3">
                  <div className="border-2 border-red-500 bg-red-50 p-4 rounded">
                    <p className="font-bold text-red-900 text-sm mb-3">❌ PETITIONER'S FLAWED CALCULATION</p>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span><strong>Step 1:</strong> Start with net proceeds</span>
                        <span className="font-mono">$280,355.83</span>
                      </div>
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span><strong>Step 2:</strong> "Add back" arrears already paid</span>
                        <span className="font-mono text-red-600">+ $77,779.88</span>
                      </div>
                      <div className="flex justify-between bg-red-100 p-2 rounded border border-red-400">
                        <span><strong>Step 3:</strong> Create fictional "total"</span>
                        <span className="font-mono font-bold">= $358,155.71</span>
                      </div>
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span><strong>Step 4:</strong> Calculate her 35% share</span>
                        <span className="font-mono">$125,354.50</span>
                      </div>
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span><strong>Step 5:</strong> Deduct same $77,779.88 from my share</span>
                        <span className="font-mono text-red-600">($77,779.88)</span>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-red-200 border border-red-600 rounded">
                      <p className="text-xs font-bold text-red-900">RESULT: The same $77,779.88 is BOTH added to her share AND subtracted from mine, creating a $27,229.96 windfall to Petitioner through mathematical manipulation.</p>
                    </div>
                  </div>

                  <div className="border-2 border-green-600 bg-green-50 p-4 rounded">
                    <p className="font-bold text-green-900 text-sm mb-3">✓ CORRECT CALCULATION</p>

                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between bg-white p-2 rounded">
                        <span><strong>Net Proceeds Available</strong></span>
                        <span className="font-mono font-bold">$280,355.83</span>
                      </div>
                      <div className="flex justify-between bg-white p-2 rounded border-l-4 border-green-600">
                        <span>Respondent's 65% Share</span>
                        <span className="font-mono">$182,231.29</span>
                      </div>
                      <div className="flex justify-between bg-white p-2 rounded border-l-4 border-blue-600">
                        <span>Petitioner's 35% Share</span>
                        <span className="font-mono">$98,124.54</span>
                      </div>
                    </div>

                    <div className="mt-3 p-3 bg-green-100 border border-green-600 rounded">
                      <p className="text-xs">All mortgage obligations, including the $77,779.88 in arrears, were already paid at closing. These amounts are <strong>not</strong> available for distribution and cannot be "added back."</p>
                    </div>
                  </div>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">3.4 Violation of Accounting Principles.</span> Petitioner's methodology violates the fundamental accounting principle that <em>proceeds = gross sale price minus all obligations</em>. The equation Petitioner attempts to create is:
                </p>

                <div className="ml-8 my-3 p-4 bg-gray-50 border-2 border-gray-400 font-mono text-xs text-center">
                  <p className="mb-2">Petitioner's Impossible Math:</p>
                  <p className="text-red-600 font-bold">Available Funds = (Gross Sale - Debt Paid) + Debt Paid</p>
                  <p className="mt-2 text-sm text-gray-600">This simplifies to: Available Funds = Gross Sale</p>
                  <p className="mt-1 text-sm font-bold">Which would mean NO debts were ever paid!</p>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">3.5 Quantified Harm to Respondent.</span> Through this mathematical manipulation, Petitioner seeks to convert her 35% ownership interest into approximately 95% of the actual net distribution:
                </p>

                <div className="ml-8 my-3 bg-yellow-50 border-l-4 border-yellow-500 p-4">
                  <table className="w-full text-xs">
                    <thead className="border-b-2 border-yellow-600">
                      <tr className="text-left">
                        <th className="pb-2">Calculation Method</th>
                        <th className="pb-2 text-right">Petitioner Gets</th>
                        <th className="pb-2 text-right">Respondent Gets</th>
                        <th className="pb-2 text-right">Petitioner's Windfall</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-yellow-300">
                      <tr className="bg-green-100">
                        <td className="py-2 font-semibold">Correct (65/35 split)</td>
                        <td className="py-2 text-right font-mono">$98,124.54</td>
                        <td className="py-2 text-right font-mono">$182,231.29</td>
                        <td className="py-2 text-right font-mono">—</td>
                      </tr>
                      <tr className="bg-red-100">
                        <td className="py-2 font-semibold">Petitioner's Method</td>
                        <td className="py-2 text-right font-mono font-bold">$125,354.50+</td>
                        <td className="py-2 text-right font-mono text-red-600">$104,451.41</td>
                        <td className="py-2 text-right font-mono font-bold text-red-700">+$27,229.96</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="mt-3 text-xs font-bold text-yellow-900">Petitioner seeks to unlawfully obtain an additional $27,229.96 through mathematical manipulation — a 27.7% increase over her rightful 35% share.</p>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">3.6 No Legal Precedent for "Add-Back" Methodology.</span> Petitioner cites no California case law, statute, or legal authority permitting this "add-back" scheme. This methodology has no basis in California family law and would create an impermissible windfall to the non-paying spouse.</p>
              </div>
            </div>

            {/* Section 4 */}
            <div className="space-y-4 mt-6">
              <h3 className="text-base font-bold border-l-4 border-purple-600 pl-3 py-1 bg-purple-50">
                4. WATTS CHARGES ANALYSIS — TIMELINE CUTOFF AND LEGAL IMPOSSIBILITY
              </h3>

              <div className="ml-4 space-y-4">
                <p className="leading-relaxed">
                  <span className="font-semibold">4.1 Fundamental Legal Principle.</span> <span className="italic font-semibold">Watts v. Watts</span> (1985) 171 Cal.App.3d 366 establishes that Watts charges compensate a non-occupying spouse for the exclusive use and benefit of community property by the occupying spouse. Critically, these charges <strong>terminate upon transfer of possession</strong> to the previously non-occupying spouse.
                </p>

                <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-3">
                  <p className="font-bold text-purple-900 mb-2">⚖️ LEGAL IMPOSSIBILITY — TIMELINE CUTOFF</p>
                  <p className="text-sm leading-relaxed text-purple-800">
                    Petitioner's own sworn declaration establishes she took exclusive possession on <strong>November 16, 2024</strong>. Any Watts charges claimed for periods <em>after</em> this date—when she was the sole occupant deriving exclusive benefit—are legally impossible and must be stricken.
                  </p>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">4.2 Petitioner's Contradictory Claims.</span> Petitioner's RFO contains an inherent logical contradiction:
                </p>

                <div className="ml-8 my-3 grid grid-cols-2 gap-3">
                  <div className="border-2 border-purple-300 bg-purple-50 p-3 rounded">
                    <p className="font-semibold text-xs text-purple-900 mb-2">Petitioner's Admission</p>
                    <p className="text-xs italic text-purple-700">"I took possession of the home on November 16, 2024"</p>
                    <p className="text-xs text-purple-600 mt-2">— Declaration ¶19</p>
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
                  <p className="font-bold text-green-900 mb-3">✓ LEGALLY CORRECT WATTS PERIOD</p>
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
                5. TAX WITHHOLDING ANALYSIS — CONTRADICTORY CLAIMS AND LACK OF EVIDENCE
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
                    <span className="text-2xl text-red-600 font-bold">⇓ BUT THEN ⇓</span>
                  </div>
                  <div className="border-l-4 border-red-500 bg-red-50 p-3">
                    <p className="font-semibold text-red-900 text-sm mb-1">Statement #2 (RFO ¶ __)</p>
                    <p className="text-sm italic text-red-700">"Respondent shall reimburse me 65% of tax withholding ($8,901.50)"</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-400 rounded p-4">
                  <p className="font-bold text-yellow-900 text-sm mb-2">⚠️ LOGICAL CONTRADICTION</p>
                  <p className="text-xs text-yellow-800">
                    One cannot simultaneously "take full responsibility" for an obligation AND demand reimbursement for that same obligation. These positions are mutually exclusive and demonstrate the internally inconsistent nature of Petitioner's RFO.
                  </p>
                </div>

                <p className="leading-relaxed">
                  <span className="font-semibold">5.2 Lack of Supporting Documentation.</span> Petitioner provides <strong>zero evidence</strong> for her claimed tax withholding amount of $13,694.62, including:
                </p>

                <div className="ml-8 my-3 grid grid-cols-2 gap-3">
                  <div className="bg-red-50 border border-red-200 p-3 rounded-sm">
                    <p className="font-semibold text-xs text-red-900 mb-2">❌ Missing Evidence</p>
                    <ul className="text-xs text-red-700 space-y-1">
                      <li>• Tax return calculations</li>
                      <li>• IRS Form 593 documentation</li>
                      <li>• Capital gains worksheets</li>
                      <li>• Actual tax liability proof</li>
                    </ul>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 p-3 rounded-sm">
                    <p className="font-semibold text-xs text-slate-900 mb-2">📋 Required Documentation</p>
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
                    <li>✓ Proof of actual tax liability</li>
                    <li>✓ Evidence of payment (cancelled check, wire confirmation)</li>
                    <li>✓ Tax professional analysis</li>
                    <li>✓ IRS/FTB correspondence confirming obligation</li>
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
      </div>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .no-print { display: none !important; }
          .page-break { page-break-before: always; }
          .legal-document { font-family: "Times New Roman", Times, serif; }
          body { margin: 0; padding: 0; }
          .page-break:first-child { page-break-before: avoid; }
        }
      `}</style>
    </div>
  );
};

export default OppositionFilingPage;
