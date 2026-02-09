import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
  useCallback,
} from 'react';
import { Snackbar, Alert } from '@mui/material';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationContextType {
  showNotification: (message: string, type?: NotificationType) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>('success');

  const showNotification = useCallback(
    (msg: string, t: NotificationType = 'success') => {
      setMessage(msg);
      setType(t);
      setOpen(true);
    },
    []
  );

  const hideNotification = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({ showNotification, hideNotification }),
    [showNotification, hideNotification]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={hideNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={hideNotification}
          severity={type}
          variant="filled"
          sx={{ width: '100%', borderRadius: 3 }}
        >
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
