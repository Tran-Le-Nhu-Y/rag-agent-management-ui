import { Box, Button, Stack, Tooltip, Typography } from '@mui/material';
import { DataGridTable, Loading } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DocumentDetailDialog from './DocumentDetailDialog';
import {
  useDeleteDocument,
  useEmbedDocument,
  useGetUnembeddedDocuments,
} from '../../service';
import { parseDay, Path } from '../../util';
import SelectStoreToEmbedDialog from './SelectStoreToEmbedDialog';
import type { DocumentInfo, VectorStore } from '../../@types/entities';
import ConfirmDialog from '../../component/ConfirmDialog';
import {
  downloadFile,
  getDocumentDownloadTokenById,
} from '../../service/api/file';
import { useSnackbar } from '../../hook';

const UnembedDocument = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [openStoreToEmbedDialog, setOpenStoreToEmbedDialog] = useState(false);

  const [viewedDocument, setViewedDocument] = useState<DocumentInfo | null>(
    null
  );
  const [documentIdToDelete, setDocumentIdToDelete] = useState<string | null>(
    null
  );
  const [, setSelectedStoreToEmbed] = useState<VectorStore | null>(null);
  const [documentIdToEmbed, setDocumentIdToEmbed] = useState<string | null>(
    null
  );

  const columns: GridColDef<DocumentInfo>[] = [
    {
      field: 'name',
      headerName: t('documentName'),
      width: 300,
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
      width: 250,
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
              setDocumentIdToEmbed(params.row.id);
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
            onClick={() => setDocumentIdToDelete(params.row.id)}
          />,
        ];
      },
    },
  ];

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
    if (documentResults.isError)
      snackbar.show({
        message: t('createDocumentError'),
        severity: 'error',
      });
  }, [documentResults.isError, snackbar, t]);

  const rows = useMemo(() => {
    if (documentResults.isFetching) return [];
    if (!documentResults.data) return [];
    return documentResults.data.content.map(
      (doc) =>
        ({
          id: doc.id,
          name: doc.name,
          description: doc.description,
          created_at: parseDay(doc.created_at),
          mime_type: doc.mime_type,
          source: doc.source,
        } as DocumentInfo)
    );
  }, [documentResults.data, documentResults.isFetching]);

  //Delete doucment
  const [deleteDocumentTrigger] = useDeleteDocument();
  const handleDeleteDocument = async (documentId: string) => {
    try {
      await deleteDocumentTrigger(documentId).unwrap();
      snackbar.show({
        message: t('deleteDocumentSuccess'),
        severity: 'success',
      });
    } catch (error) {
      console.error(error);
      snackbar.show({
        message: t('deleteDocumentFailed'),
        severity: 'error',
      });
    }
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
        snackbar.show({
          message: t('imageExportError'),
          severity: 'error',
        });
      }
    },
    [snackbar, t]
  );

  //Embedded doucment
  const [embedDocumentTrigger, embedDocument] = useEmbedDocument();
  const embedDocumentHandler = async (
    documentId: string,
    storeName: string
  ) => {
    try {
      await embedDocumentTrigger({
        documentId: documentId,
        storeName: storeName,
      }).unwrap();
      snackbar.show({
        message: t('embedDocumentSuccess'),
        severity: 'success',
      });
    } catch (err) {
      console.error(err);
      snackbar.show({
        message: t('embedDocumentFailed'),
        severity: 'error',
      });
    }
  };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <DocumentDetailDialog
        open={openDetailDialog}
        onClose={() => setOpenDetailDialog(false)}
        document={viewedDocument}
      />
      <SelectStoreToEmbedDialog
        open={openStoreToEmbedDialog}
        onClose={() => setOpenStoreToEmbedDialog(false)}
        onSubmit={async (selectedStore) => {
          setOpenStoreToEmbedDialog(false);
          setSelectedStoreToEmbed(selectedStore);

          if (documentIdToEmbed && selectedStore) {
            await embedDocumentHandler(documentIdToEmbed, selectedStore.name);
            setDocumentIdToEmbed(null);
          }
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
            await handleDeleteDocument(documentIdToDelete);
            setDocumentIdToDelete(null);
          }}
          successMessage={t('deleteDocumentSuccess')}
          errorMessage={t('deleteDocumentFailed')}
        />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '90%' }}>
        <Button
          variant="contained"
          onClick={() => navigate(Path.CREATE_DOCUMENT)}
        >
          {t('createDocument')}
        </Button>
      </Box>
      {documentResults.isLoading ||
      documentResults.isFetching ||
      embedDocument.isLoading ? (
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

export default UnembedDocument;
