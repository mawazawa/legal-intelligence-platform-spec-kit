"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Target, TrendingUp, Activity, Calculator, Shield } from 'lucide-react';

interface ModelSelectorProps {
  activeModel: string;
  onModelChange: (model: string) => void;
}

const models = [
  { id: 'outcome', label: 'Outcome', icon: Target },
  { id: 'settlement', label: 'Settlement', icon: TrendingUp },
  { id: 'timeline', label: 'Timeline', icon: Activity },
  { id: 'cost', label: 'Cost', icon: Calculator },
  { id: 'risk', label: 'Risk', icon: Shield },
];

export const ModelSelector = React.memo<ModelSelectorProps>(({ activeModel, onModelChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-2 p-4 bg-white rounded-lg border">
      {models.map(({ id, label, icon: Icon }) => (
        <Button
          key={id}
          variant={activeModel === id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onModelChange(id)}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Button>
      ))}
    </div>
  );
});

ModelSelector.displayName = 'ModelSelector';
