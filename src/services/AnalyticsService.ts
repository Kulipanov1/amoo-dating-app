import ReactGA from 'react-ga4';
import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';
import { User } from 'firebase/auth';

class AnalyticsService {
  private static instance: AnalyticsService;
  private initialized = false;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public initialize() {
    if (this.initialized) return;

    // Инициализация Google Analytics
    ReactGA.initialize(process.env.REACT_APP_GA_MEASUREMENT_ID || '');

    // Инициализация Sentry
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
      environment: process.env.NODE_ENV,
      release: process.env.REACT_APP_VERSION,
    });

    this.initialized = true;
  }

  public trackPageView(path: string) {
    ReactGA.send({ hitType: 'pageview', page: path });
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Navigated to ${path}`,
      level: 'info',
    });
  }

  public trackEvent(category: string, action: string, label?: string, value?: number) {
    ReactGA.event({
      category,
      action,
      label,
      value,
    });
  }

  public trackError(error: Error, context?: Record<string, any>) {
    Sentry.captureException(error, {
      contexts: {
        app: context,
      },
    });
  }

  public setUser(user: User | null) {
    if (user) {
      ReactGA.set({ userId: user.uid });
      Sentry.setUser({
        id: user.uid,
        email: user.email || undefined,
      });
    } else {
      ReactGA.set({ userId: null });
      Sentry.setUser(null);
    }
  }

  public trackPerformance(metricName: string, value: number) {
    ReactGA.event({
      category: 'Performance',
      action: metricName,
      value: Math.round(value),
    });
  }
}

export default AnalyticsService; 