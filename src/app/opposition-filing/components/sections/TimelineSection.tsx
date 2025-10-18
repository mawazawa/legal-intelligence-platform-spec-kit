import React from 'react';
import { PROPERTY_INFO, TIMELINE_EVENTS } from '../../data/case-data';

const TimelineSection: React.FC = () => {
  return (
    <div className="line-numbers">
      <div className="line font-bold">2. TIMELINE OF EVENTS - PETITIONER&apos;S EXCLUSIVE POSSESSION</div>
      <div className="line">&nbsp;</div>
      <div className="line">     2.1  Petitioner took exclusive possession of the Property</div>
      <div className="line">on {PROPERTY_INFO.possessionDate}. This fact is established by</div>
      <div className="line">Petitioner&apos;s own sworn declaration at paragraph 19, which</div>
      <div className="line">states: "On {PROPERTY_INFO.possessionDate}, I took possession of the</div>
      <div className="line">home." (Petitioner&apos;s Declaration, ¶19 filed June 25, 2025.)</div>
      <div className="line">&nbsp;</div>
      <div className="line">     2.2  Under California family law, the party in exclusive</div>
      <div className="line">possession of community real property bears responsibility for</div>
      <div className="line">all Property-related expenses from the date of possession.</div>
      <div className="line">Once Petitioner took possession on {PROPERTY_INFO.possessionDate}, she</div>
      <div className="line">became legally responsible for: (a) mortgage payments</div>
      <div className="line">(principal, interest, and escrow); (b) property taxes; (c)</div>
      <div className="line">insurance premiums; and (d) maintenance and repairs.</div>
      <div className="line">&nbsp;</div>
      <div className="line">     2.3  The critical dates are as follows:</div>
      <div className="line">&nbsp;</div>
      {TIMELINE_EVENTS.map((event, idx) => (
        <React.Fragment key={idx}>
          <div className="line">          {event.date}: {event.event}</div>
          {idx < TIMELINE_EVENTS.length - 1 && <div className="line">&nbsp;</div>}
        </React.Fragment>
      ))}
      <div className="line">&nbsp;</div>
      <div className="line">     2.4  Petitioner cannot claim Watts charges or expenses</div>
      <div className="line">for the {PROPERTY_INFO.possessionDays}-day period ({PROPERTY_INFO.possessionDate} through {PROPERTY_INFO.saleDate})</div>
      <div className="line">during which she had exclusive possession, use, and</div>
      <div className="line">benefit of the Property. Her claims for expenses during her</div>
      <div className="line">own possession period are legally baseless and directly</div>
      <div className="line">contradicted by her own sworn admission in paragraph 19 of</div>
      <div className="line">her declaration.</div>
      <div className="line">&nbsp;</div>
      <div className="line">     2.5  Petitioner&apos;s sworn statement of possession on</div>
      <div className="line">{PROPERTY_INFO.possessionDate}, constitutes a binding judicial admission</div>
      <div className="line">under California Evidence Code section 1220. She cannot now</div>
      <div className="line">claim expenses against me for a period when she admits she</div>
      <div className="line">had exclusive possession and control of the Property.</div>
      <div className="line">&nbsp;</div>
    </div>
  );
};

export default React.memo(TimelineSection);
