import { db } from '../../config/firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

interface BlockedUser {
  userId: string;
  reason: string;
  blockedAt: Date;
  blockedBy: string;
  expiresAt?: Date;
}

interface Report {
  reporterId: string;
  targetId: string;
  type: 'SPAM' | 'INAPPROPRIATE' | 'FAKE' | 'HARASSMENT' | 'OTHER';
  description: string;
  evidence?: string[];
  createdAt: Date;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
}

export class SecurityService {
  private readonly ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '';
  private readonly ALGORITHM = 'aes-256-gcm';

  async blockUser(userId: string, targetId: string, reason: string, duration?: number): Promise<void> {
    try {
      const blockData: BlockedUser = {
        userId: targetId,
        reason,
        blockedAt: new Date(),
        blockedBy: userId,
        expiresAt: duration ? new Date(Date.now() + duration) : undefined
      };

      // Обновляем документ пользователя
      const userRef = doc(db, 'users', targetId);
      await updateDoc(userRef, {
        isBlocked: true,
        blockedReason: reason,
        blockedAt: blockData.blockedAt,
        blockedUntil: blockData.expiresAt
      });

      // Добавляем запись в историю блокировок
      const blockHistoryRef = doc(db, 'blockHistory', targetId);
      await updateDoc(blockHistoryRef, {
        blocks: arrayUnion(blockData)
      });
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }

  async unblockUser(targetId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', targetId);
      await updateDoc(userRef, {
        isBlocked: false,
        blockedReason: null,
        blockedAt: null,
        blockedUntil: null
      });
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  }

  async reportUser(reportData: Omit<Report, 'createdAt' | 'status'>): Promise<void> {
    try {
      const report: Report = {
        ...reportData,
        createdAt: new Date(),
        status: 'PENDING'
      };

      // Сохраняем жалобу
      const reportsRef = doc(db, 'reports', `${report.targetId}_${report.reporterId}`);
      await updateDoc(reportsRef, {
        reports: arrayUnion(report)
      });

      // Проверяем количество жалоб на пользователя
      const userReportsRef = doc(db, 'userReports', report.targetId);
      const userReportsDoc = await getDoc(userReportsRef);
      const reports = userReportsDoc.data()?.reports || [];

      // Автоматическая блокировка при большом количестве жалоб
      if (reports.length >= 5) {
        await this.blockUser(
          'SYSTEM',
          report.targetId,
          'Multiple user reports',
          7 * 24 * 60 * 60 * 1000 // 7 дней
        );
      }
    } catch (error) {
      console.error('Error reporting user:', error);
      throw error;
    }
  }

  async encrypt(data: string): Promise<{ encrypted: string; iv: string; authTag: string }> {
    try {
      const iv = randomBytes(16);
      const cipher = createCipheriv(this.ALGORITHM, Buffer.from(this.ENCRYPTION_KEY, 'hex'), iv);
      
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      
      const authTag = cipher.getAuthTag();
      
      return {
        encrypted,
        iv: iv.toString('hex'),
        authTag: authTag.toString('hex')
      };
    } catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  }

  async decrypt(encryptedData: { encrypted: string; iv: string; authTag: string }): Promise<string> {
    try {
      const decipher = createDecipheriv(
        this.ALGORITHM,
        Buffer.from(this.ENCRYPTION_KEY, 'hex'),
        Buffer.from(encryptedData.iv, 'hex')
      );
      
      decipher.setAuthTag(Buffer.from(encryptedData.authTag, 'hex'));
      
      let decrypted = decipher.update(encryptedData.encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  }

  validatePassword(password: string): boolean {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  }

  sanitizeInput(input: string): string {
    return input
      .replace(/[<>]/g, '') // Удаляем HTML теги
      .replace(/['"]/g, '') // Удаляем кавычки
      .trim(); // Удаляем пробелы в начале и конце
  }
} 