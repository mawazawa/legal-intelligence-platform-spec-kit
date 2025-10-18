/**
 * RFO Type Selection Component
 * SOLID: Single responsibility for selecting RFO type
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { RFO_TYPES } from '@/data/rfo-types';
import { renderIcon } from '@/lib/utils/icon-map';

interface RFOTypeSelectorProps {
  selectedRFOType: string | null;
  onSelectRFOType: (type: string) => void;
  onContinue: () => void;
}

export const RFOTypeSelector = React.memo<RFOTypeSelectorProps>(({
  selectedRFOType,
  onSelectRFOType,
  onContinue
}) => {
  return (
    <Card className="shadow-xl border-0 bg-white mb-6">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100 border-b">
        <CardTitle className="text-2xl font-bold flex items-center">
          <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">1</span>
          What is the Other Party Asking For?
        </CardTitle>
        <p className="text-slate-600 text-sm mt-2">Select the main topic of the Request for Order (RFO) you received</p>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {RFO_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => onSelectRFOType(type.id)}
              className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-lg ${
                selectedRFOType === type.id
                  ? 'border-blue-600 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-start mb-3">
                <div className={`p-3 rounded-lg ${selectedRFOType === type.id ? 'bg-blue-100' : 'bg-gray-100'}`}>
                  {renderIcon(type.icon, 'h-6 w-6')}
                </div>
                {selectedRFOType === type.id && (
                  <CheckCircle2 className="h-6 w-6 text-blue-600 ml-auto" />
                )}
              </div>
              <h3 className="font-bold text-lg text-slate-800 mb-2">{type.name}</h3>
              <p className="text-sm text-slate-600 mb-3">{type.description}</p>
              <div className="text-xs text-slate-500">
                <span className="font-semibold">Common in:</span> {type.commonIn}
              </div>
            </button>
          ))}
        </div>

        {selectedRFOType && (
          <div className="mt-6 flex justify-end">
            <Button
              onClick={onContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg"
            >
              Continue to Deadline Calculator
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

RFOTypeSelector.displayName = 'RFOTypeSelector';
