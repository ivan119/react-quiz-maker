import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import { Box, Checkbox, Chip, FormControlLabel, Switch } from '@mui/material';
import {
  History as HistoryIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Close as CloseIcon,
  FilterList as FilterListIcon,
  FilterListOff as FilterListOffIcon,
} from '@mui/icons-material';
import { questionService } from '../../../api';
import { type Question } from '../../../shared/types/quiz';
import { PreviewText, DataTable, type Column } from '../ui';

interface Props {
  onSelect: (questions: Question[]) => void;
  existingQuestions?: { id?: string; question: string; answer: string }[];
}

export const RecycledQuestionsSelector = ({
  onSelect,
  existingQuestions = [],
}: Props) => {
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(
    new Set()
  );

  const [hideInQuiz, setHideInQuiz] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await questionService.getAllQuestions();
        setAllQuestions(data);
      } catch (err) {
        console.error('Failed to fetch recycled questions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const selectedQuestions = useMemo(() => {
    return allQuestions.filter((q) => q.id && selectedIds.has(q.id));
  }, [allQuestions, selectedIds]);

  const toggleSelection = useCallback((id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  // Notify parent on every selection change
  useEffect(() => {
    onSelect(selectedQuestions);
  }, [selectedQuestions, onSelect]);

  // Helper to check if a question is already in quiz
  const isQuestionInQuiz = useCallback(
    (q: Question) =>
      existingQuestions.some(
        (eq) =>
          (q.id && eq.id === q.id) ||
          eq.question.trim().toLowerCase() === q.question.trim().toLowerCase()
      ),
    [existingQuestions]
  );

  const displayQuestions = useMemo(() => {
    if (!hideInQuiz) return allQuestions;
    return allQuestions.filter((q) => !isQuestionInQuiz(q));
  }, [allQuestions, hideInQuiz, isQuestionInQuiz]);

  const getQuestionRowSx = useCallback(
    (row: Question) =>
      isQuestionInQuiz(row)
        ? { bgcolor: 'rgba(0,0,0,0.02)', opacity: 0.6 }
        : {},
    [isQuestionInQuiz]
  );

  const columns: Column<Question>[] = useMemo(
    () => [
      {
        id: 'select',
        label: '',
        minWidth: 50,
        sortable: false,
        format: (_value: any, row: Question): ReactNode => {
          const isSelected = !!(row.id && selectedIds.has(row.id));
          const isInQuiz = isQuestionInQuiz(row);
          return (
            <Checkbox
              checked={isSelected}
              disabled={isInQuiz}
              color="primary"
              icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 20 }} />}
              checkedIcon={<CheckBoxIcon sx={{ fontSize: 20 }} />}
              onClick={(e) => {
                e.stopPropagation();
                if (row.id && !isInQuiz) toggleSelection(row.id);
              }}
              sx={{ p: 0 }}
            />
          );
        },
      },
      {
        id: 'question',
        label: 'Question',
        minWidth: 250,
        format: (value: string, row: Question): ReactNode => {
          const isInQuiz = isQuestionInQuiz(row);
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PreviewText
                text={value}
                variant="body2"
                sx={{ fontWeight: 600 }}
              />
              {isInQuiz && (
                <Chip
                  label="In Quiz"
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{
                    height: 18,
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    borderRadius: 1,
                    opacity: 0.8,
                  }}
                />
              )}
            </Box>
          );
        },
      },
      {
        id: 'answer',
        label: 'Answer',
        minWidth: 200,
        format: (value: string): ReactNode => (
          <PreviewText text={value} variant="body2" color="text.secondary" />
        ),
      },
    ],
    [selectedIds, isQuestionInQuiz, toggleSelection]
  );

  if (allQuestions.length === 0 && !loading) {
    return (
      <Box
        sx={{
          textAlign: 'center',
          p: 6,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <HistoryIcon
          sx={{ fontSize: 48, color: 'text.disabled', opacity: 0.5 }}
        />
        <PreviewText
          text="Your question history is empty."
          variant="h6"
          sx={{ fontWeight: 600, color: 'text.primary' }}
        />
        <PreviewText
          text="Create and save a quiz with some questions first to build your question bank for recycling!"
          variant="body2"
          color="text.secondary"
        />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        gap: 2.5,
      }}
    >
      <DataTable<Question>
        searchable
        searchFields={['question', 'answer']}
        searchPlaceholder="Search question bank..."
        showSelectionAction
        selectedIds={selectedIds}
        onSelectionChange={setSelectedIds}
        isRowSelectable={(row) => !isQuestionInQuiz(row)}
        getRowSx={getQuestionRowSx}
        actions={
          <FormControlLabel
            control={
              <Switch
                size="small"
                checked={hideInQuiz}
                onChange={(e) => setHideInQuiz(e.target.checked)}
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                {hideInQuiz ? (
                  <FilterListIcon sx={{ fontSize: 16 }} />
                ) : (
                  <FilterListOffIcon sx={{ fontSize: 16 }} />
                )}
                <PreviewText
                  text="Hide Added"
                  variant="caption"
                  sx={{ fontWeight: 700, textTransform: 'uppercase' }}
                />
              </Box>
            }
            sx={{ ml: 1, mr: 0 }}
          />
        }
        columns={columns}
        rows={displayQuestions}
        canEdit={true}
        height={320}
        loading={loading}
        emptyMessage="No questions match your search."
        onRowClick={(row) => {
          if (row.id && !isQuestionInQuiz(row)) toggleSelection(row.id);
        }}
      />

      <Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
          <HistoryIcon sx={{ fontSize: 16, color: 'primary.main' }} />
          <PreviewText
            text={`${selectedIds.size} Questions Selected`}
            variant="caption"
            sx={{
              fontWeight: 900,
              color: 'primary.main',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          />
        </Box>

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            flexWrap: 'nowrap',
            overflowX: 'auto',
            pb: 1,
            minHeight: 40,
            alignItems: 'center',
            '&::-webkit-scrollbar': { height: 4 },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: 'divider',
              borderRadius: 2,
            },
          }}
        >
          {selectedQuestions.length === 0 ? (
            <PreviewText
              text="Select questions from the list above to include them in your quiz."
              variant="caption"
              color="text.disabled"
              sx={{ fontStyle: 'italic' }}
            />
          ) : (
            selectedQuestions.map((q) => (
              <Chip
                key={q.id}
                label={q.question}
                onDelete={() => q.id && toggleSelection(q.id)}
                color="primary"
                variant="outlined"
                deleteIcon={<CloseIcon style={{ fontSize: 14 }} />}
                sx={{
                  maxWidth: 200,
                  borderRadius: 2,
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  borderWidth: 1.5,
                  bgcolor: 'rgba(var(--mui-palette-primary-mainChannel), 0.05)',
                  '& .MuiChip-label': { px: 1.5 },
                }}
              />
            ))
          )}
        </Box>
      </Box>
    </Box>
  );
};
