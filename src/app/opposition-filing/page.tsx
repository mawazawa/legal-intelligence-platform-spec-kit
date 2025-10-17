"use client";

import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Printer, Download, FileText, Scale, Gavel } from 'lucide-react';

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
        <div className="page-break min-h-[11in] p-16">
          <h2 className="text-xl font-bold mb-6 text-center">DECLARATION OF MATHIEU CHRISTIAN YVES WAUTERS</h2>
          
          <div className="text-sm leading-relaxed space-y-4">
            <p><strong>I, Mathieu Christian Yves Wauters, declare as follows:</strong></p>
            
            <div>
              <h3 className="font-semibold mb-2">1. INTRODUCTION AND PERSONAL KNOWLEDGE</h3>
              <p>I am the Respondent in this action. I have personal knowledge of the facts stated herein and could competently testify thereto if called as a witness. This declaration is made in support of my opposition to Petitioner's Request for Order filed June 25, 2025, seeking redistribution of escrow proceeds from the sale of the real property located at 3525 8th Avenue, Los Angeles, CA 90018 ("Property").</p>
              
              <p>Petitioner's RFO contains fundamental mathematical errors that render her requested relief impossible and legally unsupportable. The core flaw is her attempt to both deduct $77,779.88 from the net proceeds AND add it back to create a fictional "total net proceed" of $358,155.71. This is mathematically impossible and demonstrates either a fundamental misunderstanding of basic arithmetic or an intentional attempt to mislead this Court.</p>
              
              <p>This opposition is filed pursuant to Family Code section 271 and California Rules of Court, rule 5.92. I respectfully request that this Court deny Petitioner's motion in its entirety due to the mathematical impossibilities and legal deficiencies outlined below.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. TIMELINE OF EVENTS - PETITIONER'S POSSESSION CONTROL</h3>
              <p><strong>Critical Date: November 16, 2024</strong> - Petitioner took exclusive possession of the Property on this date. This fact is admitted in her own declaration at paragraph 19: "On November 16, 2024, I took possession of the home."</p>
              
              <p><strong>Legal Significance:</strong> Once Petitioner took possession on November 16, 2024, she became responsible for all Property-related expenses, including mortgage payments, property taxes, insurance, and maintenance. Her claims for "Watts charges" and other expenses after this date are legally baseless.</p>
              
              <p><strong>Mortgage Payment Responsibility:</strong> Petitioner's claim that I failed to pay the mortgage "since December 2023" ignores the fact that she took possession in November 2024. Any mortgage payments due after November 16, 2024, were her responsibility, not mine.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. MATHEMATICAL IMPOSSIBILITY OF PETITIONER'S CALCULATIONS</h3>
              <p><strong>The $77,779.88 Double-Counting Error:</strong> Petitioner's calculation is fundamentally flawed. She claims:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>The mortgage company was paid $759,364.32 at closing</li>
                <li>This included $77,779.88 in "unpaid mortgage/escrow" costs</li>
                <li>She wants to "add back" this $77,779.88 to the net proceeds</li>
                <li><strong>This is mathematically impossible</strong> - you cannot both pay a debt and add it back to your share</li>
              </ul>
              
              <p><strong>Correct Calculation:</strong> The escrow proceeds of $280,355.83 already reflect the payment of all mortgage obligations, including the $77,779.88. To "add back" this amount would be double-counting and result in an inflated, fictional total.</p>
              
              <p><strong>Petitioner's Requested Distribution:</strong> She seeks 35% of $358,155.71 = $125,354.50, but this figure is based on the mathematically impossible "add back" of the $77,779.88.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. WATTS CHARGES ANALYSIS - TIMELINE CUTOFF</h3>
              <p><strong>Watts Charges Cannot Extend Past Possession Date:</strong> Petitioner claims Watts charges through November 16, 2024, but she took possession on that exact date. Watts charges are for exclusive use and possession - once she took possession, the charges should end.</p>
              
              <p><strong>Petitioner's Own Timeline Contradiction:</strong> Her declaration shows she took possession on November 16, 2024, yet she claims Watts charges through that date. This is logically impossible - she cannot both owe Watts charges for exclusive use AND have taken possession on the same date.</p>
              
              <p><strong>Correct Watts Calculation:</strong> Watts charges should end on November 15, 2024, the day before she took possession. Any claims for November 16, 2024, and beyond are invalid.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">5. TAX WITHHOLDING ANALYSIS</h3>
              <p><strong>Proportional Responsibility:</strong> Petitioner claims $13,694.62 in tax withholding and seeks my 65% share ($8,901.50). However, tax withholding is typically split proportionally based on ownership interests.</p>
              
              <p><strong>Petitioner's Admission:</strong> She states she will "take full responsibility" for the tax withholding but then seeks reimbursement. This is contradictory and unsupported by law.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">6. ATTORNEY FEES SANCTIONS - NO EVIDENCE OF BAD FAITH</h3>
              <p><strong>No Evidence of "Willful Disregard":</strong> Petitioner seeks $40,000 in attorney fees as sanctions, claiming I "willfully disregarded" court orders. However, she provides no evidence of bad faith or intentional violation of orders.</p>
              
              <p><strong>Exercise of Legal Rights:</strong> My actions were consistent with exercising legal rights, not violating court orders. Disagreement with Petitioner's interpretation of orders does not constitute "willful disregard."</p>
              
              <p><strong>Petitioner's Own Delays:</strong> The record shows Petitioner caused significant delays in the Property sale process, yet she seeks sanctions against me for delays.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">7. CLEANUP COSTS - INSUFFICIENT EVIDENCE</h3>
              <p><strong>No Proof of Damage:</strong> Petitioner claims $6,419 in cleanup costs and $2,470 in removal costs, but provides insufficient evidence of actual damage or the condition of the Property before and after my departure.</p>
              
              <p><strong>Normal Wear and Tear:</strong> The photos attached to her declaration appear to show normal wear and tear, not damage requiring $6,419 in repairs.</p>
              
              <p><strong>Petitioner's Use of Property:</strong> After taking possession on November 16, 2024, Petitioner used the Property for her own purposes. Any cleanup costs should be offset by her use and benefit.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">8. COUNTER-CLAIMS AND OFFSETS</h3>
              <p><strong>Petitioner's Possession Period:</strong> From November 16, 2024, to the sale date of May 30, 2025, Petitioner had exclusive possession of the Property. She should be responsible for all Property-related expenses during this period.</p>
              
              <p><strong>Offset for Petitioner's Use:</strong> Petitioner's use of the Property from November 16, 2024, to May 30, 2025, should offset any Watts charges she claims against me.</p>
              
              <p><strong>Petitioner's Delays:</strong> Petitioner's own actions caused delays in the Property sale process, including her refusal to cooperate with the realtor and her delays in signing necessary documents.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">9. LEGAL ANALYSIS</h3>
              <p><strong>Family Code Section 2550:</strong> The division of community property must be "equal" unless there is a valid reason for unequal division. Petitioner's requested division is not equal and lacks legal justification.</p>
              
              <p><strong>Family Code Section 271:</strong> Attorney fees sanctions require a showing of conduct that "frustrates the policy of the law to promote settlement of litigation." My actions were consistent with exercising legal rights, not frustrating settlement.</p>
              
              <p><strong>Watts Charges Law:</strong> Watts charges are for exclusive use and possession. Once Petitioner took possession, the charges should end. Her claims for charges after possession are legally unsupportable.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">10. REQUESTED RELIEF</h3>
              <p><strong>Denial of RFO:</strong> I request that this Court deny Petitioner's Request for Order in its entirety due to the fundamental mathematical errors and legal deficiencies outlined above.</p>
              
              <p><strong>Correct Distribution:</strong> The escrow proceeds of $280,355.83 should be divided according to the Judgment: 65% to me ($182,231.29) and 35% to Petitioner ($98,124.54).</p>
              
              <p><strong>Offset Claims:</strong> I request that any Watts charges be calculated only through November 15, 2024, and that Petitioner's use of the Property from November 16, 2024, to May 30, 2025, be offset against any charges.</p>
              
              <p><strong>Attorney Fees:</strong> I request that this Court deny Petitioner's request for attorney fees sanctions and instead order her to pay my attorney fees for this unnecessary motion.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">11. CONCLUSION</h3>
              <p>Petitioner's Request for Order is based on fundamental mathematical errors and legal misstatements. The core flaw - attempting to both deduct and add back the same $77,779.88 - renders her entire calculation invalid. Her claims for Watts charges after taking possession, attorney fees sanctions without evidence of bad faith, and cleanup costs without proof of damage are all legally unsupportable.</p>
              
              <p>I respectfully request that this Court deny Petitioner's Request for Order and order the escrow proceeds divided according to the Judgment without the mathematical errors and legal deficiencies contained in Petitioner's motion.</p>
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
        <div className="page-break min-h-[11in] p-16">
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
        <div className="page-break min-h-[11in] p-16">
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
