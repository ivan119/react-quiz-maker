import { useState, useRef, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
} from 'react-hook-form';
import { Box, Paper, Divider, CircularProgress } from '@mui/material';
import { Add as AddIcon, History as HistoryIcon } from '@mui/icons-material';
import { Virtuoso, type VirtuosoHandle } from 'react-virtuoso';
import { Form, FormInput, Button, PreviewText, Modal } from '../ui';
import { QuizQuestionItem } from './QuizQuestionItem';
import {
  quizSchema,
  type QuizFormValues,
} from '../../lib/validators/quiz.schema';
import { type Question } from '../../../shared/types/quiz';

const RecycledQuestionsSelector = lazy(() =>
  import('./RecycledQuestionsSelector').then((module) => ({
    default: module.RecycledQuestionsSelector,
  }))
);

type Props = {
  defaultValues?: QuizFormValues;
  onSubmit: (values: QuizFormValues) => Promise<void> | void;
  onCancel?: () => void;
  submitLabel?: string;
  title?: string;
  isEdit?: boolean;
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
  isEdit = false,
}: Props) => {
  const navigate = useNavigate();
  const virtuosoRef = useRef<VirtuosoHandle>(null);
  const [expanded, setExpanded] = useState<string | false>(
    isEdit ? false : 'panel0'
  );
  const [isRecycleModalOpen, setIsRecycleModalOpen] = useState(false);
  const [selectedRecycledQuestions, setSelectedRecycledQuestions] = useState<
    Question[]
  >([]);

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

  const handlePushRecycled = () => {
    if (selectedRecycledQuestions.length > 0) {
      // If we have a single empty question, remove it first
      if (fields.length === 1 && !fields[0].question && !fields[0].answer) {
        remove(0);
      }

      append(
        selectedRecycledQuestions.map((q) => ({
          question: q.question,
          answer: q.answer,
        }))
      );

      setIsRecycleModalOpen(false);
      setSelectedRecycledQuestions([]);

      // Expand the first newly added question
      const newIndex =
        fields.length === 1 && !fields[0].question ? 0 : fields.length;
      setExpanded(`panel${newIndex}`);
      scrollToPanel(newIndex);
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
      <PreviewText
        variant="h4"
        component="div"
        sx={{ fontWeight: 700, letterSpacing: '-0.01em', mb: 2 }}
        text={title}
      />

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
              <PreviewText variant="h6" text="Questions" />
              {(errors.questions?.message ||
                errors.questions?.root?.message) && (
                <PreviewText
                  variant="caption"
                  color="error"
                  text={
                    errors.questions?.message || errors.questions?.root?.message
                  }
                />
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                icon={<HistoryIcon />}
                variant="outlined"
                size="small"
                onClick={() => setIsRecycleModalOpen(true)}
                title="Recycle"
              />
              <AddQuestionButton
                control={control}
                append={append}
                onAdd={() => {
                  setExpanded(`panel${fields.length}`);
                  scrollToPanel(fields.length);
                }}
              />
            </Box>
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

      <Modal
        open={isRecycleModalOpen}
        onClose={() => setIsRecycleModalOpen(false)}
        onConfirm={handlePushRecycled}
        title="Question Bank"
        confirmText={`Add ${selectedRecycledQuestions.length} Questions`}
        confirmDisabled={selectedRecycledQuestions.length === 0}
        maxWidth="md"
      >
        <Suspense
          fallback={
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          }
        >
          <RecycledQuestionsSelector onSelect={setSelectedRecycledQuestions} />
        </Suspense>
      </Modal>
    </Box>
  );
};

export default QuizForm;
