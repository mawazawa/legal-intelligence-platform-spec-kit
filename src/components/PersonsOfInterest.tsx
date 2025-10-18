'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import type { PersonsOfInterestProps } from './PersonsOfInterest/types';
import { personsData, categories } from './PersonsOfInterest/data';
import { CategorySection } from './PersonsOfInterest/CategorySection';

export function PersonsOfInterest({ showCategories, compact = false }: PersonsOfInterestProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['party', 'legal']);
  const [expandedPersons, setExpandedPersons] = useState<string[]>([]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const togglePerson = (name: string) => {
    setExpandedPersons(prev =>
      prev.includes(name)
        ? prev.filter(n => n !== name)
        : [...prev, name]
    );
  };

  const filteredPersons = showCategories
    ? personsData.filter(p => showCategories.includes(p.category))
    : personsData;

  return (
    <div className="print:break-before-page">
      <Card className="print:shadow-none print:border-2">
        <CardHeader className="print:pb-2">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            Persons of Interest
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {categories.map(category => {
            const categoryPersons = filteredPersons.filter(p => p.category === category.id);
            const isExpanded = expandedCategories.includes(category.id);

            return (
              <CategorySection
                key={category.id}
                category={category}
                persons={categoryPersons}
                isExpanded={isExpanded}
                expandedPersons={expandedPersons}
                compact={compact}
                onToggleCategory={toggleCategory}
                onTogglePerson={togglePerson}
              />
            );
          })}
        </CardContent>
      </Card>

      <style jsx global>{`
        @media print {
          .print\\:break-before-page {
            break-before: page;
          }
          .print\\:break-inside-avoid {
            break-inside: avoid;
          }
          .print\\:shadow-none {
            box-shadow: none;
          }
          .print\\:border-2 {
            border-width: 2px;
          }
          .print\\:pb-2 {
            padding-bottom: 0.5rem;
          }
          .print\\:bg-slate-100 {
            background-color: #f1f5f9;
          }
          .print\\:hover\\:from-slate-100:hover {
            background-image: linear-gradient(to right, #f1f5f9, #f1f5f9);
          }
          .print\\:block {
            display: block !important;
          }
          .print\\:hidden {
            display: none;
          }
          .print\\:cursor-default {
            cursor: default;
          }
          .print\\:mb-2 {
            margin-bottom: 0.5rem;
          }
          .print\\:text-slate-600 {
            color: #475569;
          }
        }
      `}</style>
    </div>
  );
}
