import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface DocumentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  document: {
    documentName: string;
    documentDescription: string;
    createdAt: string;
    updatedAt: string;
    status: string;
  } | null;
}

const DocumentDetailDialog = ({
  open,
  onClose,
  document,
}: DocumentDetailDialogProps) => {
  const { t } = useTranslation();

  if (!document) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center">
        <strong>{t('documentDetail')}</strong>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Typography variant="body1" color="textSecondary">
              {t('documentName')}:
            </Typography>
            <Typography variant="body1">{document.documentName}</Typography>
          </Stack>
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" color="textSecondary">
              {t('documentDescription')}:
            </Typography>
            <Typography variant="body1">
              {document.documentDescription}
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" color="textSecondary">
              {t('createAt')}:
            </Typography>
            <Typography variant="body1">{document.createdAt}</Typography>
          </Stack>
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" color="textSecondary">
              {t('updateAt')}:
            </Typography>
            <Typography variant="body1">{document.updatedAt}</Typography>
          </Stack>
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" color="textSecondary">
              {t('usedStatus')}:
            </Typography>
            <Typography variant="body1">{document.status}</Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DocumentDetailDialog;
