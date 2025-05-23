import { Box, Button, Stack, Typography } from '@mui/material';
import { DragAndDropForm, Tags } from '../../component';
import { useTranslation } from 'react-i18next';
import type { Tag } from '../../component/Tags';

const ImageRecommendationPage = () => {
  const { t } = useTranslation();
  //const navigate = useNavigate();

  const agentData: Tag[] = [
    { name: 'Agent A' },
    { name: 'Agent B' },
    { name: 'Agent C' },
  ];
  return (
    <Stack
      justifyContent={'center'}
      alignItems="center"
      spacing={5}
      sx={{ width: '100%' }}
    >
      <Typography variant="h4">{t('imageRecommendation')}</Typography>
      <Stack sx={{ width: '70%' }}>
        <Tags tags={agentData} label={t('selectAgent')} />
      </Stack>

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
