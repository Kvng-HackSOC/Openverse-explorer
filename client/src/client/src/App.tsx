// client/src/App.tsx
import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout';
import LoadingSpinner from './components/layout/LoadingSpinner';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { useAuth } from './hooks/useAuth';

// Lazy-loaded components
const HomePage = lazy(() => import('./pages/HomePage'));
const SearchPage = lazy(() => import('./pages/SearchPage'));
const MediaDetailsPage = lazy(() => import('./pages/MediaDetailsPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SearchHistoryPage = lazy(() => import('./pages/SearchHistoryPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

const App: React.FC = () => {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route 
            index 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <HomePage />
              </Suspense>
            } 
          />
          <Route 
            path="search" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <SearchPage />
              </Suspense>
            } 
          />
          <Route 
            path="media/:type/:id" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <MediaDetailsPage />
              </Suspense>
            } 
          />
          <Route 
            path="login" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <LoginPage />
              </Suspense>
            } 
          />
          <Route 
            path="register" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <RegisterPage />
              </Suspense>
            } 
          />
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <ProfilePage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="history" 
            element={
              <ProtectedRoute>
                <Suspense fallback={<LoadingSpinner />}>
                  <SearchHistoryPage />
                </Suspense>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="*" 
            element={
              <Suspense fallback={<LoadingSpinner />}>
                <NotFoundPage />
              </Suspense>
            } 
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;