// components/ConfirmDeleteDialog.tsx
import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import { Delete } from '@mui/icons-material';
import AppSnackbar from './AppSnackbar';

interface ConfirmDialogProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onDelete: () => Promise<void> | void;
  deleteButtonProps?: {
    variant?: 'text' | 'outlined' | 'contained';
    size?: 'small' | 'medium' | 'large';
    color?:
      | 'inherit'
      | 'primary'
      | 'secondary'
      | 'error'
      | 'info'
      | 'success'
      | 'warning';
    disabled?: boolean;
  };
  triggerButton?: React.ReactNode;
  successMessage?: string;
  errorMessage?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmText,
  cancelText,
  onDelete,
  deleteButtonProps = { variant: 'outlined', size: 'small', color: 'error' },
  triggerButton,
  successMessage,
  errorMessage,
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'warning' | 'info',
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onDelete();
      setOpen(false);
      setSnackbar({
        open: true,
        message: successMessage || '',
        severity: 'success',
      });
    } catch (error) {
      console.error('Delete error:', error);
      setSnackbar({
        open: true,
        message: errorMessage || '',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <>
      {/* Trigger Button */}
      {triggerButton ? (
        <div onClick={handleClickOpen}>{triggerButton}</div>
      ) : (
        <IconButton onClick={handleClickOpen} {...deleteButtonProps}>
          <Delete />
        </IconButton>
      )}

      {/* Confirm Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {message}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={loading}
            variant="outlined"
            size="small"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            autoFocus
            disabled={loading}
            variant="contained"
            color="error"
            size="small"
          >
            {loading ? 'Đang xóa...' : confirmText}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alert */}
      <AppSnackbar
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={handleSnackbarClose}
      />
    </>
  );
};

export default ConfirmDialog;
