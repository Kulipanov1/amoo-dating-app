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
import ScreenWrapper from '../components/ScreenWrapper';

interface Message {
  id: string;
  type: 'text' | 'image' | 'audio';
  content: string;
  timestamp: Date;
  senderId: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: Date;
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
  lastSeen: new Date(),
};

const dummyMessages: Message[] = [
  {
    id: '1',
    type: 'text',
    content: 'Привет! Как дела?',
    timestamp: new Date(Date.now() - 3600000),
    senderId: 'other_user',
    status: 'read',
  },
  {
    id: '2',
    type: 'text',
    content: 'Привет! Все хорошо, спасибо! Как ты?',
    timestamp: new Date(Date.now() - 3500000),
    senderId: 'current_user',
    status: 'read',
  },
];

export default function ChatScreen({ route, navigation }) {
  const { width: windowWidth } = Dimensions.get('window');
  const isDesktop = Platform.OS === 'web' && windowWidth > 768;
  const contentWidth = isDesktop ? 480 : windowWidth;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  
  useEffect(() => {
    // Здесь можно загрузить историю сообщений
    loadInitialMessages();
  }, []);

  const loadInitialMessages = () => {
    // Имитация загрузки сообщений
    const initialMessages: Message[] = [
      {
        id: '1',
        type: 'text',
        content: 'Привет! Как дела?',
        timestamp: new Date(Date.now() - 3600000),
        senderId: 'other_user',
        status: 'read',
      },
      {
        id: '2',
        type: 'text',
        content: 'Привет! Все хорошо, спасибо! Как ты?',
        timestamp: new Date(Date.now() - 3500000),
        senderId: 'current_user',
        status: 'read',
      },
    ];
    setMessages(initialMessages);
  };

  const handleSend = () => {
    if (inputText.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'text',
        content: inputText.trim(),
        timestamp: new Date(),
        senderId: 'current_user',
        status: 'sent',
      };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      scrollToBottom();
    }
  };

  const handleAttachImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'image',
        content: result.assets[0].uri,
        timestamp: new Date(),
        senderId: 'current_user',
        status: 'sent',
      };
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
    }
    setShowAttachMenu(false);
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      );
      recordingRef.current = recording;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording', err);
    }
  };

  const stopRecording = async () => {
    if (!recordingRef.current) return;

    try {
      await recordingRef.current.stopAndUnloadAsync();
      const uri = recordingRef.current.getURI();
      recordingRef.current = null;
      setIsRecording(false);

      if (uri) {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'audio',
          content: uri,
          timestamp: new Date(),
          senderId: 'current_user',
          status: 'sent',
        };
        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      }
    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const scrollToBottom = () => {
    if (flatListRef.current && messages.length > 0) {
      flatListRef.current.scrollToEnd({ animated: true });
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === 'current_user';

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        {item.type === 'text' && (
          <Text style={styles.messageText}>{item.content}</Text>
        )}
        {item.type === 'image' && (
          <Image source={{ uri: item.content }} style={styles.messageImage} />
        )}
        {item.type === 'audio' && (
          <TouchableOpacity style={styles.audioContainer}>
            <Ionicons name="play" size={24} color={isOwnMessage ? 'white' : '#8A2BE2'} />
            <View style={styles.audioWaveform} />
          </TouchableOpacity>
        )}
        <View style={styles.messageFooter}>
          <Text style={styles.timestamp}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isOwnMessage && (
            <Ionicons
              name={item.status === 'read' ? 'checkmark-done' : 'checkmark'}
              size={16}
              color={item.status === 'read' ? '#4CAF50' : '#999'}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <ScreenWrapper isDesktop={isDesktop} contentWidth={contentWidth}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#8A2BE2" />
          </TouchableOpacity>
          <View style={styles.userInfo}>
            <Image source={{ uri: otherUser.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.userName}>{otherUser.name}</Text>
              <Text style={styles.userStatus}>
                {otherUser.isOnline ? 'В сети' : 'Был(а) недавно'}
              </Text>
            </View>
          </View>
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.messagesList}
          onContentSizeChange={scrollToBottom}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
          <View style={styles.inputContainer}>
            <TouchableOpacity
              style={styles.attachButton}
              onPress={() => setShowAttachMenu(!showAttachMenu)}
            >
              <Ionicons name="attach" size={24} color="#8A2BE2" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Сообщение..."
              multiline
            />

            {inputText.length > 0 ? (
              <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
                <Ionicons name="send" size={24} color="white" />
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
                  color={isRecording ? "#FF4444" : "#8A2BE2"}
                />
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>

        {showAttachMenu && (
          <View style={styles.attachMenu}>
            <TouchableOpacity
              style={styles.attachMenuItem}
              onPress={handleAttachImage}
            >
              <Ionicons name="image" size={24} color="#8A2BE2" />
              <Text style={styles.attachMenuText}>Фото</Text>
            </TouchableOpacity>
            {/* Добавьте другие опции прикрепления файлов здесь */}
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E3D3FF',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userStatus: {
    fontSize: 12,
    color: '#666',
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
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#8A2BE2',
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F0E6FF',
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
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  audioWaveform: {
    width: 100,
    height: 20,
    backgroundColor: '#E3D3FF',
    marginLeft: 8,
    borderRadius: 10,
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#E3D3FF',
    backgroundColor: 'white',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    padding: 8,
    backgroundColor: '#F0E6FF',
    borderRadius: 20,
    maxHeight: 100,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#8A2BE2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  micButton: {
    padding: 8,
  },
  attachMenu: {
    position: 'absolute',
    bottom: 76,
    left: 16,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  attachMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  attachMenuText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
}); 