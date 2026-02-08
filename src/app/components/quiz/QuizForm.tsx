import { useState, useMemo, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  useFieldArray,
  useForm,
  useWatch,
  type Control,
} from 'react-hook-form';
import { Box, Paper, Divider, CircularProgress } from '@mui/material';
import {
  Add as AddIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import {
  DataTable,
  type Column,
  Form,
  FormInput,
  Button,
  PreviewText,
  Modal,
} from '../ui';
import {
  quizSchema,
  type QuizFormValues,
} from '../../lib/validators/quiz.schema';
import { type Question } from '../../../shared/types/quiz';
import { useNotification } from '../../context/NotificationContext';
import { z } from 'zod';

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
};

const AddQuestionButton = ({
  control,
  onAdd,
}: {
  control: Control<QuizFormValues>;
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
      onClick={onAdd}
      title="Add Question"
    />
  );
};

const QuizForm = ({
  defaultValues = { name: '', questions: [] },
  onSubmit,
  onCancel,
  submitLabel = 'Save Quiz',
  title = 'Quiz',
}: Props) => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [isRecycleModalOpen, setIsRecycleModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [selectedRecycledQuestions, setSelectedRecycledQuestions] = useState<
    Question[]
  >([]);

  const methods = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues,
  });

  const addQuestionMethods = useForm<{ question: string; answer: string }>({
    resolver: zodResolver(
      z.object({
        question: z.string().min(3, 'Question must be at least 3 characters'),
        answer: z.string().min(3, 'Answer must be at least 3 characters'),
      })
    ),
    defaultValues: { question: '', answer: '' },
  });

  const {
    control,
    formState: { isSubmitting, errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  // Watch the actual form values - fields from useFieldArray is just metadata
  const watchedQuestions = useWatch({
    control,
    name: 'questions',
  });

  // Merge field IDs with watched values for the DataTable
  const tableRows = useMemo(
    () =>
      fields.map((field, index) => ({
        ...field,
        question: watchedQuestions?.[index]?.question ?? field.question,
        answer: watchedQuestions?.[index]?.answer ?? field.answer,
      })),
    [fields, watchedQuestions]
  );

  const columns: Column<any>[] = useMemo(
    () => [
      {
        id: 'index',
        label: '#',
        minWidth: 50,
        format: (_value: any, _row: any, index: number) => index + 1,
      },
      {
        id: 'question',
        label: 'Question',
        minWidth: 250,
        format: (value: string) => (
          <PreviewText
            text={value}
            limit={80}
            variant="body2"
            sx={{ fontWeight: 500 }}
          />
        ),
      },
      {
        id: 'answer',
        label: 'Answer',
        minWidth: 250,
        format: (value: string) => (
          <PreviewText
            text={value}
            limit={80}
            variant="body2"
            color="text.secondary"
          />
        ),
      },
      {
        id: 'actions',
        label: 'Actions',
        minWidth: 100,
        align: 'right',
        sortable: false,
        format: (_value: any, _row: any, index: number) => (
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{ display: 'flex', gap: 0.5, justifyContent: 'flex-end' }}
          >
            <Button
              isIconButton
              size="small"
              color="primary"
              onClick={() => {
                setEditingIndex(index);
                setIsQuestionModalOpen(true);
              }}
              icon={<EditIcon sx={{ fontSize: 20 }} />}
              tooltip="Edit Question"
            />
            <Button
              isIconButton
              size="small"
              color="error"
              onClick={() => remove(index)}
              icon={<DeleteIcon sx={{ fontSize: 20 }} />}
              tooltip="Delete Question"
              disabled={tableRows.length <= 1}
            />
          </Box>
        ),
      },
    ],
    [tableRows, remove]
  );

  const handlePushRecycled = () => {
    if (selectedRecycledQuestions.length > 0) {
      const currentQuestions = methods.getValues('questions') || [];

      const toAdd = selectedRecycledQuestions.filter(
        (newQ) =>
          !currentQuestions.some(
            (currQ) =>
              (newQ.id && currQ.id === newQ.id) ||
              currQ.question.trim().toLowerCase() ===
                newQ.question.trim().toLowerCase()
          )
      );

      const skippedCount = selectedRecycledQuestions.length - toAdd.length;

      if (toAdd.length > 0) {
        // If we have a single empty question, remove it first
        const questions = methods.getValues('questions') || [];
        if (
          questions.length === 1 &&
          !questions[0].question &&
          !questions[0].answer
        ) {
          remove(0);
        }

        append(
          toAdd.map((q) => ({
            id: q.id,
            question: q.question,
            answer: q.answer,
          }))
        );

        if (skippedCount > 0) {
          showNotification(
            `Added ${toAdd.length} questions, skipped ${skippedCount} duplicates`,
            'info'
          );
        } else {
          showNotification(
            `Successfully added ${toAdd.length} questions`,
            'success'
          );
        }
      } else if (skippedCount > 0) {
        showNotification(
          'All selected questions are already in the quiz',
          'warning'
        );
      }

      setIsRecycleModalOpen(false);
      setSelectedRecycledQuestions([]);
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
            autoFocus
          />

          <Divider sx={{ my: 2 }} />

          {fields.length > 0 && (
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
                      errors.questions?.message ||
                      errors.questions?.root?.message
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
                  onAdd={() => {
                    addQuestionMethods.reset({ question: '', answer: '' });
                    setEditingIndex(null);
                    setIsQuestionModalOpen(true);
                  }}
                />
              </Box>
            </Box>
          )}

          <Box sx={{ mb: 2 }}>
            {fields.length > 0 ? (
              <DataTable
                columns={columns}
                rows={tableRows}
                canEdit={true}
                height={300}
                emptyMessage="No questions added yet. Click 'Add Question' or 'Recycle' to start!"
                onRowClick={(_row: any, index?: number) => {
                  if (index !== undefined) {
                    setEditingIndex(index);
                    setIsQuestionModalOpen(true);
                  }
                }}
              />
            ) : (
              <Paper
                sx={{
                  p: 4,
                  borderRadius: 3,
                  border: '2px dashed',
                  borderColor:
                    errors.questions?.message || errors.questions?.root?.message
                      ? 'error.main'
                      : 'divider',
                  bgcolor:
                    errors.questions?.message || errors.questions?.root?.message
                      ? 'rgba(var(--mui-palette-error-mainChannel), 0.04)'
                      : 'background.paper',
                }}
              >
                <Box sx={{ mb: 2 }}>
                  <PreviewText
                    variant="h6"
                    sx={{ fontWeight: 700, mb: 1 }}
                    text="Add Your First Question"
                  />
                  <PreviewText
                    variant="body2"
                    color="text.secondary"
                    text="Start building your quiz by adding your first question below, or recycle from your history."
                  />
                  {(errors.questions?.message ||
                    errors.questions?.root?.message) && (
                    <PreviewText
                      variant="caption"
                      color="error"
                      sx={{ display: 'block', mt: 1, fontWeight: 700 }}
                      text={
                        errors.questions?.message ||
                        errors.questions?.root?.message
                      }
                    />
                  )}
                </Box>

                <FormInput<{ question: string; answer: string }>
                  name="question"
                  control={addQuestionMethods.control}
                  multiline
                  rows={3}
                  label="Question Text"
                  placeholder="What is gravity?"
                />
                <FormInput<{ question: string; answer: string }>
                  name="answer"
                  control={addQuestionMethods.control}
                  multiline
                  rows={2}
                  label="Correct Answer"
                  placeholder="A fundamental force of nature"
                />

                <Box
                  sx={{
                    display: 'flex',
                    gap: 2,
                    justifyContent: 'flex-end',
                    mt: 2,
                  }}
                >
                  <Button
                    title="Recycle from Bank"
                    icon={<HistoryIcon />}
                    variant="outlined"
                    onClick={() => setIsRecycleModalOpen(true)}
                  />
                  <Button
                    title="Add Question"
                    icon={<AddIcon />}
                    onClick={async () => {
                      const isValid = await addQuestionMethods.trigger();
                      if (isValid) {
                        append(addQuestionMethods.getValues());
                        addQuestionMethods.reset({ question: '', answer: '' });
                      }
                    }}
                  />
                </Box>
              </Paper>
            )}
          </Box>

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
          <RecycledQuestionsSelector
            onSelect={setSelectedRecycledQuestions}
            existingQuestions={methods.getValues('questions')}
          />
        </Suspense>
      </Modal>

      <Modal
        open={isQuestionModalOpen}
        onClose={() => setIsQuestionModalOpen(false)}
        title={editingIndex !== null ? 'Edit Question' : 'Add Question'}
        onConfirm={async () => {
          if (editingIndex === null) {
            const isValid = await addQuestionMethods.trigger();
            if (isValid) {
              append(addQuestionMethods.getValues());
              setIsQuestionModalOpen(false);
            }
          } else {
            const isValid = await methods.trigger([
              `questions.${editingIndex}.question` as const,
              `questions.${editingIndex}.answer` as const,
            ] as any);
            if (isValid) {
              setIsQuestionModalOpen(false);
            }
          }
        }}
        confirmText="Done"
        cancelText="Close"
      >
        <Box sx={{ p: 1 }}>
          {editingIndex !== null ? (
            <>
              <FormInput<QuizFormValues>
                name={`questions.${editingIndex}.question`}
                control={control}
                multiline
                rows={3}
                label="Question Text"
                placeholder="What is gravity?"
                autoFocus
              />
              <FormInput<QuizFormValues>
                name={`questions.${editingIndex}.answer`}
                control={control}
                multiline
                rows={2}
                label="Correct Answer"
                placeholder="A fundamental force of nature"
              />
            </>
          ) : (
            <>
              <FormInput<{ question: string; answer: string }>
                name="question"
                control={addQuestionMethods.control}
                multiline
                rows={3}
                label="Question Text"
                placeholder="What is gravity?"
                autoFocus
              />
              <FormInput<{ question: string; answer: string }>
                name="answer"
                control={addQuestionMethods.control}
                multiline
                rows={2}
                label="Correct Answer"
                placeholder="A fundamental force of nature"
              />
            </>
          )}
          <Box
            sx={{
              mt: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {((editingIndex !== null &&
              (errors.questions?.[editingIndex]?.question ||
                errors.questions?.[editingIndex]?.answer)) ||
              (editingIndex === null &&
                (addQuestionMethods.formState.errors.question ||
                  addQuestionMethods.formState.errors.answer))) && (
              <PreviewText
                variant="caption"
                color="error"
                text={
                  editingIndex !== null
                    ? errors.questions?.[editingIndex]?.question?.message ||
                      errors.questions?.[editingIndex]?.answer?.message ||
                      'Please fill in all fields'
                    : addQuestionMethods.formState.errors.question?.message ||
                      addQuestionMethods.formState.errors.answer?.message ||
                      'Please fill in all fields'
                }
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default QuizForm;
