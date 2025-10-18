import React, { memo } from 'react';
import { CalculationStep } from '@/types/calculations';

interface CalculationStepDisplayProps {
  step: CalculationStep;
}

export const CalculationStepDisplay = memo<CalculationStepDisplayProps>(({ step }) => {
  return (
    <div className="court-step bg-white border border-slate-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mr-4 border-2 border-slate-300">
            <span className="text-sm font-bold text-slate-700">{step.stepNumber}</span>
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">{step.stepName}</h4>
            <p className="text-sm text-slate-600">{step.explanation}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black text-slate-900">
            ${step.amount.toLocaleString()}
          </div>
          {step.formula && (
            <div className="text-xs text-slate-500 mt-1 font-mono bg-slate-50 px-2 py-1 rounded">
              {step.formula}
            </div>
          )}
        </div>
      </div>

      {/* Document Sources */}
      <div className="mb-4">
        <h5 className="text-sm font-bold text-slate-700 mb-2">DOCUMENT SOURCES:</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {step.sources?.map((source, sourceIndex) => (
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

      {/* Sub-steps */}
      {step.subSteps && step.subSteps.length > 0 && (
        <div className="ml-6 mt-4">
          <h6 className="text-sm font-bold text-slate-700 mb-2">SUB-CALCULATIONS:</h6>
          <div className="space-y-2">
            {step.subSteps.map((subStep, subIndex) => (
              <div key={subIndex} className="bg-slate-50 border border-slate-200 rounded p-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700 font-medium">{subStep.stepName}</span>
                  <span className="font-bold text-slate-800">${subStep.amount.toLocaleString()}</span>
                </div>
                {subStep.explanation && (
                  <p className="text-slate-600 mt-1 text-xs">{subStep.explanation}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

CalculationStepDisplay.displayName = 'CalculationStepDisplay';
