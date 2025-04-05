import { storage, db } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import * as ImageManipulator from 'expo-image-manipulator';

interface VerificationRequest {
  userId: string;
  type: 'PHOTO' | 'DOCUMENT';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  submittedAt: Date;
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

export class VerificationService {
  private async optimizeImage(uri: string): Promise<string> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1200, height: 1200 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return result.uri;
    } catch (error) {
      console.error('Image optimization error:', error);
      throw error;
    }
  }

  async submitVerificationPhoto(userId: string, photoUri: string): Promise<void> {
    try {
      // Оптимизация изображения
      const optimizedUri = await this.optimizeImage(photoUri);
      
      // Загрузка фото в Storage
      const photoRef = ref(storage, `verification/${userId}/photo_${Date.now()}.jpg`);
      const response = await fetch(optimizedUri);
      const blob = await response.blob();
      await uploadBytes(photoRef, blob);
      
      // Получение URL загруженного фото
      const photoURL = await getDownloadURL(photoRef);
      
      // Создание запроса на верификацию
      const verificationRequest: VerificationRequest = {
        userId,
        type: 'PHOTO',
        status: 'PENDING',
        submittedAt: new Date()
      };
      
      // Обновление документа пользователя
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'verificationStatus': 'PENDING',
        'verificationPhoto': photoURL,
        'verificationRequests': arrayUnion(verificationRequest)
      });
    } catch (error) {
      console.error('Photo verification submission error:', error);
      throw error;
    }
  }

  async submitVerificationDocument(userId: string, documentUri: string, documentType: string): Promise<void> {
    try {
      // Оптимизация изображения документа
      const optimizedUri = await this.optimizeImage(documentUri);
      
      // Загрузка документа в Storage
      const docRef = ref(storage, `verification/${userId}/document_${documentType}_${Date.now()}.jpg`);
      const response = await fetch(optimizedUri);
      const blob = await response.blob();
      await uploadBytes(docRef, blob);
      
      // Получение URL загруженного документа
      const documentURL = await getDownloadURL(docRef);
      
      // Создание запроса на верификацию
      const verificationRequest: VerificationRequest = {
        userId,
        type: 'DOCUMENT',
        status: 'PENDING',
        submittedAt: new Date()
      };
      
      // Обновление документа пользователя
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'verificationStatus': 'PENDING',
        [`verificationDocuments.${documentType}`]: documentURL,
        'verificationRequests': arrayUnion(verificationRequest)
      });
    } catch (error) {
      console.error('Document verification submission error:', error);
      throw error;
    }
  }

  async checkVerificationStatus(userId: string): Promise<string> {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await userRef.get();
      const userData = userDoc.data();
      
      return userData?.verificationStatus || 'NONE';
    } catch (error) {
      console.error('Verification status check error:', error);
      throw error;
    }
  }

  async cancelVerification(userId: string): Promise<void> {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        'verificationStatus': 'NONE',
        'verificationPhoto': null,
        'verificationDocuments': {}
      });
    } catch (error) {
      console.error('Verification cancellation error:', error);
      throw error;
    }
  }
} 