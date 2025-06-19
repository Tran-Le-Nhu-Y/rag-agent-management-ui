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
  onSubmit: () => void;
}

const SelectStoreToEmbedDialog = ({
  open,
  onClose,
  onSubmit,
}: SelectStoreToEmbedDialogProps) => {
  const { t } = useTranslation();
  const [, setSelectedStore] = useState<VectorStore>();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center">
        <strong>{t('selectStore')}</strong>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack spacing={1}>
            <Tags
              options={[{ name: '' }]}
              limitTags={3}
              label={t('selectVectorStore')}
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
        <Button onClick={onSubmit} variant="contained" color="primary">
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectStoreToEmbedDialog;
