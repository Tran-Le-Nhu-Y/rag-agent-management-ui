import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { ImagePaginationViewer, Tags } from '../../component';
import { useTranslation } from 'react-i18next';
import type { Tag } from '../../component/Tags';
import { useState } from 'react';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

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
  const tagData: Tag[] = [
    { name: 'White Spot' },
    { name: 'Early Mortality Syndrome' },
    { name: 'Healthy' },
  ];
  const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });

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

  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

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
          <Stack direction={'row'} spacing={2} width={'100%'}>
            <Typography variant="h6">{t('recommentImageMore')}:</Typography>
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              {t('uploadImage')}
              <VisuallyHiddenInput
                type="file"
                onChange={(event) => console.log(event.target.files)}
                multiple
              />
            </Button>
          </Stack>
          <Stack width={'100%'} spacing={1}>
            <Typography variant="h6">{t('imageTagging')}:</Typography>
            <Tags
              tags={tagData}
              label={t('selectTag')}
              onChange={(tag) => setSelectedTag(tag)}
            />
            <Box display="flex" justifyContent="center">
              <Button variant="contained" disabled={!selectedTag}>
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
