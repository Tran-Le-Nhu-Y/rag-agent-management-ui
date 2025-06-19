import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { AppSnackbar, DataGridTable, Loading } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import { useTranslation } from 'react-i18next';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import { useEffect, useState } from 'react';
import UpdateDocumentDialog from './UpdateDocumentDialog';
import DocumentDetailDialog from './DocumentDetailDialog';
import { useGetUnembeddedDocuments } from '../../service';
import { HideDuration, SnackbarSeverity } from '../../util';

type DocumentRow = {
  id: string;
  documentName: string;
  documentDescription: string;
  createdAt: string;
  mimeType: string;
  source: string;
};

const EmbeddedDocumentPage = () => {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    id: string;
    documentName: string;
    documentDescription: string;
  } | null>(null);
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [viewedDocument, setViewedDocument] = useState<{
    documentName: string;
    documentDescription: string;
    createdAt: string;
    source: string;
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
      width: 300,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'storeName',
      headerName: t('storeName'),
      width: 200,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'createdAt',
      headerName: t('createAt'),
      type: 'string',
      width: 250,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'source',
      headerName: t('source'),
      type: 'string',
      width: 130,
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
              {params.value === 'UPLOADED' ? t('uploaded') : 'VectorDB'}
            </Typography>
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
            setViewedDocument({
              documentName: params.row.documentName,
              documentDescription: params.row.documentDescription,
              createdAt: params.row.createdAt,
              source: params.row.source,
            });
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
            <Tooltip title={t('unembeddedAgent')}>
              <FolderDeleteIcon color="error" />
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
  const [rows, setRows] = useState<DocumentRow[]>([]);

  const [documentQuery, setDocumentQuery] =
    useState<GetUnembeddedDocumentsQuery>({
      offset: 0,
      limit: 10,
    });

  const document = useGetUnembeddedDocuments(documentQuery, {
    skip: !documentQuery,
  });

  useEffect(() => {
    if (document.isError) {
      setSnackbarMessage(t('createDocumentError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [document.isError, t]);

  useEffect(() => {
    if (document.data) {
      const mappedRows: DocumentRow[] = document.data.content.map((doc) => ({
        id: doc.id,
        documentName: doc.name,
        documentDescription: doc.description,
        createdAt: doc.created_at,
        mimeType: doc.mime_type,
        source: doc.source,
      }));
      setRows(mappedRows);
    }
  }, [document.data, t]);

  const handleUpdateClick = (params: DocumentRow) => {
    setSelectedDocument(params);
    setOpenUpdateDialog(true);
  };

  const handleUpdateSubmit = (newDescription: string) => {
    if (selectedDocument) {
      setRows((prev) =>
        prev.map((row) =>
          row.id === selectedDocument.id
            ? { ...row, documentDescription: newDescription }
            : row
        )
      );
    }
    setOpenUpdateDialog(false);
    setSelectedDocument(null);
  };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
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

      {document.isLoading || document.isFetching ? (
        <Loading />
      ) : (
        <Box sx={{ height: 400, width: '90%' }}>
          <DataGridTable
            rows={rows}
            columns={columns}
            pageSize={documentQuery?.limit ?? 6}
            onPageChange={(newPage) =>
              setDocumentQuery((prev) => {
                return { ...prev, offset: newPage - 1 };
              })
            }
          />
        </Box>
      )}
    </Stack>
  );
};

export default EmbeddedDocumentPage;
