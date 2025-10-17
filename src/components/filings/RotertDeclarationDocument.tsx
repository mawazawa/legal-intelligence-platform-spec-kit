import React from 'react';

const RotertDeclarationDocument: React.FC = () => {
  const lineNumbers = Array.from({ length: 28 }).map((_, i) => i + 1);
  return (
    <div className="pleading-paper legal-document">
      <div className="pleading-gutter hidden print:block">
        <ol>{lineNumbers.map((n) => (<li key={n}>{n}</li>))}</ol>
      </div>
      <div className="pleading-body space-y-6 text-sm leading-relaxed">
        <div className="text-center">
          <div className="font-bold text-lg">THOMAS J. ROTERT (State Bar # 171056)</div>
          <div>Attorney at Law</div>
          <div>1083 Vine Street, #357</div>
          <div>Healdsburg, CA 95448</div>
          <div>Telephone: (310) 713-0104</div>
          <div>tjrotert@gmail.com</div>
          <div className="mt-4 font-bold">Attorney for Respondent,</div>
          <div className="font-bold">MATHIEU CHRISTIAN YVES WAUTERS</div>
        </div>

        <div className="text-center">
          <div className="font-bold text-lg">SUPERIOR COURT OF THE STATE OF CALIFORNIA</div>
          <div className="font-bold">COUNTY OF SAN FRANCISCO—UNIFIED FAMILY COURT</div>
        </div>

        <div className="text-center">
          <div className="font-bold text-lg">In Re Marriage of:</div>
          <div className="mt-4">
            <div className="font-bold">ROSANNA CLAIRE ALVERO</div>
            <div className="italic">(fka WAUTERS),</div>
            <div className="mt-2 font-bold">Petitioner,</div>
            <div className="font-bold">vs.</div>
            <div className="mt-2 font-bold">Mathieu Christian Yves Wauters,</div>
            <div className="mt-2 font-bold">Respondent.</div>
          </div>
          <div className="mt-4 font-bold">Case No.: FDI-21-794666</div>
        </div>

        <div className="text-center">
          <div className="font-bold text-lg">OPPOSITION OF</div>
          <div className="font-bold text-lg">MEMORANDUM OF POINTS AND AUTHORITIES IN SUPPORT OF</div>
          <div className="mt-4">
            <div>Date: October 21, 2025</div>
            <div>Time: 9:00 a.m.</div>
            <div>Dept.: 403</div>
          </div>
        </div>

        <div className="text-center font-bold">
          TO THE COURT, TO ALL PARTIES, AND TO THEIR ATTORNEYS OF RECORD
        </div>

        <div>
          <p>
            COMES NOW, Respondent, Mathieu Christian Yves Wauters ("Mr. Wauters") and responds to the
            "Request for Division of the Net Proceeds" filed by Petitioner, Rosanna Claire Alvero
            ("Ms. Alvero"), by giving notice of Respondent's intent to appear and offer testimony at the
            hearing of this matter at 9:00 a.m. on October 21, 2025 in Department 403 of the above entitled
            Court.
          </p>
          <p className="mt-4">
            Respondent hereby provides an outline of the testimony and argument that he and/or his counsel
            intends to provide at the hearing, only insofar as the intended testimony is in direct response
            to matters addressed directly by Petitioner in her moving papers, and excluding any new,
            ancillary or additional matters not raised in the opening brief.
          </p>
        </div>

        <div>
          <div className="font-bold text-lg mb-4">FORMAT AND PURPOSE OF STATEMENT OF INTENDED TESTIMONY</div>
          <p>
            The attached declarations of Respondent and counsel set forth the reasons that no opposition was
            timely filed. With the hearing set only four calendar days away, it would be unfair to file an
            opposition containing new facts or law without affording Petitioner the opportunity to respond.
            Respondent has therefore limited this opposition to matters raised in Petitioner's moving papers
            and now presents testimony and argument solely to rebut those points.
          </p>
        </div>

        <div>
          <div className="font-bold text-lg mb-4">PETITIONER'S REQUEST vs RESPONDENT'S INTENDED TESTIMONY</div>

          <div className="mb-6">
            <div className="font-bold text-base mb-2">Mortgage Payment Add-Back: $77,799.88</div>
            <div className="mb-4">
              <div className="font-bold">Alvero Declaration ¶¶ 39-41:</div>
              <div className="italic ml-4">
                "The outstanding mortgage and escrow advance were carried from the months (almost a year)
                that Respondent was living on the property..."
              </div>
            </div>
            <div className="space-y-3">
              <div>
                • There should be no money "added back" to the proceeds from escrow because the Court never
                assigned payment of the mortgage, taxes, and insurance to one party.
              </div>
              <div>
                • Ms. Alvero relies on information supplied by others without identifying the source.
              </div>
              <div>
                • $20,615.90 of the escrow-paid mortgage arrears corresponds to months when only Petitioner
                occupied the residence.
              </div>
              <div>
                • The Statement of Decision granted only $122 per month in rental profit, not reassignment of
                mortgage, tax, or insurance obligations.
              </div>
              <div>
                • Adding $77,799.88 on paper does not increase the actual cash held in trust; the parties would
                still divide only $280,355.83.
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="font-bold text-base mb-2">Watts Charges and Household Items</div>
            <div className="space-y-3">
              <div>
                • Petitioner's Watts calculation exceeds the $122/month cap established by the Court.
              </div>
              <div>
                • Household items should credit Respondent $15,000 consistent with the Statement of Decision.
              </div>
            </div>
          </div>

          <div className="mb-6">
            <div className="font-bold text-base mb-2">Tax Withholding</div>
            <div className="space-y-3">
              <div>
                • Both parties must receive equal treatment regarding the Form 593 withholding; Petitioner's
                request for exclusive credit lacks statutory support.
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="font-bold text-lg mb-4">LEGAL AUTHORITIES</div>
          <ul className="list-disc ml-6 space-y-2">
            <li>Family Code § 2550 — Equal division mandate.</li>
            <li>Family Code § 271 — Limitation on attorney fees sanctions.</li>
            <li>Watts v. Watts (1985) 171 Cal.App.3d 366 — Watts charge framework.</li>
          </ul>
        </div>

        <div>
          <div className="font-bold text-lg mb-4">CONCLUSION</div>
          <p>
            Respondent respectfully requests that the Court deny Petitioner's requested adjustments, adopt the
            corrected distribution grounded in the actual net proceeds, and enforce the Statement of Decision's
            allocation and limitations.
          </p>
        </div>

        <div>
          <div className="font-bold">DATED: ______________________</div>
          <div className="mt-4 font-bold">By:</div>
          <div className="font-bold">Thomas J. Rotert, Esq.</div>
          <div className="font-bold">Attorney for Respondent</div>
        </div>
      </div>
    </div>
  );
};

export default RotertDeclarationDocument;
