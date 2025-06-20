import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { AppSnackbar, DataGridTable, Loading } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { useEffect, useState } from 'react';
import UpdateDocumentDialog from './UpdateDocumentDialog';
import DocumentDetailDialog from './DocumentDetailDialog';
import { useDeleteDocument, useGetUnembeddedDocuments } from '../../service';
import { HideDuration, SnackbarSeverity } from '../../util';
import SelectStoreToEmbedDialog from './SelectStoreToEmbedDialog';
import type { DocumentInfo } from '../../@types/entities';
import ConfirmDialog from '../../component/ConfirmDialog';

const UnembeddedDocumentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [openUpdateDialog, setOpenUpdateDialog] = useState(false);

  const [selectedDocument, setSelectedDocument] = useState<DocumentInfo | null>(
    null
  );
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openStoreToEmbedDialog, setOpenStoreToEmbedDialog] = useState(false);

  const [viewedDocument, setViewedDocument] = useState<DocumentInfo | null>(
    null
  );
  const [documentIdToDelete, setDocumentIdToDelete] = useState<string | null>(
    null
  );

  const columns: GridColDef<DocumentInfo>[] = [
    {
      field: 'name',
      headerName: t('documentName'),
      width: 250,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'description',
      headerName: t('documentDescription'),
      width: 300,
      align: 'center',
      headerAlign: 'center',
    },

    {
      field: 'created_at',
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
      width: 130,
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
              id: params.row.id,
              name: params.row.name,
              description: params.row.description,
              created_at: params.row.created_at,
              mime_type: params.row.mime_type,
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
            <Tooltip title={t('delete')}>
              <DeleteIcon color="error" />
            </Tooltip>
          }
          label={t('delete')}
          onClick={() => handleDeleteDocument(params.row.id)}
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
            setOpenStoreToEmbedDialog(true);
          }}
        />,
      ],
    },
  ];
  const [rows, setRows] = useState<DocumentInfo[]>([]);

  // Get all unembedded document
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
      const mappedRows: DocumentInfo[] = document.data.content.map((doc) => ({
        id: doc.id,
        name: doc.name,
        description: doc.description,
        created_at: doc.created_at,
        mime_type: doc.mime_type,
        source: doc.source,
      }));
      setRows(mappedRows);
    }
  }, [document.data, t]);

  const handleUpdateClick = (params: DocumentInfo) => {
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

  //Delete doucment
  const [deleteDocumentTrigger, deleteDocument] = useDeleteDocument();
  useEffect(() => {
    if (deleteDocument.isError) {
      setSnackbarMessage(t('deleteImageFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [deleteDocument.isError, t]);

  const handleDeleteDocument = (documentId: string) => {
    setDocumentIdToDelete(documentId);
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
      <SelectStoreToEmbedDialog
        open={openStoreToEmbedDialog}
        onClose={() => setOpenStoreToEmbedDialog(false)}
        onSubmit={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
      {documentIdToDelete && (
        <ConfirmDialog
          open={true}
          onClose={() => setDocumentIdToDelete(null)}
          title={t('confirmDeleteTitle')}
          message={t('deleteDocumentConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={async () => {
            await deleteDocumentTrigger(documentIdToDelete);
            setDocumentIdToDelete(null);
          }}
          successMessage={t('deleteDocumentSuccess')}
          errorMessage={t('deleteDocumentFailed')}
        />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate('/create-document')}
        >
          {t('createDocument')}
        </Button>
      </Box>
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

export default UnembeddedDocumentPage;
