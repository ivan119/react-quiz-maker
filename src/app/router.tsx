import { createBrowserRouter } from 'react-router-dom';
import Layout from '../shared/components/Layout';

const QuizListPage = () => <div>Quiz list</div>;
const QuizCreatePage = () => <div>Create quiz s</div>;
const QuizEditPage = () => <div>Edit quiz</div>;
const QuizSolvePage = () => <div>Solve quiz</div>;

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: '/', element: <QuizListPage /> },
      { path: '/quizzes/new', element: <QuizCreatePage /> },
      { path: '/quizzes/:id', element: <QuizEditPage /> },
      { path: '/quizzes/:id/solve', element: <QuizSolvePage /> },
    ],
  },
]);
