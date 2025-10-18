'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronRight } from 'lucide-react';
import type { Person, Category } from './types';
import { PersonCard } from './PersonCard';

interface CategorySectionProps {
  category: Category;
  persons: Person[];
  isExpanded: boolean;
  expandedPersons: string[];
  compact: boolean;
  onToggleCategory: (id: string) => void;
  onTogglePerson: (name: string) => void;
}

export const CategorySection = React.memo<CategorySectionProps>(({
  category,
  persons,
  isExpanded,
  expandedPersons,
  compact,
  onToggleCategory,
  onTogglePerson
}) => {
  if (persons.length === 0) return null;

  return (
    <div className="print:break-inside-avoid">
      <button
        onClick={() => onToggleCategory(category.id)}
        className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg hover:from-slate-100 hover:to-slate-200 transition-colors print:bg-slate-100 print:hover:from-slate-100"
      >
        <div className="flex items-center gap-2">
          {category.icon}
          <span className="font-semibold">{category.title}</span>
          <Badge variant="outline" className="ml-2">
            {persons.length}
          </Badge>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 print:hidden" />
        ) : (
          <ChevronRight className="h-5 w-5 print:hidden" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-2 space-y-2 ml-4 print:block">
          {persons.map(person => (
            <PersonCard
              key={person.name}
              person={person}
              isExpanded={expandedPersons.includes(person.name)}
              compact={compact}
              onToggle={onTogglePerson}
            />
          ))}
        </div>
      )}
    </div>
  );
});

CategorySection.displayName = 'CategorySection';
