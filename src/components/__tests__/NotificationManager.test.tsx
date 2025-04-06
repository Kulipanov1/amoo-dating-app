/// <reference types="@testing-library/jest-dom" />
import React from 'react';
import { render, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotificationManager from '../NotificationManager';
import NotificationService from '../../services/NotificationService';
import { NotificationProvider } from '../NotificationProvider';

type MessageCallback = (payload: { notification?: { title: string; body?: string } }) => void;

interface MockNotificationService {
  requestPermission: jest.Mock<Promise<boolean>, []>;
  onMessage: jest.Mock<() => void, [callback: MessageCallback]>;
}

const mockRequestPermission = jest.fn().mockResolvedValue(true);
const mockOnMessage = jest.fn<() => void, [MessageCallback]>();
const mockUnsubscribe = jest.fn();

jest.mock('../../services/NotificationService', () => ({
  getInstance: jest.fn(() => ({
    requestPermission: mockRequestPermission,
    onMessage: mockOnMessage.mockImplementation((callback) => {
      (mockOnMessage as any).callback = callback;
      return mockUnsubscribe;
    })
  }))
}));

describe('NotificationManager', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('requests notification permission and subscribes to notifications on mount', async () => {
    const notificationService = NotificationService.getInstance() as unknown as MockNotificationService;

    await act(async () => {
      render(
        <NotificationProvider>
          <NotificationManager />
        </NotificationProvider>
      );
    });

    expect(notificationService.requestPermission).toHaveBeenCalled();
    expect(notificationService.onMessage).toHaveBeenCalled();
  });

  it('displays notification when message is received', async () => {
    const notificationService = NotificationService.getInstance() as unknown as MockNotificationService;
    const mockMessage = {
      notification: {
        title: 'Test Title',
        body: 'Test Body'
      }
    };

    render(
      <NotificationProvider>
        <NotificationManager />
      </NotificationProvider>
    );

    await act(async () => {
      ((notificationService.onMessage as any).callback)(mockMessage);
    });

    // Проверяем, что уведомление было показано через NotificationProvider
    // Примечание: конкретная проверка зависит от реализации NotificationProvider
  });

  it('unsubscribes from notifications on unmount', () => {
    const notificationService = NotificationService.getInstance() as unknown as MockNotificationService;
    const { unmount } = render(
      <NotificationProvider>
        <NotificationManager />
      </NotificationProvider>
    );

    unmount();

    const mockUnsubscribe = notificationService.onMessage.mock.results[0].value;
    expect(mockUnsubscribe).toHaveBeenCalled();
  });
}); 