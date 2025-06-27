import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  HideDuration,
  isValidLength,
  SnackbarSeverity,
  TextLength,
} from '../../util';
import { useEffect, useState } from 'react';
import { AppSnackbar, InputFileUpload } from '../../component';
import { useNavigate } from 'react-router';
import { useUploadDocument } from '../../service';

const CreateDocumentPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<SnackbarSeverity>('success');
  const [resetSignal, setResetSignal] = useState(false);
  const [description, setDescription] = useState('');
  const [uploadedFile, setUploadedFile] = useState<File>();

  const [uploadDocumentTrigger, uploadDocument] = useUploadDocument();
  useEffect(() => {
    if (uploadDocument.isError) {
      setSnackbarMessage(t('createDocumentError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
    } else if (uploadDocument.isSuccess) {
      setSnackbarMessage(t('createDocumentSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
      setUploadedFile(undefined); // Clear uploaded files after successful upload
    }
  }, [t, uploadDocument.isError, uploadDocument.isSuccess]);

  const handleUploadDocument = async () => {
    if (!uploadedFile) return;

    try {
      const newDocument: UploadDocumentRequest = {
        description: description,
        file: uploadedFile,
      };

      await uploadDocumentTrigger(newDocument);
      setDescription(''); //Clear description
      setUploadedFile(undefined); //Clear the selected file list
      setResetSignal(true); // reset
      setTimeout(() => setResetSignal(false), 100); // Reset signal => false
      navigate('/update-knowledge-management');

      setSnackbarMessage(t('createDocumentSuccess'));
      setSnackbarSeverity(SnackbarSeverity.SUCCESS);
      setSnackbarOpen(true);
    } catch (error) {
      console.error('Uploading images have error:', error);
      setSnackbarMessage(t('createDocumentError'));
      setSnackbarSeverity(SnackbarSeverity.ERROR);
      setSnackbarOpen(true);
      return;
    }
  };

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={3}>
      <AppSnackbar
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={HideDuration.FAST}
        onClose={() => setSnackbarOpen(false)}
      />
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
            onFilesChange={(files: File[]) => {
              setUploadedFile(files[0]);
            }}
            acceptedFileTypes={['.pdf', '.txt']}
            resetSignal={resetSignal}
          />
        </Box>
      </Stack>

      <Box display="flex" justifyContent="center" gap={2}>
        <Button variant="contained" onClick={() => handleUploadDocument()}>
          {t('confirm')}
        </Button>
        <Button variant="outlined" onClick={() => navigate(-1)}>
          {t('back')}
        </Button>
      </Box>
    </Stack>
  );
};

export default CreateDocumentPage;
