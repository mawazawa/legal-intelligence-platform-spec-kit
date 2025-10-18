import { HeatmapData, ViewMode } from './types';
import {
  STRENGTH_COLORS,
  CATEGORY_COLORS,
  TIMELINE_COLORS,
  VERIFIED_COLORS,
} from './constants';

export const getStrengthColor = (strength: string): string => {
  return STRENGTH_COLORS[strength as keyof typeof STRENGTH_COLORS] ?? STRENGTH_COLORS.default;
};

export const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] ?? CATEGORY_COLORS.default;
};

export const getTimelineColor = (date: string): string => {
  const daysSince = Math.floor(
    (Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSince < 7) return TIMELINE_COLORS.recent;
  if (daysSince < 30) return TIMELINE_COLORS.week;
  if (daysSince < 90) return TIMELINE_COLORS.month;
  return TIMELINE_COLORS.old;
};

export const getVerifiedColor = (verified: boolean): string => {
  return verified ? VERIFIED_COLORS.verified : VERIFIED_COLORS.unverified;
};

export const getCellColor = (data: HeatmapData, viewMode: ViewMode): string => {
  switch (viewMode) {
    case 'strength':
      return getStrengthColor(data.strength);
    case 'category':
      return getCategoryColor(data.category);
    case 'timeline':
      return getTimelineColor(data.date);
    case 'verified':
      return getVerifiedColor(data.verified);
    default:
      return getStrengthColor(data.strength);
  }
};

export const getCellIntensity = (data: HeatmapData, viewMode: ViewMode): number => {
  switch (viewMode) {
    case 'strength':
      return data.value / 4;
    case 'category':
      return 1;
    case 'timeline':
      return 1;
    case 'verified':
      return data.verified ? 1 : 0.5;
    default:
      return data.value / 4;
  }
};
