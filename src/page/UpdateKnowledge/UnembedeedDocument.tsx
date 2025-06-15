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
import { useState } from 'react';
import UpdateDocumentDialog from './UpdateDocumentDialog';
import DocumentDetailDialog from './DocumentDetailDialog';

type DocumentRow = {
  id: number;
  documentName: string;
  documentDescription: string;
  createdAt: string;
  updatedAt: string;
  status: string;
};

const UnembeddedDocumentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: number;
    documentName: string;
    documentDescription: string;
  } | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [viewedDocument, setViewedDocument] = useState<{
    documentName: string;
    documentDescription: string;
    createdAt: string;
    updatedAt: string;
    status: string;
  } | null>(null);

  const columns: GridColDef<(typeof rows)[number]>[] = [
    {
      field: 'documentName',
      headerName: t('documentName'),
      width: 250,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'documentDescription',
      headerName: t('documentDescription'),
      width: 250,
      align: 'center',
      headerAlign: 'center',
    },

    {
      field: 'createdAt',
      headerName: t('createAt'),
      type: 'string',
      width: 130,
      align: 'center',
      headerAlign: 'center',
    },

    {
      field: 'updatedAt',
      headerName: t('updateAt'),
      type: 'string',
      width: 120,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'status',
      headerName: t('usedStatus'),
      width: 160,
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
      width: 160,
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <Tooltip title={t('see')}>
              <RemoveRedEyeIcon />
            </Tooltip>
          }
          color="primary"
          label={t('see')}
          onClick={() => {
            setViewedDocument(params.row);
            setOpenDetailDialog(true);
          }}
        />,
        <GridActionsCellItem
          icon={
            <Tooltip title={t('update')}>
              <DriveFileRenameOutlineIcon />
            </Tooltip>
          }
          color="primary"
          label={t('update')}
          onClick={() => {
            handleUpdateClick(params.row);
          }}
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
      width: 230,
      getActions: () => [
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
      ],
    },
  ];

  const [rows, setRows] = useState<DocumentRow[]>([
    {
      id: 1,
      documentName: 'A',
      documentDescription: 'A',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
      status: 'pending',
    },
    {
      id: 2,
      documentName: 'B',
      documentDescription: 'A',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
      status: 'pending',
    },
    {
      id: 3,
      documentName: 'C',
      documentDescription: 'A',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-05',
      status: 'pending',
    },
    {
      id: 4,
      documentName: 'D',
      documentDescription: 'A',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
      status: 'pending',
    },
    {
      id: 5,
      documentName: 'E',
      documentDescription: 'A',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-02',
      status: 'pending',
    },
    {
      id: 6,
      documentName: 'F',
      documentDescription: 'A',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-01',
      status: 'pending',
    },
    {
      id: 7,
      documentName: 'G',
      documentDescription: 'A',
      createdAt: '2024-05-01',
      updatedAt: '2024-05-09',
      status: 'pending',
    },
  ]);

  const handleUpdateClick = (params: DocumentRow) => {
    setSelectedDocument(params);
    setOpenUpdateDialog(true);
  };

  const handleUpdateSubmit = (newDescription: string) => {
    if (selectedDocument) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === selectedDocument.id
            ? { ...row, description: newDescription }
            : row
        )
      );
    }
    setOpenUpdateDialog(false);
    setSelectedDocument(null);
  };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <UpdateDocumentDialog
        open={openUpdateDialog}
        onClose={() => setOpenUpdateDialog(false)}
        onSubmit={handleUpdateSubmit}
        document={selectedDocument}
      />
      <DocumentDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        document={viewedDocument}
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/create-document')}
        >
          {t('createDocument')}
        </Button>
      </Box>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGridTable rows={rows} columns={columns} />
      </Box>
    </Stack>
  );
};

export default UnembeddedDocumentPage;
