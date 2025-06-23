import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { AppSnackbar, Tags } from '../../component';
import { useTranslation } from 'react-i18next';
import { useGetAllLabel } from '../../service';
import { useEffect, useState } from 'react';
import { HideDuration, SnackbarSeverity } from '../../util';
import { Stack } from '@mui/material';
import type { Label } from '../../@types/entities';
import { downloadFile, getExportingTokenByLabelId } from '../../service/api';

type FormDialogProps = {
  open: boolean;
  onClose: () => void;
};

export default function SelectLabelToExportDialog({
  open,
  onClose,
}: FormDialogProps) {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedLabelId, setSelectedLabelId] = useState<string>('');

  // Query to get all labels
  const labels = useGetAllLabel();
  useEffect(() => {
    if (labels.isError) {
      setSnackbarMessage(t('labelLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [labels.isError, t]);

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
      } catch (error) {
        console.error(error);
        setSnackbarMessage(t('imageExportError'));
        setSnackbarSeverity(SnackbarSeverity.ERROR);
        setSnackbarOpen(true);
      }
    },
    [t]
  );

  return (
    <React.Fragment>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
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
              handleExportByLabelId(selectedLabelId);
              onClose();
            }}
            disabled={selectedLabelId.length === 0} // disable if not select
          >
            {t('confirm')}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
