import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { AppSnackbar, DataGridTable, Loading } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useTranslation } from 'react-i18next';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import { useCallback, useEffect, useState } from 'react';
import DocumentDetailDialog from './DocumentDetailDialog';
import { useGetEmbeddedDocuments, useUnembedDocument } from '../../service';
import { HideDuration, parseDay, SnackbarSeverity } from '../../util';
import type { DocumentInfo } from '../../@types/entities';
import {
  downloadFile,
  getDocumentDownloadTokenById,
} from '../../service/api/file';

const EmbeddedDocumentPage = () => {
  const { t } = useTranslation();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [viewedDocument, setViewedDocument] = useState<DocumentInfo | null>(
    null
  );

  const columns: GridColDef<(typeof rows)[number]>[] = [
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
      field: 'embedded_to_vs',
      headerName: t('storeName'),
      width: 200,
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
      width: 160,
      getActions: (params) => {
        const isUploaded = params.row.source === 'UPLOADED';

        return [
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
                embedded_to_bm25: params.row.embedded_to_bm25,
                embedded_to_vs: params.row.embedded_to_vs,
                created_at: params.row.created_at,
                mime_type: params.row.mime_type,
                source: params.row.source,
              });
              setOpenDetailDialog(true);
            }}
          />,

          <GridActionsCellItem
            icon={
              <Tooltip title={t('unembeddedAgent')}>
                <FolderDeleteIcon color="error" />
              </Tooltip>
            }
            color="primary"
            label={t('unembeddedAgent')}
            onClick={async () => {
              await unembedDocumentTrigger({
                documentId: params.row.id,
              });
            }}
          />,
        ];
      },
    },
  ];
  const [rows, setRows] = useState<DocumentInfo[]>([]);

  const [documentQuery, setDocumentQuery] = useState<GetEmbeddedDocumentsQuery>(
    {
      offset: 0,
      limit: 8,
    }
  );

  const documentResults = useGetEmbeddedDocuments(documentQuery, {
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
          embedded_to_bm25: doc.embedded_to_bm25,
          embedded_to_vs: doc.embedded_to_vs,
          mime_type: doc.mime_type,
          source: doc.source,
        })
      );
      setRows(mappedRows);
    }
  }, [documentResults.data, t]);

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

  //Unembed document
  const [unembedDocumentTrigger, unembedDocument] = useUnembedDocument();
  useEffect(() => {
    if (unembedDocument.isError) {
      setSnackbarMessage(t('unembedDocumentFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
    if (unembedDocument.isSuccess) {
      setSnackbarMessage(t('unembedDocumentSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    }
  }, [unembedDocument.isError, unembedDocument.isSuccess, t]);

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

      {documentResults.isLoading ||
      documentResults.isFetching ||
      unembedDocument.isLoading ? (
        <Loading />
      ) : (
        <Box sx={{ height: 500, width: '90%' }}>
          <DataGridTable
            height={530}
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

export default EmbeddedDocumentPage;
