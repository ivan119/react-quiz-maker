import { useEffect, useState, useMemo, memo, useCallback } from 'react';
import {
  Box,
  Checkbox,
  CircularProgress,
  TextField,
  InputAdornment,
  Chip,
  Paper,
} from '@mui/material';
import {
  Search as SearchIcon,
  History as HistoryIcon,
  CheckBox as CheckBoxIcon,
  CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { Virtuoso } from 'react-virtuoso';
import { questionService } from '../../../api';
import { type Question } from '../../../shared/types/quiz';
import { PreviewText, Button } from '../ui';

interface Props {
  onSelect: (questions: Question[]) => void;
}

// Optimized row component
const QuestionItem = memo(
  ({
    question,
    isSelected,
    onToggle,
  }: {
    question: Question;
    isSelected: boolean;
    onToggle: (id: string) => void;
  }) => {
    const handleToggle = useCallback(() => {
      if (question.id) onToggle(question.id);
    }, [question.id, onToggle]);

    return (
      <Box
        sx={{
          p: 1.5,
          borderBottom: '1px solid',
          borderColor: 'divider',
          '&:hover': { bgcolor: 'action.hover' },
          transition: 'all 0.1s ease',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 2,
        }}
        onClick={handleToggle}
      >
        <Checkbox
          checked={isSelected}
          color="primary"
          icon={<CheckBoxOutlineBlankIcon />}
          checkedIcon={<CheckBoxIcon />}
          onChange={handleToggle}
          onClick={(e) => e.stopPropagation()}
          sx={{ p: 0.5, mt: -0.25 }}
        />
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <PreviewText
            text={question.question}
            variant="subtitle2"
            sx={{ fontWeight: 700, mb: 0.5 }}
          />
          <PreviewText
            text={question.answer}
            variant="body2"
            color="text.secondary"
          />
        </Box>
      </Box>
    );
  }
);

QuestionItem.displayName = 'QuestionItem';

export const RecycledQuestionsSelector = ({ onSelect }: Props) => {
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

      {/* Virtualized List */}
      <Paper
        elevation={0}
        sx={{
          height: 380,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Virtuoso
          data={filteredQuestions}
          itemContent={(_index, question) => {
            const isSelected = !!(question.id && selectedIds.has(question.id));
            return (
              <Box
                key={question.id}
                sx={{
                  p: 1.5,
                  px: 2,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  bgcolor: isSelected
                    ? 'rgba(var(--mui-palette-primary-mainChannel), 0.04)'
                    : 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'background-color 0.2s ease',
                  '&:hover': {
                    bgcolor:
                      'rgba(var(--mui-palette-primary-mainChannel), 0.02)',
                  },
                }}
                onClick={() => question.id && toggleSelection(question.id)}
              >
                <Checkbox
                  checked={isSelected}
                  color="primary"
                  icon={<CheckBoxOutlineBlankIcon sx={{ fontSize: 20 }} />}
                  checkedIcon={<CheckBoxIcon sx={{ fontSize: 20 }} />}
                  sx={{ p: 0 }}
                />
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <PreviewText
                    text={question.question}
                    variant="subtitle2"
                    sx={{ fontWeight: 700, mb: 0.2, color: 'text.primary' }}
                  />
                  <PreviewText
                    text={question.answer}
                    variant="caption"
                    color="text.secondary"
                    sx={{
                      display: 'block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  />
                </Box>
              </Box>
            );
          }}
        />
      </Paper>

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
