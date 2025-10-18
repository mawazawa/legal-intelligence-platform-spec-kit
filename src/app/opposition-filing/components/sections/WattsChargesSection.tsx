import React from 'react';
import { PROPERTY_INFO, CLAIMS } from '../../data/case-data';

const WattsChargesSection: React.FC = () => {
  return (
    <div className="space-y-4 mt-6">
      <h3 className="text-base font-bold border-l-4 border-purple-600 pl-3 py-1 bg-purple-50">
        4. WATTS CHARGES ANALYSIS - TIMELINE CUTOFF AND LEGAL IMPOSSIBILITY
      </h3>

      <div className="ml-4 space-y-4">
        <p className="leading-relaxed">
          <span className="font-semibold">4.1 Fundamental Legal Principle.</span>{' '}
          <span className="italic font-semibold">Watts v. Watts</span> (1985) 171 Cal.App.3d 366
          establishes that Watts charges compensate a non-occupying spouse for the exclusive use
          and benefit of community property by the occupying spouse. Critically, these charges{' '}
          <strong>terminate upon transfer of possession</strong> to the previously non-occupying
          spouse.
        </p>

        <div className="bg-purple-50 border-l-4 border-purple-500 p-4 my-3">
          <p className="font-bold text-purple-900 mb-2">[LEGAL] LEGAL IMPOSSIBILITY - TIMELINE CUTOFF</p>
          <p className="text-sm leading-relaxed text-purple-800">
            Petitioner&apos;s own sworn declaration establishes she took exclusive possession on{' '}
            <strong>{PROPERTY_INFO.possessionDate}</strong>. Any Watts charges claimed for periods{' '}
            <em>after</em> this date - when she was the sole occupant deriving exclusive benefit -
            are legally impossible and must be stricken.
          </p>
        </div>

        <p className="leading-relaxed">
          <span className="font-semibold">4.2 Petitioner&apos;s Contradictory Claims.</span>{' '}
          Petitioner&apos;s RFO contains an inherent logical contradiction:
        </p>

        <div className="ml-8 my-3 grid grid-cols-2 gap-3">
          <div className="border-2 border-purple-300 bg-purple-50 p-3 rounded">
            <p className="font-semibold text-xs text-purple-900 mb-2">Petitioner&apos;s Admission</p>
            <p className="text-xs italic text-purple-700">
              &quot;I took possession of the home on {PROPERTY_INFO.possessionDate}&quot;
            </p>
            <p className="text-xs text-purple-600 mt-2">- Declaration ¶19</p>
          </div>
          <div className="border-l-4 border-red-500 bg-red-50 p-3">
            <p className="font-semibold text-xs text-red-900 mb-2">Petitioner&apos;s Claim</p>
            <p className="text-xs text-red-700">
              Watts charges through {PROPERTY_INFO.possessionDate} and beyond
            </p>
            <p className="text-xs text-red-600 mt-2 font-bold">CONTRADICTION!</p>
          </div>
        </div>

        <p className="leading-relaxed">
          <span className="font-semibold">4.3 Correct Watts Calculation Cutoff.</span> Based on
          the legal principle that possession transfer terminates Watts charges, the correct
          calculation is:
        </p>

        <div className="ml-8 my-3 bg-green-50 border-l-4 border-green-500 p-4">
          <p className="font-bold text-green-900 mb-3">[OK] LEGALLY CORRECT WATTS PERIOD</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span>Watts Charges Accrue:</span>
              <span className="font-mono font-semibold">Until November 15, 2024</span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white rounded">
              <span>Watts Charges End:</span>
              <span className="font-mono font-semibold text-green-700">
                {PROPERTY_INFO.possessionDate} (possession transfer)
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-red-100 rounded border-l-4 border-red-500">
              <span className="font-bold">Invalid Period Claimed:</span>
              <span className="font-mono font-bold text-red-700">
                {PROPERTY_INFO.possessionDate} → {PROPERTY_INFO.saleDate}
              </span>
            </div>
          </div>
        </div>

        <p className="leading-relaxed">
          <span className="font-semibold">4.4 Petitioner&apos;s Exclusive Benefit Period ({PROPERTY_INFO.possessionDays} Days).</span>{' '}
          From {PROPERTY_INFO.possessionDate} to {PROPERTY_INFO.saleDate}, Petitioner enjoyed{' '}
          <strong>exclusive possession, use, and benefit</strong> of the Property for{' '}
          {PROPERTY_INFO.possessionDays} consecutive days ({PROPERTY_INFO.possessionMonths} months).
          During this period:
        </p>

        <ul className="ml-12 list-disc space-y-2 text-sm">
          <li>She had sole access and occupancy rights</li>
          <li>She derived all residential benefit</li>
          <li>She controlled property access and use</li>
          <li>She bore legal responsibility for property expenses</li>
        </ul>

        <div className="bg-slate-50 border border-slate-300 rounded p-4 my-3">
          <p className="font-semibold text-slate-900 mb-2">4.5 Offset for Petitioner&apos;s Use Value</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            If the Court were to entertain Petitioner&apos;s Watts claims (which it should not),
            any such award must be offset by the fair rental value of her exclusive use during the{' '}
            {PROPERTY_INFO.possessionDays}-day period she possessed the Property. At her claimed
            rate of ${CLAIMS.wattsMonthlyRate.toLocaleString()}/month, her use value equals
            approximately <strong>${CLAIMS.wattsOffsetAmount.toLocaleString()}</strong>, completely
            offsetting any pre-possession Watts claims.
          </p>
        </div>
      </div>
    </div>
  );
};

export default React.memo(WattsChargesSection);
