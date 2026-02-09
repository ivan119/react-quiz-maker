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
import type {
  QuizDetail,
  QuizValidationResult,
} from '../../../shared/types/quiz';
import { Button, PreviewText } from '../ui';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckIcon from '@mui/icons-material/Check';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

interface QuizCompletedProps {
  quiz: QuizDetail;
  validationResult: QuizValidationResult;
  onRestart: () => void;
  onExit: () => void;
}

export const QuizCompleted = ({
  quiz,
  validationResult,
  onRestart,
  onExit,
}: QuizCompletedProps) => {
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
          text={`${validationResult.score} / ${validationResult.totalQuestions}`}
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
              {validationResult.results.map((res, idx) => {
                const question = quiz.questions.find(
                  (q) => q.id === res.questionId
                );
                return (
                  <TableRow key={idx}>
                    <TableCell>{idx + 1}</TableCell>
                    <TableCell>{question?.question || 'Unknown'}</TableCell>
                    <TableCell>
                      {res.userAnswer || <em>No answer</em>}
                    </TableCell>
                    <TableCell>{res.correctAnswer}</TableCell>
                    <TableCell align="center">
                      {res.isCorrect ? (
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
