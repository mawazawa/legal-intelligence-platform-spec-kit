'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calculator, 
  Scale, 
  DollarSign, 
  RefreshCw, 
  Save, 
  Eye,
  AlertCircle,
  CheckCircle2,
  Bot,
  MessageSquare,
  FileText,
  TrendingUp,
  TrendingDown
} from 'lucide-react';

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

interface CalculationInput {
  netProceeds: number;
  petitionerPercentage: number;
  respondentPercentage: number;
  adjustments: Array<{
    id: string;
    type: 'watts' | 'tax' | 'arrears' | 'other';
    amount: number;
    description: string;
    party: 'petitioner' | 'respondent' | 'both';
  }>;
}

interface JudgmentCalculatorProps {
  judgment: JudgmentData;
  onCalculationUpdate: (calculation: any) => void;
  onSaveCalculation: (calculation: any) => void;
}

const JudgmentCalculator: React.FC<JudgmentCalculatorProps> = ({
  judgment,
  onCalculationUpdate,
  onSaveCalculation
}) => {
  const [inputs, setInputs] = useState<CalculationInput>({
    netProceeds: judgment.calculations.netProceeds,
    petitionerPercentage: judgment.calculations.petitionerPercentage,
    respondentPercentage: judgment.calculations.respondentPercentage,
    adjustments: judgment.calculations.adjustments.map((adj, index) => ({
      id: `adj-${index}`,
      ...adj
    }))
  });

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  // Calculate results
  const results = useMemo(() => {
    const basePetitioner = inputs.netProceeds * (inputs.petitionerPercentage / 100);
    const baseRespondent = inputs.netProceeds * (inputs.respondentPercentage / 100);

    let petitionerTotal = basePetitioner;
    let respondentTotal = baseRespondent;

    inputs.adjustments.forEach(adj => {
      if (adj.party === 'petitioner' || adj.party === 'both') {
        petitionerTotal += adj.amount;
      }
      if (adj.party === 'respondent' || adj.party === 'both') {
        respondentTotal += adj.amount;
      }
    });

    return {
      basePetitioner,
      baseRespondent,
      petitionerTotal,
      respondentTotal,
      totalDistributed: petitionerTotal + respondentTotal,
      discrepancy: Math.abs((petitionerTotal + respondentTotal) - inputs.netProceeds)
    };
  }, [inputs]);

  const updateInput = (field: keyof CalculationInput, value: any) => {
    setInputs(prev => ({
      ...prev,
      [field]: value
    }));
    onCalculationUpdate({ ...inputs, [field]: value });
  };

  const addAdjustment = () => {
    const newAdjustment = {
      id: `adj-${Date.now()}`,
      type: 'other' as const,
      amount: 0,
      description: '',
      party: 'both' as const
    };
    updateInput('adjustments', [...inputs.adjustments, newAdjustment]);
  };

  const updateAdjustment = (id: string, field: string, value: any) => {
    const updatedAdjustments = inputs.adjustments.map(adj =>
      adj.id === id ? { ...adj, [field]: value } : adj
    );
    updateInput('adjustments', updatedAdjustments);
  };

  const removeAdjustment = (id: string) => {
    const updatedAdjustments = inputs.adjustments.filter(adj => adj.id !== id);
    updateInput('adjustments', updatedAdjustments);
  };

  const handleAIAssistant = async () => {
    if (!aiQuery.trim()) return;

    // Simulate AI response - in real implementation, this would call an AI service
    const response = `Based on the judgment analysis and your query "${aiQuery}", here are the key considerations:

1. **Net Proceeds Calculation**: The judgment specifies using actual net proceeds of $${inputs.netProceeds.toLocaleString()} from the closing statement.

2. **Percentage Split**: The 35%/65% split is clearly established in the Statement of Decision.

3. **Adjustments**: Consider whether any additional adjustments are needed based on:
   - Watts charges symmetry
   - Tax withholding credits
   - Post-closing expenses

4. **Recommendation**: ${results.discrepancy > 100 ? 'Review adjustments to minimize discrepancy' : 'Calculation appears balanced'}`;

    setAiResponse(response);
  };

  const getAdjustmentIcon = (type: string) => {
    switch (type) {
      case 'watts': return <TrendingUp className="h-4 w-4 text-blue-500" />;
      case 'tax': return <DollarSign className="h-4 w-4 text-green-500" />;
      case 'arrears': return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <FileText className="h-4 w-4 text-gray-500" />;
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
              <p className="text-sm text-gray-600">Granular payout computation with AI assistance</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIAssistant(!showAIAssistant)}
            >
              <Bot className="h-4 w-4 mr-2" />
              AI Assistant
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onSaveCalculation(results)}
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Judgment Context Panel */}
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
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {judgment.content}
                  </p>
                </ScrollArea>
              </CardContent>
            </Card>
          </ScrollArea>
        </div>

        {/* Calculator Panel */}
        <div className="flex-1 flex flex-col">
          {/* Input Controls */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="net-proceeds">Net Proceeds</Label>
                <Input
                  id="net-proceeds"
                  type="number"
                  value={inputs.netProceeds}
                  onChange={(e) => updateInput('netProceeds', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="petitioner-percentage">Petitioner %</Label>
                <Input
                  id="petitioner-percentage"
                  type="number"
                  value={inputs.petitionerPercentage}
                  onChange={(e) => updateInput('petitionerPercentage', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="respondent-percentage">Respondent %</Label>
                <Input
                  id="respondent-percentage"
                  type="number"
                  value={inputs.respondentPercentage}
                  onChange={(e) => updateInput('respondentPercentage', parseFloat(e.target.value) || 0)}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Results Display */}
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
                      <span>${results.basePetitioner.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Adjustments:</span>
                      <span>${(results.petitionerTotal - results.basePetitioner).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-red-700 border-t pt-1">
                      <span>Total:</span>
                      <span>${results.petitionerTotal.toLocaleString()}</span>
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
                      <span>${results.baseRespondent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Adjustments:</span>
                      <span>${(results.respondentTotal - results.baseRespondent).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-blue-700 border-t pt-1">
                      <span>Total:</span>
                      <span>${results.respondentTotal.toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Distributed:</span>
                <span className="font-semibold">${results.totalDistributed.toLocaleString()}</span>
              </div>
              {results.discrepancy > 0 && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-sm text-gray-600">Discrepancy:</span>
                  <span className={`text-sm font-medium ${results.discrepancy > 100 ? 'text-red-600' : 'text-yellow-600'}`}>
                    ${results.discrepancy.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Adjustments */}
          <div className="flex-1 overflow-auto p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Adjustments</h3>
              <Button size="sm" onClick={addAdjustment}>
                Add Adjustment
              </Button>
            </div>

            <div className="space-y-3">
              {inputs.adjustments.map(adj => (
                <Card key={adj.id} className="p-4">
                  <div className="grid grid-cols-6 gap-3 items-end">
                    <div>
                      <Label className="text-xs">Type</Label>
                      <select
                        value={adj.type}
                        onChange={(e) => updateAdjustment(adj.id, 'type', e.target.value)}
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
                        onChange={(e) => updateAdjustment(adj.id, 'amount', parseFloat(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-xs">Description</Label>
                      <Input
                        value={adj.description}
                        onChange={(e) => updateAdjustment(adj.id, 'description', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Party</Label>
                      <select
                        value={adj.party}
                        onChange={(e) => updateAdjustment(adj.id, 'party', e.target.value)}
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
                        onClick={() => removeAdjustment(adj.id)}
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
        </div>

        {/* AI Assistant Panel */}
        {showAIAssistant && (
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
                  onChange={(e) => setAiQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAIAssistant()}
                />
                <Button onClick={handleAIAssistant} className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ask AI
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JudgmentCalculator;
