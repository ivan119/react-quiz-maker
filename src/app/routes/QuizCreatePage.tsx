import { useNavigate } from "react-router-dom";
import QuizForm from "../components/quiz/QuizForm";
import type { QuizFormValues } from "../lib/validators/quiz.schema";
import { quizService } from "../../api";
import {  Box } from "@mui/material";
import { Button } from '../components/ui';


const QuizCreatePage = () => {
  const navigate = useNavigate();
  const onSubmit = async (values: QuizFormValues) => {
    try {
      const quizData = {
        name: values.name,
        questionIds: [],
        questions: values.questions,
      };
      await quizService.createQuiz(quizData);
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
      <Button variant="text" onClick={() => navigate('/')} title="Cancel" />
    </Box>
  );
};

export default QuizCreatePage;
