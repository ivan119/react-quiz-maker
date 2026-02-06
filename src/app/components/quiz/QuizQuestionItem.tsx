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
  Button,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { FormInput } from '../ui';
import { type QuizFormValues } from '../../lib/validators/quiz.schema';

type QuizQuestionItemProps = {
  control: Control<QuizFormValues>;
  index: number;
  remove: UseFieldArrayRemove;
  isExpanded: boolean;
  onChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  canRemove: boolean;
};

export const QuizQuestionItem = memo(
  ({
    control,
    index,
    remove,
    isExpanded,
    onChange,
    canRemove,
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
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            {questionTitle || `New Question #${index + 1}`}
          </Typography>
        </AccordionSummary>

        <AccordionDetails>
          <FormInput<QuizFormValues>
            name={`questions.${index}.question`}
            control={control}
            label="Question Text"
            multiline
            rows={2}
          />
          <FormInput<QuizFormValues>
            name={`questions.${index}.answer`}
            control={control}
            label="Correct Answer"
          />

          {canRemove && (
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
    );
  }
);
