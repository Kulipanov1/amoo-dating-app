import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

interface PushNotification {
  title: string;
  body: string;
  data?: Record<string, any>;
}

export class PushService {
  constructor() {
    this.configurePushNotifications();
  }

  private async configurePushNotifications() {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#8A2BE2'
      });
    }

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
      })
    });
  }

  async registerForPushNotifications(userId: string): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        console.log('Push notifications are not available on simulator');
        return null;
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return null;
      }

      const token = (await Notifications.getExpoPushTokenAsync()).data;
      
      // Сохраняем токен в Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        pushTokens: arrayUnion(token)
      });

      return token;
    } catch (error) {
      console.error('Error registering for push notifications:', error);
      return null;
    }
  }

  async unregisterFromPushNotifications(userId: string, token: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        pushTokens: arrayRemove(token)
      });
    } catch (error) {
      console.error('Error unregistering from push notifications:', error);
      throw error;
    }
  }

  async sendLocalNotification(notification: PushNotification): Promise<void> {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: notification.title,
          body: notification.body,
          data: notification.data || {},
          sound: true,
          badge: 1
        },
        trigger: null
      });
    } catch (error) {
      console.error('Error sending local notification:', error);
      throw error;
    }
  }

  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
    } catch (error) {
      console.error('Error setting badge count:', error);
      throw error;
    }
  }

  addNotificationListener(callback: (notification: Notifications.Notification) => void): void {
    Notifications.addNotificationReceivedListener(callback);
  }

  addNotificationResponseListener(callback: (response: Notifications.NotificationResponse) => void): void {
    Notifications.addNotificationResponseReceivedListener(callback);
  }
} 