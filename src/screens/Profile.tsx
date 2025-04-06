import React, { useState, useEffect } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  IconButton,
  Chip,
  Paper,
} from '@mui/material';
import { Edit as EditIcon, Add as AddIcon } from '@mui/icons-material';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import UserProfileService from '../services/UserProfileService';
import { auth } from '../config/firebase';

type Gender = 'male' | 'female' | 'other';

interface ProfileState {
  displayName: string;
  bio: string;
  age: number;
  gender: Gender;
  interests: string[];
  photos: string[];
  isEditing: boolean;
}

const Profile: React.FC = () => {
  const [profile, setProfile] = useState<ProfileState>({
    displayName: '',
    bio: '',
    age: 0,
    gender: 'other',
    interests: [],
    photos: [],
    isEditing: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Пользователь не авторизован');
        return;
      }

      const userProfile = await UserProfileService.getProfile(userId);
      if (userProfile) {
        setProfile({
          displayName: userProfile.displayName,
          bio: userProfile.bio || '',
          age: userProfile.birthDate ? calculateAge(userProfile.birthDate) : 0,
          gender: userProfile.gender || 'other',
          interests: userProfile.interests,
          photos: userProfile.photos,
          isEditing: false,
        });
      }
    } catch (err: any) {
      setError(err.message || 'Ошибка при загрузке профиля');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1;
    }
    
    return age;
  };

  const handleSave = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        setError('Пользователь не авторизован');
        return;
      }

      await UserProfileService.updateProfile(userId, {
        displayName: profile.displayName,
        bio: profile.bio,
        gender: profile.gender,
        interests: profile.interests,
      });

      setProfile(prev => ({ ...prev, isEditing: false }));
    } catch (err: any) {
      setError(err.message || 'Ошибка при сохранении профиля');
    }
  };

  const handleAddInterest = () => {
    if (newInterest.trim() && !profile.interests.includes(newInterest.trim())) {
      setProfile(prev => ({
        ...prev,
        interests: [...prev.interests, newInterest.trim()],
      }));
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setProfile(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest),
    }));
  };

  const containerSx: SxProps<Theme> = {
    mt: 4,
    mb: 4,
  };

  const avatarSx: SxProps<Theme> = {
    width: 120,
    height: 120,
    mb: 2,
  };

  const sectionSx: SxProps<Theme> = {
    mt: 3,
    p: 2,
  };

  if (loading) {
    return (
      <Container maxWidth="md">
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={containerSx}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Avatar sx={avatarSx} src={profile.photos[0]}>
            {profile.displayName[0]}
          </Avatar>
          <IconButton
            sx={{ position: 'absolute', right: 16, top: 16 }}
            onClick={() => setProfile(prev => ({ ...prev, isEditing: !prev.isEditing }))}
          >
            <EditIcon />
          </IconButton>

          {profile.isEditing ? (
            <Box component="form" sx={{ width: '100%' }}>
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: 'repeat(12, 1fr)' }}>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField
                    fullWidth
                    label="Имя"
                    value={profile.displayName}
                    onChange={e => setProfile(prev => ({ ...prev, displayName: e.target.value }))}
                  />
                </Box>
                <Box sx={{ gridColumn: 'span 12' }}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="О себе"
                    value={profile.bio}
                    onChange={e => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  />
                </Box>
                <Box sx={{ gridColumn: 'span 6' }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Возраст"
                    value={profile.age}
                    disabled
                  />
                </Box>
                <Box sx={{ gridColumn: 'span 6' }}>
                  <TextField
                    fullWidth
                    select
                    label="Пол"
                    value={profile.gender}
                    onChange={e => setProfile(prev => ({ ...prev, gender: e.target.value as Gender }))}
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="male">Мужской</option>
                    <option value="female">Женский</option>
                    <option value="other">Другой</option>
                  </TextField>
                </Box>
              </Box>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleSave}
                sx={{ mt: 3 }}
              >
                Сохранить
              </Button>
            </Box>
          ) : (
            <>
              <Typography variant="h5" gutterBottom>
                {profile.displayName}
              </Typography>
              <Typography variant="body1" color="textSecondary" paragraph>
                {profile.bio || 'Нет описания'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Возраст: {profile.age}
              </Typography>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                Пол: {profile.gender === 'male' ? 'Мужской' : profile.gender === 'female' ? 'Женский' : 'Другой'}
              </Typography>
            </>
          )}

          <Paper sx={sectionSx}>
            <Typography variant="h6" gutterBottom>
              Интересы
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profile.interests.map((interest, index) => (
                <Chip
                  key={index}
                  label={interest}
                  onDelete={profile.isEditing ? () => handleRemoveInterest(interest) : undefined}
                />
              ))}
              {profile.isEditing && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', mt: 1 }}>
                  <TextField
                    size="small"
                    label="Новый интерес"
                    value={newInterest}
                    onChange={e => setNewInterest(e.target.value)}
                  />
                  <IconButton onClick={handleAddInterest} color="primary">
                    <AddIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Paper>
    </Container>
  );
};

export default Profile; 