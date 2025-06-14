import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { DataGridTable } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import DisabledByDefaultIcon from '@mui/icons-material/DisabledByDefault';
import FileOpenIcon from '@mui/icons-material/FileOpen';

const UpdateKnowledgeManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: 'id', headerName: 'ID', width: 50 },
    {
      field: 'agentName',
      headerName: t('textRecommendationName'),
      width: 250,
      editable: true,
      align: 'center',
      headerAlign: 'center',
    },

    {
      field: 'createdAt',
      headerName: t('createAt'),
      type: 'string',
      width: 150,
      editable: true,
      align: 'center',
      headerAlign: 'center',
    },

    {
      field: 'updatedAt',
      headerName: t('updateAt'),
      type: 'string',
      width: 150,
      editable: true,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: t('usedStatus'),
      width: 180,
      headerAlign: 'center',
      renderCell: (params) => {
        let content;
        if (params.value === 'done') {
          content = <CheckBoxIcon color="primary" />;
        } else if (params.value === 'pending') {
          content = <DisabledByDefaultIcon color="warning" />;
        } else {
          content = <Typography color="textSecondary">-</Typography>;
        }
        return (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%',
            }}
          >
            {content}
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: t('actions'),
      type: 'actions',
      width: 180,
      getActions: () => [
        <GridActionsCellItem
          icon={
            <Tooltip title={t('see')}>
              <RemoveRedEyeIcon />
            </Tooltip>
          }
          color="primary"
          label={t('see')}
          onClick={() => {}}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('update')}>
              <DriveFileRenameOutlineIcon />
            </Tooltip>
          }
          color="primary"
          label={t('update')}
          onClick={() => {}}
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
    {
      field: 'updateKnowledge',
      headerName: t('updateKnowledgeForAgent'),
      type: 'actions',
      width: 250,
      getActions: (params) => {
        // Chỉ hiển thị action nếu status KHÁC 'done'
        if (params.row.status === 'done') {
          return []; // không hiển thị gì cả
        }

        return [
          <GridActionsCellItem
            icon={
              <Tooltip title={t('embeddingIntoAgent')}>
                <FileOpenIcon />
              </Tooltip>
            }
            color="primary"
            label={t('embeddingIntoAgent')}
            onClick={() => {
              // TODO: your handler here
            }}
          />,
        ];
      },
    },
  ];

  const rows = [
    {
      id: 1,
      agentName: 'A',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
      status: 'done',
    },
    {
      id: 2,
      agentName: 'B',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
      status: 'pending',
    },
    {
      id: 3,
      agentName: 'C',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-05',
      status: 'pending',
    },
    {
      id: 4,
      agentName: 'D',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
      status: 'done',
    },
    {
      id: 5,
      agentName: 'E',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-02',
      status: 'pending',
    },
    {
      id: 6,
      agentName: 'F',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
      status: 'done',
    },
    {
      id: 7,
      agentName: 'G',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-09',
      status: 'pending',
    },
  ];

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <Typography variant="h4">{t('updateKnowledgeBase')}</Typography>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/text-data-recommendation')}
        >
          {t('createTextRecommendation')}
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '90%' }}>
        <DataGridTable rows={rows} columns={columns} />
      </Box>
    </Stack>
  );
};

export default UpdateKnowledgeManagementPage;
