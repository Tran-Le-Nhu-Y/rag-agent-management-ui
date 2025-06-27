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
import { isValidLength, TextLength } from '../util';

type CreateLabelDialogProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (label: { name: string; description: string }) => void;
};

const CreateLabelDialog = ({
  open,
  onClose,
  onSubmit,
}: CreateLabelDialogProps) => {
  const { t } = useTranslation();
  const [labelInfo, setLabelInfo] = useState({ name: '', description: '' });

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
  const handleSubmit = () => {
    if (
      isValidLength(labelInfo.name, TextLength.LONG) &&
      isValidLength(labelInfo.description, TextLength.VERY_LONG)
    ) {
      onSubmit(labelInfo);
      resetForm();
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
          onClick={handleSubmit}
          disabled={
            !isValidLength(labelInfo.name, TextLength.LONG) ||
            !isValidLength(labelInfo.description, TextLength.VERY_LONG)
          }
        >
          {t('confirm')}
        </Button>
        <Button size="small" onClick={handleClose}>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateLabelDialog;
