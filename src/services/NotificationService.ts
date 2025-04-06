import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { messaging } from '../config/firebase';
import AnalyticsService from './AnalyticsService';

class NotificationService {
  private static instance: NotificationService;
  private messaging = messaging;
  private analytics = AnalyticsService.getInstance();

  private constructor() {}

  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  public async requestPermission(): Promise<boolean> {
    try {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        await this.getToken();
        return true;
      }
      return false;
    } catch (error) {
      this.analytics.trackError(error as Error, { context: 'NotificationService.requestPermission' });
      return false;
    }
  }

  public async getToken(): Promise<string | null> {
    try {
      const currentToken = await getToken(this.messaging, {
        vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
      });
      
      if (currentToken) {
        this.analytics.trackEvent('Notifications', 'Token received');
        return currentToken;
      }
      
      return null;
    } catch (error) {
      this.analytics.trackError(error as Error, { context: 'NotificationService.getToken' });
      return null;
    }
  }

  public onMessage(callback: (payload: any) => void): () => void {
    return onMessage(this.messaging, (payload) => {
      this.analytics.trackEvent('Notifications', 'Message received');
      callback(payload);
    });
  }

  public async deleteToken(): Promise<boolean> {
    try {
      const currentToken = await this.getToken();
      if (currentToken) {
        await this.messaging.deleteToken();
        this.analytics.trackEvent('Notifications', 'Token deleted');
        return true;
      }
      return false;
    } catch (error) {
      this.analytics.trackError(error as Error, { context: 'NotificationService.deleteToken' });
      return false;
    }
  }
}

export default NotificationService; 