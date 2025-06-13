import { Stack, Typography, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Loading = () => {
  const { t } = useTranslation();
  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent="center"
      alignItems="center"
      height="50vh"
      width="100%"
    >
      <CircularProgress />
      <Typography variant="h6" color="primary">
        {t('loading')}...
      </Typography>
    </Stack>
  );
};

export default Loading;
