import { Box, Button, Stack, Tooltip } from '@mui/material';
import { DataGridTable } from '../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';

const AgentManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'agentName',
      headerName: t('agentName'),
      width: 250,
      editable: true,
    },

    {
      field: 'createdAt',
      headerName: t('createAt'),
      type: 'string',
      width: 150,
      editable: true,
    },

    {
      field: 'updatedAt',
      headerName: t('updateAt'),
      type: 'string',
      width: 150,
      editable: true,
    },
    {
      field: 'actions',
      headerName: t('actions'),
      type: 'actions',
      width: 250,
      getActions: () => [
        <GridActionsCellItem
          icon={
            <Tooltip title={t('see')}>
              <RemoveRedEyeIcon />
            </Tooltip>
          }
          color="primary"
          label={t('see')}
          onClick={() => navigate('/agent-detail')}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('update')}>
              <DriveFileRenameOutlineIcon />
            </Tooltip>
          }
          color="primary"
          label={t('update')}
          onClick={() => navigate('/agent-update')}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('delete')}>
              <DeleteIcon color="error" />
            </Tooltip>
          }
          label={t('delete')}
          onClick={() => {}}
        />,
      ],
    },
  ];

  const rows = [
    { id: 1, agentName: 'A', createdAt: '2024-05-01', updatedAt: '2024-05-01' },
    { id: 2, agentName: 'B', createdAt: '2024-05-01', updatedAt: '2024-05-01' },
    { id: 3, agentName: 'C', createdAt: '2024-05-01', updatedAt: '2024-05-01' },
    { id: 4, agentName: 'D', createdAt: '2024-05-01', updatedAt: '2024-05-01' },
    { id: 5, agentName: 'E', createdAt: '2024-05-01', updatedAt: '2024-05-01' },
    { id: 6, agentName: 'F', createdAt: '2024-05-01', updatedAt: '2024-05-01' },
    { id: 7, agentName: 'G', createdAt: '2024-05-01', updatedAt: '2024-05-01' },
  ];
  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <h1>{t('agentList')}</h1>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button variant="contained" onClick={() => navigate('/agent-creation')}>
          {t('createAgent')}
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '90%' }}>
        <DataGridTable rows={rows} columns={columns} />
      </Box>
    </Stack>
  );
};

export default AgentManagementPage;
