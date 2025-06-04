import { Box, Button, Stack, Typography } from '@mui/material';
import { DragAndDropForm } from '../../component';
import { useTranslation } from 'react-i18next';

const ImageRecommendationPage = () => {
  const { t } = useTranslation();
  //const navigate = useNavigate();

  return (
    <Stack
      justifyContent={'center'}
      alignItems="center"
      spacing={5}
      sx={{ width: '100%' }}
    >
      <Typography variant="h4">{t('imageRecommendation')}</Typography>

      <Box sx={{ width: '70%' }}>
        <DragAndDropForm
          onFilesChange={function (): void {
            throw new Error('Function not implemented.');
          }}
        />
      </Box>
      <Box display="flex" justifyContent="center">
        <Button variant="contained">{t('confirm')}</Button>
      </Box>
    </Stack>
  );
};

export default ImageRecommendationPage;
