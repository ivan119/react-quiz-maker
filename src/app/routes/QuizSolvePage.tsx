import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { quizService } from '../../api';
import type { QuizDetail, QuizValidationResult } from '../../api';
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
  const [validating, setValidating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [validationResult, setValidationResult] =
    useState<QuizValidationResult | null>(null);

  // Guest Solve State
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

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

  const handleNext = async (finalAnswers?: Record<string, string>) => {
    if (quiz && currentSlide < quiz.questions.length - 1) {
      const nextSlide = currentSlide + 1;
      const nextQuestionId = quiz.questions[nextSlide].id || '';
      setCurrentSlide(nextSlide);
      setIsAnswerRevealed(false);
      setCurrentAnswer(
        finalAnswers?.[nextQuestionId] || userAnswers[nextQuestionId] || ''
      );
    } else if (!isAdmin && quiz && id) {
      // Transition to validation
      setValidating(true);
      try {
        const result = await quizService.validateQuiz(
          id,
          finalAnswers || userAnswers
        );
        setValidationResult(result);
      } catch (err) {
        console.error(err);
        showNotification('Failed to validate quiz results.', 'error');
      } finally {
        setValidating(false);
      }
    }
  };

  const handlePrev = () => {
    if (quiz && currentSlide > 0) {
      const prevSlide = currentSlide - 1;
      const prevQuestionId = quiz.questions[prevSlide].id || '';
      setCurrentSlide(prevSlide);
      setIsAnswerRevealed(false);
      setCurrentAnswer(userAnswers[prevQuestionId] || '');
    }
  };

  const handleSubmitAnswer = () => {
    if (!quiz) return;
    const qId = quiz.questions[currentSlide].id || '';
    const newAnswers = { ...userAnswers, [qId]: currentAnswer };
    setUserAnswers(newAnswers);
    handleNext(newAnswers);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showNotification('Quiz link copied to clipboard!', 'success');
  };

  const handleRestart = () => {
    setValidationResult(null);
    setCurrentSlide(0);
    setUserAnswers({});
    setCurrentAnswer('');
    setIsAnswerRevealed(false);
  };

  if (loading || validating) {
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

  if (validationResult && !isAdmin) {
    return (
      <QuizCompleted
        quiz={quiz}
        validationResult={validationResult}
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
