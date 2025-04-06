import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { UserProfile } from './UserService';
import { Message } from './ChatService';

export interface Report {
  id: string;
  reporterId: string;
  reportedId: string;
  type: 'profile' | 'message';
  reason: string;
  description?: string;
  status: 'pending' | 'resolved' | 'rejected';
  messageId?: string;
  timestamp: Date;
  resolvedAt?: Date;
  moderatorId?: string;
  action?: 'warning' | 'temporary_ban' | 'permanent_ban' | 'none';
}

export interface ContentFilter {
  id: string;
  type: 'text' | 'image';
  pattern: string;
  action: 'block' | 'warn' | 'flag';
  createdAt: Date;
  updatedAt: Date;
}

class ModerationService {
  private static instance: ModerationService;
  private readonly reportsCollection = 'reports';
  private readonly filtersCollection = 'content_filters';
  private readonly bannedUsersCollection = 'banned_users';

  private constructor() {}

  public static getInstance(): ModerationService {
    if (!ModerationService.instance) {
      ModerationService.instance = new ModerationService();
    }
    return ModerationService.instance;
  }

  // Создание жалобы на пользователя
  async reportUser(
    reporterId: string,
    reportedId: string,
    reason: string,
    description?: string
  ): Promise<Report> {
    const reportRef = firestore().collection(this.reportsCollection).doc();
    const report: Report = {
      id: reportRef.id,
      reporterId,
      reportedId,
      type: 'profile',
      reason,
      description,
      status: 'pending',
      timestamp: new Date(),
    };

    await reportRef.set(report);
    return report;
  }

  // Создание жалобы на сообщение
  async reportMessage(
    reporterId: string,
    reportedId: string,
    messageId: string,
    reason: string,
    description?: string
  ): Promise<Report> {
    const reportRef = firestore().collection(this.reportsCollection).doc();
    const report: Report = {
      id: reportRef.id,
      reporterId,
      reportedId,
      type: 'message',
      messageId,
      reason,
      description,
      status: 'pending',
      timestamp: new Date(),
    };

    await reportRef.set(report);
    return report;
  }

  // Проверка текста на запрещенный контент
  async checkText(text: string): Promise<{ isAllowed: boolean; warnings: string[] }> {
    const filters = await firestore()
      .collection(this.filtersCollection)
      .where('type', '==', 'text')
      .get();

    const warnings: string[] = [];
    let isAllowed = true;

    filters.docs.forEach((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => {
      const filter = doc.data() as ContentFilter;
      const regex = new RegExp(filter.pattern, 'i');
      
      if (regex.test(text)) {
        if (filter.action === 'block') {
          isAllowed = false;
        }
        warnings.push(`Обнаружен недопустимый контент: ${filter.pattern}`);
      }
    });

    return { isAllowed, warnings };
  }

  // Проверка изображения (заглушка, требуется интеграция с API анализа изображений)
  async checkImage(imageUrl: string): Promise<{ isAllowed: boolean; warnings: string[] }> {
    // Здесь должна быть интеграция с сервисом анализа изображений
    return { isAllowed: true, warnings: [] };
  }

  // Бан пользователя
  async banUser(
    userId: string,
    moderatorId: string,
    duration?: number, // в часах, если не указано - бан навсегда
    reason?: string
  ): Promise<void> {
    const banRef = firestore().collection(this.bannedUsersCollection).doc(userId);
    await banRef.set({
      userId,
      moderatorId,
      reason,
      bannedAt: new Date(),
      expiresAt: duration ? new Date(Date.now() + duration * 3600000) : null,
      active: true,
    });

    // Обновляем статус пользователя
    await firestore()
      .collection('users')
      .doc(userId)
      .update({
        isBanned: true,
        banExpiresAt: duration ? new Date(Date.now() + duration * 3600000) : null,
      });
  }

  // Проверка бана пользователя
  async checkUserBan(userId: string): Promise<boolean> {
    const banDoc = await firestore()
      .collection(this.bannedUsersCollection)
      .doc(userId)
      .get();

    if (!banDoc.exists) return false;

    const banData = banDoc.data();
    if (!banData?.active) return false;

    if (banData.expiresAt && banData.expiresAt.toDate() < new Date()) {
      // Бан истек, снимаем его
      await this.unbanUser(userId);
      return false;
    }

    return true;
  }

  // Разбан пользователя
  async unbanUser(userId: string): Promise<void> {
    const batch = firestore().batch();

    const banRef = firestore().collection(this.bannedUsersCollection).doc(userId);
    batch.update(banRef, { active: false });

    const userRef = firestore().collection('users').doc(userId);
    batch.update(userRef, {
      isBanned: false,
      banExpiresAt: null,
    });

    await batch.commit();
  }

  // Получение списка жалоб для модерации
  async getPendingReports(limit: number = 50): Promise<Report[]> {
    const snapshot = await firestore()
      .collection(this.reportsCollection)
      .where('status', '==', 'pending')
      .orderBy('timestamp', 'asc')
      .limit(limit)
      .get();

    return snapshot.docs.map((doc: FirebaseFirestoreTypes.QueryDocumentSnapshot) => doc.data() as Report);
  }

  // Обработка жалобы
  async resolveReport(
    reportId: string,
    moderatorId: string,
    action: Report['action']
  ): Promise<void> {
    const reportRef = firestore().collection(this.reportsCollection).doc(reportId);
    const report = await reportRef.get();
    
    if (!report.exists) {
      throw new Error('Report not found');
    }

    const reportData = report.data() as Report;
    const batch = firestore().batch();

    // Обновляем статус жалобы
    batch.update(reportRef, {
      status: 'resolved',
      resolvedAt: new Date(),
      moderatorId,
      action,
    });

    // Применяем действие к пользователю
    if (action === 'temporary_ban') {
      await this.banUser(reportData.reportedId, moderatorId, 24); // Бан на 24 часа
    } else if (action === 'permanent_ban') {
      await this.banUser(reportData.reportedId, moderatorId);
    }

    await batch.commit();
  }
}

export default ModerationService.getInstance(); 