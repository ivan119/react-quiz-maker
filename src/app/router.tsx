import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/Layout/Main';
const QuizListPage = () => <div>Quiz list</div>;
import QuizCreatePage from './routes/QuizCreatePage';
const QuizEditPage = () => <div>Edit quiz</div>;
const QuizSolvePage = () => <div>Solve quiz</div>;

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <QuizListPage /> },
      { path: '/quizzes/new', element: <QuizCreatePage /> },
      { path: '/quizzes/:id', element: <QuizEditPage /> },
      { path: '/quizzes/:id/solve', element: <QuizSolvePage /> },
    ],
  },
]);
