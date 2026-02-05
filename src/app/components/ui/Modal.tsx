import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

export interface ModalProps {
  /** Whether the modal is visible */
  open: boolean;
  /** Callback fired when the component requests to be closed */
  onClose: () => void;
  /** Title of the modal */
  title?: string;
  /** Content of the modal */
  children: React.ReactNode;
  /** Callback fired when the confirm button is clicked */
  onConfirm?: () => void;
  /** Callback fired when the cancel button is clicked */
  onCancel?: () => void;
  /** Text for the confirm button. Default: 'Confirm' */
  confirmText?: string;
  /** Text for the cancel button. Default: 'Cancel' */
  cancelText?: string;
  /** Whether to show the confirm button. Default: true */
  showConfirm?: boolean;
  /** Whether to show the cancel button. Default: true */
  showCancel?: boolean;
  /** Color of the confirm button. Default: 'primary' */
  confirmColor?:
    | 'inherit'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'error'
    | 'info'
    | 'warning';
  /** Max width of the modal. Default: 'sm' */
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
  /** Whether the confirm button is disabled */
  confirmDisabled?: boolean;
  /** Whether the modal is in a loading state */
  loading?: boolean;
}

/**
 * A reusable modal component based on Material UI Dialog.
 * Supports customizable actions, titles, and sizes.
 */
export const Modal = ({
  open,
  onClose,
  title,
  children,
  onConfirm,
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  showConfirm = true,
  showCancel = true,
  confirmColor = 'primary',
  maxWidth = 'sm',
  confirmDisabled = false,
  loading = false,
}: ModalProps) => {
  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth={maxWidth}
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
          backgroundImage: 'none', // Remove MUI default overlay
          bgcolor: 'background.paper',
        },
      }}
    >
      <Box sx={{ position: 'relative' }}>
        {title && (
          <DialogTitle sx={{ m: 0, p: 2.5, pr: 6 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontWeight: 700, letterSpacing: '-0.01em' }}
            >
              {title}
            </Typography>
          </DialogTitle>
        )}

        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 12,
            top: 12,
            color: (theme) => theme.palette.grey[500],
            '&:hover': {
              color: 'text.primary',
              bgcolor: 'rgba(255,255,255,0.05)',
            },
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ px: 3, pb: 3, pt: title ? 0 : 3 }}>
          <Box sx={{ color: 'text.secondary' }}>{children}</Box>
        </DialogContent>

        {(showConfirm || showCancel) && (
          <DialogActions
            sx={{ p: 2.5, px: 3, bgcolor: 'rgba(0,0,0,0.1)', gap: 1 }}
          >
            {showCancel && (
              <Button
                onClick={handleCancel}
                color="inherit"
                sx={{
                  borderRadius: 2,
                  px: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                }}
              >
                {cancelText}
              </Button>
            )}
            {showConfirm && (
              <Button
                onClick={handleConfirm}
                variant="contained"
                color={confirmColor}
                disabled={confirmDisabled || loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                  },
                }}
              >
                {loading ? 'Processing...' : confirmText}
              </Button>
            )}
          </DialogActions>
        )}
      </Box>
    </Dialog>
  );
};
