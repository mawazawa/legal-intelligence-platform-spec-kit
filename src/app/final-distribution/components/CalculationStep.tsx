import React from 'react';
import { CalculationStep as CalculationStepType } from '@/types/calculations';

interface CalculationStepProps {
  step: CalculationStepType;
}

export const CalculationStepComponent = React.memo(({ step }: CalculationStepProps) => (
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
          ${step.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}
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
      <div className="mt-4 pl-8 border-l-2 border-slate-200">
        <h6 className="text-sm font-bold text-slate-700 mb-3">SUPPORTING CALCULATIONS:</h6>
        <div className="space-y-3">
          {step.subSteps.map((subStep, subIndex) => (
            <div key={subIndex} className="bg-slate-50 border border-slate-200 rounded p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center mr-3 border border-slate-300">
                    <span className="text-xs font-bold text-slate-700">{subStep.stepNumber}</span>
                  </div>
                  <div>
                    <h6 className="text-sm font-bold text-slate-800">{subStep.stepName}</h6>
                    <p className="text-xs text-slate-600">{subStep.explanation}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-slate-900">
                    ${subStep.amount?.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '—'}
                  </div>
                </div>
              </div>

              {/* Sub-step Sources */}
              {subStep.sources && subStep.sources.length > 0 && (
                <div className="mt-3">
                  <div className="grid grid-cols-1 gap-2">
                    {subStep.sources.map((source, sourceIndex) => (
                      <div key={sourceIndex} className="bg-white border border-slate-200 rounded p-2 text-xs">
                        <div className="font-semibold text-slate-700">{source.documentName}</div>
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
              )}
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
));

CalculationStepComponent.displayName = 'CalculationStepComponent';
