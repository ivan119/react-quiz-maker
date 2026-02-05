import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/Layout/Main';
import QuizCreatePage from './routes/QuizCreatePage';
import QuizListPage from './routes/QuizListPage';
const QuizEditPage = () => <div>Edit quiz</div>;
const QuizSolvePage = () => <div>Solve quiz</div>;

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <QuizListPage /> },
      { path: '/quizzes/new', element: <QuizCreatePage /> },
      { path: '/quizzes/:id/edit', element: <QuizEditPage /> },
      { path: '/quizzes/:id/solve', element: <QuizSolvePage /> },
    ],
  },
]);
