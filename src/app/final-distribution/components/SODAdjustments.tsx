import React from 'react';
import { SODAdjustments as SODAdjustmentsType } from '@/types/calculations';

interface SODAdjustmentsProps {
  sodAdjustments: SODAdjustmentsType;
}

export const SODAdjustments = React.memo(({ sodAdjustments }: SODAdjustmentsProps) => (
  <div className="space-y-6">
    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h4 className="text-lg font-bold text-slate-800 mb-4">Mathieu Owes Rosanna</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded p-4">
          <div className="text-sm font-bold text-slate-700">Watts Charges</div>
          <div className="text-xl font-black text-slate-900">${sodAdjustments.wattsChargesOriginal.toLocaleString()}</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded p-4">
          <div className="text-sm font-bold text-slate-700">Rental Income Share</div>
          <div className="text-xl font-black text-slate-900">${sodAdjustments.rentalIncomeShare.toLocaleString()}</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded p-4">
          <div className="text-sm font-bold text-slate-700">Motorcycle Share</div>
          <div className="text-xl font-black text-slate-900">${sodAdjustments.motorcycleShare.toLocaleString()}</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded p-4">
          <div className="text-sm font-bold text-slate-700">Furniture Share</div>
          <div className="text-xl font-black text-slate-900">${sodAdjustments.furnitureShare.toLocaleString()}</div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
        <div className="text-lg font-bold text-blue-900">Total: ${(sodAdjustments.wattsChargesOriginal + sodAdjustments.rentalIncomeShare + sodAdjustments.motorcycleShare + sodAdjustments.furnitureShare).toLocaleString()}</div>
      </div>
    </div>

    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h4 className="text-lg font-bold text-slate-800 mb-4">Rosanna Owes Mathieu</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded p-4">
          <div className="text-sm font-bold text-slate-700">Exclusive Possession</div>
          <div className="text-xl font-black text-slate-900">${sodAdjustments.rosannaExclusivePossession.toLocaleString()}</div>
        </div>
        <div className="bg-slate-50 border border-slate-200 rounded p-4">
          <div className="text-sm font-bold text-slate-700">Furniture Correction</div>
          <div className="text-xl font-black text-slate-900">${sodAdjustments.furnitureCorrection.toLocaleString()}</div>
        </div>
      </div>
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded">
        <div className="text-lg font-bold text-green-900">Total: ${(sodAdjustments.rosannaExclusivePossession + sodAdjustments.furnitureCorrection).toLocaleString()}</div>
      </div>
    </div>

    <div className="bg-white border border-slate-200 rounded-lg p-6">
      <h4 className="text-lg font-bold text-slate-800 mb-4">Net Adjustment</h4>
      <div className="p-4 bg-slate-50 border border-slate-200 rounded">
        <div className="text-2xl font-black text-slate-900">${(sodAdjustments.wattsChargesOriginal + sodAdjustments.rentalIncomeShare + sodAdjustments.motorcycleShare + sodAdjustments.furnitureShare - sodAdjustments.rosannaExclusivePossession - sodAdjustments.furnitureCorrection).toLocaleString()}</div>
        <div className="text-sm text-slate-600 mt-2">Mathieu Owes Rosanna - Rosanna Owes Mathieu</div>
      </div>
    </div>
  </div>
));

SODAdjustments.displayName = 'SODAdjustments';
