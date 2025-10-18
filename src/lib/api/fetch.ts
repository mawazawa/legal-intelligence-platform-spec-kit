/**
 * Safe Fetch Wrapper
 * Provides type-safe, error-handled fetch with automatic retries and logging
 */

import { logger } from '../logging/logger';
import { AppError, ErrorCategory, ErrorSeverity, toAppError } from '../errors/AppError';

/**
 * Fetch options with retry and timeout support
 */
export interface SafeFetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  retryDelay?: number;
  expectJson?: boolean;
}

/**
 * Fetch response wrapper with type safety
 */
export interface FetchResponse<T = unknown> {
  data: T | null;
  error: AppError | null;
  status: number;
  ok: boolean;
}

/**
 * Default fetch configuration
 */
const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRIES = 2;
const DEFAULT_RETRY_DELAY = 1000;

/**
 * Safe fetch wrapper with automatic error handling
 *
 * @template T - Response data type
 * @param url - URL to fetch
 * @param options - Fetch options with retry/timeout support
 * @returns Promise<FetchResponse<T>>
 *
 * @example
 * ```typescript
 * const { data, error } = await safeFetch<UserData>('/api/user', {
 *   expectJson: true,
 *   timeout: 5000,
 *   retries: 3,
 * });
 *
 * if (error) {
 *   logger.error('Failed to fetch user', error);
 *   return;
 * }
 *
 * console.log(data); // UserData or null
 * ```
 */
export async function safeFetch<T = unknown>(
  url: string,
  options: SafeFetchOptions = {}
): Promise<FetchResponse<T>> {
  const {
    timeout = DEFAULT_TIMEOUT,
    retries = DEFAULT_RETRIES,
    retryDelay = DEFAULT_RETRY_DELAY,
    expectJson = true,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;
  const startTime = performance.now();

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(url, {
        ...fetchOptions,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const duration = performance.now() - startTime;

      // Log successful requests in development
      logger.debug(`Fetch: ${response.status} ${url}`, {
        method: fetchOptions.method || 'GET',
        duration: `${duration.toFixed(2)}ms`,
        attempt: attempt + 1,
      });

      // Handle non-OK responses
      if (!response.ok) {
        let errorData: unknown = null;

        try {
          if (expectJson) {
            errorData = await response.json();
          }
        } catch {
          // Ignore JSON parse errors
        }

        const error = new AppError(
          `HTTP ${response.status}: ${response.statusText}`,
          {
            category: getErrorCategory(response.status),
            severity: getErrorSeverity(response.status),
            statusCode: response.status,
            context: {
              url,
              method: fetchOptions.method || 'GET',
              errorData,
            },
          }
        );

        return {
          data: null,
          error,
          status: response.status,
          ok: false,
        };
      }

      // Parse response
      const data = expectJson ? await response.json() : await response.text();

      return {
        data: data as T,
        error: null,
        status: response.status,
        ok: true,
      };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Don't retry on abort
      if (lastError.name === 'AbortError') {
        break;
      }

      // Retry with exponential backoff
      if (attempt < retries) {
        const delay = retryDelay * Math.pow(2, attempt);
        logger.warn(`Fetch attempt ${attempt + 1} failed, retrying in ${delay}ms`, {
          url,
          error: lastError.message,
        });
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }

  // All retries exhausted
  const duration = performance.now() - startTime;
  const error = toAppError(lastError, {
    url,
    method: fetchOptions.method || 'GET',
    retries,
    duration: `${duration.toFixed(2)}ms`,
  });

  logger.error(`Fetch failed after ${retries + 1} attempts: ${url}`, lastError as Error, {
    url,
    duration: `${duration.toFixed(2)}ms`,
  });

  return {
    data: null,
    error,
    status: 0,
    ok: false,
  };
}

/**
 * Get error category from HTTP status code
 */
function getErrorCategory(status: number): ErrorCategory {
  if (status === 400) return ErrorCategory.VALIDATION;
  if (status === 401) return ErrorCategory.AUTHENTICATION;
  if (status === 403) return ErrorCategory.AUTHORIZATION;
  if (status === 404) return ErrorCategory.NOT_FOUND;
  if (status === 409) return ErrorCategory.CONFLICT;
  if (status === 429) return ErrorCategory.RATE_LIMIT;
  if (status >= 500) return ErrorCategory.EXTERNAL_SERVICE;
  return ErrorCategory.UNKNOWN;
}

/**
 * Get error severity from HTTP status code
 */
function getErrorSeverity(status: number): ErrorSeverity {
  if (status >= 500) return ErrorSeverity.HIGH;
  if (status === 429) return ErrorSeverity.MEDIUM;
  if (status >= 400) return ErrorSeverity.LOW;
  return ErrorSeverity.MEDIUM;
}

/**
 * Batch fetch multiple URLs in parallel with concurrency control
 *
 * @example
 * ```typescript
 * const results = await batchFetch(['/api/data1', '/api/data2'], { concurrency: 3 });
 * ```
 */
export async function batchFetch<T = unknown>(
  urls: string[],
  options: SafeFetchOptions & { concurrency?: number } = {}
): Promise<FetchResponse<T>[]> {
  const { concurrency = 5, ...fetchOptions } = options;
  const results: FetchResponse<T>[] = [];
  const inProgress = new Set<Promise<unknown>>();

  for (const url of urls) {
    const promise = (async () => {
      const result = await safeFetch<T>(url, fetchOptions);
      results.push(result);
      inProgress.delete(promise);
    })();

    inProgress.add(promise);

    if (inProgress.size >= concurrency) {
      await Promise.race(inProgress);
    }
  }

  await Promise.all(inProgress);
  return results;
}
