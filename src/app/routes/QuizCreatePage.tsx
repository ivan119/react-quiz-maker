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

  const onSubmit = async (values: QuizFormValues) => {
    setLoading(true);
    try {
      const quizData = {
        name: values.name,
        questions: values.questions,
      };

      // 1. Create the quiz itself first
      await quizService.createQuiz(quizData);
      showNotification(
        `Quiz "${values.name}" created successfully!`,
        'success'
      );

      // 2. Prepare for bank modal
      setPendingValues(values);
      setShowBankModal(true);
    } catch (error) {
      console.error('Error creating quiz:', error);
      showNotification('Failed to create quiz. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToBank = async () => {
    if (!pendingValues) return;

    setLoading(true);
    try {
      const response = await questionService.postNewQuestions(
        pendingValues.questions
      );

      const added = response.addedCount;
      const skipped = response.skippedCount;

      if (added > 0 && skipped > 0) {
        showNotification(
          `Bank Updated: ${added} added, ${skipped} skipped (duplicates)`,
          'info'
        );
      } else if (added > 0) {
        showNotification(`Bank Updated: ${added} questions added!`, 'success');
      } else if (skipped > 0) {
        showNotification(
          `No new questions added (all ${skipped} already exist in bank)`,
          'warning'
        );
      } else {
        showNotification('Bank update complete.', 'success');
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving to bank:', error);
      showNotification('Failed to save questions to bank.', 'error');
      // Still navigate away since quiz was created
      navigate('/');
    } finally {
      setLoading(false);
      setShowBankModal(false);
    }
  };

  const handleSkipBank = () => {
    setShowBankModal(false);
    navigate('/');
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
        onClose={handleSkipBank}
        title="Question Bank"
        confirmText="Yes, Save to Bank"
        cancelText="Maybe Later"
        onConfirm={handleSaveToBank}
        onCancel={handleSkipBank}
        loading={loading}
      >
        <PreviewText
          text="Nice! Your quiz is ready. Do you also want to save these questions in the bank for future use?"
          sx={{ mb: 1, fontWeight: 600 }}
        />
        <PreviewText
          variant="caption"
          text="Saving them to the bank allows you to 'Recycle' them when creating other quizzes."
          sx={{ color: 'text.secondary', display: 'block' }}
        />
      </Modal>
    </Box>
  );
};

export default QuizCreatePage;
