import AnalyticsService from '../AnalyticsService';
import ReactGA from 'react-ga4';
import * as Sentry from '@sentry/react';

// Моки для внешних зависимостей
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
  event: jest.fn(),
}));

jest.mock('@sentry/react', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  setUser: jest.fn(),
}));

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    jest.clearAllMocks();
    analyticsService = AnalyticsService.getInstance();
  });

  it('инициализирует сервисы аналитики', () => {
    analyticsService.initialize();

    expect(ReactGA.initialize).toHaveBeenCalledWith(
      process.env.REACT_APP_GA_MEASUREMENT_ID
    );
    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: process.env.REACT_APP_SENTRY_DSN,
      environment: process.env.REACT_APP_APP_ENV,
    });
  });

  it('отслеживает просмотр страницы', () => {
    const path = '/test-page';
    analyticsService.trackPageView(path);

    expect(ReactGA.send).toHaveBeenCalledWith({
      hitType: 'pageview',
      page: path,
    });
  });

  it('отслеживает события', () => {
    const category = 'Test Category';
    const action = 'Test Action';
    const label = 'Test Label';

    analyticsService.trackEvent(category, action, { label });

    expect(ReactGA.event).toHaveBeenCalledWith({
      category,
      action,
      label,
    });
  });

  it('отслеживает ошибки', () => {
    const error = new Error('Test Error');
    const context = { additionalInfo: 'test' };

    analyticsService.trackError(error, context);

    expect(Sentry.captureException).toHaveBeenCalledWith(error, {
      extra: context,
    });
  });

  it('устанавливает информацию о пользователе', () => {
    const user = {
      id: 'test-id',
      email: 'test@example.com',
    };

    analyticsService.setUser(user);

    expect(Sentry.setUser).toHaveBeenCalledWith(user);
  });

  it('отслеживает метрики производительности', () => {
    const name = 'Test Metric';
    const value = 100;
    const data = { additionalInfo: 'test' };

    analyticsService.trackPerformance(name, value, data);

    expect(ReactGA.event).toHaveBeenCalledWith({
      category: 'Performance',
      action: name,
      value,
      ...data,
    });
  });
}); 