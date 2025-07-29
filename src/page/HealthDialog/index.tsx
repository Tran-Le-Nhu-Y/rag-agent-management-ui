import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useGetAgentStatus, useRestartAgent } from '../../service';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface HealthDialogProps {
  open: boolean;
  onClose?: () => void;
}

const HealthDialog: React.FC<HealthDialogProps> = ({ open, onClose }) => {
  const agentStatusQuery = useGetAgentStatus();
  const { t } = useTranslation('standard');
  const agentStatus = useMemo(() => {
    const data = agentStatusQuery.data;
    if (!data)
      return {
        name: '',
        description: '',
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
      name: data.name,
      description: data.description ?? '',
      status: statusMap[data.status],
      stores: data.available_vector_stores,
      syncBM25: data.bm25_last_sync
        ? dayjs(data.bm25_last_sync).toDate().toLocaleString()
        : t('undefined'),
    };
  }, [agentStatusQuery.data, t]);

  const [restartAgentTrigger, restartAgentStatus] = useRestartAgent();
  const restartAgentHandler = async () => {
    try {
      await restartAgentTrigger().unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h4" textAlign={'center'}>
        {t('agentStatus')}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Typography variant="body1" fontWeight={'bold'}>
              {t('agentName')}:
            </Typography>
            <Typography>{agentStatus.name}</Typography>
          </Stack>

          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Typography variant="body1" fontWeight={'bold'}>
              {t('agentDescription')}:
            </Typography>
            <Typography textOverflow={'clip'}>
              {agentStatus.description}
            </Typography>
          </Stack>

          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Typography variant="body1" fontWeight={'bold'}>
              {t('status')}:
            </Typography>
            <Typography>{agentStatus.status}</Typography>
          </Stack>

          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Typography variant="body1" fontWeight={'bold'}>
              {t('configuredVectorStores')}:
            </Typography>
            <Typography>{agentStatus.stores.join(', ')}</Typography>
          </Stack>

          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Typography variant="body1" fontWeight={'bold'}>
              {t('lastSyncBM25')}:
            </Typography>
            <Typography>{agentStatus.syncBM25}</Typography>
          </Stack>

          <Stack direction={'row'} spacing={1} alignItems={'center'}>
            <Typography variant="body1" fontWeight={'bold'}>
              {t('restartAgent')}:
            </Typography>
            <Tooltip title={t('restartAgent')}>
              <IconButton
                color="primary"
                disabled={restartAgentStatus.isLoading}
                onClick={restartAgentHandler}
              >
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {restartAgentStatus.isLoading && <LinearProgress />}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('close')}</Button>
      </DialogActions>
    </Dialog>
  );
};

export default HealthDialog;
