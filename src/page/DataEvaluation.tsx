import { Stack, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

const DataEvaluationPage = () => {
  const { t } = useTranslation();
  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <Typography>{t('dataEvaluation')}</Typography>
    </Stack>
  );
};

export default DataEvaluationPage;
