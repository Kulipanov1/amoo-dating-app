import React, { useEffect, useState } from 'react';
import { Snackbar, Alert } from '@mui/material';
import NotificationService from '../services/NotificationService';
import { useNotification } from './NotificationProvider';

const NotificationManager: React.FC = () => {
  const [notification, setNotification] = useState<any>(null);
  const { showNotification } = useNotification();
  const notificationService = NotificationService.getInstance();

  useEffect(() => {
    // Запрос разрешения на отправку уведомлений
    const requestPermission = async () => {
      const granted = await notificationService.requestPermission();
      if (granted) {
        showNotification('Уведомления включены', 'success');
      }
    };

    requestPermission();

    // Подписка на получение сообщений
    const unsubscribe = notificationService.onMessage((payload) => {
      setNotification(payload);
      showNotification(payload.notification?.title || 'Новое уведомление', 'info');
    });

    return () => {
      unsubscribe();
    };
  }, [showNotification]);

  const handleClose = () => {
    setNotification(null);
  };

  if (!notification) {
    return null;
  }

  return (
    <Snackbar
      open={!!notification}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={handleClose}
        severity="info"
        variant="filled"
        sx={{ width: '100%' }}
      >
        {notification.notification?.title}
        <br />
        {notification.notification?.body}
      </Alert>
    </Snackbar>
  );
};

export default NotificationManager; 