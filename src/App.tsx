import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { HelmetProvider } from 'react-helmet-async';
import { theme } from './theme';
import { AuthProvider } from './providers/AuthProvider';
import { NotificationProvider } from './providers/NotificationProvider';
import { AnalyticsProvider } from './providers/AnalyticsProvider';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import ChatScreen from './screens/ChatScreen';
import ChatListScreen from './screens/ChatListScreen';
import SettingsScreen from './screens/SettingsScreen';
import StreamScreen from './screens/StreamScreen';
import MapScreen from './screens/MapScreen';
import Layout from './components/Layout';

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider theme={theme}>
        <AnalyticsProvider>
          <NotificationProvider>
            <AuthProvider>
              <Router>
                <Layout>
                  <Routes>
                    <Route path="/" element={<HomeScreen />} />
                    <Route path="/profile/:userId?" element={<ProfileScreen />} />
                    <Route path="/chat/:chatId" element={<ChatScreen />} />
                    <Route path="/chats" element={<ChatListScreen />} />
                    <Route path="/settings" element={<SettingsScreen />} />
                    <Route path="/stream/:streamId" element={<StreamScreen />} />
                    <Route path="/map" element={<MapScreen />} />
                  </Routes>
                </Layout>
              </Router>
            </AuthProvider>
          </NotificationProvider>
        </AnalyticsProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App; 