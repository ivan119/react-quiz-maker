import { useState, type FC } from 'react';
import { useNavigate } from 'react-router-dom';
import QuizForm from '../components/quiz/QuizForm';
import type { QuizFormValues } from '../lib/validators/quiz.schema';
import { quizService, questionService } from '../../api';
import { Box } from '@mui/material';
import { Modal, PreviewText } from '../components/ui';
import { useNotification } from '../context/NotificationContext';

const QuizCreatePage: FC = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [showBankModal, setShowBankModal] = useState(false);
  const [pendingValues, setPendingValues] = useState<QuizFormValues | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const onSubmit = (values: QuizFormValues) => {
    // Instead of submitting directly, show the modal
    setPendingValues(values);
    setShowBankModal(true);
  };

  const handleCreateQuiz = async (saveToBank: boolean) => {
    if (!pendingValues) return;

    setLoading(true);
    try {
      const quizData = {
        name: pendingValues.name,
        questions: pendingValues.questions,
      };

      // 1. Create the quiz itself
      await quizService.createQuiz(quizData);

      // 2. Optionally save questions to the bank
      if (saveToBank) {
        await questionService.postNewQuestions(pendingValues.questions);
      }

      showNotification(
        `Quiz "${pendingValues.name}" created successfully${saveToBank ? ' and questions added to bank' : ''}!`,
        'success'
      );
      navigate('/');
    } catch (error) {
      console.error('Error creating quiz:', error);
      showNotification('Failed to create quiz. Please try again.', 'error');
    } finally {
      setLoading(false);
      setShowBankModal(false);
    }
  };

  return (
    <Box>
      <QuizForm
        title="Create New Quiz"
        submitLabel="Save Quiz"
        onSubmit={onSubmit}
      />

      <Modal
        open={showBankModal}
        onClose={() => !loading && setShowBankModal(false)}
        title="Question Bank"
        confirmText="Yes, Save to Bank"
        cancelText="No, Just Create Quiz"
        onConfirm={() => handleCreateQuiz(true)}
        onCancel={() => handleCreateQuiz(false)}
        loading={loading}
      >
        <PreviewText
          text="Do you want to save these questions in the bank for future recycling and reusing in other quizzes?"
          sx={{ mb: 1 }}
        />
        <PreviewText
          variant="caption"
          text="Selecting 'No' will still create the quiz, but these questions won't appear in the 'Recycle Questions' selector later."
          sx={{ color: 'text.secondary', display: 'block' }}
        />
      </Modal>
    </Box>
  );
};

export default QuizCreatePage;
