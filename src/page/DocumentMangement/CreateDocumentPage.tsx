import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isValidLength, Path, TextLength } from '../../util';
import { useState } from 'react';
import { InputFileUpload, type FileAttachment } from '../../component';
import { useNavigate } from 'react-router';
import { useUploadDocument } from '../../service';
import { useSnackbar } from '../../hook';

const acceptedFileTypes = ['.pdf', '.txt', '.docx'];

const CreateDocumentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const snackbar = useSnackbar();

  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<FileAttachment>();

  const [uploadDocumentTrigger, uploadDocument] = useUploadDocument();
  const handleUploadDocument = async () => {
    if (!uploadedFile) return;

    try {
      const newDocument: UploadDocumentRequest = {
        description: description,
        file: uploadedFile.file,
      };

      await uploadDocumentTrigger(newDocument);
      setDescription(''); //Clear description
      setUploadedFile(undefined); //Clear the selected file list
      navigate(Path.DOCUMENT);

      snackbar.show({
        message: t('createDocumentSuccess'),
        severity: 'success',
      });
    } catch (error) {
      console.error('Uploading images have error:', error);
      snackbar.show({
        message: t('createDocumentError'),
        severity: 'error',
      });
    }
  };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={3}>
      <Typography variant="h4">{t('createDocument')}</Typography>
      <Stack spacing={2} sx={{ width: '80%' }}>
        <Stack alignItems={'center'} spacing={1} sx={{ width: '100%' }}>
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
            files={uploadedFile && [uploadedFile]}
            disabled={uploadDocument.isLoading || uploadedFile !== undefined}
            onFilesChange={(files) => setUploadedFile(files[0])}
            acceptedFileTypes={acceptedFileTypes}
          />
        </Box>
      </Stack>

      <Box display="flex" justifyContent="center" gap={2}>
        <Button
          variant="contained"
          loading={uploadDocument.isLoading}
          disabled={uploadedFile === undefined}
          onClick={() => handleUploadDocument()}
        >
          {t('confirm')}
        </Button>
        <Button
          variant="outlined"
          disabled={uploadDocument.isLoading}
          onClick={() => navigate(Path.DOCUMENT, { replace: true })}
        >
          {t('back')}
        </Button>
      </Box>
    </Stack>
  );
};

export default CreateDocumentPage;
