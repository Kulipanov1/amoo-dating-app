import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Platform,
  Dimensions,
  SafeAreaView,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as VideoRecorder from 'expo-camera';
import { Audio } from 'expo-av';
import { useNavigation, useRoute } from '@react-navigation/native';
import { hapticFeedback } from '../utils/haptics';

interface Message {
  id: string;
  text: string;
  timestamp: string;
  senderId: string;
  type: 'text' | 'image' | 'video' | 'audio';
  content?: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen: string;
}

const currentUser = {
  id: 'current_user',
  name: 'Вы',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
};

const otherUser: ChatUser = {
  id: 'other_user',
  name: 'Анна',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
  isOnline: true,
  lastSeen: 'онлайн',
};

const dummyMessages: Message[] = [
  {
    id: '1',
    text: 'Привет! Как дела?',
    timestamp: '14:30',
    senderId: 'other_user',
    type: 'text',
    status: 'read',
  },
  {
    id: '2',
    text: 'Привет! Все хорошо, спасибо! Как ты?',
    timestamp: '14:31',
    senderId: 'current_user',
    type: 'text',
    status: 'read',
  },
];

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
      setWindowHeight(window.height);
    });

    // Имитация загрузки сообщений
    const timer = setTimeout(() => {
      setMessages(dummyMessages);
    }, 1000);

    return () => {
      subscription?.remove();
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={styles.headerTitle}>
          <Image source={{ uri: otherUser.avatar }} style={styles.headerAvatar} />
          <View>
            <Text style={styles.headerName}>{otherUser.name}</Text>
            <Text style={styles.headerStatus}>
              {otherUser.isOnline ? 'онлайн' : otherUser.lastSeen}
            </Text>
          </View>
        </View>
      ),
    });
  }, [navigation]);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      senderId: currentUser.id,
      type: 'text',
      status: 'sent',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    hapticFeedback.light();
    scrollToBottom();
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const isDesktop = windowWidth > 768;
  const contentWidth = isDesktop ? 480 : windowWidth;

  const renderMessage = ({ item }: { item: Message }) => {
    const isMine = item.senderId === currentUser.id;

    return (
      <View style={[styles.messageContainer, isMine ? styles.myMessage : styles.otherMessage]}>
        <View style={[styles.messageBubble, isMine ? styles.myBubble : styles.otherBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.messageTime}>{item.timestamp}</Text>
          {isMine && (
            <View style={styles.messageStatus}>
              <Ionicons
                name={item.status === 'read' ? 'checkmark-done' : 'checkmark'}
                size={16}
                color={item.status === 'read' ? '#4CAF50' : '#666'}
              />
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDesktop && styles.desktopSafeArea]}>
      <View style={[styles.wrapper, isDesktop && styles.desktopWrapper]}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={[styles.container, isDesktop && { width: contentWidth }]}
        >
          <FlatList
            ref={flatListRef}
            data={messages}
            renderItem={renderMessage}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.messagesList}
            onContentSizeChange={scrollToBottom}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={() => setShowAttachMenu(!showAttachMenu)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#8A2BE2" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Сообщение..."
              multiline
              maxLength={1000}
            />

            {inputText.trim() ? (
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Ionicons name="send" size={24} color="#8A2BE2" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.micButton}
                onPressIn={() => setIsRecording(true)}
                onPressOut={() => setIsRecording(false)}
              >
                <Ionicons
                  name={isRecording ? 'radio-button-on' : 'mic-outline'}
                  size={24}
                  color={isRecording ? '#FF0000' : '#8A2BE2'}
                />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  desktopSafeArea: {
    backgroundColor: '#8A2BE2',
  },
  wrapper: {
    flex: 1,
  },
  desktopWrapper: {
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#F8F4FF',
  },
  headerTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  headerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerStatus: {
    fontSize: 12,
    color: '#666',
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 8,
    flexDirection: 'row',
  },
  myMessage: {
    justifyContent: 'flex-end',
  },
  otherMessage: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  myBubble: {
    backgroundColor: '#8A2BE2',
  },
  otherBubble: {
    backgroundColor: 'white',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginRight: 40,
  },
  messageTime: {
    fontSize: 12,
    color: '#666',
    position: 'absolute',
    right: 8,
    bottom: 8,
  },
  messageStatus: {
    position: 'absolute',
    right: 8,
    bottom: 24,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    maxHeight: 100,
    padding: 8,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
  micButton: {
    padding: 8,
  },
}); 