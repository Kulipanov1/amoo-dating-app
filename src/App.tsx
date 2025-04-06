import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import ErrorBoundary from './components/ErrorBoundary';
import { NotificationProvider } from './components/NotificationProvider';
import { AuthProvider } from './contexts/AuthContext';
import LoadingOverlay from './components/LoadingOverlay';
import PerformanceTracker from './components/PerformanceTracker';
import NotificationManager from './components/NotificationManager';
import theme from './theme';
import AppRoutes from './routes';
import AnalyticsService from './services/AnalyticsService';

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
    <BrowserRouter>
      <ErrorBoundary>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <NotificationProvider>
            <AuthProvider>
              <div data-testid="app">
                <NavigationTracker />
                <PerformanceTracker />
                <NotificationManager />
                <Suspense fallback={<LoadingOverlay open={true} message="Загрузка приложения..." />}>
                  <AppRoutes />
                </Suspense>
              </div>
            </AuthProvider>
          </NotificationProvider>
        </ThemeProvider>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default App; 