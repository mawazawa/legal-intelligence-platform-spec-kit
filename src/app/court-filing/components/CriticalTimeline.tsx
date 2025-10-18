import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Eye, EyeOff } from 'lucide-react';
import { TimelineEvent } from '../types';

interface CriticalTimelineProps {
  events: TimelineEvent[];
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export const CriticalTimeline = React.memo<CriticalTimelineProps>(({
  events,
  isVisible,
  onToggleVisibility
}) => {
  const getActorColor = (actor: TimelineEvent['actor']) => {
    switch (actor) {
      case 'petitioner':
        return 'bg-red-500';
      case 'respondent':
        return 'bg-purple-500';
      case 'court':
        return 'bg-blue-500';
      default:
        return 'bg-green-500';
    }
  };

  const getActorBadgeClasses = (actor: TimelineEvent['actor']) => {
    switch (actor) {
      case 'petitioner':
        return 'border-red-300 text-red-700';
      case 'respondent':
        return 'border-purple-300 text-purple-700';
      case 'court':
        return 'border-blue-300 text-blue-700';
      default:
        return 'border-green-300 text-green-700';
    }
  };

  const getImpactBadgeClasses = (impact: TimelineEvent['impact']) => {
    switch (impact) {
      case 'critical':
        return 'border-red-300 text-red-700';
      case 'high':
        return 'border-orange-300 text-orange-700';
      default:
        return 'border-yellow-300 text-yellow-700';
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-slate-900 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          Critical Timeline
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleVisibility}
            className="ml-auto"
          >
            {isVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isVisible && (
          <div className="space-y-4">
            {events.map((event, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full ${getActorColor(event.actor)} ring-2 ring-offset-2 ring-offset-background`} />
                  {index < events.length - 1 && (
                    <div className="w-px h-8 bg-slate-300 mt-1" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-slate-800">{event.event}</h3>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={`text-xs ${getActorBadgeClasses(event.actor)}`}>
                        {event.actor}
                      </Badge>
                      <Badge variant="outline" className={`text-xs ${getImpactBadgeClasses(event.impact)}`}>
                        {event.impact}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600">{event.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
});

CriticalTimeline.displayName = 'CriticalTimeline';
