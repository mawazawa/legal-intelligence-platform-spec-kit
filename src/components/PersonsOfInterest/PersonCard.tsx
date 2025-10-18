'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, MapPin } from 'lucide-react';
import type { Person } from './types';
import { getStatusColor, getStatusIcon } from './utils';

interface PersonCardProps {
  person: Person;
  isExpanded: boolean;
  compact: boolean;
  onToggle: (name: string) => void;
}

export const PersonCard = React.memo<PersonCardProps>(({ person, isExpanded, compact, onToggle }) => {
  return (
    <div className="border rounded-lg p-3 bg-white print:break-inside-avoid print:mb-2">
      <button
        onClick={() => onToggle(person.name)}
        className="w-full flex items-start justify-between text-left print:cursor-default"
      >
        <div className="flex items-start gap-3 flex-1">
          <div className={`p-2 rounded-lg ${getStatusColor(person.status)}`}>
            {person.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-sm">{person.name}</h4>
              {person.status && (
                <Badge
                  variant="outline"
                  className={`${getStatusColor(person.status)} text-xs`}
                >
                  {getStatusIcon(person.status)}
                  <span className="ml-1">{person.status}</span>
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-600">{person.role}</p>
            {person.organization && (
              <p className="text-xs text-slate-500">{person.organization}</p>
            )}
          </div>
        </div>
      </button>

      {(isExpanded || compact) && (
        <div className="mt-3 pt-3 border-t space-y-2 text-sm print:block">
          {person.description && (
            <p className="text-slate-700">{person.description}</p>
          )}
          <div className="space-y-1 text-slate-600">
            {person.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <a
                  href={`mailto:${person.email}`}
                  className="hover:text-blue-600 print:text-slate-600"
                >
                  {person.email}
                </a>
              </div>
            )}
            {person.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <a
                  href={`tel:${person.phone}`}
                  className="hover:text-blue-600 print:text-slate-600"
                >
                  {person.phone}
                </a>
              </div>
            )}
            {person.address && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{person.address}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

PersonCard.displayName = 'PersonCard';
