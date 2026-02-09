import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/Main';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { Box, CircularProgress } from '@mui/material';

// Lazy load pages - splitting them into separate chunks
const QuizCreatePage = lazy(() => import('./routes/QuizCreatePage'));
const QuizEditPage = lazy(() => import('./routes/QuizEditPage'));
const QuizListPage = lazy(() => import('./routes/QuizListPage'));
const LoginPage = lazy(() => import('./routes/LoginPage'));
const QuizSolvePage = lazy(() => import('./routes/QuizSolvePage'));

// Simple loader for the splitting transition
const PageLoader = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
    <CircularProgress />
  </Box>
);

const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<PageLoader />}>
    <Component />
  </Suspense>
);

export const router = createBrowserRouter([
  {
    path: '/login',
    element: withSuspense(LoginPage),
  },
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: withSuspense(QuizListPage) },
      { path: '/quiz/:id/solve', element: withSuspense(QuizSolvePage) },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/quiz/create', element: withSuspense(QuizCreatePage) },
          { path: '/quiz/:id/edit', element: withSuspense(QuizEditPage) },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
