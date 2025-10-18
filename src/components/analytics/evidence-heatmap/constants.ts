export const STRENGTH_VALUES = {
  airtight: 4,
  strong: 3,
  moderate: 2,
  weak: 1,
  default: 0,
} as const;

export const STRENGTH_COLORS = {
  airtight: '#059669', // emerald-600
  strong: '#0d9488', // teal-600
  moderate: '#0891b2', // cyan-600
  weak: '#0284c7', // sky-600
  default: '#6b7280', // gray-500
} as const;

export const CATEGORY_COLORS = {
  petitioner: '#dc2626', // red-600
  respondent: '#059669', // emerald-600
  neutral: '#6b7280', // gray-500
  legal: '#7c3aed', // violet-600
  financial: '#d97706', // amber-600
  timeline: '#0891b2', // cyan-600
  default: '#6b7280',
} as const;

export const TIMELINE_COLORS = {
  recent: '#059669', // emerald-600 (< 7 days)
  week: '#0d9488', // teal-600 (< 30 days)
  month: '#0891b2', // cyan-600 (< 90 days)
  old: '#0284c7', // sky-600 (>= 90 days)
} as const;

export const VERIFIED_COLORS = {
  verified: '#059669', // emerald-600
  unverified: '#dc2626', // red-600
} as const;

export const STRENGTH_OPTIONS = [
  { value: 'all', label: 'All Strengths' },
  { value: 'airtight', label: 'Airtight' },
  { value: 'strong', label: 'Strong' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'weak', label: 'Weak' },
] as const;

export const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All Categories' },
  { value: 'petitioner', label: 'Petitioner' },
  { value: 'respondent', label: 'Respondent' },
  { value: 'neutral', label: 'Neutral' },
  { value: 'legal', label: 'Legal' },
  { value: 'financial', label: 'Financial' },
  { value: 'timeline', label: 'Timeline' },
] as const;
