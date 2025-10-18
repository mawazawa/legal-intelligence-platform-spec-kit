/**
 * Structured Logging System
 * Provides consistent logging across the application
 * Replaces console statements with context-aware logging
 */

import { ErrorSeverity } from '../errors/AppError';

/**
 * Log levels for filtering and display
 */
export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

/**
 * Structured log entry
 */
export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    message: string;
    stack?: string;
    name?: string;
  };
  requestId?: string;
  userId?: string;
  duration?: number;
}

/**
 * Logger configuration
 */
export interface LoggerConfig {
  minLevel: LogLevel;
  environment: 'development' | 'production' | 'test';
  enableConsole: boolean;
  onLog?: (entry: LogEntry) => void | Promise<void>;
}

/**
 * Structured logger implementation
 */
class Logger {
  private config: LoggerConfig;
  private requestId?: string;
  private userId?: string;

  constructor(config: Partial<LoggerConfig> = {}) {
    this.config = {
      minLevel: LogLevel.DEBUG,
      environment: process.env.NODE_ENV as any || 'development',
      enableConsole: true,
      ...config,
    };
  }

  /**
   * Set request context for correlation
   */
  setRequestContext(requestId: string, userId?: string): void {
    this.requestId = requestId;
    this.userId = userId;
  }

  /**
   * Clear request context
   */
  clearRequestContext(): void {
    this.requestId = undefined;
    this.userId = undefined;
  }

  /**
   * Format log level for display
   */
  private formatLevel(level: LogLevel): string {
    const colors = {
      DEBUG: '\x1b[36m', // cyan
      INFO: '\x1b[32m',  // green
      WARN: '\x1b[33m',  // yellow
      ERROR: '\x1b[31m', // red
    };
    const reset = '\x1b[0m';
    const color = colors[level];
    return `${color}[${level}]${reset}`;
  }

  /**
   * Check if log level should be recorded
   */
  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    const currentIndex = levels.indexOf(this.config.minLevel);
    const logIndex = levels.indexOf(level);
    return logIndex >= currentIndex;
  }

  /**
   * Create log entry
   */
  private createEntry(
    level: LogLevel,
    message: string,
    context?: Record<string, unknown>,
    error?: Error
  ): LogEntry {
    return {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error: error ? {
        message: error.message,
        stack: error.stack,
        name: error.name,
      } : undefined,
      requestId: this.requestId,
      userId: this.userId,
    };
  }

  /**
   * Log entry to console and callback
   * Fire-and-forget async to avoid blocking - errors are caught to prevent unhandled rejections
   */
  private outputEntry(entry: LogEntry): void {
    if (this.config.enableConsole && this.config.environment === 'development') {
      const levelStr = this.formatLevel(entry.level);
      const contextStr = entry.context ? ` ${JSON.stringify(entry.context)}` : '';
      const errorStr = entry.error ? ` Error: ${entry.error.message}` : '';
      console.log(`${levelStr} ${entry.timestamp} ${entry.message}${contextStr}${errorStr}`);

      if (entry.error?.stack && entry.level === LogLevel.ERROR) {
        console.log(entry.error.stack);
      }
    }

    if (this.config.onLog) {
      // Fire-and-forget async callback, catching errors to prevent unhandled rejections
      Promise.resolve(this.config.onLog(entry)).catch((err) => {
        console.error('Logger callback error:', err);
      });
    }
  }

  /**
   * Log debug message
   */
  debug(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.DEBUG)) return;
    const entry = this.createEntry(LogLevel.DEBUG, message, context);
    this.outputEntry(entry);
  }

  /**
   * Log info message
   */
  info(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.INFO)) return;
    const entry = this.createEntry(LogLevel.INFO, message, context);
    this.outputEntry(entry);
  }

  /**
   * Log warning message
   */
  warn(message: string, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.WARN)) return;
    const entry = this.createEntry(LogLevel.WARN, message, context);
    this.outputEntry(entry);
  }

  /**
   * Log error with full context
   */
  error(message: string, error?: Error | unknown, context?: Record<string, unknown>): void {
    if (!this.shouldLog(LogLevel.ERROR)) return;

    const err = error instanceof Error ? error : new Error(String(error));
    const entry = this.createEntry(LogLevel.ERROR, message, context, err);
    this.outputEntry(entry);
  }

  /**
   * Log operation timing
   */
  time(label: string, duration: number, context?: Record<string, unknown>): void {
    const entry: LogEntry = {
      level: LogLevel.INFO,
      message: `${label} completed`,
      timestamp: new Date().toISOString(),
      context,
      duration,
      requestId: this.requestId,
      userId: this.userId,
    };
    this.outputEntry(entry);
  }
}

/**
 * Global logger instance
 */
export const logger = new Logger({
  minLevel: process.env.LOG_LEVEL as LogLevel || LogLevel.INFO,
  environment: process.env.NODE_ENV as any,
  enableConsole: true,
});

export default logger;
