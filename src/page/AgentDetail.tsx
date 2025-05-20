import { Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

const AgentDetailPage = () => {
  const { t } = useTranslation();
  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <h1>{t('agentDetailInformation')}</h1>
    </Stack>
  );
};

export default AgentDetailPage;
