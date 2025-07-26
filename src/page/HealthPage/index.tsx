import { Stack, Typography } from '@mui/material';
import { useGetAgentStatus } from '../../service';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const HealthPage = () => {
  const agentStatusQuery = useGetAgentStatus();
  const { t } = useTranslation('standard');
  const agentStatus = useMemo(() => {
    const data = agentStatusQuery.data;
    if (!data)
      return {
        status: '',
        stores: [],
        syncBM25: '',
      };

    const statusMap: Record<
      'ON' | 'OFF' | 'RESTART' | 'EMBED_DOCUMENT',
      string
    > = {
      ON: t('ON'),
      OFF: t('OFF'),
      RESTART: t('RESTART'),
      EMBED_DOCUMENT: t('embedDocument'),
    };

    return {
      status: statusMap[data.status],
      stores: data.available_vector_stores,
      syncBM25: data.bm25_last_sync
        ? dayjs(data.bm25_last_sync).toDate().toLocaleString()
        : t('undefined'),
    };
  }, [agentStatusQuery.data, t]);

  return (
    <Stack spacing={2}>
      <Typography variant="h4" textAlign={'center'}>
        {t('agentStatus')}
      </Typography>

      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <Typography variant="h6">{t('status')}:</Typography>
        <Typography>{agentStatus.status}</Typography>
      </Stack>

      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <Typography variant="h6">{t('configuredVectorStores')}:</Typography>
        <Typography>{agentStatus.stores.join(', ')}</Typography>
      </Stack>

      <Stack direction={'row'} spacing={1} alignItems={'center'}>
        <Typography variant="h6">{t('lastSyncBM25')}:</Typography>
        <Typography>{agentStatus.syncBM25}</Typography>
      </Stack>
    </Stack>
  );
};

export default HealthPage;
