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
import {
  useDeleteImage,
  useGetAllLabel,
  useGetUnlabeledImages,
  useUploadImage,
} from '../../service';
import type { Label } from '../../@types/entities';
import { getImageUrl } from '../../service/api';
import { HideDuration, SnackbarSeverity } from '../../util';

const UntaggedImagePage = () => {
  const { t } = useTranslation();
  const userId = 'a3e6a251-89c3-4b18-9a80-640b2cd24dc2';
  const [selectedLabel, setSelectedLabel] = useState<Label[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');

  // Fetch unlabeled images
  const [unlabeledImagesQuery] = useState<GetUnlabeledImagesQuery>({
    offset: 0,
    limit: 100,
    orderBy: 'created_at',
  });
  const unlabeledImages = useGetUnlabeledImages(unlabeledImagesQuery!, {
    skip: !unlabeledImagesQuery,
    refetchOnMountOrArgChange: true,
  });
  useEffect(() => {
    if (unlabeledImages.isError) {
      setSnackbarMessage(t('imageLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [unlabeledImages.isError, t]);

  // Fetch all labels
  const labels = useGetAllLabel();
  useEffect(() => {
    if (labels.isError) {
      setSnackbarMessage(t('labelLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [labels.isError, t]);

  // Generate image URLs
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

  //Delete Image
  const [deleteImageTrigger, deleteImage] = useDeleteImage();
  useEffect(() => {
    if (deleteImage.isError) {
      setSnackbarMessage(t('deleteImageFailed'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [deleteImage.isError, t]);

  const handleDeleteImage = async (imageId: string) => {
    await deleteImageTrigger(imageId);
  };

  // Handle images upload
  const [uploadImageTrigger, uploadImage] = useUploadImage();
  useEffect(() => {
    if (uploadImage.isError) {
      setSnackbarMessage(t('imageUploadError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    } else if (uploadImage.isSuccess) {
      setSnackbarMessage(t('imageUploadSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setUploadedFiles([]); // Clear uploaded files after successful upload
    }
  }, [uploadImage.isError, uploadImage.isSuccess, t]);

  const handleUploadImages = async () => {
    if (!uploadedFiles.length) return;

    try {
      const uploadPromises = uploadedFiles.map((image) =>
        uploadImageTrigger({ file: image, userId: userId }).unwrap()
      );

      const results = await Promise.all(uploadPromises); //Wait for all images to finish uploading
      await unlabeledImages.refetch(); //Upload successful -> call API again to get new images
      setUploadedFiles([]); //Clear the selected file list

      console.log('Upload thành công:', results);
      setSnackbarMessage(t('imageUploadSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Lỗi upload:', error);
      setSnackbarMessage(t('imageUploadError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
      return;
    }
  };

  return (
    <Stack justifyContent={'center'} alignItems="center">
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
      {uploadImage.isLoading ||
      labels.isLoading ||
      unlabeledImages.isLoading ? (
        <Box
          display={'flex'}
          justifyContent="center"
          alignItems="center"
          height="50vh"
          width="100%"
        >
          <CircularProgress />
          <Typography variant="h6" color="primary">
            {t('loading')}...
          </Typography>
        </Box>
      ) : (
        <Stack
          direction={'row'}
          justifyContent="center"
          alignItems="center"
          spacing={5}
          width={'100%'}
          height={'100%'}
        >
          <Stack width={'50%'} height={'50%'}>
            <ImagePaginationViewer
              images={imageUrls}
              itemsPerPage={1}
              onDelete={handleDeleteImage}
            />
          </Stack>

          <Stack alignItems="center" width={'50%'} height={'50%'}>
            <Stack spacing={1} width={'100%'}>
              <Typography variant="h6">{t('recommentImageMore')}:</Typography>
              <DragAndDropForm
                onFilesChange={(files: File[]) => {
                  setUploadedFiles(files);
                }}
              />
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  disabled={uploadedFiles.length === 0}
                  onClick={handleUploadImages}
                >
                  {t('recommendation')}
                </Button>
              </Box>
            </Stack>

            <Stack width={'100%'} spacing={1}>
              <Typography variant="h6">{t('imageTagging')}:</Typography>
              <Tags
                labelList={labels.data ?? []}
                label={t('selectTag')}
                onChange={(tags: Label[] | null) => {
                  setSelectedLabel(tags || []);
                }}
              />
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  disabled={selectedLabel.length === 0}
                >
                  {t('tagging')}
                </Button>
              </Box>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};

export default UntaggedImagePage;
