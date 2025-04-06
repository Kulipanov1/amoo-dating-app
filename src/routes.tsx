import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import LoadingOverlay from './components/LoadingOverlay';

// Ленивая загрузка компонентов
const Home = lazy(() => import('./screens/Home'));
const Profile = lazy(() => import('./screens/Profile'));
const Login = lazy(() => import('./screens/Login'));
const Register = lazy(() => import('./screens/Register'));
const Chat = lazy(() => import('./screens/Chat'));
const ChatList = lazy(() => import('./screens/ChatList'));
const Settings = lazy(() => import('./screens/Settings'));
const NotFound = lazy(() => import('./screens/NotFound'));

// Компоненты
const Layout = lazy(() => import('./components/Layout'));
const AuthGuard = lazy(() => import('./components/AuthGuard'));

const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<LoadingOverlay open={true} message="Загрузка страницы..." />}>
      <Routes>
        {/* Публичные маршруты */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Защищенные маршруты */}
        <Route element={<AuthGuard><Layout /></AuthGuard>}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/chats" element={<ChatList />} />
          <Route path="/chat/:id" element={<Chat />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes; 