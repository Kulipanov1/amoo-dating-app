declare module '@sentry/react' {
  interface SentryInitOptions {
    dsn: string;
    tracesSampleRate?: number;
    environment?: string;
    integrations?: any[];
  }

  interface SentryUser {
    id?: string;
    email?: string;
    [key: string]: any;
  }

  interface SentryBreadcrumb {
    category: string;
    message: string;
    level: string;
  }

  interface SentryContext {
    contexts: {
      app: any;
    };
  }

  export function init(options: SentryInitOptions): void;
  export function captureException(error: Error, context?: SentryContext): void;
  export function setUser(user: SentryUser | null): void;
  export function addBreadcrumb(breadcrumb: SentryBreadcrumb): void;
} 