import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { ThemeProvider } from '@mui/material/styles';
import theme from '../theme';

// Мок переменных окружения
process.env.REACT_APP_GA_MEASUREMENT_ID = 'test-ga-id';
process.env.REACT_APP_SENTRY_DSN = 'test-sentry-dsn';
process.env.REACT_APP_VERSION = '1.0.0';

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

describe('App', () => {
  it('renders without crashing', () => {
    render(
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    );

    expect(screen.getByTestId('app')).toBeInTheDocument();
  });
});