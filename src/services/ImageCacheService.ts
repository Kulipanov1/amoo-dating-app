import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface ImageCacheDB extends DBSchema {
  images: {
    key: string;
    value: {
      url: string;
      blob: Blob;
      timestamp: number;
    };
  };
}

class ImageCacheService {
  private static instance: ImageCacheService;
  private db: IDBPDatabase<ImageCacheDB> | null = null;
  private readonly CACHE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7 дней
  private readonly MAX_CACHE_SIZE = 100 * 1024 * 1024; // 100MB

  private constructor() {
    this.initDB();
  }

  public static getInstance(): ImageCacheService {
    if (!ImageCacheService.instance) {
      ImageCacheService.instance = new ImageCacheService();
    }
    return ImageCacheService.instance;
  }

  private async initDB() {
    this.db = await openDB<ImageCacheDB>('image-cache', 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('images')) {
          db.createObjectStore('images');
        }
      },
    });
  }

  private async getCacheSize(): Promise<number> {
    if (!this.db) return 0;
    
    const tx = this.db.transaction('images', 'readonly');
    const store = tx.objectStore('images');
    let size = 0;

    await store.iterateCursor((cursor) => {
      if (cursor) {
        size += cursor.value.blob.size;
        cursor.continue();
      }
    });

    return size;
  }

  private async cleanupCache(): Promise<void> {
    if (!this.db) return;

    const tx = this.db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    const now = Date.now();

    // Удаляем устаревшие записи
    await store.iterateCursor((cursor) => {
      if (cursor) {
        if (now - cursor.value.timestamp > this.CACHE_EXPIRY) {
          cursor.delete();
        }
        cursor.continue();
      }
    });

    // Если размер кэша все еще превышает лимит, удаляем старые записи
    let currentSize = await this.getCacheSize();
    if (currentSize > this.MAX_CACHE_SIZE) {
      const tx = this.db.transaction('images', 'readwrite');
      const store = tx.objectStore('images');
      const index = store.index('timestamp');

      await index.iterateCursor((cursor) => {
        if (cursor && currentSize > this.MAX_CACHE_SIZE) {
          currentSize -= cursor.value.blob.size;
          cursor.delete();
          cursor.continue();
        }
      });
    }
  }

  public async getImage(url: string): Promise<string> {
    if (!this.db) {
      await this.initDB();
    }

    try {
      // Проверяем кэш
      const cached = await this.db?.get('images', url);
      if (cached && Date.now() - cached.timestamp < this.CACHE_EXPIRY) {
        return URL.createObjectURL(cached.blob);
      }

      // Загружаем изображение
      const response = await fetch(url);
      const blob = await response.blob();

      // Сохраняем в кэш
      await this.db?.put('images', {
        url,
        blob,
        timestamp: Date.now(),
      });

      // Очищаем кэш при необходимости
      await this.cleanupCache();

      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error caching image:', error);
      return url; // В случае ошибки возвращаем оригинальный URL
    }
  }

  public async clearCache(): Promise<void> {
    if (!this.db) return;

    const tx = this.db.transaction('images', 'readwrite');
    const store = tx.objectStore('images');
    await store.clear();
  }
}

export default ImageCacheService; 