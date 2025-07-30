import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  TextField,
  DialogActions,
  Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { isValidLength, TextLength } from '../../util';
import { useSnackbar } from '../../hook';
import { useUpdateLabel } from '../../service';
import type { Label } from '../../@types/entities';

type UpdateLabelDialogProps = {
  open: boolean;
  onClose: () => void;
  label: Label;
};

const DEFAULT_SNAPSHOT: Label = {
  id: 'placeholder-label-snapshot',
  name: '',
  description: '',
  source: 'CREATED',
};

const UpdateLabelDialog = ({
  open,
  onClose,
  label,
}: UpdateLabelDialogProps) => {
  const { t } = useTranslation();
  const [dataSnapshot, setDataSnapshot] = useState<Label>();
  const snackbar = useSnackbar();

  useEffect(() => {
    setDataSnapshot(label);
  }, [label]);

  const [updateLabelTrigger, updateLabel] = useUpdateLabel();
  const handleUpdateLabelSubmit = async () => {
    const validateFields = () => {
      if (
        !isValidLength(dataSnapshot?.description ?? '', TextLength.VERY_LONG)
      ) {
        return false;
      }

      return true;
    };

    if (!validateFields()) return;

    try {
      await updateLabelTrigger({
        labelId: label.id,
        description: dataSnapshot?.description ?? '',
      }).unwrap();

      snackbar.show({
        message: t('updateLabelSuccess'),
        severity: 'success',
      });
    } catch (error) {
      snackbar.show({
        message: t('createLabelError'),
        severity: 'error',
      });
      console.error(error);
    } finally {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle align="center">
        <strong>{t('updateLabel')}</strong>
      </DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack direction={'row'} alignItems={'center'} spacing={1}>
            <Typography variant="h6">{t('labelName')}:</Typography>
            <Typography variant="body1">{label.name}</Typography>
          </Stack>
          <TextField
            multiline
            rows={2}
            fullWidth
            label={t('labelDescription')}
            value={dataSnapshot?.description ?? ''}
            helperText={t('hyperTextVeryLong')}
            placeholder={`${t('enter')} ${t(
              'labelDescription'
            ).toLowerCase()}...`}
            onChange={(e) =>
              setDataSnapshot((pre) => {
                if (pre === undefined) return DEFAULT_SNAPSHOT;
                return {
                  ...pre,
                  description: e.target.value,
                };
              })
            }
            error={
              !isValidLength(
                dataSnapshot?.description ?? '',
                TextLength.VERY_LONG
              )
            }
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          size="small"
          variant="contained"
          onClick={handleUpdateLabelSubmit}
          disabled={
            !isValidLength(
              dataSnapshot?.description ?? '',
              TextLength.VERY_LONG
            )
          }
          loading={updateLabel.isLoading}
        >
          {t('confirm')}
        </Button>
        <Button size="small" onClick={onClose} disabled={updateLabel.isLoading}>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateLabelDialog;
