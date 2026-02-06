import { createBrowserRouter } from 'react-router-dom';
import MainLayout from './components/Layout/Main';
import QuizCreatePage from './routes/QuizCreatePage';
import QuizEditPage from './routes/QuizEditPage';
import QuizListPage from './routes/QuizListPage';
const QuizSolvePage = () => <div>Solve quiz</div>;

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      { path: '/', element: <QuizListPage /> },
      { path: '/quiz/create', element: <QuizCreatePage /> },
      { path: '/quiz/:id/edit', element: <QuizEditPage /> },
      { path: '/quiz/:id/solve', element: <QuizSolvePage /> },
    ],
  },
]);
