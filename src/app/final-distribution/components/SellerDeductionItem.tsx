import React from 'react';
import { SellerDeduction } from '@/types/calculations';

interface SellerDeductionItemProps {
  deduction: SellerDeduction;
  index: number;
}

export const SellerDeductionItem = React.memo(({ deduction, index }: SellerDeductionItemProps) => (
  <div className="bg-white border border-slate-200 rounded-lg p-6">
    <div className="flex items-start justify-between mb-4">
      <div className="flex items-center">
        <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-4 border-2 border-slate-300">
          <span className="text-sm font-bold text-slate-700">{index + 1}</span>
        </div>
        <div>
          <h4 className="text-lg font-bold text-slate-800">{deduction.description}</h4>
          <p className="text-sm text-slate-600">Category: {deduction.category}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="text-2xl font-black text-slate-900">
          ${deduction.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        {deduction.negotiable && (
          <div className="text-xs text-blue-600 mt-1 font-medium">Negotiable</div>
        )}
      </div>
    </div>

    {/* Sources */}
    <div className="mb-4">
      <h5 className="text-sm font-bold text-slate-700 mb-2">SOURCES:</h5>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {deduction.sources.map((source, sourceIndex) => (
          <div key={sourceIndex} className="bg-slate-50 border border-slate-200 rounded p-3 text-xs">
            <div className="font-bold text-slate-700">{source.documentName}</div>
            <div className="text-slate-600">{source.documentDate}</div>
            {source.sectionName && (
              <div className="text-slate-600">{source.sectionName}</div>
            )}
            {source.excerpt && (
              <div className="text-slate-600 mt-1 italic">&quot;{source.excerpt}&quot;</div>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
));

SellerDeductionItem.displayName = 'SellerDeductionItem';
