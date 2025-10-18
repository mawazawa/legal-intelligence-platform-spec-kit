import { TimelineEvent } from '../types';

export const timelineEvents: TimelineEvent[] = [
  { date: '2024-06-14', event: 'Petitioner files ex parte to list property', actor: 'petitioner', impact: 'high' },
  { date: '2024-07-12', event: 'Court orders property listing', actor: 'court', impact: 'medium' },
  { date: '2024-08-09', event: 'Petitioner files ex parte for sole possession', actor: 'petitioner', impact: 'high' },
  { date: '2024-10-03', event: 'Court orders Respondent to vacate', actor: 'court', impact: 'high' },
  { date: '2024-11-16', event: 'Petitioner takes possession', actor: 'petitioner', impact: 'critical' },
  { date: '2025-04-16', event: 'Buyer offers $1,150,000', actor: 'buyer', impact: 'medium' },
  { date: '2025-05-30', event: 'Property sold for $1,175,000', actor: 'buyer', impact: 'high' },
  { date: '2025-06-25', event: 'Petitioner files RFO', actor: 'petitioner', impact: 'high' }
];
