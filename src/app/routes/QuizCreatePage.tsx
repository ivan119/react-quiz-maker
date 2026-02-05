import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import {
  Typography,
  Box,
  Button,
  Paper,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormInput } from '../components/ui';
import { quizService } from '../../api';

const quizSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  questions: z
    .array(
      z.object({
        question: z.string().min(1, 'Question text is required'),
        answer: z.string().min(1, 'Answer is required'),
      })
    )
    .min(1, 'At least one question is required'),
});

type QuizFormValues = z.infer<typeof quizSchema>;

const QuizCreatePage = () => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState<string | false>('panel0');

  const methods = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      name: '',
      questions: [{ question: '', answer: '' }],
    },
  });

  const {
    control,
    formState: { isSubmitting },
    watch,
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const questionsValues = watch('questions');

  const handleAccordionChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

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
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        Create New Quiz
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Form<QuizFormValues> onSubmit={onSubmit} useFormMethods={methods}>
          <FormInput
            name="name"
            control={control}
            label="Quiz Name"
            placeholder="e.g., General Knowledge"
          />

          <Divider sx={{ my: 4 }} />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="h6">
              Add Questions ({fields.length})
            </Typography>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              size="small"
              onClick={() => {
                append({ question: '', answer: '' });
                setExpanded(`panel${fields.length}`);
              }}
            >
              Add Question
            </Button>
          </Box>

          {fields.map((field, index) => (
            <Accordion
              key={field.id}
              expanded={expanded === `panel${index}`}
              onChange={handleAccordionChange(`panel${index}`)}
              sx={{
                mb: 1,
                borderRadius: '8px !important',
                '&:before': { display: 'none' },
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {questionsValues[index]?.question ||
                    `New Question #${index + 1}`}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <FormInput
                  name={`questions.${index}.question`}
                  control={control}
                  label="Question Text"
                  multiline
                  rows={2}
                />
                <FormInput
                  name={`questions.${index}.answer`}
                  control={control}
                  label="Correct Answer"
                />
                {fields.length > 1 && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => remove(index)}
                    >
                      Remove Question
                    </Button>
                  </Box>
                )}
              </AccordionDetails>
            </Accordion>
          ))}

          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              size="large"
              sx={{ px: 4, borderRadius: 2 }}
            >
              {isSubmitting ? 'Saving...' : 'Save Quiz'}
            </Button>
            <Button variant="text" onClick={() => navigate('/')} size="large">
              Cancel
            </Button>
          </Box>
        </Form>
      </Paper>
    </Box>
  );
};

export default QuizCreatePage;
