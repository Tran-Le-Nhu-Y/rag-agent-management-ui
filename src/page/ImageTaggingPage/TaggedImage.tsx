import { Button, Stack } from '@mui/material';
import { AppSnackbar, TaggedImageList, Tags } from '../../component';
import { useTranslation } from 'react-i18next';
import { useState, useMemo, useEffect } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import type { Label } from '../../@types/entities';
import {
  useGetAllLabel,
  useGetImagesByLabelId,
  useGetLabeledImages,
} from '../../service';
import { HideDuration } from '../../util';
import { getImageUrl } from '../../service/api';

const TaggedImagePage = () => {
  const { t } = useTranslation();
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Query to get all labels
  const labels = useGetAllLabel();
  useEffect(() => {
    if (labels.isError) {
      setSnackbarMessage(t('labelLoadingError'));
      setSnackbarOpen(true);
    }
  }, [labels.isError, t]);

  // Query to get all labeled images
  const labeledImagesQuery = useMemo<GetLabeledImagesQuery>(
    () => ({
      offset: 0,
      limit: 100,
      orderBy: 'created_at',
    }),
    []
  );
  const allLabeledImages = useGetLabeledImages(labeledImagesQuery!, {
    skip: !!selectedLabel,
  });

  // Query to get images by selected label
  const imagesByLabelIdQuery = useMemo<GetImagesByLabelIdQuery>(() => {
    return {
      labelId: selectedLabel?.id ?? '',
      offset: 0,
      limit: 100,
      orderBy: 'created_at',
    };
  }, [selectedLabel]);
  const imagesByLabelId = useGetImagesByLabelId(imagesByLabelIdQuery!, {
    skip: !selectedLabel,
  });

  // Handle errors for images by label ID
  useEffect(() => {
    if (
      (imagesByLabelId.isError && selectedLabel) ||
      (allLabeledImages.isError && !selectedLabel)
    ) {
      setSnackbarMessage(t('imageLoadingError'));
      setSnackbarOpen(true);
    }
  }, [allLabeledImages.isError, imagesByLabelId.isError, selectedLabel, t]);

  // Prepare image URLs for the image list
  const imageUrls = useMemo(() => {
    // If no label is selected, we use the all labeled images query
    const sourceImages = selectedLabel ? imagesByLabelId : allLabeledImages;
    if (!sourceImages.data || sourceImages.isLoading || sourceImages.isError)
      return [];

    return sourceImages.data.content.map((img) => ({
      id: img.id,
      url: getImageUrl(img.id),
      labels: selectedLabel ? [selectedLabel.name] : [],
    }));
  }, [selectedLabel, imagesByLabelId, allLabeledImages]);

  return (
    <Stack justifyContent="center" alignItems="center" spacing={4}>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity="error"
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
      <Stack direction="row" spacing={4} alignItems="center" width="80%">
        <Tags
          labelList={labels.data ?? []}
          label={t('tagSearch')}
          onChange={(tags: Label[] | null) => {
            if (tags && tags.length > 0) {
              setSelectedLabel(tags[0]);
            } else {
              setSelectedLabel(null);
            }
          }}
        />
        <Button
          variant="contained"
          endIcon={<FileDownloadIcon />}
          onClick={() => {}}
          disabled={imagesByLabelId.data?.content.length === 0}
          sx={{ width: '200px' }}
        >
          {t('downloadImages')}
        </Button>
      </Stack>

      <TaggedImageList items={imageUrls} cols={5} />
    </Stack>
  );
};

export default TaggedImagePage;
