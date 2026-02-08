import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Paper, CircularProgress } from '@mui/material';
import { quizService } from '../../api';
import type { QuizDetail } from '../../api';
import { Button, PreviewText } from '../components/ui';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const QuizSolvePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [revealedIndexes, setRevealedIndexes] = useState<Set<number>>(
    new Set()
  );

  const loadQuiz = useCallback(async () => {
    if (!id) {
      setError('Quiz ID is required');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await quizService.getQuizById(id);
      setQuiz(data ?? null);
      if (!data) setError('Quiz not found');
      setRevealedIndexes(new Set());
      setCurrentSlide(0);
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

  const totalSlides = quiz?.questions.length ?? 0;
  const canGoPrev = totalSlides > 0 && currentSlide > 0;
  const canGoNext = totalSlides > 0 && currentSlide < totalSlides - 1;

  const goPrev = () => {
    if (canGoPrev) setCurrentSlide((i) => i - 1);
  };

  const goNext = () => {
    if (canGoNext) setCurrentSlide((i) => i + 1);
  };

  const toggleAnswer = () => {
    setRevealedIndexes((prev) => {
      const next = new Set(prev);
      if (next.has(currentSlide)) next.delete(currentSlide);
      else next.add(currentSlide);
      return next;
    });
  };

  const isRevealed = revealedIndexes.has(currentSlide);
  const currentQuestion = quiz?.questions[currentSlide];

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh', // Ensures it shows up in the middle of the page
          gap: 2,
        }}
      >
        <PreviewText text="Loading quiz…" color="text.secondary" />
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error || !quiz) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <PreviewText
          text={error || 'Quiz not found'}
          color="error"
          variant="h6"
          sx={{ mb: 2 }}
        />
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          title="Back to list"
        />
      </Box>
    );
  }

  if (quiz.questions.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <PreviewText
          text="This quiz has no questions."
          color="text.secondary"
          sx={{ mb: 2 }}
        />
        <Button
          variant="outlined"
          onClick={() => navigate('/')}
          title="Back to list"
        />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 720, mx: 'auto' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <PreviewText
          text={quiz.name}
          variant="h5"
          sx={{ fontWeight: 'bold' }}
        />
        <Button
          variant="outlined"
          size="small"
          onClick={() => navigate('/')}
          title="Back to quizzes"
        />
      </Box>

      <PreviewText
        text="Admin: run quiz and check correct answers."
        variant="body2"
        color="text.secondary"
        sx={{ mb: 2 }}
      />

      {/* Progress */}
      <PreviewText
        text={`Question ${currentSlide + 1} of ${totalSlides}`}
        variant="body2"
        color="text.secondary"
        sx={{ mb: 1 }}
      />
      <Box sx={{ display: 'flex', gap: 0.5, mb: 2, flexWrap: 'wrap' }}>
        {quiz.questions.map((_, index) => (
          <Box
            key={index}
            onClick={() => setCurrentSlide(index)}
            sx={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              bgcolor:
                index === currentSlide ? 'primary.main' : 'action.selected',
              cursor: 'pointer',
              opacity: index === currentSlide ? 1 : 0.6,
              '&:hover': { opacity: 1 },
            }}
            aria-label={`Go to question ${index + 1}`}
          />
        ))}
      </Box>

      {/* Slide content */}
      <Paper
        sx={{
          p: 4,
          minHeight: 280,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <PreviewText
          text={currentQuestion?.question ?? ''}
          variant="h6"
          sx={{ fontWeight: 600, mb: 2, flex: 1 }}
        />

        {isRevealed && currentQuestion && (
          <Box
            sx={{
              mb: 2,
              p: 2,
              bgcolor: 'success.light',
              color: 'success.contrastText',
              borderRadius: 2,
            }}
          >
            <PreviewText
              label="Correct answer"
              text={currentQuestion.answer}
              variant="body1"
            />
          </Box>
        )}

        <Box sx={{ mt: 'auto' }}>
          <Button
            variant={isRevealed ? 'outlined' : 'contained'}
            size="medium"
            onClick={toggleAnswer}
            title={isRevealed ? 'Hide answer' : 'Show correct answer'}
          />
        </Box>
      </Paper>

      {/* Slideshow controls */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mt: 3,
        }}
      >
        <Button
          variant="outlined"
          onClick={goPrev}
          disabled={!canGoPrev}
          icon={<NavigateBeforeIcon />}
          title="Previous question"
        />
        <PreviewText
          text={`${currentSlide + 1} / ${totalSlides}`}
          variant="body2"
          color="text.secondary"
        />
        <Button
          variant="outlined"
          onClick={goNext}
          disabled={!canGoNext}
          icon={<NavigateNextIcon />}
          title="Next question"
        />
      </Box>
    </Box>
  );
};

export default QuizSolvePage;
