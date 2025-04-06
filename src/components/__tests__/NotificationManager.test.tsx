import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import { NotificationProvider } from '../NotificationProvider';
import NotificationManager from '../NotificationManager';
import NotificationService from '../../services/NotificationService';

// Мок для NotificationService
jest.mock('../../services/NotificationService', () => ({
  getInstance: jest.fn(() => ({
    requestPermission: jest.fn().mockResolvedValue(true),
    onMessage: jest.fn().mockReturnValue(() => {}),
  })),
}));

describe('NotificationManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('запрашивает разрешение на отправку уведомлений при монтировании', async () => {
    render(
      <NotificationProvider>
        <NotificationManager />
      </NotificationProvider>
    );

    const notificationService = NotificationService.getInstance();
    await waitFor(() => {
      expect(notificationService.requestPermission).toHaveBeenCalled();
    });
  });

  it('подписывается на уведомления при монтировании', () => {
    render(
      <NotificationProvider>
        <NotificationManager />
      </NotificationProvider>
    );

    const notificationService = NotificationService.getInstance();
    expect(notificationService.onMessage).toHaveBeenCalled();
  });

  it('отображает уведомление при получении сообщения', async () => {
    let messageCallback: (payload: any) => void;
    const mockOnMessage = jest.fn((callback) => {
      messageCallback = callback;
      return () => {};
    });

    (NotificationService.getInstance as jest.Mock).mockReturnValue({
      requestPermission: jest.fn().mockResolvedValue(true),
      onMessage: mockOnMessage,
    });

    render(
      <NotificationProvider>
        <NotificationManager />
      </NotificationProvider>
    );

    // Симулируем получение уведомления
    act(() => {
      messageCallback({
        notification: {
          title: 'Тестовое уведомление',
          body: 'Текст уведомления',
        },
      });
    });

    // Проверяем, что уведомление отображается
    await waitFor(() => {
      expect(screen.getByText('Тестовое уведомление')).toBeInTheDocument();
      expect(screen.getByText('Текст уведомления')).toBeInTheDocument();
    });
  });
}); 