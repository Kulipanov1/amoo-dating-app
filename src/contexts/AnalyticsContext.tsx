import React, { createContext, useContext, ReactNode } from 'react';
import AnalyticsService from '../services/AnalyticsService';

interface AnalyticsContextType {
  trackMetric: (name: string, value: number) => void;
}

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined);

export const AnalyticsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const analytics = AnalyticsService.getInstance();

  const trackMetric = (name: string, value: number) => {
    analytics.trackPerformance(name, value);
  };

  return (
    <AnalyticsContext.Provider value={{ trackMetric }}>
      {children}
    </AnalyticsContext.Provider>
  );
};

export { AnalyticsContext }; 