import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isValidLength, TextLength } from '../../util';
import { useEffect, useState } from 'react';

interface UpdateDocumentDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (newDescription: string) => void;
  document: {
    documentName: string;
    documentDescription: string;
  } | null;
}

const UpdateDocumentDialog = ({
  open,
  onClose,
  onSubmit,
  document,
}: UpdateDocumentDialogProps) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (document) {
      setDescription(document.documentDescription);
    }
  }, [document]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{t('updateDocument')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2}>
          <Stack direction="row" spacing={1}>
            <Typography variant="body1">{t('documentName')}:</Typography>
            <Typography variant="body1" fontWeight="bold">
              {document?.documentName}
            </Typography>
          </Stack>
          <TextField
            multiline
            rows={4}
            fullWidth
            label={t('documentDescription')}
            value={description}
            placeholder={`${t('enter')} ${t(
              'documentDescription'
            ).toLowerCase()}...`}
            onChange={(e) => {
              const newValue = e.target.value;
              if (isValidLength(newValue, TextLength.VERY_LONG)) {
                setDescription(newValue);
              }
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onSubmit(description)} variant="contained">
          {t('confirm')}
        </Button>
        <Button onClick={onClose} variant="outlined">
          {t('cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateDocumentDialog;
