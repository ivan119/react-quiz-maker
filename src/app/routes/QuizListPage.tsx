import { useEffect, useState } from 'react';
import { Typography, Box, Button, IconButton, Tooltip } from '@mui/material';
import {
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { quizService, type QuizDetail } from '../../api';
import { DataTable, type Column } from '../components/ui';

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState<QuizDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadQuizzes();
  }, []);

  const loadQuizzes = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error('Error loading quizzes:', err);
      setError('Failed to load quizzes. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const columns: Column<QuizDetail>[] = [
    {
      id: 'name',
      label: 'Quiz Name',
      minWidth: 170,
      format: (value, row) => (
        <Box
          onClick={() => navigate(`/quizzes/${row.id}/edit`)}
          sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {row.questions.length} questions
          </Typography>
        </Box>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'right',
      sortable: false,
      format: (_, row) => (
        <Box>
          <Tooltip title="Solve Quiz">
            <IconButton
              color="primary"
              onClick={() => navigate(`/quizzes/${row.id}/solve`)}
            >
              <PlayIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete Quiz">
            <IconButton color="error">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h4" component="h1">
          Quizzes
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/quizzes/new')}
        >
          Create New Quiz
        </Button>
      </Box>

      <Box sx={{ opacity: loading ? 0.7 : 1, position: 'relative' }}>
        <DataTable
          columns={columns}
          rows={quizzes}
          initialRowsPerPage={10}
          loading={loading}
        />
      </Box>

      {error && !loading && (
        <Typography color="error" sx={{ mt: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default QuizListPage;
