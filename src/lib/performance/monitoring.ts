/**
 * Performance Monitoring System
 * Tracks application performance metrics and Web Vitals
 */

import { logger } from '../logging/logger';

/**
 * Extended performance entry types for Web Vitals
 */
interface LargestContentfulPaintEntry extends PerformanceEntry {
  renderTime: number;
  loadTime: number;
}

interface FirstInputEntry extends PerformanceEntry {
  processingDuration: number;
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  // Timing metrics (ms)
  domContentLoaded: number;
  pageLoad: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
  cumulativeLayoutShift?: number;
  firstInputDelay?: number;

  // Navigation timing
  dns: number;
  tcp: number;
  ttfb: number; // Time to First Byte
  download: number;

  // Resource metrics
  totalResources: number;
  resourceSize: number;
  cachedResources: number;

  // Timestamps
  timestamp: string;
}

/**
 * Performance monitor class
 */
export class PerformanceMonitor {
  private metrics: PerformanceMetrics | null = null;
  private observers: Map<string, PerformanceObserver> = new Map();

  /**
   * Initialize performance monitoring
   */
  initialize(): void {
    if (typeof window === 'undefined' || !window.performance) return;

    this.observeWebVitals();
    this.collectNavigationTiming();
    this.collectResourceTiming();
  }

  /**
   * Observe Web Vitals
   */
  private observeWebVitals(): void {
    // Largest Contentful Paint (LCP)
    if (typeof PerformanceObserver !== 'undefined') {
      try {
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as LargestContentfulPaintEntry;
          const lcp = lastEntry.renderTime || lastEntry.loadTime;

          if (this.metrics) {
            this.metrics.largestContentfulPaint = lcp;
          }

          logger.debug('LCP (Largest Contentful Paint)', {
            value: `${lcp.toFixed(2)}ms`,
            status: this.getVitalsStatus(lcp, 'lcp'),
          });
        });

        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        this.observers.set('lcp', lcpObserver);
      } catch (err) {
        logger.debug('LCP observer not supported');
      }

      // Cumulative Layout Shift (CLS)
      try {
        const clsObserver = new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              const cls = (this.metrics?.cumulativeLayoutShift || 0) + (entry as any).value;
              if (this.metrics) {
                this.metrics.cumulativeLayoutShift = cls;
              }
            }
          }

          logger.debug('CLS (Cumulative Layout Shift)', {
            value: this.metrics?.cumulativeLayoutShift?.toFixed(3),
            status: this.getVitalsStatus(this.metrics?.cumulativeLayoutShift || 0, 'cls'),
          });
        });

        clsObserver.observe({ entryTypes: ['layout-shift'] });
        this.observers.set('cls', clsObserver);
      } catch (err) {
        logger.debug('CLS observer not supported');
      }

      // First Input Delay (FID)
      try {
        const fidObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const firstEntry = entries[0] as FirstInputEntry;

          if (this.metrics) {
            this.metrics.firstInputDelay = firstEntry.processingDuration;
          }

          logger.debug('FID (First Input Delay)', {
            value: `${firstEntry.processingDuration.toFixed(2)}ms`,
            status: this.getVitalsStatus(firstEntry.processingDuration, 'fid'),
          });
        });

        fidObserver.observe({ entryTypes: ['first-input'] });
        this.observers.set('fid', fidObserver);
      } catch (err) {
        logger.debug('FID observer not supported');
      }
    }
  }

  /**
   * Collect navigation timing
   */
  private collectNavigationTiming(): void {
    if (!window.performance || !window.performance.timing) return;

    const timing = window.performance.timing;

    this.metrics = {
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      pageLoad: timing.loadEventEnd - timing.navigationStart,
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      ttfb: timing.responseStart - timing.navigationStart,
      download: timing.responseEnd - timing.responseStart,
      totalResources: 0,
      resourceSize: 0,
      cachedResources: 0,
      timestamp: new Date().toISOString(),
    };

    logger.info('Page Load Metrics', {
      dom: `${this.metrics.domContentLoaded}ms`,
      page: `${this.metrics.pageLoad}ms`,
      ttfb: `${this.metrics.ttfb}ms`,
    });
  }

  /**
   * Collect resource timing
   */
  private collectResourceTiming(): void {
    if (!window.performance || !window.performance.getEntriesByType) return;

    const resources = window.performance.getEntriesByType('resource');
    let totalSize = 0;
    let cachedCount = 0;

    for (const resource of resources) {
      const timing = resource as PerformanceResourceTiming;
      if (timing.transferSize) {
        totalSize += timing.transferSize;
      } else {
        cachedCount++;
      }
    }

    if (this.metrics) {
      this.metrics.totalResources = resources.length;
      this.metrics.resourceSize = totalSize;
      this.metrics.cachedResources = cachedCount;

      logger.debug('Resource Timing', {
        total: resources.length,
        size: `${(totalSize / 1024).toFixed(2)}KB`,
        cached: cachedCount,
      });
    }
  }

  /**
   * Get Web Vitals status
   */
  private getVitalsStatus(value: number, metric: string): string {
    switch (metric) {
      case 'lcp':
        return value <= 2500 ? 'good' : value <= 4000 ? 'needs improvement' : 'poor';
      case 'cls':
        return value <= 0.1 ? 'good' : value <= 0.25 ? 'needs improvement' : 'poor';
      case 'fid':
        return value <= 100 ? 'good' : value <= 300 ? 'needs improvement' : 'poor';
      default:
        return 'unknown';
    }
  }

  /**
   * Get collected metrics
   */
  getMetrics(): PerformanceMetrics | null {
    return this.metrics;
  }

  /**
   * Measure custom operation
   */
  measureOperation<T>(name: string, fn: () => T): T {
    const start = performance.now();
    try {
      const result = fn();
      const duration = performance.now() - start;
      logger.debug(`Operation: ${name}`, { duration: `${duration.toFixed(2)}ms` });
      return result;
    } catch (err) {
      const duration = performance.now() - start;
      logger.error(`Operation failed: ${name}`, err as Error, {
        duration: `${duration.toFixed(2)}ms`,
      });
      throw err;
    }
  }

  /**
   * Measure async operation
   */
  async measureAsyncOperation<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = performance.now();
    try {
      const result = await fn();
      const duration = performance.now() - start;
      logger.debug(`Async Operation: ${name}`, { duration: `${duration.toFixed(2)}ms` });
      return result;
    } catch (err) {
      const duration = performance.now() - start;
      logger.error(`Async operation failed: ${name}`, err as Error, {
        duration: `${duration.toFixed(2)}ms`,
      });
      throw err;
    }
  }

  /**
   * Destroy observers
   */
  destroy(): void {
    for (const [, observer] of this.observers) {
      observer.disconnect();
    }
    this.observers.clear();
  }
}

/**
 * Global performance monitor instance
 */
export const performanceMonitor = new PerformanceMonitor();

/**
 * Initialize on page load
 */
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceMonitor.initialize();
    });
  } else {
    performanceMonitor.initialize();
  }
}
