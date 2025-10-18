/**
 * useAsync Hook
 * Handles async operations with error handling, loading states, and data caching
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import { logger } from '../logging/logger';
import { AppError, toAppError } from '../errors/AppError';

/**
 * Async operation state
 */
export interface AsyncState<T> {
  status: 'idle' | 'pending' | 'success' | 'error';
  data: T | null;
  error: AppError | null;
  isLoading: boolean;
}

/**
 * Options for useAsync hook
 */
export interface UseAsyncOptions {
  immediate?: boolean;
  onError?: (error: AppError) => void;
  onSuccess?: (data: unknown) => void;
  retries?: number;
}

/**
 * Custom hook for managing async operations
 *
 * @template T - Return type of async function
 * @param asyncFn - Async function to execute
 * @param options - Configuration options
 * @returns Async state and execute function
 *
 * @example
 * ```typescript
 * const { data, error, isLoading, execute } = useAsync(
 *   async () => {
 *     const response = await fetch('/api/data');
 *     return response.json();
 *   },
 *   { immediate: true }
 * );
 *
 * if (isLoading) return <div>Loading...</div>;
 * if (error) return <div>Error: {error.message}</div>;
 * return <div>{JSON.stringify(data)}</div>;
 * ```
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncOptions = {}
): AsyncState<T> & { execute: () => Promise<T | null> } {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
    isLoading: false,
  });

  const isMountedRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Execute async operation
   */
  const execute = useCallback(async (): Promise<T | null> => {
    if (!isMountedRef.current) return null;

    setState({
      status: 'pending',
      data: null,
      error: null,
      isLoading: true,
    });

    try {
      const result = await asyncFn();

      if (!isMountedRef.current) return null;

      setState({
        status: 'success',
        data: result,
        error: null,
        isLoading: false,
      });

      options.onSuccess?.(result);
      return result;
    } catch (err) {
      if (!isMountedRef.current) return null;

      const error = toAppError(err, { operation: asyncFn.name });
      logger.error(`Async operation failed: ${asyncFn.name}`, error);

      setState({
        status: 'error',
        data: null,
        error,
        isLoading: false,
      });

      options.onError?.(error);
      return null;
    }
  }, [asyncFn, options]);

  /**
   * Execute immediately if option is set
   */
  useEffect(() => {
    if (options.immediate) {
      execute();
    }

    return () => {
      isMountedRef.current = false;
      abortControllerRef.current?.abort();
    };
  }, [execute, options.immediate]);

  return {
    ...state,
    execute,
  };
}

/**
 * useAsyncEffect Hook
 * Similar to useEffect but for async operations
 *
 * @example
 * ```typescript
 * useAsyncEffect(async () => {
 *   const data = await fetch('/api/data').then(r => r.json());
 *   setData(data);
 * }, []);
 * ```
 */
export function useAsyncEffect(
  asyncFn: () => Promise<void>,
  deps?: React.DependencyList
): void {
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        await asyncFn();
        if (isMounted) {
          logger.debug('Async effect completed');
        }
      } catch (err) {
        if (isMounted) {
          logger.error('Async effect failed', err as Error);
        }
      }
    })();

    return () => {
      isMounted = false;
    };
  }, deps);
}
