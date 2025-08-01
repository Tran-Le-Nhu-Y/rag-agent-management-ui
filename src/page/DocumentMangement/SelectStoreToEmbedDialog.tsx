import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Tags } from '../../component';
import { useEmbedDocument, useGetAgentStatus } from '../../service';
import { useSnackbar } from '../../hook';
import { useState } from 'react';

interface SelectStoreToEmbedDialogProps {
  documentId: string | null;
  onClose: () => void;
}

const SelectStoreToEmbedDialog = ({
  documentId,
  onClose,
}: SelectStoreToEmbedDialogProps) => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const agentStatusQuery = useGetAgentStatus();

  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [embedDocumentTrigger, embedDocument] = useEmbedDocument();
  const embedDocumentHandler = async () => {
    if (!documentId || !selectedStore) return;

    try {
      await embedDocumentTrigger({
        documentId: documentId,
        storeName: selectedStore,
      }).unwrap();
      snackbar.show({
        message: t('embedDocumentSuccess'),
        severity: 'success',
      });
    } catch (err) {
      console.error(err);
      snackbar.show({
        message: t('embedDocumentFailed'),
        severity: 'error',
      });
    } finally {
      onClose();
    }
  };

  return (
    <Dialog
      open={documentId !== null}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle align="center">
        <strong>{t('selectStore')}</strong>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Tags
              //   multiple
              options={agentStatusQuery.data?.available_vector_stores ?? []}
              limitTags={3}
              loading={
                agentStatusQuery.isLoading || agentStatusQuery.isFetching
              }
              getOptionLabel={(option) => option}
              label={t('selectVectorStore')}
              onChange={(v) => {
                setSelectedStore(v as string);
              }}
            />
          </Stack>
          <Typography variant="body1">{t('embedDocumentNote')}</Typography>
          <Typography variant="body1">
            {t('embedDocumentCheckStatusNote')}
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={embedDocumentHandler}
          variant="contained"
          color="primary"
          loading={embedDocument.isLoading}
        >
          {t('confirm')}
        </Button>
        <Button onClick={onClose} disabled={embedDocument.isLoading}>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectStoreToEmbedDialog;
