import React, { useEffect } from 'react';
import { useNotification } from './NotificationProvider';
import NotificationService from '../services/NotificationService';

const NotificationManager: React.FC = () => {
  const { showNotification } = useNotification();
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    notificationService.requestPermission();

    const unsubscribe = notificationService.onMessage((payload) => {
      if (payload.notification) {
        showNotification(
          payload.notification.title,
          payload.notification.body || '',
          'info'
        );
      }
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [showNotification]);

  return null;
};

export default NotificationManager; 