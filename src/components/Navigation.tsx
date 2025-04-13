import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from '@mui/material';
import {
  Home as HomeIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getNavigationValue = () => {
    const path = location.pathname;
    if (path === '/') return 0;
    if (path.startsWith('/chats')) return 1;
    if (path.startsWith('/profile')) return 2;
    if (path.startsWith('/settings')) return 3;
    return 0;
  };

  const handleNavigation = (newValue: number) => {
    switch (newValue) {
      case 0:
        navigate('/');
        break;
      case 1:
        navigate('/chats');
        break;
      case 2:
        navigate('/profile');
        break;
      case 3:
        navigate('/settings');
        break;
    }
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Amoo One
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        elevation={3}
      >
        <BottomNavigation
          value={getNavigationValue()}
          onChange={(_, newValue) => handleNavigation(newValue)}
          showLabels
        >
          <BottomNavigationAction label="Главная" icon={<HomeIcon />} />
          <BottomNavigationAction label="Чаты" icon={<ChatIcon />} />
          <BottomNavigationAction label="Профиль" icon={<PersonIcon />} />
          <BottomNavigationAction label="Настройки" icon={<SettingsIcon />} />
        </BottomNavigation>
      </Paper>
    </>
  );
};

export default Navigation; 