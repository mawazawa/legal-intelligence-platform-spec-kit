/**
 * Judgment Calculator Hook
 * Manages state and logic for judgment calculations
 * Extracted from JudgmentCalculator component for reusability
 */

'use client';

import { useState, useMemo, useCallback } from 'react';
import {
  type JudgmentCalculationInputs,
  type JudgmentCalculationResults,
  type JudgmentAdjustment,
  calculateJudgmentDistribution,
  createAdjustment,
  updateAdjustment as updateAdjustmentUtil,
  removeAdjustment as removeAdjustmentUtil,
  generateAIResponse,
} from '@/lib/calculations/judgment';

export interface UseJudgmentCalculatorProps {
  initialNetProceeds: number;
  initialPetitionerPercentage: number;
  initialRespondentPercentage: number;
  initialAdjustments?: JudgmentAdjustment[];
  onCalculationUpdate?: (results: JudgmentCalculationResults) => void;
}

export interface UseJudgmentCalculatorReturn {
  // State
  inputs: JudgmentCalculationInputs;
  results: JudgmentCalculationResults;
  showAIAssistant: boolean;
  aiQuery: string;
  aiResponse: string;

  // Input updaters
  updateNetProceeds: (value: number) => void;
  updatePetitionerPercentage: (value: number) => void;
  updateRespondentPercentage: (value: number) => void;

  // Adjustment management
  addAdjustment: () => void;
  updateAdjustment: (id: string, field: keyof JudgmentAdjustment, value: any) => void;
  removeAdjustment: (id: string) => void;

  // AI Assistant
  toggleAIAssistant: () => void;
  setAiQuery: (query: string) => void;
  handleAIAssistant: () => void;
}

/**
 * Custom hook for managing judgment calculator state and logic
 *
 * @param props - Configuration props
 * @returns Calculator state and methods
 *
 * @example
 * const calculator = useJudgmentCalculator({
 *   initialNetProceeds: 280355.83,
 *   initialPetitionerPercentage: 35,
 *   initialRespondentPercentage: 65,
 *   onCalculationUpdate: (results) => console.log(results),
 * });
 */
export function useJudgmentCalculator({
  initialNetProceeds,
  initialPetitionerPercentage,
  initialRespondentPercentage,
  initialAdjustments = [],
  onCalculationUpdate,
}: UseJudgmentCalculatorProps): UseJudgmentCalculatorReturn {
  // State management
  const [inputs, setInputs] = useState<JudgmentCalculationInputs>({
    netProceeds: initialNetProceeds,
    petitionerPercentage: initialPetitionerPercentage,
    respondentPercentage: initialRespondentPercentage,
    adjustments: initialAdjustments,
  });

  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiQuery, setAiQuery] = useState('');
  const [aiResponse, setAiResponse] = useState('');

  // Calculate results
  const results = useMemo(() => {
    const calculatedResults = calculateJudgmentDistribution(inputs);

    // Notify parent of calculation updates
    if (onCalculationUpdate) {
      onCalculationUpdate(calculatedResults);
    }

    return calculatedResults;
  }, [inputs, onCalculationUpdate]);

  // Input updaters
  const updateNetProceeds = useCallback((value: number) => {
    setInputs(prev => ({ ...prev, netProceeds: value }));
  }, []);

  const updatePetitionerPercentage = useCallback((value: number) => {
    setInputs(prev => ({ ...prev, petitionerPercentage: value }));
  }, []);

  const updateRespondentPercentage = useCallback((value: number) => {
    setInputs(prev => ({ ...prev, respondentPercentage: value }));
  }, []);

  // Adjustment management
  const addAdjustment = useCallback(() => {
    const newAdjustment = createAdjustment();
    setInputs(prev => ({
      ...prev,
      adjustments: [...prev.adjustments, newAdjustment],
    }));
  }, []);

  const updateAdjustment = useCallback(
    (id: string, field: keyof JudgmentAdjustment, value: any) => {
      setInputs(prev => ({
        ...prev,
        adjustments: updateAdjustmentUtil(prev.adjustments, id, field, value),
      }));
    },
    []
  );

  const removeAdjustment = useCallback((id: string) => {
    setInputs(prev => ({
      ...prev,
      adjustments: removeAdjustmentUtil(prev.adjustments, id),
    }));
  }, []);

  // AI Assistant
  const toggleAIAssistant = useCallback(() => {
    setShowAIAssistant(prev => !prev);
  }, []);

  const handleAIAssistant = useCallback(() => {
    if (!aiQuery.trim()) return;

    const response = generateAIResponse(inputs, results, aiQuery);
    setAiResponse(response);
  }, [aiQuery, inputs, results]);

  return {
    // State
    inputs,
    results,
    showAIAssistant,
    aiQuery,
    aiResponse,

    // Input updaters
    updateNetProceeds,
    updatePetitionerPercentage,
    updateRespondentPercentage,

    // Adjustment management
    addAdjustment,
    updateAdjustment,
    removeAdjustment,

    // AI Assistant
    toggleAIAssistant,
    setAiQuery,
    handleAIAssistant,
  };
}
