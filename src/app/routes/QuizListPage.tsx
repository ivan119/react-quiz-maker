import { useEffect, useState, useCallback } from "react";
import { Typography, Box, Button } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { quizService, type QuizDetail } from "../../api";
import QuizTable from "../components/quiz/QuizTable";

const QuizListPage = () => {
  const [quizzes, setQuizzes] = useState<QuizDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const loadQuizzes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await quizService.getAllQuizzes();
      setQuizzes(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load quizzes. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadQuizzes();
  }, [loadQuizzes]);


  return (
      <Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h4" component="h1">Quizzes</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/quizzes/new")}>
            Create New Quiz
          </Button>
        </Box>

        <QuizTable
            quizzes={quizzes}
            loading={loading}
            onEdit={(id) => navigate(`/quizzes/${id}/edit`)}
            onSolve={(id) => navigate(`/quizzes/${id}/solve`)}
            onDelete={(id) => console.log(id)}
        />

        {error && !loading && (
            <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
              {error}
            </Typography>
        )}
      </Box>
  );
};

export default QuizListPage;
