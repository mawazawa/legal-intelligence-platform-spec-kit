import React from 'react';
import { CASE_INFO, PROPERTY_INFO } from '../../data/case-data';

const IntroductionSection: React.FC = () => {
  return (
    <div className="line-numbers mt-8">
      <div className="line">I, MATHIEU CHRISTIAN YVES WAUTERS, declare as follows:</div>
      <div className="line">&nbsp;</div>
      <div className="line font-bold">1. INTRODUCTION AND PERSONAL KNOWLEDGE</div>
      <div className="line">&nbsp;</div>
      <div className="line">     1.1  I am the Respondent in this dissolution action, Case</div>
      <div className="line">No. {CASE_INFO.caseNumber}. I have personal knowledge of all facts</div>
      <div className="line">stated herein except those stated on information and belief,</div>
      <div className="line">and as to those matters, I believe them to be true. I am over</div>
      <div className="line">18 years of age and competent to testify to the matters</div>
      <div className="line">stated herein if called as a witness.</div>
      <div className="line">&nbsp;</div>
      <div className="line">     1.2  This declaration is made in support of my opposition</div>
      <div className="line">to Petitioner {CASE_INFO.petitioner}&apos;s Request for Order</div>
      <div className="line">("RFO") filed June 25, 2025, seeking redistribution of escrow</div>
      <div className="line">proceeds from the sale of the real property located at {PROPERTY_INFO.address}</div>
      <div className="line">(the "Property").</div>
      <div className="line">&nbsp;</div>
      <div className="line">     1.3  Petitioner&apos;s RFO contains fundamental mathematical</div>
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
      <div className="line">Petitioner&apos;s motion in its entirety due to the mathematical</div>
      <div className="line">impossibilities, legal deficiencies, and factual</div>
      <div className="line">misrepresentations outlined below.</div>
      <div className="line">&nbsp;</div>
    </div>
  );
};

export default React.memo(IntroductionSection);
