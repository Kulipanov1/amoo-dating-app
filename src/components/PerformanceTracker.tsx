import React, { useEffect } from 'react';
import AnalyticsService from '../services/AnalyticsService';

const PerformanceTracker: React.FC = () => {
  useEffect(() => {
    const analytics = AnalyticsService.getInstance();

    // Отслеживание метрик производительности
    const trackPerformanceMetrics = () => {
      if ('performance' in window) {
        const timing = window.performance.timing;
        const metrics = {
          'First Contentful Paint': timing.domContentLoadedEventEnd - timing.navigationStart,
          'DOM Load Time': timing.domComplete - timing.domLoading,
          'Page Load Time': timing.loadEventEnd - timing.navigationStart,
        };

        Object.entries(metrics).forEach(([name, value]) => {
          analytics.trackPerformance(name, value);
        });
      }
    };

    // Отслеживание метрик Core Web Vitals
    const trackCoreWebVitals = () => {
      if ('web-vitals' in window) {
        import('web-vitals').then(({ getCLS, getFID, getLCP, getFCP, getTTFB }) => {
          getCLS((metric) => analytics.trackPerformance('CLS', metric.value));
          getFID((metric) => analytics.trackPerformance('FID', metric.value));
          getLCP((metric) => analytics.trackPerformance('LCP', metric.value));
          getFCP((metric) => analytics.trackPerformance('FCP', metric.value));
          getTTFB((metric) => analytics.trackPerformance('TTFB', metric.value));
        });
      }
    };

    // Отслеживание использования памяти
    const trackMemoryUsage = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        analytics.trackPerformance('Memory Usage', memory.usedJSHeapSize);
      }
    };

    // Запуск отслеживания
    trackPerformanceMetrics();
    trackCoreWebVitals();
    trackMemoryUsage();

    // Периодическое обновление метрик
    const interval = setInterval(() => {
      trackMemoryUsage();
    }, 60000); // Каждую минуту

    return () => clearInterval(interval);
  }, []);

  return null;
};

export default PerformanceTracker; 