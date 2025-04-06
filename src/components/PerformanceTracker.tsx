import React, { useEffect } from 'react';
import AnalyticsService from '../services/AnalyticsService';
import type { Metric } from 'web-vitals';

const PerformanceTracker: React.FC = () => {
  useEffect(() => {
    const analytics = AnalyticsService.getInstance();

    // Отслеживание метрик производительности
    const trackPerformanceMetrics = () => {
      if (typeof window !== 'undefined' && 'performance' in window && window.performance.timing) {
        try {
          const timing = window.performance.timing;
          if (timing.domContentLoadedEventEnd && timing.navigationStart) {
            const metrics = {
              'First Contentful Paint': timing.domContentLoadedEventEnd - timing.navigationStart,
              'DOM Load Time': timing.domComplete - timing.domLoading,
              'Page Load Time': timing.loadEventEnd - timing.navigationStart,
            };

            Object.entries(metrics).forEach(([name, value]) => {
              if (typeof value === 'number' && !isNaN(value)) {
                analytics.trackPerformance(name, value);
              }
            });
          }
        } catch (error) {
          console.warn('Failed to track performance metrics:', error);
        }
      }
    };

    // Отслеживание метрик Core Web Vitals
    const trackCoreWebVitals = () => {
      if (typeof window !== 'undefined' && 'web-vitals' in window) {
        try {
          import('web-vitals').then(({ getCLS, getFID, getLCP, getFCP, getTTFB }) => {
            const trackMetric = (metric: Metric) => {
              analytics.trackPerformance(metric.name, metric.value);
            };

            getCLS(trackMetric);
            getFID(trackMetric);
            getLCP(trackMetric);
            getFCP(trackMetric);
            getTTFB(trackMetric);
          });
        } catch (error) {
          console.warn('Failed to track Core Web Vitals:', error);
        }
      }
    };

    // Отслеживание использования памяти
    const trackMemoryUsage = () => {
      if (typeof window !== 'undefined' && 'performance' in window && 'memory' in performance) {
        try {
          const memory = (performance as any).memory;
          if (memory && typeof memory.usedJSHeapSize === 'number') {
            analytics.trackPerformance('Memory Usage', memory.usedJSHeapSize);
          }
        } catch (error) {
          console.warn('Failed to track memory usage:', error);
        }
      }
    };

    // Запуск отслеживания только в браузере
    if (typeof window !== 'undefined') {
      trackPerformanceMetrics();
      trackCoreWebVitals();
      trackMemoryUsage();

      // Периодическое обновление метрик
      const interval = setInterval(() => {
        trackMemoryUsage();
      }, 60000); // Каждую минуту

      return () => clearInterval(interval);
    }
  }, []);

  return null;
};

export default PerformanceTracker; 