import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { Typography, Box, Paper, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Form, FormInput, Button } from '../ui';
import { QuizQuestionItem } from './QuizQuestionItem';
import {
  quizSchema,
  type QuizFormValues,
} from '../../lib/validators/quiz.schema';

type Props = {
  defaultValues?: QuizFormValues;
  onSubmit: (values: QuizFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  title?: string;
};

const QuizForm = ({
  defaultValues = { name: '', questions: [{ question: '', answer: '' }] },
  onSubmit,
  onCancel,
  submitLabel = 'Save Quiz',
  title = 'Quiz',
}: Props) => {
  const navigate = useNavigate();
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

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/');
    }
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
              icon={<AddIcon />}
              variant="contained"
              size="small"
              onClick={() => {
                append({ question: '', answer: '' });
                setExpanded(`panel${fields.length}`);
              }}
              title="Add Question"
            />
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
          <Box
            sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}
          >
            <Button
              variant="outlined"
              onClick={handleCancel}
              size="large"
              title="Cancel"
              disabled={isSubmitting}
              color="inherit"
            />
            <Button
              variant="contained"
              type="submit"
              isLoading={isSubmitting}
              size="large"
              disabled={isSubmitting}
              title={submitLabel}
            />
          </Box>
        </Form>
      </Paper>
    </Box>
  );
};

export default QuizForm;
