'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Calculator,
  Scale,
  DollarSign,
  Save,
  AlertCircle,
  CheckCircle2,
  Bot,
  MessageSquare,
  FileText,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { useJudgmentCalculator } from '@/hooks/useJudgmentCalculator';
import type { JudgmentAdjustment } from '@/lib/calculations/judgment';
import { formatCurrency } from '@/lib/utils/currency';

interface JudgmentData {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  calculations: {
    netProceeds: number;
    petitionerPercentage: number;
    respondentPercentage: number;
    adjustments: Array<{
      type: 'watts' | 'tax' | 'arrears' | 'other';
      amount: number;
      description: string;
      party: 'petitioner' | 'respondent' | 'both';
    }>;
  };
}

interface JudgmentCalculatorProps {
  judgment: JudgmentData;
  onCalculationUpdate: (calculation: any) => void;
  onSaveCalculation: (calculation: any) => void;
}

const JudgmentCalculator: React.FC<JudgmentCalculatorProps> = ({
  judgment,
  onCalculationUpdate,
  onSaveCalculation,
}) => {
  // Use custom hook for all state and logic
  const calculator = useJudgmentCalculator({
    initialNetProceeds: judgment.calculations.netProceeds,
    initialPetitionerPercentage: judgment.calculations.petitionerPercentage,
    initialRespondentPercentage: judgment.calculations.respondentPercentage,
    initialAdjustments: judgment.calculations.adjustments.map((adj, index) => ({
      id: `adj-${index}`,
      ...adj,
    })),
    onCalculationUpdate,
  });

  const { inputs, results, showAIAssistant, aiQuery, aiResponse } = calculator;

  const getAdjustmentIcon = (type: string) => {
    switch (type) {
      case 'watts':
        return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'tax':
        return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'arrears':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <FileText className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Scale className="h-6 w-6 text-purple-600" />
            <div>
              <h2 className="font-semibold text-lg">Judgment Calculator</h2>
              <p className="text-sm text-gray-600">
                Granular payout computation with AI assistance
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={calculator.toggleAIAssistant}>
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button variant="outline" size="sm" onClick={() => onSaveCalculation(results)}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Judgment Context Panel */}
        <JudgmentContextPanel judgment={judgment} />

        {/* Calculator Panel */}
        <div className="flex-1 flex flex-col">
          {/* Input Controls */}
          <CalculatorInputs
            netProceeds={inputs.netProceeds}
            petitionerPercentage={inputs.petitionerPercentage}
            respondentPercentage={inputs.respondentPercentage}
            onNetProceedsChange={calculator.updateNetProceeds}
            onPetitionerPercentageChange={calculator.updatePetitionerPercentage}
            onRespondentPercentageChange={calculator.updateRespondentPercentage}
          />

          {/* Results Display */}
          <CalculatorResults results={results} />

          {/* Adjustments */}
          <AdjustmentList
            adjustments={inputs.adjustments}
            onAdd={calculator.addAdjustment}
            onUpdate={calculator.updateAdjustment}
            onRemove={calculator.removeAdjustment}
            getIcon={getAdjustmentIcon}
          />
        </div>

        {/* AI Assistant Panel */}
        {showAIAssistant && (
          <AIAssistantPanel
            aiQuery={aiQuery}
            aiResponse={aiResponse}
            onQueryChange={calculator.setAiQuery}
            onSubmit={calculator.handleAIAssistant}
          />
        )}
      </div>
    </div>
  );
};

/* ===== Sub-Components ===== */

interface JudgmentContextPanelProps {
  judgment: JudgmentData;
}

const JudgmentContextPanel: React.FC<JudgmentContextPanelProps> = ({ judgment }) => (
  <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <FileText className="h-5 w-5 text-purple-600" />
        Judgment Context
      </h3>
    </div>

    <ScrollArea className="flex-1 p-4">
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">{judgment.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <Label className="text-sm font-medium text-gray-700">Key Points</Label>
              <ul className="mt-2 space-y-1">
                {judgment.keyPoints.map((point, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle2 className="h-3 w-3 text-green-500 mt-1 flex-shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Judgment Content</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-64">
            <p className="text-sm text-gray-700 leading-relaxed">{judgment.content}</p>
          </ScrollArea>
        </CardContent>
      </Card>
    </ScrollArea>
  </div>
);

interface CalculatorInputsProps {
  netProceeds: number;
  petitionerPercentage: number;
  respondentPercentage: number;
  onNetProceedsChange: (value: number) => void;
  onPetitionerPercentageChange: (value: number) => void;
  onRespondentPercentageChange: (value: number) => void;
}

const CalculatorInputs: React.FC<CalculatorInputsProps> = ({
  netProceeds,
  petitionerPercentage,
  respondentPercentage,
  onNetProceedsChange,
  onPetitionerPercentageChange,
  onRespondentPercentageChange,
}) => (
  <div className="bg-white border-b border-gray-200 p-4">
    <div className="grid grid-cols-3 gap-4">
      <div>
        <Label htmlFor="net-proceeds">Net Proceeds</Label>
        <Input
          id="net-proceeds"
          type="number"
          value={netProceeds}
          onChange={e => onNetProceedsChange(parseFloat(e.target.value) || 0)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="petitioner-percentage">Petitioner %</Label>
        <Input
          id="petitioner-percentage"
          type="number"
          value={petitionerPercentage}
          onChange={e => onPetitionerPercentageChange(parseFloat(e.target.value) || 0)}
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="respondent-percentage">Respondent %</Label>
        <Input
          id="respondent-percentage"
          type="number"
          value={respondentPercentage}
          onChange={e => onRespondentPercentageChange(parseFloat(e.target.value) || 0)}
          className="mt-1"
        />
      </div>
    </div>
  </div>
);

interface CalculatorResultsProps {
  results: {
    basePetitioner: number;
    baseRespondent: number;
    petitionerTotal: number;
    respondentTotal: number;
    totalDistributed: number;
    discrepancy: number;
    petitionerAdjustments: number;
    respondentAdjustments: number;
  };
}

const CalculatorResults: React.FC<CalculatorResultsProps> = ({ results }) => (
  <div className="bg-white border-b border-gray-200 p-4">
    <div className="grid grid-cols-2 gap-4">
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="h-4 w-4 text-red-600" />
            <h4 className="font-semibold text-red-700">Petitioner</h4>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Base (35%):</span>
              <span>{formatCurrency(results.basePetitioner)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Adjustments:</span>
              <span>{formatCurrency(results.petitionerAdjustments)}</span>
            </div>
            <div className="flex justify-between font-semibold text-red-700 border-t pt-1">
              <span>Total:</span>
              <span>{formatCurrency(results.petitionerTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="h-4 w-4 text-blue-600" />
            <h4 className="font-semibold text-blue-700">Respondent</h4>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Base (65%):</span>
              <span>{formatCurrency(results.baseRespondent)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Adjustments:</span>
              <span>{formatCurrency(results.respondentAdjustments)}</span>
            </div>
            <div className="flex justify-between font-semibold text-blue-700 border-t pt-1">
              <span>Total:</span>
              <span>{formatCurrency(results.respondentTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <div className="flex justify-between items-center">
        <span className="font-medium">Total Distributed:</span>
        <span className="font-semibold">{formatCurrency(results.totalDistributed)}</span>
      </div>
      {results.discrepancy > 0 && (
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-600">Discrepancy:</span>
          <span
            className={`text-sm font-medium ${
              results.discrepancy > 100 ? 'text-red-600' : 'text-yellow-600'
            }`}
          >
            {formatCurrency(results.discrepancy)}
          </span>
        </div>
      )}
    </div>
  </div>
);

interface AdjustmentListProps {
  adjustments: JudgmentAdjustment[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof JudgmentAdjustment, value: any) => void;
  onRemove: (id: string) => void;
  getIcon: (type: string) => React.ReactNode;
}

const AdjustmentList: React.FC<AdjustmentListProps> = ({
  adjustments,
  onAdd,
  onUpdate,
  onRemove,
  getIcon,
}) => (
  <div className="flex-1 overflow-auto p-4">
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-semibold">Adjustments</h3>
      <Button size="sm" onClick={onAdd}>
        Add Adjustment
      </Button>
    </div>

    <div className="space-y-3">
      {adjustments.map(adj => (
        <Card key={adj.id} className="p-4">
          <div className="grid grid-cols-6 gap-3 items-end">
            <div>
              <Label className="text-xs">Type</Label>
              <select
                value={adj.type}
                onChange={e => onUpdate(adj.id, 'type', e.target.value)}
                className="w-full mt-1 text-sm border rounded px-2 py-1"
              >
                <option value="watts">Watts</option>
                <option value="tax">Tax</option>
                <option value="arrears">Arrears</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <Label className="text-xs">Amount</Label>
              <Input
                type="number"
                value={adj.amount}
                onChange={e => onUpdate(adj.id, 'amount', parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs">Description</Label>
              <Input
                value={adj.description}
                onChange={e => onUpdate(adj.id, 'description', e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-xs">Party</Label>
              <select
                value={adj.party}
                onChange={e => onUpdate(adj.id, 'party', e.target.value)}
                className="w-full mt-1 text-sm border rounded px-2 py-1"
              >
                <option value="petitioner">Petitioner</option>
                <option value="respondent">Respondent</option>
                <option value="both">Both</option>
              </select>
            </div>
            <div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(adj.id)}
                className="w-full"
              >
                Remove
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
);

interface AIAssistantPanelProps {
  aiQuery: string;
  aiResponse: string;
  onQueryChange: (query: string) => void;
  onSubmit: () => void;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  aiQuery,
  aiResponse,
  onQueryChange,
  onSubmit,
}) => (
  <div className="w-1/3 bg-white border-l border-gray-200 flex flex-col">
    <div className="p-4 border-b border-gray-200">
      <h3 className="font-semibold text-lg flex items-center gap-2">
        <Bot className="h-5 w-5 text-blue-600" />
        AI Assistant
      </h3>
    </div>

    <div className="flex-1 flex flex-col p-4">
      <div className="flex-1 mb-4">
        <ScrollArea className="h-full">
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="text-sm text-blue-800">
                Ask me about calculation adjustments, judgment interpretation, or legal precedents.
              </p>
            </div>

            {aiResponse && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{aiResponse}</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="space-y-2">
        <Input
          placeholder="Ask about calculations, adjustments, or legal guidance..."
          value={aiQuery}
          onChange={e => onQueryChange(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && onSubmit()}
        />
        <Button onClick={onSubmit} className="w-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          Ask AI
        </Button>
      </div>
    </div>
  </div>
);

export default JudgmentCalculator;
