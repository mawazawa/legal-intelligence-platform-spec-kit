import React from 'react';
import { FileCheck } from 'lucide-react';
import { FL320ChecklistItem as ChecklistItem } from '@/types/checklist';
import { ChecklistItemCard } from './ChecklistItemCard';
import { ChecklistControls } from './ChecklistControls';

interface ChecklistItemsListProps {
  items: ChecklistItem[];
  showCompleted: boolean;
  onToggleItem: (itemId: string) => void;
  onToggleCompleted: () => void;
  isEditing: boolean;
  onToggleEdit: () => void;
}

export const ChecklistItemsList = React.memo<ChecklistItemsListProps>(({
  items,
  showCompleted,
  onToggleItem,
  onToggleCompleted,
  isEditing,
  onToggleEdit
}) => {
  const filteredItems = items.filter(item => showCompleted || item.status !== 'completed');

  return (
    <div className="court-calculation mb-12">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-slate-800 flex items-center">
          <FileCheck className="h-5 md:h-6 w-5 md:w-6 mr-2 md:mr-3 text-blue-600" />
          CHECKLIST ITEMS
        </h3>
        <ChecklistControls
          showCompleted={showCompleted}
          isEditing={isEditing}
          onToggleCompleted={onToggleCompleted}
          onToggleEdit={onToggleEdit}
        />
      </div>

      <div className="space-y-4">
        {filteredItems.map((item) => (
          <ChecklistItemCard key={item.id} item={item} onToggle={onToggleItem} />
        ))}
      </div>
    </div>
  );
});

ChecklistItemsList.displayName = 'ChecklistItemsList';
