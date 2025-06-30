import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  AppSnackbar,
  CreateLabelDialog,
  DragAndDropForm,
  ImagePaginationViewer,
  Loading,
  Tags,
} from '../../component';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';
import {
  useAssignLabelToImage,
  useCreateLabel,
  useDeleteImage,
  useGetAllLabel,
  useGetUnlabeledImages,
  useUploadImage,
} from '../../service';
import type { Label } from '../../@types/entities';
import { getImageUrl } from '../../service/api';
import { HideDuration, SnackbarSeverity } from '../../util';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { LabelError } from '../../util/errors';

const UntaggedImagePage = () => {
  const { t } = useTranslation();
  const userId = 'a3e6a251-89c3-4b18-9a80-640b2cd24dc2';
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [createLabelDialogOpen, setCreateLabelDialogOpen] = useState(false);

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
      console.error('Uploading images have error:', error);
      setSnackbarMessage(t('imageUploadError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
      return;
    }
  };

  // Assign labels to images
  const [assignLabelsTrigger, assignLabels] = useAssignLabelToImage();
  useEffect(() => {
    if (assignLabels.isError) {
      setSnackbarMessage(t('assignLabelsError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    } else if (assignLabels.isSuccess) {
      setSnackbarMessage(t('assignLabelsSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setSelectedLabels([]); // Clear selected labels after successful asignment
    }
  }, [assignLabels.isError, assignLabels.isSuccess, t, unlabeledImages]);

  const handleAssignLabels = async () => {
    if (selectedLabels.length === 0 || !imageUrls[currentImageIndex]) return;

    const imageId = imageUrls[currentImageIndex].id;
    const labelIds = selectedLabels.map((label) => label.id);

    try {
      await assignLabelsTrigger({
        imageId: imageId,
        labelIds: labelIds,
      }).unwrap(); // Wait for all labels to be assigned

      unlabeledImages.refetch(); // Refresh the list of unlabeled images
      setSelectedLabels([]); // Clear selected labels after successful assignment

      setSnackbarMessage(t('assignLabelsSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Assigning label have error:', error);
      setSnackbarMessage(t('assignLabelsError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
      return;
    }
  };

  //Create Label
  const [createLabelTrigger] = useCreateLabel();

  const handleCreateLabelSubmit = async (label: {
    name: string;
    description: string;
  }) => {
    try {
      await createLabelTrigger(label).unwrap();
      labels.refetch(); // Refresh the list of labels
      setSnackbarMessage(t('createLabelSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setCreateLabelDialogOpen(false);
    } catch (error) {
      switch (error) {
        case LabelError.DUPLICATE_LABEL_NAME: {
          console.log(typeof error);
          setSnackbarMessage(t('duplicateLabelNameError'));
          setSnackbarSeverity(SnackbarSeverity.WARNING);
          setSnackbarOpen(true);
          break;
        }
        case LabelError.UNKNOWN_ERROR: {
          setSnackbarMessage(t('createLabelError'));
          setSnackbarSeverity(SnackbarSeverity.ERROR);
          setSnackbarOpen(true);
          break;
        }
      }
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
      <CreateLabelDialog
        open={createLabelDialogOpen}
        onClose={() => setCreateLabelDialogOpen(false)}
        onSubmit={handleCreateLabelSubmit}
      />
      {uploadImage.isLoading ||
      labels.isLoading ||
      unlabeledImages.isLoading ? (
        <Loading />
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
              onPageChange={(index) => setCurrentImageIndex(index)}
            />
          </Stack>

          <Stack alignItems="center" width={'50%'} height={'50%'}>
            <Stack spacing={1} width={'100%'}>
              <Typography variant="h6">{t('recommentImageMore')}:</Typography>
              <DragAndDropForm
                maxBytes={5 * 1024 * 1024} // 5MB
                acceptedFileTypes={['image/*']}
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
              <Stack direction={'row'} spacing={1} alignItems={'center'}>
                <Typography variant="h6">{t('imageTagging')}:</Typography>
                <Tooltip title={t('createLabel')}>
                  <IconButton onClick={() => setCreateLabelDialogOpen(true)}>
                    <AddCircleIcon color="primary" />
                  </IconButton>
                </Tooltip>
              </Stack>

              <Tags
                multiple
                options={labels.data ?? []}
                getOptionLabel={(option) => option.name}
                loading={labels.isLoading}
                limitTags={3}
                label={t('selectTag')}
                onChange={(value) => {
                  const tags = value as Label[];
                  setSelectedLabels(tags || []);
                }}
              />
              <Box display="flex" justifyContent="center">
                <Button
                  variant="contained"
                  disabled={
                    selectedLabels.length === 0 || imageUrls.length === 0
                  }
                  onClick={handleAssignLabels}
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
