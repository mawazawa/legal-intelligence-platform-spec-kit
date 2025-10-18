import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calculator, Eye, EyeOff } from 'lucide-react';
import { CalculationStep } from '@/types/calculations';

interface FinancialCalculationsProps {
  steps: CalculationStep[];
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const FinancialCalculations = React.memo<FinancialCalculationsProps>(({
  steps,
  isVisible,
  onToggleVisibility
}) => {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <Calculator className="h-6 w-6 text-green-600" />
          Financial Calculations
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="ml-auto"
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isVisible && (
          <div className="space-y-4">
            {steps.map((step) => (
              <div key={step.stepNumber} className="border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-slate-800">
                    {step.stepNumber}. {step.stepName}
                  </h3>
                  <div className="text-right">
                    <div className="text-lg font-bold text-slate-900">
                      ${step.amount.toLocaleString()}
                    </div>
                    {step.formula && (
                      <div className="text-xs text-slate-500">{step.formula}</div>
                    )}
                  </div>
                </div>
                <p className="text-sm text-slate-600 mb-3">{step.explanation}</p>
                {step.sources && (
                  <div className="bg-slate-50 rounded-lg p-3">
                    <h4 className="font-medium text-slate-800 mb-2">Sources:</h4>
                    {step.sources.map((source, index) => (
                      <div key={index} className="text-sm text-slate-600 mb-1">
                        <span className="font-medium">{source.documentName}</span> ({source.documentDate})
                        {source.sectionName && <span> - {source.sectionName}</span>}
                        {source.excerpt && (
                          <div className="text-xs text-slate-500 mt-1 italic">
                            &quot;{source.excerpt}&quot;
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

FinancialCalculations.displayName = 'FinancialCalculations';
