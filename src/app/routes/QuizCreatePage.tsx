import { useNavigate } from 'react-router-dom';
import QuizForm from '../components/quiz/QuizForm';
import type { QuizFormValues } from '../lib/validators/quiz.schema';
import { quizService, questionService } from '../../api';
import { Box } from '@mui/material';

const QuizCreatePage = () => {
  const navigate = useNavigate();
  const onSubmit = async (values: QuizFormValues) => {
    try {
      const quizData = {
        name: values.name,
        questions: values.questions,
      };
      await quizService.createQuiz(quizData);
      await questionService.postNewQuestions(values.questions);
      navigate('/');
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz');
    }
  };

  return (
    <Box>
      <QuizForm
        title="Create New Quiz"
        submitLabel="Save Quiz"
        onSubmit={onSubmit}
      />
    </Box>
  );
};

export default QuizCreatePage;
