import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';
import {
  Box,
  Checkbox,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  History as HistoryIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { questionService } from '../../../api';
import { type Question } from '../../../shared/types/quiz';
import { PreviewText, Button, DataTable, type Column } from '../ui';

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
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

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

  const filteredQuestions = useMemo(() => {
    if (!search.trim()) return allQuestions;
    const lowerSearch = search.toLowerCase();
    return allQuestions.filter(
      (q) =>
        q.question.toLowerCase().includes(lowerSearch) ||
        q.answer.toLowerCase().includes(lowerSearch)
    );
  }, [allQuestions, search]);

  const selectedQuestions = useMemo(() => {
    return allQuestions.filter((q) => q.id && selectedIds.has(q.id));
  }, [allQuestions, selectedIds]);

  const toggleSelection = useCallback((id: string) => {
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

  const isAllSelected =
    filteredQuestions.length > 0 &&
    filteredQuestions.every((q) => q.id && selectedIds.has(q.id));

  const toggleSelectAll = () => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (isAllSelected) {
        filteredQuestions.forEach((q) => {
          if (q.id) next.delete(q.id);
        });
      } else {
        filteredQuestions.forEach((q) => {
          if (q.id) next.add(q.id);
        });
      }
      return next;
    });
  };

  const columns: Column<Question>[] = useMemo(
    () => [
      {
        id: 'select',
        label: '',
        minWidth: 50,
        format: (_value: any, row: Question): ReactNode => {
          const isSelected = !!(row.id && selectedIds.has(row.id));
          return (
            <Checkbox
              checked={isSelected}
              color="primary"
              icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 20 }} />}
              checkedIcon={<CheckBoxIcon sx={{ fontSize: 20 }} />}
              onClick={(e) => {
                e.stopPropagation();
                if (row.id) toggleSelection(row.id);
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
          const isInQuiz = existingQuestions.some(
            (eq) =>
              (row.id && eq.id === row.id) ||
              eq.question.trim().toLowerCase() ===
                row.question.trim().toLowerCase()
          );
          return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <PreviewText
                text={value}
                limit={60}
                variant="body2"
                sx={{ fontWeight: 600 }}
              />
              {isInQuiz && (
                <Chip
                  label="Already in Quiz"
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
          <PreviewText
            text={value}
            limit={60}
            variant="body2"
            color="text.secondary"
          />
        ),
      },
    ],
    [selectedIds, existingQuestions, toggleSelection]
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (allQuestions.length === 0) {
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
          limit={100}
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
      {/* Search & Select All Panel */}
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          fullWidth
          placeholder="Search question bank..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          variant="outlined"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'primary.main', opacity: 0.7 }} />
              </InputAdornment>
            ),
          }}
          size="small"
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'background.paper',
              transition: 'all 0.2s ease',
              '&:hover': {
                bgcolor: 'rgba(var(--mui-palette-primary-mainChannel), 0.01)',
              },
              '&.Mui-focused': {
                boxShadow:
                  '0 0 0 4px rgba(var(--mui-palette-primary-mainChannel), 0.1)',
              },
            },
          }}
        />
        <Button
          variant={isAllSelected ? 'contained' : 'outlined'}
          size="small"
          onClick={toggleSelectAll}
          icon={isAllSelected ? <CheckBoxIcon /> : <CheckBoxOutlineBlankIcon />}
          title={isAllSelected ? 'DESELECT' : 'SELECT ALL'}
          sx={{
            whiteSpace: 'nowrap',
            minWidth: 'fit-content',
            borderRadius: 3,
            fontWeight: 800,
            fontSize: '0.7rem',
          }}
        />
      </Box>

      {/* DataTable */}
      <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
        <DataTable
          columns={columns}
          rows={filteredQuestions}
          canEdit={true}
          emptyMessage="No questions match your search."
          onRowClick={(row) => {
            if (row.id) toggleSelection(row.id);
          }}
        />
      </Box>

      {/* Selection Summary Tray */}
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
