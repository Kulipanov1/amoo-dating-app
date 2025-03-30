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
  type: 'text' | 'image' | 'video' | 'audio';
  content: string;
  timestamp: number;
  senderId: string;
  status: 'sending' | 'sent' | 'delivered' | 'read';
}

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastSeen?: string;
}

export default function ChatScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [windowWidth, setWindowWidth] = useState(Dimensions.get('window').width);
  const [windowHeight, setWindowHeight] = useState(Dimensions.get('window').height);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);
  const recordingRef = useRef<Audio.Recording | null>(null);
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null);

  const user: ChatUser = {
    id: '2',
    name: 'Анна',
    avatar: 'https://example.com/avatar.jpg',
    isOnline: true,
    lastSeen: '2 минуты назад',
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setWindowWidth(window.width);
      setWindowHeight(window.height);
    });

    return () => {
      subscription?.remove();
      stopRecording();
    };
  }, []);

  const isDesktop = windowWidth > 768;
  const contentWidth = isDesktop ? 480 : windowWidth;

  const handleSend = () => {
    if (!message.trim()) return;
    
    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'text',
      content: message.trim(),
      timestamp: Date.now(),
      senderId: '1', // current user
      status: 'sending',
    };

    setMessages(prev => [...prev, newMessage]);
    setMessage('');
    scrollToBottom();
    hapticFeedback.light();

    // Имитация отправки и доставки
    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'sent' } 
            : msg
        )
      );
    }, 500);

    setTimeout(() => {
      setMessages(prev => 
        prev.map(msg => 
          msg.id === newMessage.id 
            ? { ...msg, status: 'delivered' } 
            : msg
        )
      );
    }, 1000);
  };

  const handleAttachImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'image',
        content: result.assets[0].uri,
        timestamp: Date.now(),
        senderId: '1',
        status: 'sending',
      };

      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
      setShowAttachMenu(false);
    }
  };

  const handleAttachVideo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 1,
    });

    if (!result.canceled) {
      const newMessage: Message = {
        id: Date.now().toString(),
        type: 'video',
        content: result.assets[0].uri,
        timestamp: Date.now(),
        senderId: '1',
        status: 'sending',
      };

      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
      setShowAttachMenu(false);
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
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

      // Start timer
      setRecordingTime(0);
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

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
      hapticFeedback.medium();

      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current);
        recordingTimerRef.current = null;
      }

      if (uri) {
        const newMessage: Message = {
          id: Date.now().toString(),
          type: 'audio',
          content: uri,
          timestamp: Date.now(),
          senderId: '1',
          status: 'sending',
        };

        setMessages(prev => [...prev, newMessage]);
        scrollToBottom();
      }

    } catch (err) {
      console.error('Failed to stop recording', err);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === '1';

    return (
      <View style={[
        styles.messageContainer,
        isOwnMessage ? styles.ownMessage : styles.otherMessage
      ]}>
        {item.type === 'text' && (
          <Text style={[
            styles.messageText,
            isOwnMessage ? styles.ownMessageText : styles.otherMessageText
          ]}>
            {item.content}
          </Text>
        )}

        {item.type === 'image' && (
          <Image
            source={{ uri: item.content }}
            style={styles.messageImage}
            resizeMode="cover"
          />
        )}

        {item.type === 'video' && (
          <View style={styles.messageVideo}>
            <Image
              source={{ uri: item.content }}
              style={styles.videoThumbnail}
              resizeMode="cover"
            />
            <TouchableOpacity style={styles.playButton}>
              <Ionicons name="play" size={24} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {item.type === 'audio' && (
          <TouchableOpacity style={styles.audioContainer}>
            <Ionicons name="play" size={20} color={isOwnMessage ? 'white' : '#8A2BE2'} />
            <View style={styles.audioWaveform}>
              {/* Имитация волны аудио */}
              {Array(20).fill(0).map((_, i) => (
                <View
                  key={i}
                  style={[
                    styles.waveformBar,
                    { height: Math.random() * 15 + 5 },
                    isOwnMessage ? styles.ownWaveformBar : styles.otherWaveformBar
                  ]}
                />
              ))}
            </View>
          </TouchableOpacity>
        )}

        <View style={styles.messageFooter}>
          <Text style={[
            styles.messageTime,
            isOwnMessage ? styles.ownMessageTime : styles.otherMessageTime
          ]}>
            {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
          {isOwnMessage && (
            <Ionicons
              name={
                item.status === 'read' ? 'checkmark-done' :
                item.status === 'delivered' ? 'checkmark-done' :
                'checkmark'
              }
              size={16}
              color={item.status === 'read' ? '#8A2BE2' : '#999'}
              style={styles.messageStatus}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, isDesktop && styles.desktopSafeArea]}>
      <View style={[styles.wrapper, isDesktop && styles.desktopWrapper]}>
        <View style={[styles.mainContent, isDesktop && { width: contentWidth }]}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
            
            <View style={styles.headerInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userStatus}>
                {user.isOnline ? 'В сети' : user.lastSeen}
              </Text>
            </View>

            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="call" size={22} color="white" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="videocam" size={22} color="white" />
            </TouchableOpacity>
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
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          >
            <View style={styles.inputContainer}>
              <TouchableOpacity
                style={styles.attachButton}
                onPress={() => setShowAttachMenu(!showAttachMenu)}
              >
                <Ionicons name="add-circle" size={24} color="#8A2BE2" />
              </TouchableOpacity>

              <TextInput
                style={styles.input}
                value={message}
                onChangeText={setMessage}
                placeholder="Сообщение..."
                multiline
                maxLength={1000}
              />

              {message.trim() ? (
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
                    name="mic"
                    size={24}
                    color={isRecording ? '#FF4B4B' : '#8A2BE2'}
                  />
                  {isRecording && (
                    <Text style={styles.recordingTime}>
                      {formatTime(recordingTime)}
                    </Text>
                  )}
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
                <View style={[styles.attachMenuIcon, { backgroundColor: '#FF9500' }]}>
                  <Ionicons name="image" size={24} color="white" />
                </View>
                <Text style={styles.attachMenuText}>Фото</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.attachMenuItem}
                onPress={handleAttachVideo}
              >
                <View style={[styles.attachMenuIcon, { backgroundColor: '#FF2D55' }]}>
                  <Ionicons name="videocam" size={24} color="white" />
                </View>
                <Text style={styles.attachMenuText}>Видео</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
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
    paddingVertical: 20,
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#F8F4FF',
    ...(Platform.OS === 'web' ? {
      borderRadius: 20,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    } : {}),
  },
  header: {
    height: 56,
    backgroundColor: '#8A2BE2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  userStatus: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 12,
    borderRadius: 20,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#8A2BE2',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#333',
  },
  messageImage: {
    width: 200,
    height: 200,
    borderRadius: 12,
  },
  messageVideo: {
    width: 200,
    height: 200,
    borderRadius: 12,
    position: 'relative',
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -20 }, { translateY: -20 }],
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  audioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    width: 160,
  },
  audioWaveform: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    height: 30,
  },
  waveformBar: {
    width: 3,
    marginHorizontal: 1,
    borderRadius: 1.5,
  },
  ownWaveformBar: {
    backgroundColor: 'rgba(255,255,255,0.6)',
  },
  otherWaveformBar: {
    backgroundColor: 'rgba(138,43,226,0.6)',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  messageTime: {
    fontSize: 12,
  },
  ownMessageTime: {
    color: 'rgba(255,255,255,0.7)',
  },
  otherMessageTime: {
    color: '#999',
  },
  messageStatus: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E3D3FF',
  },
  attachButton: {
    padding: 8,
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    padding: 8,
    maxHeight: 100,
    backgroundColor: '#F0E6FF',
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    padding: 8,
  },
  micButton: {
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordingTime: {
    marginLeft: 8,
    color: '#FF4B4B',
    fontSize: 14,
  },
  attachMenu: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderTopColor: '#E3D3FF',
  },
  attachMenuItem: {
    alignItems: 'center',
  },
  attachMenuIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  attachMenuText: {
    fontSize: 12,
    color: '#666',
  },
}); 