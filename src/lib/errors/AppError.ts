/**
 * Application Error Handling System
 * Provides structured error types, logging, and recovery strategies
 */

/**
 * Severity levels for error categorization
 */
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * Error categories for different failure scenarios
 */
export enum ErrorCategory {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  DATABASE = 'DATABASE_ERROR',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE_ERROR',
  FILE_UPLOAD = 'FILE_UPLOAD_ERROR',
  UNKNOWN = 'UNKNOWN_ERROR',
}

/**
 * Custom application error class
 * Extends native Error with additional context and categorization
 */
export class AppError extends Error {
  public readonly category: ErrorCategory;
  public readonly severity: ErrorSeverity;
  public readonly statusCode: number;
  public readonly context?: Record<string, unknown>;
  public readonly timestamp: Date;
  public readonly requestId?: string;

  constructor(
    message: string,
    options: {
      category?: ErrorCategory;
      severity?: ErrorSeverity;
      statusCode?: number;
      context?: Record<string, unknown>;
      requestId?: string;
      cause?: Error;
    } = {}
  ) {
    super(message);
    this.name = 'AppError';
    this.category = options.category || ErrorCategory.UNKNOWN;
    this.severity = options.severity || ErrorSeverity.MEDIUM;
    this.statusCode = options.statusCode || 500;
    this.context = options.context;
    this.timestamp = new Date();
    this.requestId = options.requestId;

    if (options.cause) {
      this.cause = options.cause;
    }

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);
  }

  /**
   * Convert error to JSON for logging/serialization
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      category: this.category,
      severity: this.severity,
      statusCode: this.statusCode,
      context: this.context,
      timestamp: this.timestamp.toISOString(),
      requestId: this.requestId,
      stack: this.stack,
    };
  }
}

/**
 * Type guard to check if error is AppError
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Convert any error to AppError for consistent handling
 */
export function toAppError(error: unknown, context?: Record<string, unknown>): AppError {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof Error) {
    return new AppError(error.message, {
      category: ErrorCategory.UNKNOWN,
      severity: ErrorSeverity.HIGH,
      context,
      cause: error,
    });
  }

  return new AppError(String(error), {
    category: ErrorCategory.UNKNOWN,
    severity: ErrorSeverity.HIGH,
    context: { originalError: error, ...context },
  });
}
