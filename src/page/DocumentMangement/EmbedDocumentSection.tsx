import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { DataGridTable } from '../../component';
import { GridActionsCellItem, type GridColDef } from '@mui/x-data-grid';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useTranslation } from 'react-i18next';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DocumentDetailDialog from './DocumentDetailDialog';
import { useGetEmbeddedDocuments, useUnembedDocument } from '../../service';
import { parseDay } from '../../util';
import type { DocumentInfo } from '../../@types/entities';
import {
  downloadFile,
  getDocumentDownloadTokenById,
} from '../../service/api/file';
import ConfirmDialog from '../../component/ConfirmDialog';
import { useSnackbar } from '../../hook';

const EmbedDocumentSection = () => {
  const { t } = useTranslation();
  const snackbar = useSnackbar();

  const [unembedDocumentId, setUnembedDocumentId] = useState<string | null>(
    null
  );
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [viewedDocument, setViewedDocument] = useState<DocumentInfo | null>(
    null
  );

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

  const columns: GridColDef<DocumentInfo>[] = useMemo(
    () => [
      {
        field: 'name',
        headerName: t('documentName'),
        width: 250,
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
                setUnembedDocumentId(params.row.id);
              }}
            />,
          ];
        },
      },
    ],
    [handleDownload, t]
  );

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
    if (documentResults.isError)
      snackbar.show({
        message: t('createDocumentError'),
        severity: 'error',
      });
  }, [documentResults.isError, snackbar, t]);
  const rows = useMemo(() => {
    if (!documentResults.data) return [];
    return documentResults.data.content.map((doc) => ({
      ...doc,
      created_at: parseDay(doc.created_at),
    }));
  }, [documentResults.data]);

  //Unembed document
  const [unembedDocumentTrigger, unembedDocument] = useUnembedDocument();
  const unembedDocumentHandler = async (documentId: string) => {
    try {
      await unembedDocumentTrigger({ documentId }).unwrap();
      snackbar.show({
        message: t('unembedDocumentSuccess'),
        severity: 'success',
      });
    } catch (err) {
      console.error(err);
      snackbar.show({
        message: t('unembedDocumentFailed'),
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

      {unembedDocumentId && (
        <ConfirmDialog
          open={true}
          onClose={() => setUnembedDocumentId(null)}
          title={t('unembedDocumentTitle')}
          message={t('unembedDocumentDescription')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          onDelete={async () => {
            await unembedDocumentHandler(unembedDocumentId!);
            setUnembedDocumentId(null);
          }}
          successMessage={t('unembedDocumentSuccess')}
          errorMessage={t('unembedDocumentFailed')}
        />
      )}

      <Box sx={{ height: 500, width: '90%' }}>
        <DataGridTable
          loading={
            documentResults.isLoading ||
            documentResults.isFetching ||
            unembedDocument.isLoading
          }
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
    </Stack>
  );
};

export default EmbedDocumentSection;
