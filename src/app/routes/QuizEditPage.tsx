import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import QuizForm from '../components/quiz/QuizForm';
import type { QuizFormValues } from '../lib/validators/quiz.schema';
import { quizService } from '../../api';
import { Box, CircularProgress } from '@mui/material';
import { PreviewText } from '../components/ui';
const QuizEditPage = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [defaultValues, setDefaultValues] = useState<QuizFormValues | null>(
    null
  );

  useEffect(() => {
    const loadQuiz = async () => {
      if (!id) {
        setError('Quiz ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const quiz = await quizService.getQuizById(id);

        if (!quiz) {
          setError('Quiz not found');
          setLoading(false);
          return;
        }

        setDefaultValues(quiz);
      } catch (err) {
        console.error('Error loading quiz:', err);
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [id]);

  const onSubmit = async (values: QuizFormValues) => {
    if (!id) {
      alert('Quiz ID is missing');
      return;
    }

    try {
      const quizData = {
        name: values.name,
        questions: values.questions,
      };
      await quizService.updateQuiz(id, quizData);
      navigate('/');
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Failed to update quiz');
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '400px',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error || !defaultValues) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <PreviewText
          text={error || 'Failed to load quiz'}
          color="error"
          variant="h6"
        />
      </Box>
    );
  }

  return (
    <Box>
      <QuizForm
        title="Edit Quiz"
        submitLabel="Update Quiz"
        onSubmit={onSubmit}
        defaultValues={defaultValues}
      />
    </Box>
  );
};

export default QuizEditPage;
