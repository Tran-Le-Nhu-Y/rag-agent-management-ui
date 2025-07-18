import { Button, Stack } from '@mui/material';
import { AppSnackbar, Loading, TaggedImageList, Tags } from '../../component';
import { useTranslation } from 'react-i18next';
import { useState, useMemo, useEffect, useCallback } from 'react';
import type { ImageHasLabels, Label } from '../../@types/entities';
import {
  useGetAllLabel,
  useGetImagesByLabelIds,
  useGetLabeledImages,
} from '../../service';
import { HideDuration, SnackbarSeverity } from '../../util';

import SelectLabelToExportDialog from './SelectLabelToExportDialog';
import {
  downloadFile,
  getExportingAllToken,
  getImageUrl,
} from '../../service/api';

const TaggedImagePage = () => {
  const { t } = useTranslation();
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [openExportDialog, setOpenExportDialog] = useState(false);
  const pageSize = 10;

  // Query to get all labels
  const labels = useGetAllLabel();
  useEffect(() => {
    if (labels.isError) {
      setSnackbarMessage(t('labelLoadingError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [labels.isError, t]);

  // Query to get all labeled images
  const [labeledImagesQuery, setLabeledImagesQuery] =
    useState<GetLabeledImagesQuery>({
      offset: 0,
      limit: pageSize,
      orderBy: 'created_at',
    });
  const allLabeledImages = useGetLabeledImages(labeledImagesQuery, {
    skip: selectedLabelIds.length !== 0,
  });

  // Query to get images by selected label
  const [imagesByLabelIdsQuery, setImagesByLabelIdsQuery] =
    useState<GetImagesByLabelIdsQuery>({
      labelIds: [],
      offset: 0,
      limit: pageSize,
    });
  const imagesByLabelIds = useGetImagesByLabelIds(imagesByLabelIdsQuery, {
    skip: selectedLabelIds.length === 0,
  });
  useEffect(() => {
    if (imagesByLabelIds.isError) {
      setSnackbarMessage(t('assignLabelsError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    }
  }, [imagesByLabelIds.isError, t]);

  //Prepare image URLs for the image list
  const imageUrls = useMemo<
    PagingWrapper<{ id: string; url: string; labels: string[] }>
  >(() => {
    // If no label is selected, we use the all labeled images query
    const sourceImages =
      selectedLabelIds.length > 0
        ? imagesByLabelIds.data
        : allLabeledImages.data;
    if (
      !sourceImages ||
      imagesByLabelIds.isLoading ||
      allLabeledImages.isLoading
    )
      return {
        content: [],
        total_elements: 0,
        total_pages: 0,
        page_size: pageSize,
        page_number: 0,
        first: true,
        last: true,
      };

    const newContent = sourceImages.content.map((img) => {
      const image = img as ImageHasLabels;
      return {
        id: image.id,
        url: getImageUrl(image.id),
        labels: image.labels?.map((label) => label.name) ?? [],
      };
    });
    return {
      content: newContent,
      total_elements: sourceImages.total_elements,
      total_pages: sourceImages.total_pages ?? 0,
      page_size: sourceImages.page_size,
      page_number: sourceImages.page_number,
      first: sourceImages.first ?? true,
      last: sourceImages.last ?? true,
    };
  }, [
    allLabeledImages.data,
    allLabeledImages.isLoading,
    imagesByLabelIds.data,
    imagesByLabelIds.isLoading,
    selectedLabelIds.length,
  ]);

  const handleExportAll = useCallback(async () => {
    try {
      const path = await getExportingAllToken();

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
  }, [t]);

  return (
    <Stack justifyContent="center" alignItems="center">
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
      <SelectLabelToExportDialog
        open={openExportDialog}
        onClose={() => setOpenExportDialog(false)}
      />
      <Stack direction="row" spacing={2} alignItems="center" width="80%">
        <Tags
          multiple
          options={labels.data ?? []}
          getOptionLabel={(option) => option.name}
          loading={labels.isLoading}
          limitTags={5}
          label={t('tagSearch')}
          onChange={(value) => {
            const tags = value as Label[];
            const labelIds = tags?.map((label) => label.id) || [];
            setSelectedLabelIds(labelIds);
            setImagesByLabelIdsQuery((pre) => ({
              ...pre,
              labelIds: labelIds,
            }));
          }}
        />
        <Button
          variant="contained"
          onClick={handleExportAll}
          disabled={imagesByLabelIds.data?.content.length === 0}
          sx={{ width: '250px' }}
        >
          {t('downloadImages')}
        </Button>
        <Button
          variant="contained"
          onClick={() => setOpenExportDialog(true)}
          sx={{ width: '250px' }}
        >
          {t('downloadImagesByLabel')}
        </Button>
      </Stack>
      {allLabeledImages.isLoading ||
      allLabeledImages.isFetching ||
      imagesByLabelIds.isLoading ||
      imagesByLabelIds.isFetching ? (
        <Loading />
      ) : (
        <TaggedImageList
          items={imageUrls.content}
          cols={5}
          page={(imageUrls.page_number ?? 0) + 1}
          pageSize={pageSize}
          total={imageUrls.total_elements ?? 0}
          onPageChange={(newPage) =>
            setLabeledImagesQuery((pre) => ({ ...pre, offset: newPage - 1 }))
          }
        />
      )}
    </Stack>
  );
};

export default TaggedImagePage;
