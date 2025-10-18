import React from 'react';
import { Button } from '@/components/ui/button';
import { NegotiableParameter } from '@/types/calculations';

interface NegotiableParametersProps {
  negotiableParams: NegotiableParameter[];
  updateParameter: (id: string, value: number) => void;
}

export const NegotiableParameters = React.memo(({ negotiableParams, updateParameter }: NegotiableParametersProps) => (
  <div className="space-y-4">
    {negotiableParams.map((param) => (
      <div key={param.id} className="bg-white border border-slate-200 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="text-lg font-bold text-slate-800">{param.name}</h4>
            <p className="text-sm text-slate-600">{param.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-slate-900">
              {param.unit === '$' ? '$' : ''}{param.currentValue.toLocaleString()}{param.unit === '%' ? '%' : ''}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateParameter(param.id, param.currentValue - param.step)}
            disabled={param.currentValue <= param.minValue}
          >
            -
          </Button>
          <div className="flex-1">
            <input
              type="range"
              min={param.minValue}
              max={param.maxValue}
              step={param.step}
              value={param.currentValue}
              onChange={(e) => updateParameter(param.id, parseFloat(e.target.value))}
              className="w-full"
            />
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => updateParameter(param.id, param.currentValue + param.step)}
            disabled={param.currentValue >= param.maxValue}
          >
            +
          </Button>
        </div>
      </div>
    ))}
  </div>
));

NegotiableParameters.displayName = 'NegotiableParameters';
