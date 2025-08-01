import {
  Box,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import {
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
  useDeleteImage,
  useGetAllLabel,
  useGetUnlabeledImages,
  useUploadImage,
} from '../../service';
import type { Label } from '../../@types/entities';
import { getImageUrl } from '../../service/api';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useSnackbar } from '../../hook';

const UntaggedImagePage = () => {
  const { t } = useTranslation();
  const [selectedLabels, setSelectedLabels] = useState<Label[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const snackbar = useSnackbar();
  const [currentImageIndex, setCurrentImageIndex] = useState<
    number | undefined
  >(undefined);
  const [createLabelDialogOpen, setCreateLabelDialogOpen] = useState(false);

  // Fetch unlabeled images
  const [unlabeledImagesQuery] = useState<GetUnlabeledImagesQuery>({
    offset: 0,
    limit: 100,
    orderBy: 'created_at',
  });
  const unlabeledImages = useGetUnlabeledImages(unlabeledImagesQuery!, {
    skip: !unlabeledImagesQuery,
  });
  useEffect(() => {
    if (unlabeledImages.isError)
      snackbar.show({
        message: t('imageLoadingError'),
        severity: 'error',
      });

    const contentLength = unlabeledImages?.data?.content?.length;
    if (
      unlabeledImages.isSuccess &&
      contentLength !== undefined &&
      contentLength > 0 &&
      currentImageIndex === undefined
    )
      setCurrentImageIndex(0);
  }, [
    unlabeledImages.isError,
    t,
    unlabeledImages.isSuccess,
    unlabeledImages?.data?.content?.length,
    currentImageIndex,
    snackbar,
  ]);

  // Fetch all labels
  const labels = useGetAllLabel();
  useEffect(() => {
    if (labels.isError)
      snackbar.show({
        message: t('labelLoadingError'),
        severity: 'error',
      });
  }, [labels.isError, snackbar, t]);

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
      recommendLabels: img.recommenedLabels,
    }));
  }, [
    unlabeledImages.data,
    unlabeledImages.isError,
    unlabeledImages.isLoading,
  ]);

  //Delete Image
  const [deleteImageTrigger] = useDeleteImage();
  const handleDeleteImage = async (imageId: string) => {
    try {
      await deleteImageTrigger(imageId).unwrap();
      snackbar.show({
        message: t('deleteImageSuccess'),
        severity: 'success',
      });
    } catch (err) {
      console.error(err);
      snackbar.show({
        message: t('deleteImageFailed'),
        severity: 'error',
      });
    }
  };

  // Handle images upload
  const [uploadImageTrigger, uploadImage] = useUploadImage();
  const handleUploadImages = async () => {
    if (!uploadedFiles.length) return;

    try {
      const uploadPromises = uploadedFiles.map((image) =>
        uploadImageTrigger({ file: image }).unwrap()
      );

      await Promise.all(uploadPromises); //Wait for all images to finish uploading
      setUploadedFiles([]); //Clear the selected file list

      snackbar.show({
        message: t('imageUploadSuccess'),
        severity: 'success',
      });
    } catch (error) {
      console.error('Uploading images have error:', error);
      snackbar.show({
        message: t('imageUploadError'),
        severity: 'error',
      });
    }
  };

  // Assign labels to images
  const [assignLabelsTrigger] = useAssignLabelToImage();
  const handleAssignLabels = async () => {
    if (
      selectedLabels.length === 0 ||
      currentImageIndex === undefined ||
      !imageUrls[currentImageIndex]
    )
      return;

    const imageId = imageUrls[currentImageIndex].id;
    const labelIds = selectedLabels.map((label) => label.id);

    try {
      await assignLabelsTrigger({
        imageId: imageId,
        labelIds: labelIds,
      }).unwrap(); // Wait for all labels to be assigned

      setSelectedLabels([]); // Clear selected labels after successful assignment

      snackbar.show({
        message: t('assignLabelsSuccess'),
        severity: 'success',
      });
    } catch (error) {
      console.error('Assigning label have error:', error);
      snackbar.show({
        message: t('assignLabelsError'),
        severity: 'error',
      });
    }
  };

  return (
    <Stack justifyContent={'center'} alignItems="center">
      <CreateLabelDialog
        open={createLabelDialogOpen}
        onClose={() => setCreateLabelDialogOpen(false)}
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
              onPageChange={(page) => {
                const newIndex = page - 1;
                setCurrentImageIndex(newIndex < 0 ? undefined : newIndex);
              }}
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

              {currentImageIndex !== undefined && (
                <Stack direction={'row'} spacing={1} alignItems="center">
                  <IconButton
                    color="primary"
                    disabled={
                      imageUrls[currentImageIndex]?.recommendLabels ===
                      undefined
                    }
                    onClick={() => {
                      if (currentImageIndex >= imageUrls.length) return;
                      const recommendedLabels =
                        imageUrls[currentImageIndex]?.recommendLabels;
                      if (recommendedLabels)
                        setSelectedLabels(recommendedLabels);
                    }}
                  >
                    <Tooltip
                      title={t('selectAllLabelHints')}
                      placement="bottom"
                    >
                      <ArrowDownwardIcon />
                    </Tooltip>
                  </IconButton>

                  <Typography
                    variant="body1"
                    color="textPrimary"
                    textOverflow={'ellipsis'}
                  >
                    {t('labelHint')}:{' '}
                    {imageUrls[currentImageIndex]?.recommendLabels
                      ?.map((label) => label.name)
                      ?.join(', ') ?? t('noLabelHint')}
                  </Typography>
                </Stack>
              )}

              <Tags
                multiple
                value={selectedLabels}
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
