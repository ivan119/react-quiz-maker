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
  Box,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { FormInput, Button, PreviewText } from '../ui';
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
    const questionValue = useWatch({
      control,
      name: `questions.${index}.question`,
    });
    const answerValue = useWatch({
      control,
      name: `questions.${index}.answer`,
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
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            <PreviewText
              label="Question"
              text={questionValue}
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: hasError ? 'error.main' : 'inherit',
                transition: 'color 0.2s ease',
              }}
            />

            <PreviewText
              label="Answer"
              text={answerValue}
              variant="body2"
              color="text.secondary"
              sx={{ mt: 0.25 }}
            />
          </Box>
        </AccordionSummary>
        {isExpanded && (
          <AccordionDetails>
            <FormInput<QuizFormValues>
              name={`questions.${index}.question`}
              control={control}
              multiline
              helperText=" "
              maxRows={2}
              label="Question Text"
            />
            <FormInput<QuizFormValues>
              name={`questions.${index}.answer`}
              control={control}
              helperText=" "
              maxRows={5}
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
        )}
      </Accordion>
    );
  }
);
