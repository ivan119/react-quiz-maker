import { memo } from 'react';
import {
  type Control,
  type UseFieldArrayRemove,
  useWatch,
} from 'react-hook-form';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { FormInput, Button } from '../ui';
import { type QuizFormValues } from '../../lib/validators/quiz.schema';

type QuizQuestionItemProps = {
  control: Control<QuizFormValues>;
  index: number;
  remove: UseFieldArrayRemove;
  isExpanded: boolean;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  canRemove: boolean;
  hasError?: boolean;
};

export const QuizQuestionItem = memo(
  ({
    control,
    index,
    remove,
    isExpanded,
    onChange,
    canRemove,
    hasError,
  }: QuizQuestionItemProps) => {
    // Watch only this specific question's title
    const questionTitle = useWatch({
      control,
      name: `questions.${index}.question`,
    });

    return (
      <Accordion
        expanded={isExpanded}
        onChange={onChange}
        sx={{
          mb: 1,
          borderRadius: '8px !important',
          '&:before': { display: 'none' },
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: hasError ? 'error.main' : 'inherit',
              transition: 'color 0.2s ease',
            }}
          >
            {questionTitle || `New Question #${index + 1}`}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <FormInput<QuizFormValues>
            name={`questions.${index}.question`}
            control={control}
            multiline
            helperText=" "
            label="Question Text"
          />
          <FormInput<QuizFormValues>
            name={`questions.${index}.answer`}
            control={control}
            helperText=" "
            multiline
            label="Correct Answer"
          />

          {canRemove && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                size="small"
                color="error"
                icon={<DeleteIcon />}
                onClick={() => remove(index)}
                title="Remove Question"
              />
            </Box>
          )}
        </AccordionDetails>
      </Accordion>
    );
  }
);
