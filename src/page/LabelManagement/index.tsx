import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { CreateLabelDialog, Loading } from '../../component';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import {
  useCreateLabel,
  useDeleteLabel,
  useGetAllLabel,
  useUpdateLabel,
} from '../../service';
import { isValidLength, TextLength } from '../../util';
import type { Label } from '../../@types/entities';
import ConfirmDialog from '../../component/ConfirmDialog';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { LabelError } from '../../util/errors';
import { useSnackbar } from '../../hook';

const LabelManagementPage = () => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const [labelIdToDelete, setLabelIdToDelete] = useState<string | null>(null);
  const [createLabelDialogOpen, setCreateLabelDialogOpen] = useState(false);
  const [updateLabelDialogOpen, setUpdateLabelDialogOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);

  const columns: GridColDef<Label>[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 150,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'name',
      headerName: t('labelName'),
      width: 250,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'description',
      headerName: t('labelDescription'),
      width: 450,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'source',
      headerName: t('source'),
      type: 'string',
      width: 150,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => {
        return (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
            }}
          >
            <Typography>
              {params.value === 'PREDEFINED' ? t('predefine') : t('created')}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: t('actions'),
      type: 'actions',
      width: 250,
      getActions: (params) => {
        const isCreated = params.row.source === 'CREATED';

        return [
          ...(isCreated
            ? [
                <GridActionsCellItem
                  icon={
                    <Tooltip title={t('update')}>
                      <BorderColorIcon />
                    </Tooltip>
                  }
                  color="primary"
                  label={t('update')}
                  onClick={() => handleUpdateLabelClick(params.row)}
                />,
                <GridActionsCellItem
                  icon={
                    <Tooltip title={t('delete')}>
                      <DeleteIcon color="error" />
                    </Tooltip>
                  }
                  label={t('delete')}
                  onClick={() => setLabelIdToDelete(params.row.id)}
                />,
              ]
            : []),
        ];
      },
    },
  ];

  // Fetch all labels
  const labels = useGetAllLabel();
  useEffect(() => {
    if (labels.isError)
      snackbar.show({
        message: t('labelLoadingError'),
        severity: 'error',
      });
  }, [labels.isError, snackbar, t]);

  const [rows, setRows] = useState<Label[]>([]);
  useEffect(() => {
    if (labels.data) {
      const mappedRows: Label[] = labels.data.map((label) => ({
        id: label.id,
        name: label.name,
        description: label.description,
        source: label.source,
      }));
      setRows(mappedRows);
    }
  }, [labels.data, t]);

  //Delete label
  const [deleteLabelTrigger, deleteLabel] = useDeleteLabel();
  useEffect(() => {}, [deleteLabel.isError, deleteLabel.isSuccess, t]);

  const handleDeleteLabel = async (labelId: string) => {
    try {
      await deleteLabelTrigger(labelId).unwrap();

      snackbar.show({
        message: t('deleteLabelSuccess'),
        severity: 'success',
      });
    } catch (error) {
      console.error(error);
      snackbar.show({
        message: t('deleteLabelFailed'),
        severity: 'error',
      });
    }
  };

  //Create Label
  const [createLabelTrigger, createLabel] = useCreateLabel();
  const handleCreateLabelSubmit = async (label: {
    name: string;
    description: string;
  }) => {
    try {
      await createLabelTrigger(label).unwrap();
      snackbar.show({
        message: t('createLabelSuccess'),
        severity: 'success',
      });
    } catch (error) {
      switch (error) {
        case LabelError.DUPLICATE_LABEL_NAME: {
          snackbar.show({
            message: t('duplicateLabelNameError'),
            severity: 'warning',
          });
          break;
        }
        case LabelError.UNKNOWN_ERROR: {
          snackbar.show({
            message: t('createLabelError'),
            severity: 'error',
          });
          break;
        }
      }
      console.error(error);
    } finally {
      setCreateLabelDialogOpen(false);
    }
  };

  //Update label
  const handleUpdateLabelClick = (label: Label) => {
    setSelectedLabel(label);
    setUpdateLabelDialogOpen(true);
  };

  const [updateLabelTrigger, updateLabel] = useUpdateLabel();

  const handleUpdateLabelSubmit = async (newData: { description: string }) => {
    if (!selectedLabel) return;
    try {
      await updateLabelTrigger({
        labelId: selectedLabel.id,
        description: newData.description,
      }).unwrap();

      snackbar.show({
        message: t('updateLabelSuccess'),
        severity: 'success',
      });
      setUpdateLabelDialogOpen(false);
    } catch (error) {
      setUpdateLabelDialogOpen(false);
      switch (error) {
        case LabelError.DUPLICATE_LABEL_NAME: {
          snackbar.show({
            message: t('duplicateLabelNameError'),
            severity: 'warning',
          });
          break;
        }
        case LabelError.UNKNOWN_ERROR: {
          snackbar.show({
            message: t('createLabelError'),
            severity: 'error',
          });
          break;
        }
      }
      console.error(error);
    } finally {
      setUpdateLabelDialogOpen(false);
    }
  };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <CreateLabelDialog
        open={createLabelDialogOpen}
        onClose={() => setCreateLabelDialogOpen(false)}
        onSubmit={handleCreateLabelSubmit}
      />
      <UpdateLabelDialog
        open={updateLabelDialogOpen}
        onClose={() => {
          setUpdateLabelDialogOpen(false);
          setSelectedLabel(null);
        }}
        labelName={selectedLabel?.name ?? ''}
        initialDescription={selectedLabel?.description ?? ''}
        onSubmit={handleUpdateLabelSubmit}
      />

      {labelIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setLabelIdToDelete(null)}
          title={t('confirmDeleteTitle')}
          message={t('deleteLabelConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={async () => {
            await handleDeleteLabel(labelIdToDelete);
            setLabelIdToDelete(null);
          }}
        />
      )}
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Typography variant="h4">{t('labelList')}</Typography>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => setCreateLabelDialogOpen(true)}
        >
          {t('createLabel')}
        </Button>
      </Box>
      {labels.isLoading ||
      labels.isFetching ||
      deleteLabel.isLoading ||
      createLabel.isLoading ||
      updateLabel.isLoading ? (
        <Loading />
      ) : (
        <Paper sx={{ height: 430, width: '90%' }}>
          <DataGrid
            rows={rows}
            columns={columns}
            initialState={{
              pagination: { paginationModel: { page: 0, pageSize: 6 } },
            }}
            pageSizeOptions={[6, 10]}
            sx={{
              '& .MuiDataGrid-columnHeaders': {
                fontWeight: 'bold',
                fontSize: '1rem',
              },
              '& .MuiDataGrid-cell': {
                fontSize: '16px',
              },
            }}
          />
        </Paper>
      )}
    </Stack>
  );
};

type UpdateLabelDialogProps = {
  open: boolean;
  onClose: () => void;
  labelName: string;
  initialDescription: string;
  onSubmit: (label: { description: string }) => void;
};

const UpdateLabelDialog = ({
  open,
  onClose,
  labelName,
  initialDescription,
  onSubmit,
}: UpdateLabelDialogProps) => {
  const { t } = useTranslation();
  const [labelInfo, setLabelInfo] = useState({
    description: initialDescription,
  });

  useEffect(() => {
    setLabelInfo({ description: initialDescription });
  }, [initialDescription]);

  //   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setLabelInfo({ description: e.target.value });
  //   };

  const handleSubmit = () => {
    if (isValidLength(labelInfo.description, TextLength.VERY_LONG)) {
      onSubmit(labelInfo);
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
            <Typography variant="body1">{labelName}</Typography>
          </Stack>
          <TextField
            multiline
            rows={2}
            fullWidth
            label={t('labelDescription')}
            value={labelInfo.description}
            helperText={t('hyperTextVeryLong')}
            placeholder={`${t('enter')} ${t(
              'labelDescription'
            ).toLowerCase()}...`}
            onChange={(e) => setLabelInfo({ description: e.target.value })}
            error={!isValidLength(labelInfo.description, TextLength.VERY_LONG)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          size="small"
          variant="contained"
          onClick={handleSubmit}
          disabled={!isValidLength(labelInfo.description, TextLength.VERY_LONG)}
        >
          {t('confirm')}
        </Button>
        <Button size="small" onClick={onClose}>
          {t('close')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LabelManagementPage;
