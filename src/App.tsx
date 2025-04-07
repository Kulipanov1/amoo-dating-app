import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './components/NotificationProvider';
import { AuthProvider } from './contexts/AuthContext';
import LoadingOverlay from './components/LoadingOverlay';
import { PerformanceTracker } from './components/PerformanceTracker';
import NotificationManager from './components/NotificationManager';
import theme from './theme';
import AppRoutes from './routes';
import AnalyticsService from './services/AnalyticsService';
import { AnalyticsProvider } from './contexts/AnalyticsContext';

// Компонент для отслеживания навигации
const NavigationTracker: React.FC = () => {
  const location = useLocation();
  const analytics = AnalyticsService.getInstance();

  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location.pathname]);

  return null;
};

const App: React.FC = () => {
  useEffect(() => {
    // Инициализация аналитики
    const analytics = AnalyticsService.getInstance();
    analytics.initialize();
  }, []);

  return (
    <div data-testid="app">
      <BrowserRouter>
        <ErrorBoundary>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AnalyticsProvider>
              <NotificationProvider>
                <AuthProvider>
                  <NavigationTracker />
                  <PerformanceTracker />
                  <NotificationManager />
                  <Suspense fallback={<LoadingOverlay open={true} message="Загрузка приложения..." />}>
                    <AppRoutes />
                  </Suspense>
                </AuthProvider>
              </NotificationProvider>
            </AnalyticsProvider>
          </ThemeProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </div>
  );
};

export default App; 