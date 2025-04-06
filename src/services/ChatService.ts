import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Match } from './MatchService';

export type MessageType = 'text' | 'image' | 'video' | 'audio' | 'location';

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  type: MessageType;
  content: string;
  timestamp: Date;
  read: boolean;
  readAt?: Date;
  mediaUrl?: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
  };
  replyTo?: string; // ID сообщения, на которое отвечают
}

export interface Chat {
  id: string;
  matchId: string;
  participants: string[];
  lastMessage?: {
    content: string;
    type: MessageType;
    timestamp: Date;
    senderId: string;
  };
  unreadCount: { [userId: string]: number };
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

class ChatService {
  private static instance: ChatService;
  private readonly chatsCollection = 'chats';
  private readonly messagesCollection = 'messages';

  private constructor() {}

  public static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  // Создание чата для мэтча
  async createChat(matchId: string, participants: string[]): Promise<Chat> {
    const chatRef = firestore().collection(this.chatsCollection).doc();
    const now = new Date();

    const chat: Chat = {
      id: chatRef.id,
      matchId,
      participants,
      unreadCount: participants.reduce((acc, userId) => ({ ...acc, [userId]: 0 }), {}),
      createdAt: now,
      updatedAt: now,
      isActive: true,
    };

    await chatRef.set(chat);
    return chat;
  }

  // Отправка текстового сообщения
  async sendTextMessage(chatId: string, senderId: string, content: string, replyTo?: string): Promise<Message> {
    const messageRef = firestore().collection(this.messagesCollection).doc();
    const now = new Date();

    const message: Message = {
      id: messageRef.id,
      chatId,
      senderId,
      type: 'text',
      content,
      timestamp: now,
      read: false,
      replyTo,
    };

    await messageRef.set(message);
    await this.updateChatLastMessage(chatId, message, senderId);

    return message;
  }

  // Отправка медиа-сообщения (изображение, видео, аудио)
  async sendMediaMessage(
    chatId: string,
    senderId: string,
    type: 'image' | 'video' | 'audio',
    uri: string,
    caption?: string
  ): Promise<Message> {
    // Загружаем медиафайл
    const filename = `chats/${chatId}/${Date.now()}_${type}`;
    const reference = storage().ref(filename);
    await reference.putFile(uri);
    const mediaUrl = await reference.getDownloadURL();

    const messageRef = firestore().collection(this.messagesCollection).doc();
    const now = new Date();

    const message: Message = {
      id: messageRef.id,
      chatId,
      senderId,
      type,
      content: caption || '',
      mediaUrl,
      timestamp: now,
      read: false,
    };

    await messageRef.set(message);
    await this.updateChatLastMessage(chatId, message, senderId);

    return message;
  }

  // Отправка локации
  async sendLocation(
    chatId: string,
    senderId: string,
    latitude: number,
    longitude: number,
    address?: string
  ): Promise<Message> {
    const messageRef = firestore().collection(this.messagesCollection).doc();
    const now = new Date();

    const message: Message = {
      id: messageRef.id,
      chatId,
      senderId,
      type: 'location',
      content: address || 'Поделился местоположением',
      location: { latitude, longitude, address },
      timestamp: now,
      read: false,
    };

    await messageRef.set(message);
    await this.updateChatLastMessage(chatId, message, senderId);

    return message;
  }

  // Получение сообщений чата
  async getMessages(chatId: string, limit: number = 50, startAfter?: Date): Promise<Message[]> {
    let query = firestore()
      .collection(this.messagesCollection)
      .where('chatId', '==', chatId)
      .orderBy('timestamp', 'desc')
      .limit(limit);

    if (startAfter) {
      query = query.startAfter(startAfter);
    }

    const snapshot = await query.get();
    return snapshot.docs.map(doc => doc.data() as Message);
  }

  // Отметить сообщения как прочитанные
  async markMessagesAsRead(chatId: string, userId: string): Promise<void> {
    const batch = firestore().batch();
    
    // Получаем непрочитанные сообщения
    const messages = await firestore()
      .collection(this.messagesCollection)
      .where('chatId', '==', chatId)
      .where('read', '==', false)
      .where('senderId', '!=', userId)
      .get();

    // Отмечаем каждое сообщение как прочитанное
    messages.docs.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        readAt: new Date(),
      });
    });

    // Обновляем счетчик непрочитанных в чате
    const chatRef = firestore().collection(this.chatsCollection).doc(chatId);
    batch.update(chatRef, {
      [`unreadCount.${userId}`]: 0,
    });

    await batch.commit();
  }

  // Получение чата по ID
  async getChat(chatId: string): Promise<Chat | null> {
    const doc = await firestore()
      .collection(this.chatsCollection)
      .doc(chatId)
      .get();

    return doc.exists ? (doc.data() as Chat) : null;
  }

  // Получение чата по ID мэтча
  async getChatByMatchId(matchId: string): Promise<Chat | null> {
    const chats = await firestore()
      .collection(this.chatsCollection)
      .where('matchId', '==', matchId)
      .limit(1)
      .get();

    return !chats.empty ? (chats.docs[0].data() as Chat) : null;
  }

  // Получение всех чатов пользователя
  async getUserChats(userId: string): Promise<Chat[]> {
    const chats = await firestore()
      .collection(this.chatsCollection)
      .where('participants', 'array-contains', userId)
      .where('isActive', '==', true)
      .orderBy('updatedAt', 'desc')
      .get();

    return chats.docs.map(doc => doc.data() as Chat);
  }

  // Подписка на новые сообщения в чате
  onNewMessages(chatId: string, callback: (message: Message) => void): () => void {
    return firestore()
      .collection(this.messagesCollection)
      .where('chatId', '==', chatId)
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          if (change.type === 'added') {
            callback(change.doc.data() as Message);
          }
        });
      });
  }

  // Подписка на обновления чата
  onChatUpdated(chatId: string, callback: (chat: Chat) => void): () => void {
    return firestore()
      .collection(this.chatsCollection)
      .doc(chatId)
      .onSnapshot(doc => {
        if (doc.exists) {
          callback(doc.data() as Chat);
        }
      });
  }

  // Обновление последнего сообщения в чате
  private async updateChatLastMessage(chatId: string, message: Message, senderId: string): Promise<void> {
    const chatRef = firestore().collection(this.chatsCollection).doc(chatId);
    const chat = await chatRef.get();
    
    if (!chat.exists) return;

    const chatData = chat.data() as Chat;
    const updates: any = {
      lastMessage: {
        content: message.content,
        type: message.type,
        timestamp: message.timestamp,
        senderId: message.senderId,
      },
      updatedAt: message.timestamp,
    };

    // Увеличиваем счетчик непрочитанных сообщений для всех участников, кроме отправителя
    chatData.participants.forEach(participantId => {
      if (participantId !== senderId) {
        updates[`unreadCount.${participantId}`] = firestore.FieldValue.increment(1);
      }
    });

    await chatRef.update(updates);
  }
}

export default ChatService.getInstance(); 