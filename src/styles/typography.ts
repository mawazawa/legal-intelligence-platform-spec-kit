/**
 * Apple-Inspired Typography System
 *
 * Follows Apple's Human Interface Guidelines and design principles:
 * - Clear hierarchy with consistent scale
 * - Optimal readability with line-height and letter-spacing
 * - Responsive font sizes for different viewports
 * - San Francisco Pro Display aesthetic (using system fonts)
 */

export const typography = {
  // Display - For hero sections and major headings
  display: {
    hero: 'text-[72px] md:text-[96px] leading-[0.95] tracking-[-0.04em] font-black',
    large: 'text-[56px] md:text-[72px] leading-[1.0] tracking-[-0.03em] font-black',
    medium: 'text-[48px] md:text-[56px] leading-[1.05] tracking-[-0.02em] font-black',
    small: 'text-[40px] md:text-[48px] leading-[1.1] tracking-[-0.015em] font-bold',
  },

  // Headings - For section titles
  heading: {
    h1: 'text-[40px] leading-[1.1] tracking-[-0.015em] font-bold',
    h2: 'text-[32px] leading-[1.2] tracking-[-0.01em] font-bold',
    h3: 'text-[24px] leading-[1.3] tracking-[-0.005em] font-semibold',
    h4: 'text-[20px] leading-[1.4] tracking-normal font-semibold',
    h5: 'text-[18px] leading-[1.4] tracking-normal font-semibold',
    h6: 'text-[16px] leading-[1.5] tracking-normal font-semibold',
  },

  // Body - For content text
  body: {
    large: 'text-[18px] leading-[1.6] tracking-normal font-normal',
    medium: 'text-[16px] leading-[1.6] tracking-normal font-normal',
    small: 'text-[14px] leading-[1.5] tracking-normal font-normal',
  },

  // Labels - For UI elements
  label: {
    large: 'text-[14px] leading-[1.4] tracking-wide font-semibold uppercase',
    medium: 'text-[12px] leading-[1.4] tracking-wide font-semibold uppercase',
    small: 'text-[10px] leading-[1.3] tracking-wider font-bold uppercase',
  },

  // Caption - For supplementary text
  caption: {
    large: 'text-[14px] leading-[1.5] tracking-normal font-normal',
    medium: 'text-[12px] leading-[1.4] tracking-normal font-normal',
    small: 'text-[10px] leading-[1.3] tracking-wide font-normal',
  },

  // Code - For technical/monospace text
  code: {
    large: 'text-[14px] leading-[1.6] tracking-normal font-mono',
    medium: 'text-[12px] leading-[1.5] tracking-normal font-mono',
    small: 'text-[10px] leading-[1.4] tracking-normal font-mono',
  },

  // Link - For interactive text
  link: {
    default: 'text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors duration-150',
    subtle: 'text-slate-600 hover:text-blue-600 hover:underline underline-offset-2 transition-colors duration-150',
    bold: 'text-blue-600 hover:text-blue-700 font-semibold underline underline-offset-2 transition-colors duration-150',
  },
} as const;

/**
 * Font Stack - System fonts for optimal performance
 * Mimics San Francisco Pro Display on Apple devices
 */
export const fontStack = {
  sans: 'ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
  mono: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
  display: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", Helvetica, Arial, sans-serif',
};

/**
 * Text Colors - Semantic color system
 */
export const textColors = {
  primary: 'text-slate-900',
  secondary: 'text-slate-600',
  tertiary: 'text-slate-500',
  disabled: 'text-slate-400',
  inverse: 'text-white',
  error: 'text-red-600',
  warning: 'text-orange-600',
  success: 'text-green-600',
  info: 'text-blue-600',
};

/**
 * Responsive Typography Utilities
 */
export const responsive = {
  // Mobile-first responsive text
  mobile: 'text-base md:text-lg',
  tablet: 'text-lg md:text-xl',
  desktop: 'text-xl md:text-2xl',

  // Truncation utilities
  truncate: 'truncate',
  lineClamp: {
    1: 'line-clamp-1',
    2: 'line-clamp-2',
    3: 'line-clamp-3',
    4: 'line-clamp-4',
  },
};

/**
 * Helper function to combine typography classes
 */
export function tx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Usage Example:
 *
 * import { typography, tx } from '@/styles/typography';
 *
 * <h1 className={typography.display.hero}>
 *   Welcome to Legal Intelligence
 * </h1>
 *
 * <p className={tx(typography.body.large, textColors.secondary)}>
 *   Your comprehensive case management platform
 * </p>
 */
