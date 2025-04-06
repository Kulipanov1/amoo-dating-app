import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  Grid,
} from '@mui/material';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import { auth } from '../config/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import UserProfileService from '../services/UserProfileService';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    setLoading(true);

    try {
      // Создаем пользователя в Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );

      // Обновляем профиль пользователя
      await updateProfile(userCredential.user, {
        displayName: formData.displayName,
      });

      // Создаем профиль пользователя в Firestore
      await UserProfileService.createProfile({
        uid: userCredential.user.uid,
        email: formData.email,
        displayName: formData.displayName,
        birthDate: new Date(), // Это нужно будет заполнить позже
        gender: 'other', // Это нужно будет заполнить позже
        location: {
          latitude: 0,
          longitude: 0,
        },
        interests: [],
        preferences: {
          ageRange: { min: 18, max: 99 },
          distance: 50,
          gender: ['male', 'female', 'other'],
          showMe: true,
        },
        photos: [],
        isOnline: true,
        lastSeen: new Date(),
        isVerified: false,
      });

      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Произошла ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const gridItemSx: SxProps<Theme> = {
    width: '100%',
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Регистрация в Amoo One
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid sx={gridItemSx}>
              <TextField
                required
                fullWidth
                id="displayName"
                label="Ваше имя"
                name="displayName"
                autoComplete="name"
                value={formData.displayName}
                onChange={handleChange}
              />
            </Grid>
            <Grid sx={gridItemSx}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid sx={gridItemSx}>
              <TextField
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid sx={gridItemSx}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Подтвердите пароль"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link component={RouterLink} to="/login" variant="body2">
              {"Уже есть аккаунт? Войдите"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register; 