/**
 * Custom Hook for RFO Opposition State Management
 * SOLID: Single Responsibility - manages all opposition filing state
 */

import { useState, useMemo, useEffect } from 'react';
import { RFOChecklistItem } from '@/types/checklist';
import { buildChecklistForRFOType } from '../data/checklist-items';
import { calculateCourtDays } from '@/lib/utils/court-days';
import { getNextStatus } from '../utils/status-helpers';

export function useRFOOpposition() {
  const [selectedRFOType, setSelectedRFOType] = useState<string | null>(null);
  const [hearingDate, setHearingDate] = useState<string>('');
  const [currentStep, setCurrentStep] = useState(1);
  const [checklistItems, setChecklistItems] = useState<RFOChecklistItem[]>([]);

  // Calculate filing deadline (9 court days before hearing)
  const filingDeadline = useMemo(() => {
    if (!hearingDate) return null;
    const hearing = new Date(hearingDate);
    return calculateCourtDays(hearing, 9);
  }, [hearingDate]);

  // Days until deadline
  const daysUntilDeadline = useMemo(() => {
    if (!filingDeadline) return null;
    const today = new Date();
    const diffTime = filingDeadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }, [filingDeadline]);

  // Initialize checklist based on RFO type
  useEffect(() => {
    if (!selectedRFOType) return;
    const items = buildChecklistForRFOType(selectedRFOType);
    setChecklistItems(items);
  }, [selectedRFOType]);

  // Toggle item status
  const toggleItemStatus = (itemId: string) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === itemId) {
        return { ...item, status: getNextStatus(item.status) };
      }
      return item;
    }));
  };

  return {
    selectedRFOType,
    setSelectedRFOType,
    hearingDate,
    setHearingDate,
    currentStep,
    setCurrentStep,
    checklistItems,
    filingDeadline,
    daysUntilDeadline,
    toggleItemStatus
  };
}
