import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material';
import { useSnackbar } from '../hook';

interface ConfirmDialogProps {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  open?: boolean;
  onClose?: () => void;
  onDelete: () => Promise<void> | void;
  successMessage?: string;
  errorMessage?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  confirmText,
  cancelText,
  open = false,
  onClose,
  onDelete,
  successMessage,
  errorMessage,
}) => {
  const [loading, setLoading] = useState(false);
  const snackbar = useSnackbar();

  const handleClose = () => {
    if (!loading) {
      onClose?.();
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onDelete();
      handleClose();
      snackbar.show({
        message: successMessage || '',
        severity: 'success',
      });
    } catch (error) {
      console.error('Delete error:', error);
      snackbar.show({
        message: errorMessage || '',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
