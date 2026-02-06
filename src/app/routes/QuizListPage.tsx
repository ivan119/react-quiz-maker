import { useEffect, useState, useCallback } from 'react';
import { Typography, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { quizService, type QuizDetail } from '../../api';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui';
import QuizTable from '../components/quiz/QuizTable';

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState<QuizDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteItem, setDeleteItem] = useState<QuizDetail | null>(null);
  const navigate = useNavigate();

  const loadQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load quizzes. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = (item: QuizDetail) => {
    setDeleteItem(item);
    setOpenModal(true);
  };

  const handleDeleteConfirm = async () => {
    if (deleteItem) {
      try {
        await quizService.deleteQuiz(deleteItem.id as string);
        setDeleteItem(null);
        setOpenModal(false);
        await loadQuizzes();
        // TODO: Maybe add a snackbar to notify the user that the quiz was deleted successfully?
      } catch (error) {
        console.error('Error deleting quiz:', error);
        alert('Failed to delete quiz');
      }
    }
  };

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Quizzes
        </Typography>
        <Button
          variant="contained"
          icon={<AddIcon />}
          onClick={() => navigate('/quiz/create')}
          title="Create New Quiz"
        />
      </Box>

      <QuizTable
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
        <Typography>
          Are you sure you want to delete this quiz?
          <br />
          Name : {deleteItem?.name}
        </Typography>
      </Modal>
      {error && !loading && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default QuizListPage;
