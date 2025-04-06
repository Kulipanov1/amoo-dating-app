import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  List,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Badge,
  CircularProgress,
  Divider,
  ListItemButton,
} from '@mui/material';
import { Chat as ChatIcon } from '@mui/icons-material';
import ChatService, { Chat, MessageType } from '../services/ChatService';
import { auth } from '../config/firebase';

interface ChatListItem {
  id: string;
  participants: string[];
  lastMessage: {
    content: string;
    type: MessageType;
    timestamp: Date;
    senderId: string;
  } | null;
  unreadCount: number;
}

const ChatListScreen: React.FC = () => {
  const navigate = useNavigate();
  const [chats, setChats] = useState<ChatListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadChats();
    const unsubscribe = ChatService.onChatUpdated(auth.currentUser?.uid || '', handleChatUpdate);
    return () => unsubscribe();
  }, []);

  const loadChats = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Пользователь не авторизован');
        return;
      }

      const userChats = await ChatService.getUserChats(userId);
      setChats(userChats.map(chat => ({
        id: chat.id,
        participants: chat.participants,
        lastMessage: chat.lastMessage || null,
        unreadCount: chat.unreadCount[userId] || 0
      })));
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке чатов');
    } finally {
      setLoading(false);
    }
  };

  const handleChatUpdate = (chat: Chat) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    setChats(prevChats => {
      const index = prevChats.findIndex(c => c.id === chat.id);
      if (index === -1) {
        return [...prevChats, {
          id: chat.id,
          participants: chat.participants,
          lastMessage: chat.lastMessage || null,
          unreadCount: chat.unreadCount[userId] || 0
        }];
      }
      const newChats = [...prevChats];
      newChats[index] = {
        id: chat.id,
        participants: chat.participants,
        lastMessage: chat.lastMessage || null,
        unreadCount: chat.unreadCount[userId] || 0
      };
      return newChats;
    });
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return 'Вчера';
    } else if (days < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleChatPress = (chatId: string) => {
    navigate(`/chat/${chatId}`);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ py: 2 }}>
        <Typography variant="h5" gutterBottom>
          Чаты
        </Typography>
        <List>
          {chats.map((chat, index) => (
            <React.Fragment key={chat.id}>
              <ListItemButton
                onClick={() => handleChatPress(chat.id)}
                sx={{
                  backgroundColor: chat.unreadCount > 0 ? 'action.hover' : 'background.paper',
                }}
              >
                <ListItemAvatar>
                  <Badge
                    color="primary"
                    badgeContent={chat.unreadCount}
                    invisible={chat.unreadCount === 0}
                  >
                    <Avatar>
                      <ChatIcon />
                    </Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={chat.participants.filter(id => id !== auth.currentUser?.uid)[0]}
                  secondary={
                    chat.lastMessage
                      ? `${chat.lastMessage.content} • ${formatTimestamp(chat.lastMessage.timestamp)}`
                      : 'Нет сообщений'
                  }
                />
              </ListItemButton>
              {index < chats.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Container>
  );
};

export default ChatListScreen; 