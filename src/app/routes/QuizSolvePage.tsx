import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { quizService } from '../../api';
import type { QuizDetail } from '../../api';
import { Button, PreviewText } from '../components/ui';
import { QuizCompleted } from '../components/quiz/QuizCompleted';
import { QuizSolver } from '../components/quiz/QuizSolver';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const QuizSolvePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { showNotification } = useNotification();

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Guest Solve State
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});

  const loadQuiz = useCallback(async () => {
    if (!id) {
      setError('Quiz ID is required');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const data = await quizService.getQuizById(id);
      if (!data) {
        setError('Quiz not found');
      } else {
        setQuiz(data);
      }
    } catch (err) {
      console.error(err);
      setError('Failed to load quiz');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadQuiz();
  }, [loadQuiz]);

  const handleNext = () => {
    if (quiz && currentSlide < quiz.questions.length - 1) {
      setCurrentSlide((prev) => prev + 1);
      setIsAnswerRevealed(false);
      setCurrentAnswer(userAnswers[currentSlide + 1] || '');
    } else if (!isAdmin) {
      // Only guests go to the "Completed" screen
      setIsCompleted(true);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
      setIsAnswerRevealed(false);
      setCurrentAnswer(userAnswers[currentSlide - 1] || '');
    }
  };

  const handleSubmitAnswer = () => {
    setUserAnswers((prev) => ({ ...prev, [currentSlide]: currentAnswer }));
    handleNext();
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification('Quiz link copied to clipboard!', 'success');
  };

  const handleRestart = () => {
    setIsCompleted(false);
    setCurrentSlide(0);
    setUserAnswers({});
    setCurrentAnswer('');
    setIsAnswerRevealed(false);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !quiz) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <PreviewText
          text={error || 'Quiz not found'}
          color="error"
          variant="h5"
        />
        <Button sx={{ mt: 2 }} onClick={() => navigate('/')} title="Go Back" />
      </Box>
    );
  }

  if (isCompleted && !isAdmin) {
    return (
      <QuizCompleted
        quiz={quiz}
        userAnswers={userAnswers}
        onRestart={handleRestart}
        onExit={() => navigate('/')}
      />
    );
  }

  return (
    <QuizSolver
      quiz={quiz}
      currentSlide={currentSlide}
      isAdmin={isAdmin}
      isAnswerRevealed={isAnswerRevealed}
      currentAnswer={currentAnswer}
      onAnswerChange={setCurrentAnswer}
      onPrev={handlePrev}
      onNext={handleNext}
      onSubmit={handleSubmitAnswer}
      onShare={handleShare}
      onToggleReveal={setIsAnswerRevealed}
      onExit={() => navigate('/')}
    />
  );
};

export default QuizSolvePage;
