import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Tags } from '../../component';
import { useTranslation } from 'react-i18next';
import { useGetAllLabel } from '../../service';
import { useEffect, useState } from 'react';
import { Stack } from '@mui/material';
import type { Label } from '../../@types/entities';
import { downloadFile, getExportingTokenByLabelId } from '../../service/api';
import { useSnackbar } from '../../hook';
import type { AxiosError } from 'axios';

type FormDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function SelectLabelToExportDialog({
  open,
  onClose,
}: FormDialogProps) {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const [selectedLabelId, setSelectedLabelId] = useState<string | null>(null);

  // Query to get all labels
  const labels = useGetAllLabel();
  useEffect(() => {
    if (labels.isError)
      snackbar.show({
        message: t('labelLoadingError'),
        severity: 'error',
      });
  }, [labels.isError, snackbar, t]);

  const handleExportByLabelId = React.useCallback(
    async (labelId: string) => {
      try {
        const path = await getExportingTokenByLabelId(labelId);

        // create "a" HTML element with href to file & click
        const link = document.createElement('a');
        link.href = downloadFile(path);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();

        // clean up "a" element
        document.body.removeChild(link);
      } catch (err) {
        const error = err as AxiosError;
        const msgErrorData = error.response?.data as
          | { message: string }
          | undefined;
        if (
          msgErrorData?.message?.includes(
            'No assigned images has label with id'
          )
        ) {
          snackbar.show({
            message: t('noAssginedImages'),
            severity: 'error',
          });
        } else {
          snackbar.show({
            message: t('imageExportError'),
            severity: 'error',
          });
        }
        console.error(error);
      }
    },
    [snackbar, t]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('selectLabelToExport')}</DialogTitle>
      <DialogContent>
        <Stack sx={{ mt: 1 }}>
          <Tags
            options={labels.data ?? []}
            getOptionLabel={(option) => option.name}
            loading={labels.isLoading}
            limitTags={1}
            label={t('downloadImagesByLabel')}
            onChange={(value) => {
              const tag = value as Label;
              const labelId = tag.id;
              setSelectedLabelId(labelId);
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          {t('cancel')}
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={() => {
            handleExportByLabelId(selectedLabelId!);
            onClose();
          }}
          disabled={selectedLabelId === null} // disable if not select
        >
          {t('confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
