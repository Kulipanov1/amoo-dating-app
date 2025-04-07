import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import { useEffect } from 'react';
import { useAnalytics } from '../hooks/useAnalytics';

export const PerformanceTracker = () => {
  const { trackMetric } = useAnalytics();

  useEffect(() => {
    const reportMetric = (metric: { name: string; value: number }) => {
      trackMetric(metric.name, metric.value);
    };

    getCLS(reportMetric);
    getFID(reportMetric);
    getFCP(reportMetric);
    getLCP(reportMetric);
    getTTFB(reportMetric);
  }, [trackMetric]);

  return null;
}; 