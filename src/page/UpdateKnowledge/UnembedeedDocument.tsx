import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { AppSnackbar, DataGridTable, Loading } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { useCallback, useEffect, useState } from 'react';
import DocumentDetailDialog from './DocumentDetailDialog';
import { useDeleteDocument, useGetUnembeddedDocuments } from '../../service';
import { HideDuration, parseDay, SnackbarSeverity } from '../../util';
import SelectStoreToEmbedDialog from './SelectStoreToEmbedDialog';
import type { DocumentInfo } from '../../@types/entities';
import ConfirmDialog from '../../component/ConfirmDialog';
import {
  downloadFile,
  getDocumentDownloadTokenById,
} from '../../service/api/file';

const UnembeddedDocumentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');

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
              {params.value === 'UPLOADED' ? t('uploaded') : t('external')}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: 'actions',
      headerName: t('actions'),
      type: 'actions',
      width: 200,
      getActions: (params) => {
        const isUploaded = params.row.source === 'UPLOADED';

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
              setOpenStoreToEmbedDialog(true);
            }}
          />,
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
          ...(isUploaded
            ? [
                <GridActionsCellItem
                  icon={
                    <Tooltip title={t('download')}>
                      <FileDownloadIcon />
                    </Tooltip>
                  }
                  color="primary"
                  label={t('download')}
                  onClick={() => handleDownload(params.row.id)}
                />,
              ]
            : []),
          <GridActionsCellItem
            icon={
              <Tooltip title={t('delete')}>
                <DeleteIcon color="error" />
              </Tooltip>
            }
            label={t('delete')}
            onClick={() => handleDeleteDocument(params.row.id)}
          />,
        ];
      },
    },
  ];
  const [rows, setRows] = useState<DocumentInfo[]>([]);

  // Get all unembedded document
  const [documentQuery, setDocumentQuery] =
    useState<GetUnembeddedDocumentsQuery>({
      offset: 0,
      limit: 6,
    });

  const documentResults = useGetUnembeddedDocuments(documentQuery, {
    skip: !documentQuery,
  });

  useEffect(() => {
    if (documentResults.isError) {
      setSnackbarMessage(t('createDocumentError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [documentResults.isError, t]);

  useEffect(() => {
    if (documentResults.data) {
      const mappedRows: DocumentInfo[] = documentResults.data.content.map(
        (doc) => ({
          id: doc.id,
          name: doc.name,
          description: doc.description,
          created_at: parseDay(doc.created_at),
          mime_type: doc.mime_type,
          source: doc.source,
        })
      );
      setRows(mappedRows);
    }
  }, [documentResults.data, t]);

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

  //Download document
  const handleDownload = useCallback(
    async (documentId: string) => {
      try {
        const path = await getDocumentDownloadTokenById(documentId);

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
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
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
      {documentResults.isLoading || documentResults.isFetching ? (
        <Loading />
      ) : (
        <Box sx={{ height: 400, width: '90%' }}>
          <DataGridTable
            rows={rows}
            columns={columns}
            total={documentResults.data?.total_elements ?? 0}
            page={documentQuery.offset ?? 0}
            pageSize={documentQuery?.limit ?? 6}
            onPageChange={(newPage) =>
              setDocumentQuery((prev) => {
                return { ...prev, offset: newPage };
              })
            }
          />
        </Box>
      )}
    </Stack>
  );
};

export default UnembeddedDocumentPage;
