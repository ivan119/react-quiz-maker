import { useCallback } from 'react';
import { useNotification } from '../context/NotificationContext';

export const useQuizSharing = () => {
  const { showNotification } = useNotification();

  const shareQuiz = useCallback(
    (id: string) => {
      const url = `${window.location.origin}/quiz/${id}/solve`;
      navigator.clipboard.writeText(url);
      showNotification('Quiz link copied to clipboard!', 'success');
    },
    [showNotification]
  );

  return { shareQuiz };
};
