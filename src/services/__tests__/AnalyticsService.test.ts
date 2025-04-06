import ReactGA from 'react-ga4';
import * as Sentry from '@sentry/react';
import { User } from 'firebase/auth';
import AnalyticsService from '../AnalyticsService';

jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
  event: jest.fn(),
  set: jest.fn()
}));

jest.mock('@sentry/react', () => ({
  init: jest.fn(),
  captureException: jest.fn(),
  setUser: jest.fn(),
  addBreadcrumb: jest.fn()
}));

describe('AnalyticsService', () => {
  let analyticsService: AnalyticsService;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.REACT_APP_GA_MEASUREMENT_ID = 'test-ga-id';
    process.env.REACT_APP_SENTRY_DSN = 'test-sentry-dsn';
    analyticsService = AnalyticsService.getInstance();
  });

  it('инициализирует сервисы аналитики', () => {
    analyticsService.initialize();

    expect(ReactGA.initialize).toHaveBeenCalledWith('test-ga-id');
    expect(Sentry.init).toHaveBeenCalledWith({
      dsn: 'test-sentry-dsn',
      tracesSampleRate: 1.0,
      environment: 'test'
    });
  });

  it('отслеживает просмотр страницы', () => {
    const path = '/test';
    analyticsService.trackPageView(path);

    expect(ReactGA.send).toHaveBeenCalledWith({ hitType: 'pageview', page: path });
    expect(Sentry.addBreadcrumb).toHaveBeenCalledWith({
      category: 'navigation',
      message: `Navigated to ${path}`,
      level: 'info'
    });
  });

  it('отслеживает события', () => {
    const category = 'Test Category';
    const action = 'Test Action';
    const options = { label: 'Test Label' };

    analyticsService.trackEvent(category, action, options);

    expect(ReactGA.event).toHaveBeenCalledWith({
      category,
      action,
      label: options
    });
  });

  it('отслеживает ошибки', () => {
    const error = new Error('Test Error');
    const context = { additionalInfo: 'test' };

    analyticsService.trackError(error, context);

    expect(Sentry.captureException).toHaveBeenCalledWith(error, {
      contexts: {
        app: context
      }
    });
  });

  it('устанавливает информацию о пользователе', () => {
    const user = {
      uid: 'test-uid',
      email: 'test@example.com',
      emailVerified: false,
      isAnonymous: false,
      metadata: {},
      providerData: [],
      refreshToken: '',
      tenantId: null,
      delete: async () => {},
      getIdToken: async () => '',
      getIdTokenResult: async () => ({
        token: '',
        authTime: '',
        issuedAtTime: '',
        expirationTime: '',
        signInProvider: null,
        claims: {},
        signInSecondFactor: null
      }),
      reload: async () => {},
      toJSON: () => ({})
    } as User;

    analyticsService.setUser(user);

    expect(ReactGA.set).toHaveBeenCalledWith({ userId: user.uid });
    expect(Sentry.setUser).toHaveBeenCalledWith({
      id: user.uid,
      email: user.email
    });
  });

  it('отслеживает метрики производительности', () => {
    const name = 'Test Metric';
    const value = 100;

    analyticsService.trackPerformance(name, value);

    expect(ReactGA.event).toHaveBeenCalledWith({
      category: 'Performance',
      action: name,
      value
    });
  });
}); 