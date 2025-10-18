import { useState, useCallback } from 'react';

export const useFilingState = () => {
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [showCalculations, setShowCalculations] = useState(true);
  const [showEvidence, setShowEvidence] = useState(true);
  const [showTimeline, setShowTimeline] = useState(true);

  const toggleTaskExpansion = useCallback((taskId: string) => {
    setExpandedTasks(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(taskId)) {
        newExpanded.delete(taskId);
      } else {
        newExpanded.add(taskId);
      }
      return newExpanded;
    });
  }, []);

  const toggleCalculations = useCallback(() => {
    setShowCalculations(prev => !prev);
  }, []);

  const toggleEvidence = useCallback(() => {
    setShowEvidence(prev => !prev);
  }, []);

  const toggleTimeline = useCallback(() => {
    setShowTimeline(prev => !prev);
  }, []);

  return {
    expandedTasks,
    showCalculations,
    showEvidence,
    showTimeline,
    toggleTaskExpansion,
    toggleCalculations,
    toggleEvidence,
    toggleTimeline,
  };
};
