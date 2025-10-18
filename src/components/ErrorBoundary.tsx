/**
 * Error Boundary Component
 * Catches React component errors and displays fallback UI
 */

'use client';

import React, { ReactNode, ReactElement } from 'react';
import { logger } from '@/lib/logging/logger';
import { AlertTriangle, RefreshCw } from 'lucide-react';

/**
 * Error boundary props
 */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactElement;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * Error boundary state
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error Boundary component for catching React errors
 *
 * @example
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, reset) => (
 *     <div>
 *       <p>Something went wrong: {error.message}</p>
 *       <button onClick={reset}>Try again</button>
 *     </div>
 *   )}
 * >
 *   <YourComponent />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    logger.error('React Error Boundary caught an error', error, {
      componentStack: errorInfo.componentStack,
    });

    this.props.onError?.(error, errorInfo);
  }

  reset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center w-12 h-12 mx-auto bg-red-100 rounded-full">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>

            <h1 className="mt-4 text-lg font-bold text-center text-slate-900">
              Oops! Something went wrong
            </h1>

            <p className="mt-2 text-sm text-center text-slate-600">
              {this.state.error.message || 'An unexpected error occurred'}
            </p>

            {process.env.NODE_ENV === 'development' && (
              <details className="mt-4 p-3 bg-slate-100 rounded text-xs text-slate-700 overflow-auto max-h-40">
                <summary className="font-semibold cursor-pointer">
                  Error Details
                </summary>
                <pre className="mt-2 whitespace-pre-wrap break-words">
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <button
              onClick={this.reset}
              className="mt-6 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * Hook version of Error Boundary (for functional components)
 * Note: Class component is required for error boundaries in React
 */
export function useErrorHandler(error: Error | null): void {
  React.useEffect(() => {
    if (error) {
      logger.error('Error handler caught an error', error);
      throw error;
    }
  }, [error]);
}
