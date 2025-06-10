import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import {
  AppSnackbar,
  DragAndDropForm,
  ImagePaginationViewer,
  Tags,
} from '../../component';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import { useGetAllLabel, useGetUnlabeledImages } from '../../service';
import type { Label } from '../../@types/entities';
import { getImageUrl } from '../../service/api';
import { HideDuration } from '../../util';

const UntaggedImagePage = () => {
  const { t } = useTranslation();
  const [selectedLabel, setSelectedLabel] = useState<Label[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [unlabeledImagesQuery] = useState<GetUnlabeledImagesQuery>({
    offset: 0,
    limit: 100,
    orderBy: 'created_at',
  });
  const unlabeledImages = useGetUnlabeledImages(unlabeledImagesQuery!, {
    skip: !unlabeledImagesQuery,
  });

  useEffect(() => {
    if (unlabeledImages.isError) {
      setSnackbarMessage(t('imageLoadingError'));
      setSnackbarOpen(true);
    }
  }, [unlabeledImages.isError, t]);

  const labels = useGetAllLabel();
  useEffect(() => {
    if (labels.isError) {
      setSnackbarMessage(t('labelLoadingError'));
      setSnackbarOpen(true);
    }
  }, [labels.isError, t]);

  const imageUrls = useMemo(() => {
    if (
      !unlabeledImages.data ||
      unlabeledImages.isLoading ||
      unlabeledImages.isError
    )
      return [];

    return unlabeledImages.data.content.map((img) => ({
      id: img.id,
      url: getImageUrl(img.id),
    }));
  }, [
    unlabeledImages.data,
    unlabeledImages.isError,
    unlabeledImages.isLoading,
  ]);

  return (
    <Stack justifyContent={'center'} alignItems="center">
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity="error"
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
      <Stack
        direction={'row'}
        justifyContent="center"
        alignItems="center"
        spacing={5}
        width={'100%'}
        height={'100%'}
      >
        {unlabeledImages.isLoading ? (
          <CircularProgress />
        ) : (
          <Stack width={'50%'} height={'50%'}>
            <ImagePaginationViewer
              images={imageUrls}
              itemsPerPage={1}
              //   onDelete={handleDeleteImage}
            />
          </Stack>
        )}

        <Stack alignItems="center" width={'50%'} height={'50%'}>
          <Stack spacing={1} width={'100%'}>
            <Typography variant="h6">{t('recommentImageMore')}:</Typography>
            <DragAndDropForm
              onFilesChange={(files: File[]) => {
                setUploadedFiles(files);
              }}
            />
            <Box display="flex" justifyContent="center">
              <Button variant="contained" disabled={uploadedFiles.length === 0}>
                {t('recommendation')}
              </Button>
            </Box>
          </Stack>
          <Stack width={'100%'} spacing={1}>
            <Typography variant="h6">{t('imageTagging')}:</Typography>
            {labels.isLoading ? (
              <Stack alignItems="center" spacing={2}>
                <Typography>{t('loadingLabels')}</Typography>
                <CircularProgress />
              </Stack>
            ) : labels.error ? (
              <Typography color="error">{t('loadingLabelError')}</Typography>
            ) : (
              <Tags
                labelList={labels.data ?? []}
                label={t('selectTag')}
                onChange={(tags: Label[] | null) => {
                  setSelectedLabel(tags || []);
                }}
              />
            )}
            <Box display="flex" justifyContent="center">
              <Button variant="contained" disabled={selectedLabel.length === 0}>
                {t('tagging')}
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UntaggedImagePage;
