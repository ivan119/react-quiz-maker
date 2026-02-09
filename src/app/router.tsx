import { createBrowserRouter, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/Main';
import QuizCreatePage from './routes/QuizCreatePage';
import QuizEditPage from './routes/QuizEditPage';
import QuizListPage from './routes/QuizListPage';
import LoginPage from './routes/LoginPage';
import QuizSolvePage from './routes/QuizSolvePage';
import ProtectedRoute from './components/Auth/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <QuizListPage /> },
      { path: '/quiz/:id/solve', element: <QuizSolvePage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: '/quiz/create', element: <QuizCreatePage /> },
          { path: '/quiz/:id/edit', element: <QuizEditPage /> },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
