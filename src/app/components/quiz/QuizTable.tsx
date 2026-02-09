import { type ReactNode } from 'react';
import { Box } from '@mui/material';
import {
  Delete as DeleteIcon,
  PlayArrow as PlayIcon,
  ContentCopy as ShareIcon,
} from '@mui/icons-material';
import { DataTable, type Column, Button, PreviewText } from '../ui';
import type { QuizDetail } from '../../../api';
import { useAuth } from '../../context/AuthContext';
import { useCallback } from 'react';
import { useQuizSharing } from '../../hooks/useQuizSharing';

type Props = {
  quizzes: QuizDetail[];
  loading?: boolean;
  onEdit: (id: string) => void;
  onSolve: (id: string) => void;
  onDelete: (item: QuizDetail) => void;
  title?: string;
  actions?: ReactNode;
};

const QuizTable = ({
  quizzes,
  loading = false,
  onEdit,
  onSolve,
  onDelete,
  title,
  actions,
}: Props) => {
  const { isAdmin } = useAuth();
  const { shareQuiz } = useQuizSharing();

  const handleShare = useCallback(
    (id: string) => {
      shareQuiz(id);
    },
    [shareQuiz]
  );

  const columns: Column<QuizDetail>[] = [
    {
      id: 'name',
      label: 'Quiz Name',
      minWidth: 170,
      format: (value, row) => (
        <Box>
          <PreviewText variant="subtitle1" text={value} useLimit={true} />
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
          {isAdmin && (
            <>
              <Button
                isIconButton
                color="info"
                onClick={() => row.id && handleShare(row.id)}
                icon={<ShareIcon sx={{ fontSize: 20 }} />}
                tooltip="Share Quiz Link"
              />
              <Button
                isIconButton
                color="error"
                onClick={() => onDelete(row)}
                icon={<DeleteIcon />}
                tooltip="Delete Quiz"
              />
            </>
          )}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ opacity: loading ? 0.7 : 1 }}>
      <DataTable<QuizDetail>
        title={title}
        actions={actions}
        columns={columns}
        rows={quizzes}
        loading={loading}
        height={600}
        onRowClick={(row) => {
          if (!row.id) return;
          if (isAdmin) {
            onEdit(row.id);
          } else {
            onSolve(row.id);
          }
        }}
      />
    </Box>
  );
};

export default QuizTable;
