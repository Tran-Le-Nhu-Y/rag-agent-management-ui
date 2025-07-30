import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isValidLength, TextLength } from '../../util';
import { useCreateLabel } from '../../service';
import { useSnackbar } from '../../hook';
import { LabelError } from '../../util/errors';

type CreateLabelDialogProps = {
  open: boolean;
  onClose: () => void;
};

const DEFAULT_VALUE = { name: '', description: '' };

const CreateLabelDialog = ({ open, onClose }: CreateLabelDialogProps) => {
  const { t } = useTranslation();
  const [labelInfo, setLabelInfo] = useState(DEFAULT_VALUE);
  const snackbar = useSnackbar();

  const handleChange =
    (field: 'name' | 'description') =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setLabelInfo((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const resetForm = () => {
    setLabelInfo({ name: '', description: '' });
  };
  const handleClose = () => {
    resetForm();
    onClose();
  };

  const [createLabelTrigger, createLabel] = useCreateLabel();
  const handleCreateLabelSubmit = async () => {
    const validateFields = () => {
      if (labelInfo.name.trim().length === 0) {
        snackbar.show({
          message: t('blankLabelName'),
          severity: 'warning',
        });
        return false;
      }

      if (!isValidLength(labelInfo.name, TextLength.LONG)) {
        return false;
      }

      if (!isValidLength(labelInfo.description, TextLength.VERY_LONG)) {
        return false;
      }

      return true;
    };

    if (!validateFields()) return;

    try {
      await createLabelTrigger(labelInfo).unwrap();
      snackbar.show({
        message: t('createLabelSuccess'),
        severity: 'success',
      });
    } catch (error) {
      switch (error) {
        case LabelError.DUPLICATE_LABEL_NAME: {
          snackbar.show({
            message: t('duplicateLabelNameError'),
            severity: 'warning',
          });
          break;
        }
        case LabelError.UNKNOWN_ERROR: {
          snackbar.show({
            message: t('createLabelError'),
            severity: 'error',
          });
          break;
        }
      }
      console.error(error);
    } finally {
      setLabelInfo(DEFAULT_VALUE);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center">
        <strong>{t('createLabel')}</strong>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <TextField
            fullWidth
            label={t('labelName')}
            value={labelInfo.name}
            helperText={t('hyperTextLong')}
            placeholder={`${t('enter')} ${t('labelName').toLowerCase()}...`}
            onChange={handleChange('name')}
            error={!isValidLength(labelInfo.name, TextLength.LONG)}
          />
          <TextField
            multiline
            rows={2}
            fullWidth
            label={t('labelDescription')}
            value={labelInfo.description}
            helperText={t('hyperTextVeryLong')}
            placeholder={`${t('enter')} ${t(
              'labelDescription'
            ).toLowerCase()}...`}
            onChange={handleChange('description')}
            error={!isValidLength(labelInfo.description, TextLength.VERY_LONG)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          size="small"
          variant="contained"
          onClick={handleCreateLabelSubmit}
          disabled={
            !isValidLength(labelInfo.name, TextLength.LONG) ||
            !isValidLength(labelInfo.description, TextLength.VERY_LONG)
          }
          loading={createLabel.isLoading}
        >
          {t('confirm')}
        </Button>
        <Button
          size="small"
          onClick={handleClose}
          disabled={createLabel.isLoading}
        >
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLabelDialog;
