import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { QuizDetail } from '../../../shared/types/quiz';
import { Button, PreviewText } from '../ui';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface QuizCompletedProps {
  quiz: QuizDetail;
  userAnswers: Record<number, string>;
  onRestart: () => void;
  onExit: () => void;
}

export const QuizCompleted = ({
  quiz,
  userAnswers,
  onRestart,
  onExit,
}: QuizCompletedProps) => {
  const calculateScore = () => {
    return quiz.questions.reduce((acc, q, idx) => {
      const userAns = userAnswers[idx]?.trim().toLowerCase() || '';
      const correctAns = q.answer.trim().toLowerCase();
      return userAns === correctAns ? acc + 1 : acc;
    }, 0);
  };

  const score = calculateScore();

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', p: 2, textAlign: 'center', py: 4 }}>
      <CheckCircleOutlineIcon color="success" sx={{ fontSize: 60, mb: 1 }} />
      <PreviewText text="Quiz Completed!" variant="h4" />
      <PreviewText
        text={quiz.name}
        variant="h6"
        color="text.secondary"
        sx={{ mb: 4 }}
      />

      <Box sx={{ mb: 6 }}>
        <PreviewText
          label="Your Score"
          text={`${score} / ${quiz.questions.length}`}
          variant="h5"
          sx={{ mb: 3 }}
        />

        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Question</TableCell>
                <TableCell>Your Answer</TableCell>
                <TableCell>Correct Answer</TableCell>
                <TableCell align="center">Result</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {quiz.questions.map((q, idx) => {
                const userAns = userAnswers[idx]?.trim().toLowerCase() || '';
                const correctAns = q.answer.trim().toLowerCase();
                const isCorrect = userAns === correctAns;
                return (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{q.question}</TableCell>
                    <TableCell>
                      {userAnswers[idx] || <em>No answer</em>}
                    </TableCell>
                    <TableCell>{q.answer}</TableCell>
                    <TableCell align="center">
                      {isCorrect ? (
                        <CheckIcon color="success" />
                      ) : (
                        <ErrorOutlineIcon color="error" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
        <Button variant="contained" onClick={onRestart} title="Restart Quiz" />
        <Button variant="outlined" onClick={onExit} title="Back to Dashboard" />
      </Stack>
    </Box>
  );
};
