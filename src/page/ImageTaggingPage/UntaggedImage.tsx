import { Box, Button, Stack, Typography } from '@mui/material';
import { ImagePaginationViewer, Tags } from '../../component';
import { useTranslation } from 'react-i18next';
import type { Tag } from '../../component/Tags';

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
  const agentData: Tag[] = [
    { name: 'Agent A' },
    { name: 'Agent B' },
    { name: 'Agent C' },
  ];
  return (
    <Stack justifyContent={'center'} alignItems="center">
      <Stack
        direction={'row'}
        justifyContent="center"
        alignItems="center"
        spacing={5}
      >
        <ImagePaginationViewer images={imageDataFromBackend} itemsPerPage={1} />
        <Stack alignItems="center" spacing={5} sx={{ width: 500 }}>
          <Typography variant="h4">{t('imageTagging')}</Typography>
          <Tags tags={agentData} label={t('selectAgent')} />
          <Tags tags={tagData} label={t('selectTag')} />
          <Box display="flex" justifyContent="center">
            <Button variant="contained">{t('confirm')}</Button>
          </Box>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default UntaggedImagePage;
