import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Tags } from '../../component';
import type { VectorStore } from '../../@types/entities';
import { useState } from 'react';

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
  const [selectedStore, setSelectedStore] = useState<VectorStore | null>(null);

  const fakeStores: VectorStore[] = [
    { id: '1', name: 'chroma_db' },
    { id: '2', name: 'faiss_store' },
    { id: '3', name: 'pinecone_vector' },
    { id: '4', name: 'milvus_index' },
  ];

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
              options={fakeStores}
              limitTags={3}
              label={t('selectVectorStore')}
              getOptionLabel={(option) => option.name}
              onChange={(v) => {
                const value = v as VectorStore;
                setSelectedStore(value);
              }}
            />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
        <Button
          onClick={() => {
            if (selectedStore) {
              onSubmit(selectedStore);
            }
          }}
          variant="contained"
          color="primary"
        >
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectStoreToEmbedDialog;
