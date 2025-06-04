import { Alert, Box, Button, Snackbar, Stack, Typography } from '@mui/material';
import { DragAndDropForm, ImagePaginationViewer, Tags } from '../../component';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { useGetAllLabel } from '../../service';

const UntaggedImagePage = () => {
  const { t } = useTranslation();

  //const navigate = useNavigate();
  const imageDataFromBackend = [
    {
      url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    },
    {
      url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    },
    {
      url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    },
    {
      url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    },
    {
      url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    },
    {
      url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    },
    {
      url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    },
    {
      url: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
    },
    {
      url: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    },
    {
      url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    },
    {
      url: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
    },
    {
      url: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    },
    {
      url: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    },
    {
      url: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
    },
  ];
  const labels = useGetAllLabel();

  const [images, setImages] = useState(imageDataFromBackend);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const handleDeleteImage = (index: number) => {
    const confirmed = window.confirm(t('deleteImageConfirm'));
    if (!confirmed) return;
    setOpenSnackbar(true);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  //   const handleDelete = async (productId: string) => {
  // 		const confirmed = await dialogs.confirm(t('deleteProductConfirm'), {
  // 			title: t('deleteConfirm'),
  // 			okText: t('yes'),
  // 			cancelText: t('cancel'),
  // 			severity: 'error',
  // 		});
  // 		if (!confirmed) return;

  // 		await deleteSoftwareTrigger(productId);
  // 	};

  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  return (
    <Stack justifyContent={'center'} alignItems="center">
      <Stack
        direction={'row'}
        justifyContent="center"
        alignItems="center"
        spacing={5}
      >
        <ImagePaginationViewer
          images={images}
          itemsPerPage={1}
          onDelete={handleDeleteImage}
        />
        <Stack alignItems="center" spacing={8} width={'50%'}>
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
              <Typography>Đang tải nhãn...</Typography>
            ) : labels.error ? (
              <Typography color="error">
                Không thể tải danh sách nhãn
              </Typography>
            ) : (
              <Tags
                labelList={labels.data ?? []}
                label={t('selectTag')}
                onChange={(tag) => setSelectedLabel(tag)}
              />
            )}
            <Box display="flex" justifyContent="center">
              <Button variant="contained" disabled={!selectedLabel}>
                {t('tagging')}
              </Button>
            </Box>
          </Stack>
        </Stack>
      </Stack>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="success"
          sx={{ width: '100%' }}
        >
          {t('deleteImageSuccess')}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default UntaggedImagePage;
