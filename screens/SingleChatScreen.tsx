import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as ImagePicker from 'expo-image-picker';
import { Camera as ExpoCamera } from 'expo-camera';
import Video from 'react-native-video';
import { hapticFeedback } from '../utils/haptics';
import { RouteProp } from '@react-navigation/native';
import VideoMessage from '../components/VideoMessage';
import AudioMessage from '../components/AudioMessage';
import VideoRecorder from '../components/VideoRecorder';
import TypingIndicator from '../components/TypingIndicator';
import { SingleChatScreenProps } from '../src/types/navigation';

interface RouteParams {
  chatId: string;
  user: ChatUser;
}

type SingleChatScreenRouteProp = RouteProp<{ SingleChat: RouteParams }, 'SingleChat'>;

interface Props {
  route: SingleChatScreenRouteProp;
}

interface Message {
  id: string;
  text?: string;
  image?: string;
  video?: string;
  audio?: string;
  videoDuration?: number;
  audioDuration?: number;
  timestamp: string;
  senderId: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'video' | 'audio' | 'videoNote';
  replyTo?: Message;
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
  isTyping?: boolean;
}

const SingleChatScreen: React.FC<SingleChatScreenProps> = ({ route }) => {
  const { chatId, user } = route.params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [isVideoMode, setIsVideoMode] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [otherUserIsTyping, setOtherUserIsTyping] = useState(false);

  const flatListRef = useRef<FlatList>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cameraRef = useRef<ExpoCamera | null>(null);

  useEffect(() => {
    // Загрузка истории сообщений
    loadMessages();
    // Подписка на новые сообщения
    subscribeToMessages();
    // Подписка на события набора текста другим пользователем
    const typingSubscription = subscribeToTypingEvents((isTyping) => {
      setOtherUserIsTyping(isTyping);
    });
    return () => {
      // Отписка при размонтировании
      unsubscribeFromMessages();
      if (typingSubscription) {
        typingSubscription.unsubscribe();
      }
    };
  }, []);

  const loadMessages = async () => {
    // Здесь будет загрузка сообщений с сервера
    const dummyMessages: Message[] = [
      {
        id: '1',
        text: 'Привет! Как дела?',
        timestamp: '10:00',
        senderId: 'other',
        status: 'read',
        type: 'text',
      },
      // Добавьте больше сообщений
    ];
    setMessages(dummyMessages);
  };

  const subscribeToMessages = () => {
    // Подписка на WebSocket или другой метод real-time обновлений
  };

  const subscribeToTypingEvents = (callback: (isTyping: boolean) => void) => {
    // Здесь будет реальная подписка на события через WebSocket
    // Для демонстрации используем имитацию
    const interval = setInterval(() => {
      callback(Math.random() > 0.7);
    }, 3000);

    return {
      unsubscribe: () => clearInterval(interval),
    };
  };

  const unsubscribeFromMessages = () => {
    // Отписка от WebSocket
  };

  const handleSend = async () => {
    if (!inputText.trim() && !isRecording) return;

    hapticFeedback.light();
    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString(),
      senderId: 'me',
      status: 'sending',
      type: 'text',
      replyTo: replyingTo || undefined,
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setReplyingTo(null);
    flatListRef.current?.scrollToEnd();

    // Имитация отправки и получения статуса
    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
        )
      );
    }, 1000);

    setTimeout(() => {
      setMessages(prev =>
        prev.map(msg =>
          msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
        )
      );
    }, 2000);
  };

  const handleVideoRecordComplete = (uri: string) => {
    setIsVideoMode(false);
    const newMessage: Message = {
      id: Date.now().toString(),
      video: uri,
      timestamp: new Date().toLocaleTimeString(),
      senderId: 'me',
      status: 'sending',
      type: 'videoNote',
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') return;

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const recording = new Audio.Recording();
      await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await recording.startAsync();
      recordingRef.current = recording;
      setIsRecording(true);
      hapticFeedback.medium();

      // Обновление длительности записи
      const interval = setInterval(() => {
        setRecordingDuration(prev => prev + 1);
      }, 1000);

      return () => clearInterval(interval);
    } catch (error) {
      console.error('Failed to start recording', error);
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);
      setRecordingDuration(0);
      hapticFeedback.medium();

      if (uri) {
        // Отправка аудио сообщения
        const newMessage: Message = {
          id: Date.now().toString(),
          audio: uri,
          audioDuration: recordingDuration,
          timestamp: new Date().toLocaleTimeString(),
          senderId: 'me',
          status: 'sending',
          type: 'audio',
        };
        setMessages(prev => [...prev, newMessage]);
      }
    } catch (error) {
      console.error('Failed to stop recording', error);
    }
  };

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      const newMessage: Message = {
        id: Date.now().toString(),
        image: result.assets[0].uri,
        timestamp: new Date().toLocaleTimeString(),
        senderId: 'me',
        status: 'sending',
        type: 'image',
      };
      setMessages(prev => [...prev, newMessage]);
    }
  };

  const handleInputChange = (text: string) => {
    setInputText(text);
    // Отправка события "печатает"
    if (!isTyping) {
      setIsTyping(true);
      // Здесь отправка события на сервер
    }

    // Сброс таймера
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Установка нового таймера
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      // Здесь отправка события на сервер
    }, 1500);
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.senderId === 'me' ? styles.myMessage : styles.otherMessage
    ]}>
      {item.replyTo && (
        <View style={styles.replyContainer}>
          <Text style={styles.replyText} numberOfLines={1}>
            {item.replyTo.text}
          </Text>
        </View>
      )}

      {item.type === 'text' && (
        <Text style={styles.messageText}>{item.text}</Text>
      )}

      {item.type === 'image' && (
        <Image source={{ uri: item.image }} style={styles.messageImage} />
      )}

      {item.type === 'videoNote' && (
        <VideoMessage uri={item.video!} isCircular={true} />
      )}

      {item.type === 'video' && (
        <VideoMessage uri={item.video!} />
      )}

      {item.type === 'audio' && (
        <AudioMessage uri={item.audio!} duration={item.audioDuration} />
      )}

      <View style={styles.messageFooter}>
        <Text style={styles.timestamp}>{item.timestamp}</Text>
        {item.senderId === 'me' && (
          <View style={styles.statusContainer}>
            {item.status === 'sending' && (
              <ActivityIndicator size="small" color="#666" />
            )}
            {item.status === 'sent' && (
              <Ionicons name="checkmark" size={16} color="#666" />
            )}
            {item.status === 'delivered' && (
              <Ionicons name="checkmark-done" size={16} color="#666" />
            )}
            {item.status === 'read' && (
              <Ionicons name="checkmark-done" size={16} color="#8A2BE2" />
            )}
          </View>
        )}
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        ListHeaderComponent={
          otherUserIsTyping ? (
            <View style={styles.typingContainer}>
              <TypingIndicator />
              <Text style={styles.typingText}>
                {user.name} печатает...
              </Text>
            </View>
          ) : null
        }
      />

      {replyingTo && (
        <View style={styles.replyBar}>
          <View style={styles.replyContent}>
            <Text style={styles.replyTitle}>Ответ на сообщение</Text>
            <Text numberOfLines={1} style={styles.replyText}>
              {replyingTo.text}
            </Text>
          </View>
          <TouchableOpacity onPress={() => setReplyingTo(null)}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.inputContainer}>
        <TouchableOpacity 
          style={styles.attachButton}
          onPress={() => setShowAttachMenu(!showAttachMenu)}
        >
          <Ionicons name="add-circle-outline" size={24} color="#8A2BE2" />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            placeholder="Сообщение..."
            value={inputText}
            onChangeText={handleInputChange}
            multiline
          />
          {!inputText && (
            <TouchableOpacity 
              style={styles.cameraButton}
              onPress={() => setIsVideoMode(true)}
            >
              <Ionicons name="camera" size={24} color="#8A2BE2" />
            </TouchableOpacity>
          )}
        </View>

        {inputText ? (
          <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
            <Ionicons name="send" size={24} color="#8A2BE2" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.micButton}
            onPressIn={startRecording}
            onPressOut={stopRecording}
          >
            <Ionicons 
              name={isRecording ? "radio-button-on" : "mic"} 
              size={24} 
              color={isRecording ? "#ff0000" : "#8A2BE2"} 
            />
            {isRecording && (
              <Text style={styles.recordingDuration}>
                {recordingDuration}s
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>

      <Modal
        visible={showAttachMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAttachMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          onPress={() => setShowAttachMenu(false)}
        >
          <View style={styles.attachMenu}>
            <TouchableOpacity 
              style={styles.attachMenuItem}
              onPress={handleImagePick}
            >
              <Ionicons name="image" size={30} color="#8A2BE2" />
              <Text style={styles.attachMenuText}>Фото или Видео</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachMenuItem}>
              <Ionicons name="document" size={30} color="#8A2BE2" />
              <Text style={styles.attachMenuText}>Документ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.attachMenuItem}>
              <Ionicons name="location" size={30} color="#8A2BE2" />
              <Text style={styles.attachMenuText}>Локация</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <VideoRecorder
        isVisible={isVideoMode}
        onClose={() => setIsVideoMode(false)}
        onRecordComplete={handleVideoRecordComplete}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 16,
  },
  myMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#E3D3FF',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  messageFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginRight: 4,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    marginHorizontal: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    padding: 8,
  },
  attachButton: {
    padding: 8,
  },
  sendButton: {
    padding: 8,
  },
  micButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingDuration: {
    marginLeft: 4,
    color: '#ff0000',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3D3FF',
    padding: 8,
    borderRadius: 16,
    width: 200,
  },
  playButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioWaveform: {
    flex: 1,
    height: 30,
    backgroundColor: '#D1C4E9',
    marginHorizontal: 8,
    borderRadius: 4,
  },
  audioDuration: {
    fontSize: 12,
    color: '#666',
  },
  videoNoteContainer: {
    width: 150,
    height: 150,
    borderRadius: 75,
    overflow: 'hidden',
    position: 'relative',
  },
  videoNote: {
    width: '100%',
    height: '100%',
  },
  replyContainer: {
    borderLeftWidth: 2,
    borderLeftColor: '#8A2BE2',
    paddingLeft: 8,
    marginBottom: 4,
  },
  replyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  replyContent: {
    flex: 1,
    marginRight: 8,
  },
  replyTitle: {
    fontSize: 12,
    color: '#8A2BE2',
    fontWeight: 'bold',
  },
  replyText: {
    fontSize: 14,
    color: '#666',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  attachMenu: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
  },
  attachMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  attachMenuText: {
    fontSize: 16,
    marginLeft: 16,
    color: '#333',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  cameraControls: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    padding: 20,
  },
  closeCamera: {
    position: 'absolute',
    top: 40,
    left: 20,
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordButtonInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#ff0000',
  },
  cameraButton: {
    padding: 8,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  typingText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 8,
  },
});

export default SingleChatScreen; 