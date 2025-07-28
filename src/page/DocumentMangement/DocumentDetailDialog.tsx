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
import type { DocumentInfo } from '../../@types/entities';

interface DocumentDetailDialogProps {
  open: boolean;
  onClose: () => void;
  document: DocumentInfo | null;
}

const DocumentDetailDialog = ({
  open,
  onClose,
  document,
}: DocumentDetailDialogProps) => {
  const { t } = useTranslation();

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
            <Typography variant="body1">{document?.name ?? ''}</Typography>
          </Stack>
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" color="textSecondary">
              {t('documentDescription')}:
            </Typography>
            <Typography variant="body1">
              {document?.description ?? ''}
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" color="textSecondary">
              {t('createAt')}:
            </Typography>
            <Typography variant="body1">
              {document?.created_at ? document.created_at : ''}
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" color="textSecondary">
              {t('embedded_to_bm25')}:
            </Typography>
            <Typography variant="body1">
              {document?.embedded_to_bm25 ? t('embedded') : t('unembedded')}
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" color="textSecondary">
              {t('storeName')}:
            </Typography>
            <Typography variant="body1">
              {document?.embedded_to_vs ?? t('unembedded')}
            </Typography>
          </Stack>
          <Stack direction={'row'} spacing={1}>
            <Typography variant="body1" color="textSecondary">
              {t('source')}:
            </Typography>
            <Typography variant="body1">
              {document?.source === 'UPLOADED' ? t('uploaded') : t('external')}
            </Typography>
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
