import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { NotificationProvider } from './context/NotificationContext';

export default function App() {
  return (
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  );
}
