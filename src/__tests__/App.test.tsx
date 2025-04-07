import { render, screen } from '@testing-library/react';
import { AuthProvider } from '../contexts/AuthContext';
import { NotificationProvider } from '../components/NotificationProvider';
import { AnalyticsProvider } from '../contexts/AnalyticsContext';
import App from '../App';

// Мок для Firebase
jest.mock('../config/firebase', () => ({
  auth: {
    onAuthStateChanged: jest.fn((callback) => {
      callback(null);
      return jest.fn();
    }),
    signInWithEmailAndPassword: jest.fn(),
    createUserWithEmailAndPassword: jest.fn(),
    signOut: jest.fn(),
    sendPasswordResetEmail: jest.fn()
  },
  db: {
    collection: jest.fn(),
    doc: jest.fn(),
    getDoc: jest.fn(),
    setDoc: jest.fn(),
    updateDoc: jest.fn(),
    deleteDoc: jest.fn()
  },
  storage: {
    ref: jest.fn(),
    uploadBytes: jest.fn(),
    getDownloadURL: jest.fn()
  },
  messaging: {
    getToken: jest.fn(),
    onMessage: jest.fn()
  }
}));

// Мок для Google Analytics
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  send: jest.fn(),
  pageview: jest.fn()
}));

// Мок для переменных окружения
jest.mock('../config/env', () => ({
  REACT_APP_GA_MEASUREMENT_ID: 'test-ga-id',
  REACT_APP_SENTRY_DSN: 'test-sentry-dsn',
  REACT_APP_FIREBASE_API_KEY: 'test-api-key',
  REACT_APP_FIREBASE_AUTH_DOMAIN: 'test-auth-domain',
  REACT_APP_FIREBASE_PROJECT_ID: 'test-project-id',
  REACT_APP_FIREBASE_STORAGE_BUCKET: 'test-storage-bucket',
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID: 'test-messaging-sender-id',
  REACT_APP_FIREBASE_APP_ID: 'test-app-id'
}));

describe('App', () => {
  it('renders without crashing', async () => {
    render(
      <AnalyticsProvider>
        <NotificationProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </NotificationProvider>
      </AnalyticsProvider>
    );

    expect(screen.getByTestId('app')).toBeInTheDocument();
  });
});