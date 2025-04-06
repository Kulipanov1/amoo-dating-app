import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Avatar,
  IconButton,
  Chip,
  CircularProgress,
  Button,
} from '@mui/material';
import { Favorite as FavoriteIcon, Message as MessageIcon } from '@mui/icons-material';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import UserProfileService from '../services/UserProfileService';
import { auth } from '../config/firebase';

interface UserCardProps {
  user: {
    uid: string;
    displayName: string;
    age: number;
    bio: string;
    photos: string[];
    interests: string[];
    distance?: number;
  };
  onLike: (userId: string) => void;
  onMessage: (userId: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, onLike, onMessage }) => {
  const cardSx: SxProps<Theme> = {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    position: 'relative',
  };

  const mediaSx: SxProps<Theme> = {
    height: 300,
    position: 'relative',
  };

  const actionsSx: SxProps<Theme> = {
    position: 'absolute',
    bottom: 0,
    right: 0,
    padding: 1,
    display: 'flex',
    gap: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: '4px 0 0 0',
  };

  return (
    <Card sx={cardSx}>
      <CardMedia
        component="div"
        sx={mediaSx}
      >
        {user.photos[0] ? (
          <Box
            component="img"
            src={user.photos[0]}
            alt={user.displayName}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <Avatar
            sx={{
              width: '100%',
              height: '100%',
              fontSize: '4rem',
            }}
          >
            {user.displayName[0]}
          </Avatar>
        )}
        <Box sx={actionsSx}>
          <IconButton
            color="primary"
            onClick={() => onLike(user.uid)}
            sx={{ bgcolor: 'background.paper' }}
          >
            <FavoriteIcon />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => onMessage(user.uid)}
            sx={{ bgcolor: 'background.paper' }}
          >
            <MessageIcon />
          </IconButton>
        </Box>
      </CardMedia>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {user.displayName}, {user.age}
          {user.distance && (
            <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
              {user.distance} км
            </Typography>
          )}
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          {user.bio}
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {user.interests.map((interest, index) => (
            <Chip key={index} label={interest} size="small" />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserCardProps['user'][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Пользователь не авторизован');
        return;
      }

      const newUsers = await UserProfileService.findUsers({
        page,
        limit: 10,
        userId,
      });

      if (newUsers.length < 10) {
        setHasMore(false);
      }

      setUsers(prev => [...prev, ...newUsers]);
      setPage(prev => prev + 1);
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (userId: string) => {
    try {
      const currentUserId = auth.currentUser?.uid;
      if (!currentUserId) {
        setError('Пользователь не авторизован');
        return;
      }

      await UserProfileService.likeUser(currentUserId, userId);
    } catch (err: any) {
      setError(err.message || 'Ошибка при отправке лайка');
    }
  };

  const handleMessage = (userId: string) => {
    navigate(`/chat/${userId}`);
  };

  if (loading && users.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error && users.length === 0) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
        }}
      >
        {users.map(user => (
          <UserCard
            key={user.uid}
            user={user}
            onLike={handleLike}
            onMessage={handleMessage}
          />
        ))}
      </Box>
      {hasMore && (
        <Box display="flex" justifyContent="center" mt={4}>
          <Button
            variant="outlined"
            onClick={loadUsers}
            disabled={loading}
          >
            {loading ? 'Загрузка...' : 'Загрузить еще'}
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default UserList; 