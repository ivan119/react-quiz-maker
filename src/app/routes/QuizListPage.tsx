import { useEffect, useState, useCallback } from 'react';
import { Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { quizService, type QuizDetail } from '../../api';
import { Modal } from '../components/ui/Modal';
import { Button, PreviewText } from '../components/ui';
import QuizTable from '../components/quiz/QuizTable';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState<QuizDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState<QuizDetail | null>(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { showNotification } = useNotification();

  const loadQuizzes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error(err);
      showNotification(
        'Failed to load quizzes. Please try again later.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [showNotification]);

  const handleDelete = (item: QuizDetail) => {
    setDeleteItem(item);
    setOpenModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteItem) {
      try {
        await quizService.deleteQuiz(deleteItem.id as string);
        const deletedName = deleteItem.name;
        setDeleteItem(null);
        setOpenModal(false);
        await loadQuizzes();
        showNotification(
          `Quiz "${deletedName}" deleted successfully`,
          'success'
        );
      } catch (error) {
        console.error('Error deleting quiz:', error);
        showNotification('Failed to delete quiz. Please try again.', 'error');
      }
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  return (
    <Box>
      <QuizTable
        title="Quizzes"
        actions={
          isAdmin && (
            <Button
              variant="contained"
              icon={<AddIcon />}
              onClick={() => navigate('/quiz/create')}
              title="Create New Quiz"
            />
          )
        }
        quizzes={quizzes}
        loading={loading}
        onEdit={(id) => navigate(`/quiz/${id}/edit`)}
        onSolve={(id) => navigate(`/quiz/${id}/solve`)}
        onDelete={(item) => handleDelete(item)}
      />
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onConfirm={handleDeleteConfirm}
        confirmText="Delete"
        confirmColor="error"
      >
        <PreviewText
          text={`Are you sure you want to delete this quiz?\nName: ${deleteItem?.name ?? ''}`}
          sx={{ whiteSpace: 'pre-line' }}
        />
      </Modal>
    </Box>
  );
};

export default QuizListPage;
