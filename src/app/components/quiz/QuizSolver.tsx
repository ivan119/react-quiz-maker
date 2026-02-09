import { memo } from 'react';
import { Box, Paper, IconButton, TextField, Divider } from '@mui/material';
import { Button, PreviewText } from '../ui';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import type { QuizDetail } from '../../../shared/types/quiz';

interface QuizSolverProps {
  quiz: QuizDetail;
  currentSlide: number;
  isAdmin: boolean;
  isAnswerRevealed: boolean;
  currentAnswer: string;
  onAnswerChange: (value: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onShare: () => void;
  onToggleReveal: (revealed: boolean) => void;
  onExit: () => void;
}

export const QuizSolver = memo(
  ({
    quiz,
    currentSlide,
    isAdmin,
    isAnswerRevealed,
    currentAnswer,
    onAnswerChange,
    onPrev,
    onNext,
    onSubmit,
    onShare,
    onToggleReveal,
    onExit,
  }: QuizSolverProps) => {
    const currentQuestion = quiz.questions[currentSlide];
    const isLastSlide = currentSlide === quiz.questions.length - 1;

    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 2 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <PreviewText text={quiz.name} variant="h5" />
          <IconButton onClick={onExit}>
            <CloseIcon />
          </IconButton>
        </Box>

        <PreviewText
          text={`Question ${currentSlide + 1} of ${quiz.questions.length}`}
          variant="body2"
          color="text.secondary"
          sx={{ mb: 1, display: 'block' }}
        />

        <Paper
          variant="outlined"
          sx={{
            p: 4,
            minHeight: 350,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <PreviewText
            text={currentQuestion?.question ?? ''}
            variant="h5"
            align="center"
            sx={{ fontWeight: 500 }}
          />

          <Divider />

          <Box
            sx={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {isAdmin ? (
              <Box sx={{ textAlign: 'center' }}>
                {isAnswerRevealed ? (
                  <Box>
                    <PreviewText
                      text="Answer:"
                      variant="overline"
                      color="primary"
                      sx={{ fontWeight: 'bold' }}
                    />
                    <PreviewText
                      text={currentQuestion?.answer ?? ''}
                      variant="h6"
                    />
                    <Button
                      variant="text"
                      size="small"
                      onClick={() => onToggleReveal(false)}
                      title="Hide"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => onToggleReveal(true)}
                    title="Reveal Answer"
                  />
                )}
              </Box>
            ) : (
              <Box>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Your Answer"
                  variant="outlined"
                  value={currentAnswer}
                  onChange={(e) => onAnswerChange(e.target.value)}
                  placeholder="Type your answer here..."
                  autoFocus
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      if (currentAnswer.trim()) {
                        onSubmit();
                      }
                    }
                  }}
                />
                <PreviewText
                  text="Press Enter to submit and go to the next question."
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: 'block', mt: 1 }}
                />
              </Box>
            )}
          </Box>
        </Paper>

        <Box
          sx={{
            mt: 3,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            variant="outlined"
            disabled={currentSlide === 0}
            onClick={onPrev}
            icon={<NavigateBeforeIcon />}
            title="Previous"
          />

          {isAdmin ? (
            <Button
              variant="contained"
              onClick={isLastSlide ? onShare : onNext}
              color={isLastSlide ? 'success' : 'primary'}
              icon={isLastSlide ? <ContentCopyIcon /> : <NavigateNextIcon />}
              title={isLastSlide ? 'Share Quiz' : 'Next'}
            />
          ) : (
            <Button
              variant="contained"
              onClick={onSubmit}
              color="primary"
              disabled={!currentAnswer.trim()}
              title={isLastSlide ? 'Finish Quiz' : 'Submit & Next'}
            />
          )}
        </Box>
      </Box>
    );
  }
);
