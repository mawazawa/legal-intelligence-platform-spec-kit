import { useState } from 'react';
import { FL320ChecklistItem as ChecklistItem } from '@/types/checklist';
import { FL320_CHECKLIST, FL320_CHECKLIST_TEMPLATE } from '../data/checklist-data';

export const useChecklistState = () => {
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(FL320_CHECKLIST);
  const [markdownContent, setMarkdownContent] = useState(FL320_CHECKLIST_TEMPLATE);
  const [isEditing, setIsEditing] = useState(false);
  const [showCompleted, setShowCompleted] = useState(true);

  const toggleItemStatus = (itemId: string) => {
    setChecklistItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStatus = item.status === 'completed' ? 'pending' : 'completed';
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const resetToTemplate = () => {
    setMarkdownContent(FL320_CHECKLIST_TEMPLATE);
  };

  return {
    checklistItems,
    markdownContent,
    setMarkdownContent,
    isEditing,
    setIsEditing,
    showCompleted,
    setShowCompleted,
    toggleItemStatus,
    resetToTemplate
  };
};
