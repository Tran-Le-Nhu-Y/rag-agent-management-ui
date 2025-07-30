import { Box, Button, Paper, Stack, Tooltip, Typography } from '@mui/material';
import { CreateLabelDialog } from '../../component';
import {
  DataGrid,
  GridActionsCellItem,
  type GridColDef,
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useDeleteLabel, useGetAllLabel } from '../../service';
import type { Label } from '../../@types/entities';
import ConfirmDialog from '../../component/ConfirmDialog';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { useSnackbar } from '../../hook';
import UpdateLabelDialog from './UpdateLabelDialog';

const LabelManagementPage = () => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();
  const [labelIdToDelete, setLabelIdToDelete] = useState<string | null>(null);
  const [createLabelDialogOpen, setCreateLabelDialogOpen] = useState(false);
  const [updateLabel, setUpdateLabel] = useState<Label>();

  const columns: GridColDef<Label>[] = useMemo(
    () => [
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
                    onClick={() => setUpdateLabel(params.row)}
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
              : [
                  <GridActionsCellItem
                    icon={
                      <Tooltip title={t('update')}>
                        <BorderColorIcon />
                      </Tooltip>
                    }
                    color="primary"
                    label={t('update')}
                    onClick={() => setUpdateLabel(params.row)}
                  />,
                ]),
          ];
        },
      },
    ],
    [t]
  );

  // Fetch all labels
  const labels = useGetAllLabel();
  useEffect(() => {
    if (labels.isError)
      snackbar.show({
        message: t('labelLoadingError'),
        severity: 'error',
      });
  }, [labels.isError, snackbar, t]);

  const rows = useMemo(() => {
    if (!labels.data) return [];
    return labels.data;
  }, [labels.data]);

  const [deleteLabelTrigger] = useDeleteLabel();

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <CreateLabelDialog
        open={createLabelDialogOpen}
        onClose={() => setCreateLabelDialogOpen(false)}
      />
      <UpdateLabelDialog
        open={updateLabel !== undefined}
        onClose={() => setUpdateLabel(undefined)}
        label={
          updateLabel ??
          ({
            id: 'placeholder-label',
            name: '',
            description: '',
            source: 'CREATED',
          } as Label)
        }
      />

      {labelIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setLabelIdToDelete(null)}
          title={t('confirmDeleteTitle')}
          message={t('deleteLabelConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          successMessage={t('deleteLabelSuccess')}
          errorMessage={t('deleteLabelFailed')}
          onDelete={async () => {
            await deleteLabelTrigger(labelIdToDelete).unwrap();
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
      <Paper sx={{ height: 430, width: '90%' }}>
        <DataGrid
          loading={labels.isLoading || labels.isFetching}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 6 } },
            sorting: {
              sortModel: [{ field: 'id', sort: 'asc' }],
            },
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
    </Stack>
  );
};

export default LabelManagementPage;
