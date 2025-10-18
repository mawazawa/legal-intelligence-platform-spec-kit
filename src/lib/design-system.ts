/**
 * Design System - Single Source of Truth
 * Apple HIG-inspired design tokens for consistent UI
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Re-export cn utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Elevation (Shadow) System
 * Use these instead of custom shadow classes
 */
export const elevation = {
  none: '',
  sm: 'shadow-sm', // Subtle lift (cards, inputs)
  md: 'shadow-md', // Medium elevation (dropdowns)
  lg: 'shadow-lg', // High elevation (modals, popovers)
  xl: 'shadow-xl', // Highest (drawers, full-screen overlays)
} as const;

/**
 * Typography Scale
 * San Francisco-inspired typography system
 */
export const typography = {
  // Display text (hero sections)
  display: {
    large: 'text-5xl font-bold tracking-tight',
    medium: 'text-4xl font-bold tracking-tight',
    small: 'text-3xl font-bold tracking-tight',
  },
  // Headings
  heading: {
    h1: 'text-2xl font-semibold tracking-tight',
    h2: 'text-xl font-semibold',
    h3: 'text-lg font-medium',
    h4: 'text-base font-medium',
  },
  // Body text
  body: {
    large: 'text-base',
    medium: 'text-sm',
    small: 'text-xs',
  },
  // Labels and metadata
  label: {
    large: 'text-sm font-medium',
    medium: 'text-xs font-medium',
    small: 'text-xs font-semibold uppercase tracking-wide',
  },
  // Captions and helper text
  caption: {
    large: 'text-sm text-slate-600',
    medium: 'text-xs text-slate-600',
    small: 'text-xs text-slate-500',
  },
  // Legal documents (Times New Roman)
  legal: {
    heading: 'font-serif text-lg font-bold',
    body: 'font-serif text-base leading-relaxed',
    citation: 'font-serif text-sm italic',
  },
} as const;

/**
 * Color System
 * Semantic color tokens
 */
export const colors = {
  // Text colors
  text: {
    primary: 'text-slate-900',
    secondary: 'text-slate-600',
    tertiary: 'text-slate-500',
    inverse: 'text-white',
  },
  // Background colors
  bg: {
    primary: 'bg-white',
    secondary: 'bg-slate-50',
    tertiary: 'bg-slate-100',
    inverse: 'bg-slate-900',
  },
  // Status colors
  status: {
    success: 'text-green-600 bg-green-50',
    warning: 'text-orange-600 bg-orange-50',
    error: 'text-red-600 bg-red-50',
    info: 'text-blue-600 bg-blue-50',
  },
  // Interactive colors
  interactive: {
    primary: 'text-blue-600 hover:text-blue-700',
    secondary: 'text-slate-600 hover:text-slate-900',
  },
} as const;

/**
 * Spacing Scale (4px base)
 * Use Tailwind's spacing, but documented here for reference
 */
export const spacing = {
  // 0: 0px
  // 1: 4px
  // 2: 8px
  // 3: 12px
  // 4: 16px
  // 6: 24px
  // 8: 32px
  // 12: 48px
  // 16: 64px
  // 20: 80px
  // 24: 96px
} as const;

/**
 * Border Radius
 */
export const radius = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
} as const;

/**
 * Transitions
 * Consistent animation timing
 */
export const transition = {
  fast: 'transition-all duration-150 ease-in-out',
  medium: 'transition-all duration-200 ease-in-out',
  slow: 'transition-all duration-300 ease-in-out',
} as const;

/**
 * Z-Index Scale
 * Maintain stacking order
 */
export const zIndex = {
  base: 'z-0',
  dropdown: 'z-10',
  sticky: 'z-20',
  modal: 'z-30',
  overlay: 'z-40',
  toast: 'z-50',
} as const;

/**
 * Helper: Combine typography + color
 */
export function tx(...classes: string[]) {
  return cn(...classes);
}

// Text color shortcuts (deprecated - use colors.text instead)
export const textColors = {
  primary: colors.text.primary,
  secondary: colors.text.secondary,
  tertiary: colors.text.tertiary,
};
