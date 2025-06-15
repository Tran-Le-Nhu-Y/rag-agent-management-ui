import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isValidLength, TextLength } from '../../util';
import { useState } from 'react';
import { InputFileUpload } from '../../component';
import { useNavigate } from 'react-router';

const CreateDocumentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');

  const [, setUploadedFiles] = useState<File[]>([]);

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={3}>
      <Typography variant="h4">{t('createDocument')}</Typography>
      <Stack spacing={2} sx={{ width: '80%' }}>
        <Stack alignItems={'center'} spacing={1} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            helperText={t('hyperTextMedium')}
            label={t('documentName')}
            value={name}
            onChange={(e) => {
              const newValue = e.target.value;
              if (isValidLength(newValue, TextLength.MEDIUM)) setName(newValue);
            }}
            placeholder={`${t('enter')} ${t('documentName').toLowerCase()}...`}
          />
          <TextField
            multiline
            rows={4}
            fullWidth
            label={t('documentDescription')}
            value={description}
            helperText={t('hyperTextVeryLong')}
            placeholder={`${t('enter')} ${t(
              'documentDescription'
            ).toLowerCase()}...`}
            onChange={(e) => {
              const newValue = e.target.value;
              if (isValidLength(newValue, TextLength.VERY_LONG)) {
                setDescription(newValue);
              }
            }}
          />
        </Stack>

        <Box display="flex" flexWrap="wrap" alignItems="center" gap={2}>
          <Typography variant="body1">
            {t('addTextRecommendationFile')}:
          </Typography>
          <InputFileUpload
            onFilesChange={(files: File[]) => {
              setUploadedFiles(files);
            }}
            acceptedFileTypes={['.pdf', '.txt']}
          />
        </Box>
      </Stack>

      <Box display="flex" justifyContent="center" gap={2}>
        <Button variant="contained">{t('confirm')}</Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          {t('cancel')}
        </Button>
      </Box>
    </Stack>
  );
};

export default CreateDocumentPage;
