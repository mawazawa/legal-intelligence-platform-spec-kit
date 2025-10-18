/**
 * Checklist Tabs Component
 * SOLID: Single responsibility for organizing checklist items by category/type
 */

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileCheck } from 'lucide-react';
import { RFOChecklistItem } from '@/types/checklist';
import { ChecklistItemCard } from './ChecklistItemCard';
import { OptionalItemCard } from './OptionalItemCard';
import { groupByCategory } from '../utils/status-helpers';

interface ChecklistTabsProps {
  checklistItems: RFOChecklistItem[];
  onToggleItemStatus: (itemId: string) => void;
}

export const ChecklistTabs = React.memo<ChecklistTabsProps>(({
  checklistItems,
  onToggleItemStatus
}) => {
  const requiredItems = checklistItems.filter(item => item.required);
  const optionalItems = checklistItems.filter(item => !item.required);
  const requiredByCategory = groupByCategory(requiredItems);

  return (
    <Tabs defaultValue="required" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="required" className="text-sm">
          Required ({requiredItems.length})
        </TabsTrigger>
        <TabsTrigger value="optional" className="text-sm">
          Optional ({optionalItems.length})
        </TabsTrigger>
        <TabsTrigger value="all" className="text-sm">
          All Items ({checklistItems.length})
        </TabsTrigger>
      </TabsList>

      {/* Required Items Tab */}
      <TabsContent value="required">
        {Object.entries(requiredByCategory).map(([category, items]) => (
          <div key={category} className="mb-6">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center">
              <FileCheck className="h-5 w-5 mr-2 text-blue-600" />
              {category}
            </h3>
            <div className="space-y-4">
              {items.map(item => (
                <ChecklistItemCard
                  key={item.id}
                  item={item}
                  onToggleStatus={onToggleItemStatus}
                />
              ))}
            </div>
          </div>
        ))}
      </TabsContent>

      {/* Optional Items Tab */}
      <TabsContent value="optional">
        {optionalItems.map(item => (
          <OptionalItemCard
            key={item.id}
            item={item}
            onToggleStatus={onToggleItemStatus}
          />
        ))}
      </TabsContent>

      {/* All Items Tab */}
      <TabsContent value="all">
        <div className="space-y-4">
          {checklistItems.map(item => (
            <ChecklistItemCard
              key={item.id}
              item={item}
              onToggleStatus={onToggleItemStatus}
            />
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
});

ChecklistTabs.displayName = 'ChecklistTabs';
