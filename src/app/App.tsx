import { RouterProvider } from 'react-router-dom';
import { router } from './router';
import { NotificationProvider } from './context/NotificationContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
      </NotificationProvider>
    </AuthProvider>
  );
}
