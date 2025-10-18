import React from 'react';
import { Button } from '@/components/ui/button';
import { Gavel, Calculator, BookOpen, FileCheck, Shield, CheckCircle2 } from 'lucide-react';
import { QualityCategory } from './types';

interface CategoryFiltersProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const categoryConfig: Array<{ value: string; label: string; icon?: React.ComponentType<{ className?: string }> }> = [
  { value: 'all', label: 'All' },
  { value: 'legal', label: 'Legal', icon: Gavel },
  { value: 'mathematical', label: 'Math', icon: Calculator },
  { value: 'citation', label: 'Citations', icon: BookOpen },
  { value: 'format', label: 'Format', icon: FileCheck },
  { value: 'ethics', label: 'Ethics', icon: Shield },
  { value: 'completeness', label: 'Complete', icon: CheckCircle2 }
];

export const CategoryFilters = React.memo<CategoryFiltersProps>(({ activeCategory, onCategoryChange }) => {
  return (
    <div className="flex items-center gap-2">
      {categoryConfig.map(({ value, label, icon: Icon }) => (
        <Button
          key={value}
          variant={activeCategory === value ? 'default' : 'outline'}
          size="sm"
          onClick={() => onCategoryChange(value)}
        >
          {Icon && <Icon className="h-4 w-4" />}
          {!Icon && label}
          {Icon && <span className="ml-1">{label}</span>}
        </Button>
      ))}
    </div>
  );
});

CategoryFilters.displayName = 'CategoryFilters';
