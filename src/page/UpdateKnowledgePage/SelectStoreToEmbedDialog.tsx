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
import type { VectorStore } from '../../@types/entities';
import { useState } from 'react';
import { useGetAgentStatus } from '../../service';

interface SelectStoreToEmbedDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (store: VectorStore) => void;
}

const SelectStoreToEmbedDialog = ({
  open,
  onClose,
  onSubmit,
}: SelectStoreToEmbedDialogProps) => {
  const { t } = useTranslation();
  const [selectedStore, setSelectedStore] = useState<string | null>(null);

  const agentStatusQuery = useGetAgentStatus();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
          onClick={() => {
            if (selectedStore) {
              onSubmit({ id: selectedStore, name: selectedStore });
              agentStatusQuery.refetch();
            }
          }}
          variant="contained"
          color="primary"
        >
          {t('confirm')}
        </Button>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectStoreToEmbedDialog;
