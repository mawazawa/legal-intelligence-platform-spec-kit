/**
 * Data Transformation Utilities
 * Eliminates 'any' types by providing type-safe transformations
 */

/**
 * Safe type casting with runtime validation
 */
export function cast<T>(value: unknown, fallback: T): T {
  return value !== null && value !== undefined ? (value as T) : fallback;
}

/**
 * Transform API response with type safety
 */
export async function transformResponse<T>(
  response: Response,
  transformer: (data: unknown) => T
): Promise<T> {
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  return transformer(data);
}

/**
 * Safe JSON parsing
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Safe JSON stringify
 */
export function safeJsonStringify(value: unknown, fallback: string = '{}'): string {
  try {
    return JSON.stringify(value);
  } catch {
    return fallback;
  }
}

/**
 * Deep clone object
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T;
  }

  if (obj instanceof Object) {
    const clonedObj: Record<string, unknown> = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone((obj as Record<string, unknown>)[key]);
      }
    }
    return clonedObj as T;
  }

  return obj;
}

/**
 * Flatten nested object
 */
export function flattenObject(
  obj: Record<string, unknown>,
  prefix: string = '',
  result: Record<string, unknown> = {}
): Record<string, unknown> {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (value !== null && typeof value === 'object' && !(value instanceof Date)) {
        if (Array.isArray(value)) {
          result[newKey] = value;
        } else {
          flattenObject(value as Record<string, unknown>, newKey, result);
        }
      } else {
        result[newKey] = value;
      }
    }
  }

  return result;
}

/**
 * Pick specific keys from object
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit specific keys from object
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  ...keys: K[]
): Omit<T, K> {
  const keySet = new Set<K>(keys);
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keySet.has(key as K))
  ) as Omit<T, K>;
}

/**
 * Transform array of objects
 */
export function mapObjects<T, R>(
  items: T[],
  mapper: (item: T, index: number) => R
): R[] {
  return items.map(mapper);
}

/**
 * Group array by key
 */
export function groupBy<T>(
  items: T[],
  keyFn: (item: T) => string | number
): Record<string, T[]> {
  const result: Record<string, T[]> = {};

  for (const item of items) {
    const key = String(keyFn(item));
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(item);
  }

  return result;
}

/**
 * Index array by key
 */
export function indexBy<T extends Record<string, unknown>>(
  items: T[],
  keyFn: (item: T) => string | number
): Record<string, T> {
  const result: Record<string, T> = {};

  for (const item of items) {
    const key = String(keyFn(item));
    result[key] = item;
  }

  return result;
}

/**
 * Paginate array
 */
export interface PaginationResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export function paginate<T>(
  items: T[],
  page: number = 1,
  pageSize: number = 10
): PaginationResult<T> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginatedItems = items.slice(start, end);
  const totalPages = Math.ceil(items.length / pageSize);

  return {
    items: paginatedItems,
    page,
    pageSize,
    total: items.length,
    totalPages,
  };
}

/**
 * Format large numbers for display
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * DEPRECATED: Use formatCurrency from @/lib/utils/currency instead
 * @deprecated - Import from centralized utility
 */
export { formatCurrency } from '@/lib/utils/currency';

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 0): string {
  return `${formatNumber(value * 100, decimals)}%`;
}

/**
 * Format date with optional formatting options
 * @param date - Date object or ISO string
 * @param options - Formatting options (default: locale string format)
 */
export function formatDate(
  date: Date | string,
  options?: {
    locale?: string;
    month?: 'long' | 'short' | 'numeric' | '2-digit';
    day?: 'numeric' | '2-digit';
    year?: 'numeric' | '2-digit';
    weekday?: 'long' | 'short' | 'narrow';
  }
): string {
  const dateObj = typeof date === 'string'
    ? new Date(date.includes('T') ? date : date + 'T00:00:00Z')
    : date;

  const locale = options?.locale || 'en-US';
  const formatOptions: Intl.DateTimeFormatOptions = {
    month: options?.month || undefined,
    day: options?.day || undefined,
    year: options?.year || undefined,
    weekday: options?.weekday || undefined,
  };

  // Remove undefined options
  Object.keys(formatOptions).forEach(
    key => formatOptions[key as keyof Intl.DateTimeFormatOptions] === undefined &&
    delete formatOptions[key as keyof Intl.DateTimeFormatOptions]
  );

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - dateObj.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return formatDate(dateObj);
}

/**
 * Retry with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < maxRetries) {
        const delay = baseDelay * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
}
