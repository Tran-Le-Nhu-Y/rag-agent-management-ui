import { Box, Button, Stack, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { isValidLength, TextLength } from '../util';

const AgentCreationPage = () => {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={2}>
      <h1>{t('createAgent')}</h1>
      <Stack spacing={2} width="50%">
        <Box mb={1}>
          <TextField
            fullWidth
            size="small"
            helperText={t('hyperTextMedium')}
            label={t('agentName')}
            value={name}
            onChange={(e) => {
              const newValue = e.target.value;
              if (isValidLength(newValue, TextLength.MEDIUM)) setName(newValue);
            }}
            placeholder={`${t('enter')} ${t('agentName').toLowerCase()}...`}
          />
        </Box>

        <TextField
          type="text"
          placeholder={`${t('enter')} ${t(
            'agentDescription'
          ).toLowerCase()}...`}
          label={t('agentDescription')}
          value={description}
          helperText={t('hyperTextVeryLong')}
          onChange={(e) => {
            const newValue = e.target.value;
            if (isValidLength(newValue, TextLength.MEDIUM))
              setDescription(newValue);
          }}
          multiline
          rows={5}
        />

        <Box mt={3} display="flex" justifyContent="center" gap={2}>
          <Button variant="contained" color="primary" onClick={() => {}}>
            {t('confirm')}
          </Button>
          <Button variant="outlined" color="secondary" onClick={() => {}}>
            {t('cancel')}
          </Button>
        </Box>
      </Stack>
    </Stack>
  );
};

export default AgentCreationPage;
