import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../hooks/useAuth';
import { NotificationProvider } from '../components/NotificationProvider';

describe('App', () => {
  it('renders correctly', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    );
    expect(screen.getByTestId('app')).toBeInTheDocument();
  });
});