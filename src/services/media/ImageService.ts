import { storage } from '../../config/firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import * as ImageManipulator from 'expo-image-manipulator';

interface ImageSize {
  width: number;
  height: number;
  suffix: string;
}

interface ImageUploadResult {
  original: string;
  thumbnails: {
    [key: string]: string;
  };
}

export class ImageService {
  private readonly THUMBNAIL_SIZES: ImageSize[] = [
    { width: 100, height: 100, suffix: 'thumb' },
    { width: 400, height: 400, suffix: 'medium' },
    { width: 800, height: 800, suffix: 'large' }
  ];

  private async optimizeImage(uri: string, size: ImageSize): Promise<string> {
    try {
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: size.width, height: size.height } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );
      return result.uri;
    } catch (error) {
      console.error('Image optimization error:', error);
      throw error;
    }
  }

  private async uploadToStorage(uri: string, path: string): Promise<string> {
    try {
      const imageRef = ref(storage, path);
      const response = await fetch(uri);
      const blob = await response.blob();
      await uploadBytes(imageRef, blob);
      return getDownloadURL(imageRef);
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  }

  async uploadProfileImage(userId: string, imageUri: string): Promise<ImageUploadResult> {
    try {
      const timestamp = Date.now();
      const result: ImageUploadResult = {
        original: '',
        thumbnails: {}
      };

      // Загрузка оригинального изображения
      const originalPath = `users/${userId}/profile/original_${timestamp}.jpg`;
      result.original = await this.uploadToStorage(imageUri, originalPath);

      // Создание и загрузка миниатюр
      for (const size of this.THUMBNAIL_SIZES) {
        const optimizedUri = await this.optimizeImage(imageUri, size);
        const thumbnailPath = `users/${userId}/profile/${size.suffix}_${timestamp}.jpg`;
        result.thumbnails[size.suffix] = await this.uploadToStorage(optimizedUri, thumbnailPath);
      }

      return result;
    } catch (error) {
      console.error('Profile image upload error:', error);
      throw error;
    }
  }

  async uploadMessageImage(chatId: string, senderId: string, imageUri: string): Promise<ImageUploadResult> {
    try {
      const timestamp = Date.now();
      const result: ImageUploadResult = {
        original: '',
        thumbnails: {}
      };

      // Загрузка оригинального изображения
      const originalPath = `chats/${chatId}/images/original_${timestamp}_${senderId}.jpg`;
      result.original = await this.uploadToStorage(imageUri, originalPath);

      // Создание и загрузка миниатюр
      for (const size of this.THUMBNAIL_SIZES) {
        const optimizedUri = await this.optimizeImage(imageUri, size);
        const thumbnailPath = `chats/${chatId}/images/${size.suffix}_${timestamp}_${senderId}.jpg`;
        result.thumbnails[size.suffix] = await this.uploadToStorage(optimizedUri, thumbnailPath);
      }

      return result;
    } catch (error) {
      console.error('Message image upload error:', error);
      throw error;
    }
  }

  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const imageRef = ref(storage, imageUrl);
      await deleteObject(imageRef);
    } catch (error) {
      console.error('Image deletion error:', error);
      throw error;
    }
  }

  async deleteProfileImages(userId: string): Promise<void> {
    try {
      const profileRef = ref(storage, `users/${userId}/profile`);
      const items = await profileRef.listAll();
      
      await Promise.all([
        ...items.items.map(item => deleteObject(item)),
        ...items.prefixes.map(prefix => this.deleteImage(prefix.fullPath))
      ]);
    } catch (error) {
      console.error('Profile images deletion error:', error);
      throw error;
    }
  }
} 