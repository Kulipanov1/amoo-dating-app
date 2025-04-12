import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingOverlay from './components/LoadingOverlay';

// Ленивая загрузка компонентов
const HomeScreen = lazy(() => import('./screens/HomeScreen'));
const Login = lazy(() => import('./screens/Login'));
const Register = lazy(() => import('./screens/Register'));
const ChatScreen = lazy(() => import('./screens/ChatScreen'));
const ChatList = lazy(() => import('./screens/ChatListScreen'));
const SettingsScreen = lazy(() => import('./screens/SettingsScreen'));
const NotFound = lazy(() => import('./screens/NotFound'));
const Profile = lazy(() => import('./screens/Profile'));
const UserList = lazy(() => import('./screens/UserList'));
const MapScreen = lazy(() => import('./screens/MapScreen'));
const SwipeScreen = lazy(() => import('./screens/SwipeScreen'));

// Компоненты
const Layout = lazy(() => import('./components/Layout'));
const AuthGuard = lazy(() => import('./components/AuthGuard'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay open={true} message="Загрузка страницы..." />}>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Защищенные маршруты */}
        <Route element={<AuthGuard><Layout /></AuthGuard>}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/chats" element={<ChatList />} />
          <Route path="/chat/:id" element={<ChatScreen />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/users" element={<UserList />} />
          <Route path="/map" element={<MapScreen />} />
          <Route path="/swipe" element={<SwipeScreen />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 