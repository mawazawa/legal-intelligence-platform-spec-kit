/**
 * Currency Formatting Utilities
 * Centralized location for all currency formatting functions
 * Eliminates duplicate implementations across the codebase
 */

export interface CurrencyFormatOptions {
  currency?: string;
  locale?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  showCurrencySymbol?: boolean;
}

/**
 * Format a number as currency
 *
 * @param value - The numeric value to format
 * @param options - Optional formatting configuration
 * @returns Formatted currency string (e.g., "$1,234.56")
 *
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1234.56, { currency: 'EUR' }) // "€1,234.56"
 * formatCurrency(undefined) // "$0.00"
 */
export function formatCurrency(
  value?: number | null,
  options: CurrencyFormatOptions = {}
): string {
  const {
    currency = 'USD',
    locale = 'en-US',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    showCurrencySymbol = true,
  } = options;

  // Handle null/undefined values
  if (value === null || value === undefined) {
    return showCurrencySymbol ? '$0.00' : '0.00';
  }

  // Handle NaN
  if (isNaN(value)) {
    return showCurrencySymbol ? '$0.00' : '0.00';
  }

  // Format using Intl.NumberFormat
  return new Intl.NumberFormat(locale, {
    style: showCurrencySymbol ? 'currency' : 'decimal',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}

/**
 * Format currency for US dollars specifically
 * Convenience function for the most common use case
 *
 * @param value - The numeric value to format
 * @returns Formatted USD string (e.g., "$1,234.56")
 */
export function formatUSD(value?: number | null): string {
  return formatCurrency(value, { currency: 'USD' });
}

/**
 * Format currency without symbol (for calculations display)
 *
 * @param value - The numeric value to format
 * @returns Formatted number string (e.g., "1,234.56")
 */
export function formatCurrencyWithoutSymbol(value?: number | null): string {
  return formatCurrency(value, { showCurrencySymbol: false });
}

/**
 * Parse a currency string back to a number
 * Handles various formats: "$1,234.56", "1234.56", "1,234", etc.
 *
 * @param value - The currency string to parse
 * @returns Numeric value or 0 if parsing fails
 *
 * @example
 * parseCurrency("$1,234.56") // 1234.56
 * parseCurrency("1,234") // 1234
 * parseCurrency("invalid") // 0
 */
export function parseCurrency(value: string): number {
  if (!value || typeof value !== 'string') {
    return 0;
  }

  // Remove currency symbols, commas, and whitespace
  const cleaned = value.replace(/[$,\s€£¥]/g, '');

  // Parse as float
  const parsed = parseFloat(cleaned);

  // Return 0 if parsing failed
  return isNaN(parsed) ? 0 : parsed;
}

/**
 * Format a currency value with abbreviated suffixes (K, M, B)
 * Useful for displaying large numbers in compact spaces
 *
 * @param value - The numeric value to format
 * @param options - Optional formatting configuration
 * @returns Abbreviated currency string (e.g., "$1.2M")
 *
 * @example
 * formatCurrencyAbbreviated(1500000) // "$1.5M"
 * formatCurrencyAbbreviated(50000) // "$50K"
 * formatCurrencyAbbreviated(500) // "$500"
 */
export function formatCurrencyAbbreviated(
  value?: number | null,
  options: CurrencyFormatOptions = {}
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '$0';
  }

  const { showCurrencySymbol = true } = options;
  const symbol = showCurrencySymbol ? '$' : '';

  const absValue = Math.abs(value);

  if (absValue >= 1_000_000_000) {
    return `${symbol}${(value / 1_000_000_000).toFixed(1)}B`;
  }

  if (absValue >= 1_000_000) {
    return `${symbol}${(value / 1_000_000).toFixed(1)}M`;
  }

  if (absValue >= 1_000) {
    return `${symbol}${(value / 1_000).toFixed(1)}K`;
  }

  return `${symbol}${value.toFixed(0)}`;
}

/**
 * Format a percentage value
 *
 * @param value - The percentage value (0-100 or 0-1 depending on isDecimal)
 * @param isDecimal - Whether the input is decimal (0-1) or percentage (0-100)
 * @param decimals - Number of decimal places to show
 * @returns Formatted percentage string (e.g., "12.5%")
 *
 * @example
 * formatPercentage(12.5) // "12.5%"
 * formatPercentage(0.125, true) // "12.5%"
 */
export function formatPercentage(
  value?: number | null,
  isDecimal: boolean = false,
  decimals: number = 1
): string {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }

  const percentValue = isDecimal ? value * 100 : value;
  return `${percentValue.toFixed(decimals)}%`;
}
