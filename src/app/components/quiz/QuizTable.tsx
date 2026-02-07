import { Box } from '@mui/material';
import {
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
} from '@mui/icons-material';
import { DataTable, type Column, Button, PreviewText } from '../ui';
import type { QuizDetail } from '../../../api';

type Props = {
  quizzes: QuizDetail[];
  loading?: boolean;
  onEdit: (id: string) => void;
  onSolve: (id: string) => void;
  onDelete: (item: QuizDetail) => void;
};

const QuizTable = ({
  quizzes,
  loading = false,
  onEdit,
  onSolve,
  onDelete,
}: Props) => {
  const columns: Column<QuizDetail>[] = [
    {
      id: 'name',
      label: 'Quiz Name',
      minWidth: 170,
      format: (value, row) => (
        <Box>
          <PreviewText variant="subtitle1" text={value} />
          <PreviewText
            variant="caption"
            color="text.secondary"
            text={`${row.questions.length} questions`}
          />
        </Box>
      ),
    },
    {
      id: 'actions',
      label: 'Actions',
      minWidth: 100,
      align: 'right',
      sortable: false,
      format: (_, row) => (
        <Box onClick={(e) => e.stopPropagation()}>
          <Button
            isIconButton
            color="primary"
            onClick={() => row.id && onSolve(row.id)}
            icon={<PlayIcon />}
            tooltip="Solve Quiz"
          />
          <Button
            isIconButton
            color="error"
            onClick={() => onDelete(row)}
            icon={<DeleteIcon />}
            tooltip="Delete Quiz"
          />
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ opacity: loading ? 0.7 : 1 }}>
      <DataTable<QuizDetail>
        columns={columns}
        rows={quizzes}
        initialRowsPerPage={10}
        loading={loading}
        onRowClick={(row) => row.id && onEdit(row.id)}
      />
    </Box>
  );
};

export default QuizTable;
