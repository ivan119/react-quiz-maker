import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
} from 'react-hook-form';
import { Typography, Box, Paper, Divider } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
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

const AddQuestionButton = ({
  control,
  append,
  onAdd,
}: {
  control: Control<QuizFormValues>;
  append: any;
  onAdd: () => void;
}) => {
  const watchedQuestions = useWatch({
    control,
    name: 'questions',
  });

  const hasIncompleteQuestions = watchedQuestions?.some(
    (q) => !q?.question?.trim() || !q?.answer?.trim()
  );

  return (
    <Button
      icon={<AddIcon />}
      variant="contained"
      size="small"
      disabled={hasIncompleteQuestions}
      onClick={() => {
        append({ question: '', answer: '' });
        onAdd();
      }}
      title="Add Question"
    />
  );
};

const QuizForm = ({
  defaultValues = { name: '', questions: [{ question: '', answer: '' }] },
  onSubmit,
  onCancel,
  submitLabel = 'Save Quiz',
  title = 'Quiz',
}: Props) => {
  const navigate = useNavigate();
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [expanded, setExpanded] = useState<string | false>('panel0');

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

  const scrollToPanel = (index?: number) => {
    const targetIndex = index !== undefined ? index : fields.length;
    setTimeout(() => {
      virtuosoRef.current?.scrollToIndex({
        index: targetIndex,
        behavior: 'smooth',
        align: 'start',
      });
    }, 369);
  };

  const handleAccordionChange =
    (panel: string, index: number) =>
    (_: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
      if (isExpanded) {
        scrollToPanel(index);
      }
    };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/');
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto' }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2 }}>
        {title}
      </Typography>

      <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
        <Form<QuizFormValues> onSubmit={onSubmit} useFormMethods={methods}>
          <FormInput<QuizFormValues>
            name="name"
            control={control}
            label="Quiz Name"
            helperText=" "
            placeholder="General Knowledge"
          />

          <Divider sx={{ my: 2 }} />

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
              {(errors.questions?.message ||
                errors.questions?.root?.message) && (
                <Typography
                  color="error"
                  variant="caption"
                  sx={{ mt: 1, display: 'block' }}
                >
                  {errors.questions?.message || errors.questions?.root?.message}
                </Typography>
              )}
            </Box>

            <AddQuestionButton
              control={control}
              append={append}
              onAdd={() => {
                setExpanded(`panel${fields.length}`);
                scrollToPanel(fields.length);
              }}
            />
          </Box>

          <Virtuoso
            ref={virtuosoRef}
            style={{ height: '450px' }}
            data={fields}
            overscan={200}
            itemContent={(index, field) => {
              const questionError = errors.questions?.[index];
              const hasError = !!(
                questionError?.question || questionError?.answer
              );

              return (
                <Box sx={{ pb: 2 }}>
                  <QuizQuestionItem
                    key={field.id}
                    control={control}
                    index={index}
                    remove={remove}
                    isExpanded={expanded === `panel${index}`}
                    onChange={handleAccordionChange(`panel${index}`, index)}
                    canRemove={fields.length > 1}
                    hasError={hasError}
                  />
                </Box>
              );
            }}
          />

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
