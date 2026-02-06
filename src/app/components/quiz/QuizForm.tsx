import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Typography, Box, Button, Paper, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Form, FormInput } from '../ui';
import { QuizQuestionItem } from './QuizQuestionItem';
import {
  quizSchema,
  type QuizFormValues,
} from '../../lib/validators/quiz.schema';

type Props = {
  defaultValues?: QuizFormValues;
  onSubmit: (values: QuizFormValues) => Promise<void> | void;
  submitLabel?: string;
  title?: string;
};
const QuizForm = ({
  defaultValues = { name: '', questions: [{ question: '', answer: '' }] },
  onSubmit,
  submitLabel = 'Save Quiz',
  title = 'Quiz',
}: Props) => {
  const [expanded, setExpanded] = useState<string | false>('panel0');
  console.log('render QuizForm');
  const methods = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues,
  });

  const {
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const handleAccordionChange =
    (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4 }}>
        {title}
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Form<QuizFormValues> onSubmit={onSubmit} useFormMethods={methods}>
          <FormInput<QuizFormValues>
            name="name"
            control={control}
            label="Quiz Name"
            placeholder="General Knowledge"
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
            <Box>
              <Typography variant="h6">Questions</Typography>
              <Typography
                variant="body2"
                color={fields.length < 15 ? 'error' : 'success.main'}
                sx={{ fontWeight: 'bold' }}
              >
                {fields.length} / 15 required
              </Typography>
            </Box>

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
            <QuizQuestionItem
              key={field.id}
              control={control}
              index={index}
              remove={remove}
              isExpanded={expanded === `panel${index}`}
              onChange={handleAccordionChange(`panel${index}`)}
              canRemove={fields.length > 1}
            />
          ))}

          {errors.questions?.message && (
            <Typography
              color="error"
              variant="caption"
              sx={{ mt: 1, display: 'block' }}
            >
              {errors.questions?.message}
            </Typography>
          )}
          <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              size="large"
            >
              {isSubmitting ? 'Saving...' : submitLabel}
            </Button>
          </Box>
        </Form>
      </Paper>
    </Box>
  );
};

export default QuizForm;
