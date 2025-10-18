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
              
              <p><strong>Property Sale Timeline:</strong> The Property was listed for sale on February 15, 2025, and sold on May 30, 2025. During this entire period, Petitioner had exclusive possession and control of the Property. She cannot claim expenses against me for a period when she was exclusively using and benefiting from the Property.</p>
              
              <p><strong>Petitioner's Admission of Possession:</strong> Petitioner's own declaration establishes that she took possession on November 16, 2024. This admission is binding and cannot be contradicted by her later claims for expenses during her possession period.</p>
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
              
              <p><strong>Accounting Principles Violated:</strong> Petitioner's calculation violates basic accounting principles. When a debt is paid, it reduces the available proceeds. You cannot simultaneously pay a debt and add it back to create additional proceeds. This is equivalent to claiming you can spend money and still have it available.</p>
              
              <p><strong>Escrow Statement Analysis:</strong> The escrow statement clearly shows that $759,364.32 was paid to the mortgage company, which included the $77,779.88 in arrears. The net proceeds of $280,355.83 represent what remains after all obligations were satisfied. Petitioner's attempt to "add back" the $77,779.88 is mathematically impossible.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. WATTS CHARGES ANALYSIS - TIMELINE CUTOFF</h3>
              <p><strong>Watts Charges Cannot Extend Past Possession Date:</strong> Petitioner claims Watts charges through November 16, 2024, but she took possession on that exact date. Watts charges are for exclusive use and possession - once she took possession, the charges should end.</p>
              
              <p><strong>Petitioner's Own Timeline Contradiction:</strong> Her declaration shows she took possession on November 16, 2024, yet she claims Watts charges through that date. This is logically impossible - she cannot both owe Watts charges for exclusive use AND have taken possession on the same date.</p>
              
              <p><strong>Correct Watts Calculation:</strong> Watts charges should end on November 15, 2024, the day before she took possession. Any claims for November 16, 2024, and beyond are invalid.</p>
              
              <p><strong>Legal Authority:</strong> Watts v. Watts (1985) 171 Cal.App.3d 366 establishes that Watts charges are for exclusive use and possession. Once possession changes hands, the charges must end. Petitioner's own admission that she took possession on November 16, 2024, legally terminates any Watts charges as of that date.</p>
              
              <p><strong>Petitioner's Benefit During Possession:</strong> From November 16, 2024, to May 30, 2025, Petitioner had exclusive use and benefit of the Property. She cannot claim Watts charges against me for a period when she was exclusively using and benefiting from the Property.</p>
              
              <p><strong>Calculation Error:</strong> Petitioner's Watts charges calculation includes the period after she took possession, which is legally impossible. The correct calculation would end on November 15, 2024, resulting in significantly reduced charges.</p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">5. TAX WITHHOLDING ANALYSIS</h3>
              <p><strong>Proportional Responsibility:</strong> Petitioner claims $13,694.62 in tax withholding and seeks my 65% share ($8,901.50). However, tax withholding is typically split proportionally based on ownership interests.</p>
              
              <p><strong>Petitioner's Admission:</strong> She states she will "take full responsibility" for the tax withholding but then seeks reimbursement. This is contradictory and unsupported by law.</p>
              
              <p><strong>Tax Liability Determination:</strong> The tax withholding amount should be determined based on the actual tax liability, not Petitioner's unilateral calculation. She provides no evidence of the actual tax liability or how the $13,694.62 figure was calculated.</p>
              
              <p><strong>Timing of Tax Obligation:</strong> Tax withholding typically occurs at the time of sale. Petitioner's claim for reimbursement of tax withholding that she allegedly paid is unsupported by documentation showing when and how this amount was determined.</p>
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
