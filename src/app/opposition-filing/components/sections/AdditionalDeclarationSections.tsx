import React from 'react';
import { CLAIMS, FINANCIAL_DATA } from '../../data/case-data';

const AdditionalDeclarationSections: React.FC = () => {
  return (
    <>
      {/* Section 6 - Attorney Fees */}
      <div className="text-sm leading-relaxed space-y-4 mt-6">
        <div>
          <h3 className="font-semibold mb-2">
            6. ATTORNEY FEES SANCTIONS - NO EVIDENCE OF BAD FAITH
          </h3>
          <p>
            <strong>No Evidence of &quot;Willful Disregard&quot;:</strong> Petitioner seeks $
            {CLAIMS.attorneyFees.toLocaleString()} in attorney fees as sanctions, claiming I
            &quot;willfully disregarded&quot; court orders. However, she provides no evidence of
            bad faith or intentional violation of orders.
          </p>

          <p>
            <strong>Exercise of Legal Rights:</strong> My actions were consistent with exercising
            legal rights, not violating court orders. Disagreement with Petitioner&apos;s
            interpretation of orders does not constitute &quot;willful disregard.&quot;
          </p>

          <p>
            <strong>Petitioner&apos;s Own Delays:</strong> The record shows Petitioner caused
            significant delays in the Property sale process, yet she seeks sanctions against me for
            delays.
          </p>

          <p>
            <strong>Legal Standard for Sanctions:</strong> Family Code section 271 requires a
            showing of conduct that &quot;frustrates the policy of the law to promote settlement of
            litigation.&quot; Petitioner provides no evidence that my actions frustrated settlement
            or violated any court orders.
          </p>

          <p>
            <strong>Petitioner&apos;s Cooperation Issues:</strong> The record demonstrates that
            Petitioner was uncooperative during the Property sale process, including delays in
            signing necessary documents and refusal to work with the realtor. These delays were
            caused by Petitioner, not me.
          </p>

          <p>
            <strong>No Court Order Violations:</strong> Petitioner fails to identify any specific
            court orders that I allegedly violated. Her claim of &quot;willful disregard&quot; is
            unsupported by evidence and appears to be a tactic to shift blame for her own delays.
          </p>
        </div>

        {/* Section 7 - Cleanup Costs */}
        <div>
          <h3 className="font-semibold mb-2">7. CLEANUP COSTS - INSUFFICIENT EVIDENCE</h3>
          <p>
            <strong>No Proof of Damage:</strong> Petitioner claims $
            {CLAIMS.cleanupCosts.toLocaleString()} in cleanup costs and $
            {CLAIMS.removalCosts.toLocaleString()} in removal costs, but provides insufficient
            evidence of actual damage or the condition of the Property before and after my
            departure.
          </p>

          <p>
            <strong>Normal Wear and Tear:</strong> The photos attached to her declaration appear to
            show normal wear and tear, not damage requiring ${CLAIMS.cleanupCosts.toLocaleString()}{' '}
            in repairs.
          </p>

          <p>
            <strong>Petitioner&apos;s Use of Property:</strong> After taking possession on November
            16, 2024, Petitioner used the Property for her own purposes. Any cleanup costs should
            be offset by her use and benefit.
          </p>

          <p>
            <strong>Lack of Documentation:</strong> Petitioner provides no receipts, invoices, or
            other documentation to support her claimed cleanup costs. The amounts appear to be
            estimates without supporting evidence.
          </p>

          <p>
            <strong>Condition Before Departure:</strong> Petitioner provides no evidence of the
            Property&apos;s condition before my departure. Without baseline documentation, her
            claims of damage are unsubstantiated.
          </p>

          <p>
            <strong>Petitioner&apos;s Responsibility:</strong> As the party in possession from
            November 16, 2024, Petitioner was responsible for maintaining the Property. Any cleanup
            costs incurred during her possession period should be her responsibility.
          </p>
        </div>

        {/* Section 8 - Counter-Claims */}
        <div>
          <h3 className="font-semibold mb-2">8. COUNTER-CLAIMS AND OFFSETS</h3>
          <p>
            <strong>Petitioner&apos;s Possession Period:</strong> From November 16, 2024, to the
            sale date of May 30, 2025, Petitioner had exclusive possession of the Property. She
            should be responsible for all Property-related expenses during this period.
          </p>

          <p>
            <strong>Offset for Petitioner&apos;s Use:</strong> Petitioner&apos;s use of the
            Property from November 16, 2024, to May 30, 2025, should offset any Watts charges she
            claims against me.
          </p>

          <p>
            <strong>Petitioner&apos;s Delays:</strong> Petitioner&apos;s own actions caused delays
            in the Property sale process, including her refusal to cooperate with the realtor and
            her delays in signing necessary documents.
          </p>

          <p>
            <strong>Email Evidence of Cooperation:</strong> My email communications with Ron
            Melendez, the listing realtor, demonstrate my good faith efforts to cooperate with the
            Property sale. These communications contradict Petitioner&apos;s claims of
            non-cooperation and willful disregard of court orders.
          </p>

          <p>
            <strong>Petitioner&apos;s Unreasonable Demands:</strong> Email evidence shows
            Petitioner made unreasonable demands during the sale process, including insisting on
            expensive realtor services against the will of the property owner, creating unnecessary
            delays and costs.
          </p>

          <p>
            <strong>Furniture Fraud Evidence:</strong> Documentary evidence establishes that
            Petitioner instructed my new wife Piyawan that all jointly purchased furniture must
            stay in the Property, then charged me $2,000+ for hauling it away while keeping the
            furniture for herself. This constitutes unjust enrichment and fraud.
          </p>
        </div>

        {/* Section 9 - Legal Analysis */}
        <div>
          <h3 className="font-semibold mb-2">9. LEGAL ANALYSIS</h3>
          <p>
            <strong>Family Code Section 2550:</strong> The division of community property must be
            &quot;equal&quot; unless there is a valid reason for unequal division.
            Petitioner&apos;s requested division is not equal and lacks legal justification.
          </p>

          <p>
            <strong>Family Code Section 271:</strong> Attorney fees sanctions require a showing of
            conduct that &quot;frustrates the policy of the law to promote settlement of
            litigation.&quot; My actions were consistent with exercising legal rights, not
            frustrating settlement.
          </p>

          <p>
            <strong>Watts Charges Law:</strong> Watts charges are for exclusive use and possession.
            Once Petitioner took possession, the charges should end. Her claims for charges after
            possession are legally unsupportable.
          </p>

          <p>
            <strong>Add-Back Methodology Legal Error:</strong> Petitioner&apos;s &quot;add-back&quot; methodology has no legal precedent in California family law. This scheme violates
            basic accounting principles and creates an impermissible windfall to the non-paying
            spouse. No California case law supports adding back paid debts to create artificial
            proceeds.
          </p>

          <p>
            <strong>Double-Counting Prohibition:</strong> California law prohibits double-counting
            of debts and credits in property division. Petitioner&apos;s methodology violates this
            fundamental principle by both deducting the $77,779.88 from net proceeds AND adding it
            back to inflate her share.
          </p>

          <p>
            <strong>Equitable Distribution Principles:</strong> Petitioner&apos;s requested
            distribution violates California&apos;s equitable distribution principles. She seeks to
            convert her 35% ownership interest into 95%+ of the actual distribution through
            mathematical manipulation and inflated claims.
          </p>

          <p>
            <strong>Watts v. Watts (1985) 171 Cal.App.3d 366:</strong> This case establishes that
            Watts charges are for exclusive use and possession and must end when possession
            changes. Petitioner&apos;s own admission that she took possession on November 16, 2024,
            legally terminates any Watts charges as of that date.
          </p>

          <p>
            <strong>Expert Testimony Scrutiny:</strong> Petitioner&apos;s claim of $4,500/month
            fair rental value requires scrutiny. The actual rental market for 3525 8th Avenue, Los
            Angeles, CA 90018 must be verified through comparable properties and market analysis.
          </p>
        </div>

        {/* Section 10 - Requested Relief */}
        <div>
          <h3 className="font-semibold mb-2">10. REQUESTED RELIEF</h3>
          <p>
            <strong>Denial of RFO:</strong> I request that this Court deny Petitioner&apos;s
            Request for Order in its entirety due to the fundamental mathematical errors and legal
            deficiencies outlined above.
          </p>

          <p>
            <strong>Correct Distribution:</strong> The escrow proceeds of $
            {FINANCIAL_DATA.netProceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
            should be divided according to the Judgment: 65% to me ($
            {FINANCIAL_DATA.respondentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            ) and 35% to Petitioner ($
            {FINANCIAL_DATA.petitionerAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            ).
          </p>

          <p>
            <strong>Offset Claims:</strong> I request that any Watts charges be calculated only
            through November 15, 2024, and that Petitioner&apos;s use of the Property from November
            16, 2024, to May 30, 2025, be offset against any charges.
          </p>

          <p>
            <strong>Attorney Fees:</strong> I request that this Court deny Petitioner&apos;s
            request for attorney fees sanctions and instead order her to pay my attorney fees for
            this unnecessary motion.
          </p>

          <p>
            <strong>Disclosure of Missing Funds:</strong> I request that Petitioner be ordered to
            disclose the disposition of the $137,245.52 that is unaccounted for in her distribution
            calculations. This amount represents nearly half of the escrow proceeds and must be
            explained.
          </p>

          <p>
            <strong>Furniture Fraud Correction:</strong> I request that the Court correct the
            furniture payment order based on evidence that Petitioner kept the furniture after
            instructing that it must stay in the Property. This constitutes unjust enrichment and
            requires correction.
          </p>

          <p>
            <strong>Interest Rate Verification:</strong> I request that Petitioner be required to
            provide detailed calculations for all interest charges, including the specific dates
            used and whether simple or compound interest was applied.
          </p>

          <p>
            <strong>Market Value Verification:</strong> I request that Petitioner be required to
            provide comparable rental properties to support her claimed $4,500/month fair rental
            value for Watts charges calculations.
          </p>
        </div>

        {/* Section 11 - Conclusion */}
        <div>
          <h3 className="font-semibold mb-2">11. CONCLUSION</h3>
          <p>
            Petitioner&apos;s Request for Order is based on fundamental mathematical errors and
            legal misstatements. The core flaw - attempting to both deduct and add back the same
            $77,779.88 - renders her entire calculation invalid. Her claims for Watts charges after
            taking possession, attorney fees sanctions without evidence of bad faith, and cleanup
            costs without proof of damage are all legally unsupportable.
          </p>

          <p>
            I respectfully request that this Court deny Petitioner&apos;s Request for Order and
            order the escrow proceeds divided according to the Judgment without the mathematical
            errors and legal deficiencies contained in Petitioner&apos;s motion.
          </p>

          <p>
            <strong>Summary of Critical Issues:</strong> Petitioner&apos;s motion attempts to
            convert her 35% ownership interest into 95%+ of the actual distribution through: (1)
            mathematical manipulation using an impermissible &quot;add-back&quot; methodology; (2)
            inflated Watts charges extending beyond her possession date; (3) excessive attorney
            fees sanctions without evidence of bad faith; (4) unsubstantiated cleanup costs; and
            (5) failure to account for $137,245.52 in missing funds.
          </p>

          <p>
            <strong>Evidence Supporting My Position:</strong> Email communications with the realtor
            demonstrate my good faith cooperation. Documentary evidence proves Petitioner&apos;s
            furniture fraud. Legal analysis shows no California precedent for the &quot;add-back&quot; methodology. Petitioner&apos;s own admission of possession on November 16,
            2024, terminates Watts charges as of that date.
          </p>

          <p>
            <strong>Requested Relief:</strong> I request that this Court deny Petitioner&apos;s
            motion in its entirety and order distribution according to the Judgment: 65% to me ($
            {FINANCIAL_DATA.respondentAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            ) and 35% to Petitioner ($
            {FINANCIAL_DATA.petitionerAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            ), with legitimate offsets applied fairly and transparently.
          </p>
        </div>

        {/* Sections 12-14 - Additional Details */}
        <div>
          <h3 className="font-semibold mb-2">12. DETAILED FINANCIAL ANALYSIS</h3>
          <p>
            <strong>Petitioner&apos;s Mathematical Scheme:</strong> Petitioner&apos;s &quot;add-back&quot; methodology violates basic accounting principles and California law. She
            attempts to:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>
              Claim the mortgage company was paid $
              {FINANCIAL_DATA.totalMortgagePayoff.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}{' '}
              at closing
            </li>
            <li>
              Identify $
              {FINANCIAL_DATA.arrears.toLocaleString('en-US', { minimumFractionDigits: 2 })} as
              &quot;unpaid mortgage/escrow&quot; costs
            </li>
            <li>
              &quot;Add back&quot; this $
              {FINANCIAL_DATA.arrears.toLocaleString('en-US', { minimumFractionDigits: 2 })} to net
              proceeds to create artificial total of $
              {FINANCIAL_DATA.petitionerFictitiousTotal.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </li>
            <li>
              Take 35% of the inflated amount ($
              {FINANCIAL_DATA.petitionerRequestedAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
              )
            </li>
            <li>
              Then deduct the same $
              {FINANCIAL_DATA.arrears.toLocaleString('en-US', { minimumFractionDigits: 2 })} from
              my 65% share
            </li>
            <li>
              <strong>
                Result: She gets $
                {FINANCIAL_DATA.petitionerWindfall.toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                })}{' '}
                more than her rightful 35% share
              </strong>
            </li>
          </ul>

          <p>
            <strong>Correct Distribution Calculation:</strong> The escrow proceeds of $
            {FINANCIAL_DATA.netProceeds.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
            already reflect payment of all mortgage obligations. The correct distribution is:
          </p>
          <ul className="list-disc ml-6 space-y-1">
            <li>
              My 65% share: $
              {FINANCIAL_DATA.respondentAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </li>
            <li>
              Petitioner&apos;s 35% share: $
              {FINANCIAL_DATA.petitionerAmount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
              })}
            </li>
            <li>Any legitimate offsets should be applied proportionally</li>
          </ul>

          <p>
            <strong>Petitioner&apos;s Windfall:</strong> Through her mathematical manipulation,
            Petitioner seeks to convert her 35% ownership interest into 95%+ of the actual
            distribution, representing a theft of approximately $82,619 from my rightful share.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">13. EVIDENCE OF COOPERATION</h3>
          <p>
            <strong>Email Communications with Realtor:</strong> My email correspondence with Ron
            Melendez, the listing realtor, demonstrates consistent good faith efforts to cooperate
            with the Property sale process. These communications contradict Petitioner&apos;s
            claims of non-cooperation and willful disregard of court orders.
          </p>

          <p>
            <strong>Timeline of Cooperation:</strong> The email evidence shows my active
            participation in the sale process, including responding to realtor inquiries, providing
            necessary information, and attempting to resolve issues that arose during the sale.
          </p>

          <p>
            <strong>Petitioner&apos;s Unreasonable Demands:</strong> Email evidence establishes
            that Petitioner made unreasonable demands during the sale process, including insisting
            on expensive realtor services against the will of the property owner, creating
            unnecessary delays and costs.
          </p>

          <p>
            <strong>Good Faith Efforts:</strong> Despite financial hardship, I made good faith
            efforts to cooperate with the Property sale, including attempting loan modifications
            and communicating with the lender about payment arrangements.
          </p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">14. FURNITURE FRAUD DOCUMENTATION</h3>
          <p>
            <strong>Petitioner&apos;s Instructions:</strong> Documentary evidence establishes that
            Petitioner instructed my new wife Piyawan that all jointly purchased furniture must
            stay in the Property. This instruction was given after the court ordered me to pay
            Petitioner ${CLAIMS.furniturePayment.toLocaleString()} for furniture.
          </p>

          <p>
            <strong>Subsequent Actions:</strong> Despite instructing that furniture must stay,
            Petitioner then charged me $2,000+ for hauling the furniture away and kept the
            furniture for herself. This constitutes unjust enrichment and fraud.
          </p>

          <p>
            <strong>Financial Impact:</strong> Petitioner received both the $
            {CLAIMS.furniturePayment.toLocaleString()} court-ordered payment AND kept furniture
            worth approximately ${CLAIMS.furnitureValue.toLocaleString()}, representing a $
            {CLAIMS.furnitureFraud.toLocaleString()} windfall at my expense.
          </p>

          <p>
            <strong>Legal Remedy:</strong> This fraud requires correction by reversing the
            furniture payment order and requiring Petitioner to account for the furniture she
            retained.
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
                <strong>MATHIEU CHRISTIAN YVES WAUTERS</strong>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default React.memo(AdditionalDeclarationSections);
