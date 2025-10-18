/**
 * Accessibility Utilities
 * Provides helpers for WCAG 2.1 AA compliance
 */

/**
 * ARIA labels for interactive elements
 */
export const ariaLabels = {
  closeButton: 'Close dialog',
  expandButton: 'Expand section',
  collapseButton: 'Collapse section',
  menu: 'Menu',
  menuButton: 'Open menu',
  searchButton: 'Search',
  deleteButton: 'Delete',
  editButton: 'Edit',
  copyButton: 'Copy to clipboard',
  downloadButton: 'Download file',
  uploadButton: 'Upload file',
} as const;

/**
 * ARIA descriptions for complex components
 */
export const ariaDescribedBy = (id: string) => `${id}-description`;

/**
 * Generate unique ID for accessibility
 */
export function generateA11yId(prefix: string, suffix?: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return `${prefix}-${suffix || random}-${timestamp}`;
}

/**
 * Accessible announcement helper
 * Announce changes to screen readers
 */
export class LiveRegion {
  private region: HTMLElement | null = null;

  constructor(id: string = 'live-region', polite: boolean = true) {
    if (typeof document === 'undefined') return;

    // Remove existing region if it exists
    const existing = document.getElementById(id);
    if (existing) {
      existing.remove();
    }

    // Create new region
    this.region = document.createElement('div');
    this.region.id = id;
    this.region.setAttribute('role', 'status');
    this.region.setAttribute('aria-live', polite ? 'polite' : 'assertive');
    this.region.setAttribute('aria-atomic', 'true');
    this.region.className = 'sr-only'; // Screen reader only

    document.body.appendChild(this.region);
  }

  /**
   * Announce message to screen readers
   */
  announce(message: string): void {
    if (this.region) {
      this.region.textContent = message;
    }
  }

  /**
   * Clear announcement
   */
  clear(): void {
    if (this.region) {
      this.region.textContent = '';
    }
  }

  /**
   * Destroy live region
   */
  destroy(): void {
    if (this.region) {
      this.region.remove();
      this.region = null;
    }
  }
}

/**
 * Check if element is keyboard accessible
 */
export function isKeyboardAccessible(element: HTMLElement): boolean {
  const focusableElements = [
    'BUTTON',
    'A',
    'INPUT',
    'SELECT',
    'TEXTAREA',
    '[tabindex]:not([tabindex="-1"])',
  ];

  const isFocusable = focusableElements.some(selector => {
    if (element.tagName === selector) return true;
    if (element.matches(selector)) return true;
    return false;
  });

  const isDisabled = (element as any).disabled || element.getAttribute('aria-disabled') === 'true';

  return isFocusable && !isDisabled;
}

/**
 * Keyboard event helpers
 */
export const keyboardHelpers = {
  /**
   * Check if Enter key was pressed
   */
  isEnter: (event: React.KeyboardEvent) => event.key === 'Enter',

  /**
   * Check if Space key was pressed
   */
  isSpace: (event: React.KeyboardEvent) => event.key === ' ',

  /**
   * Check if Escape key was pressed
   */
  isEscape: (event: React.KeyboardEvent) => event.key === 'Escape',

  /**
   * Check if Arrow Up was pressed
   */
  isArrowUp: (event: React.KeyboardEvent) => event.key === 'ArrowUp',

  /**
   * Check if Arrow Down was pressed
   */
  isArrowDown: (event: React.KeyboardEvent) => event.key === 'ArrowDown',

  /**
   * Check if Tab key was pressed
   */
  isTab: (event: React.KeyboardEvent) => event.key === 'Tab',

  /**
   * Prevent default if key matches
   */
  preventIfKey: (event: React.KeyboardEvent, key: string) => {
    if (event.key === key) {
      event.preventDefault();
    }
  },
};

/**
 * Color contrast checker
 */
export function getContrastRatio(foreground: string, background: string): number {
  const fgColor = parseColor(foreground);
  const bgColor = parseColor(background);

  if (!fgColor || !bgColor) return 0;

  const fgLuminance = getRelativeLuminance(fgColor);
  const bgLuminance = getRelativeLuminance(bgColor);

  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG AA standard
 */
export function meetsWCAG_AA(contrastRatio: number, largeText: boolean = false): boolean {
  // AA: 4.5:1 for normal text, 3:1 for large text
  return largeText ? contrastRatio >= 3 : contrastRatio >= 4.5;
}

/**
 * Check if contrast ratio meets WCAG AAA standard
 */
export function meetsWCAG_AAA(contrastRatio: number, largeText: boolean = false): boolean {
  // AAA: 7:1 for normal text, 4.5:1 for large text
  return largeText ? contrastRatio >= 4.5 : contrastRatio >= 7;
}

/**
 * Parse color string to RGB
 */
function parseColor(color: string): [number, number, number] | null {
  const div = document.createElement('div');
  div.style.color = color;
  document.body.appendChild(div);

  const computed = window.getComputedStyle(div).color;
  document.body.removeChild(div);

  const match = computed.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!match) return null;

  return [parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10)];
}

/**
 * Calculate relative luminance
 */
function getRelativeLuminance([r, g, b]: [number, number, number]): number {
  const [rs, gs, bs] = [r, g, b].map(val => {
    const v = val / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Accessibility announcer hook for React
 */
export function useA11yAnnouncer() {
  const [region] = React.useState(() => new LiveRegion());

  React.useEffect(() => {
    return () => {
      region.destroy();
    };
  }, [region]);

  return {
    announce: (message: string) => region.announce(message),
    clear: () => region.clear(),
  };
}

// Import for hook
import * as React from 'react';
