import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { isValidLength, TextLength } from '../../util';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddIcon from '@mui/icons-material/Add';
import { useState } from 'react';
import { InputFileUpload } from '../../component';

// type DynamicField = {
//   fieldName: string;
//   fieldValue: string;
// };

const TextRecommendationPage = () => {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  //   const [dynamicFields, setDynamicFields] = useState<DynamicField[]>([]);

  //   const handleAddField = () => {
  //     setDynamicFields((prev) => [...prev, { fieldName: '', fieldValue: '' }]);
  //   };
  //   const handleRemoveField = (index: number) => {
  //     setDynamicFields((prev) => prev.filter((_, i) => i !== index));
  //   };
  //   const handleFieldChange = (
  //     index: number,
  //     key: 'fieldName' | 'fieldValue',
  //     value: string
  //   ) => {
  //     const updatedFields = [...dynamicFields];
  //     updatedFields[index][key] = value;
  //     setDynamicFields(updatedFields);
  //   };
  const [, setUploadedFiles] = useState<File[]>([]);

  return (
    <Stack justifyContent={'center'} alignItems="center" spacing={3}>
      <Typography variant="h4">{t('textRecommendation')}</Typography>
      <Stack spacing={2} sx={{ width: '80%' }}>
        <Stack alignItems={'center'} spacing={1} sx={{ width: '100%' }}>
          <TextField
            fullWidth
            helperText={t('hyperTextMedium')}
            label={t('textRecommendationName')}
            value={name}
            onChange={(e) => {
              const newValue = e.target.value;
              if (isValidLength(newValue, TextLength.MEDIUM)) setName(newValue);
            }}
            placeholder={`${t('enter')} ${t(
              'textRecommendationName'
            ).toLowerCase()}...`}
          />
          <TextField
            multiline
            rows={4}
            fullWidth
            label={t('textRecommendationDescription')}
            value={description}
            helperText={t('hyperTextVeryLong')}
            placeholder={`${t('enter')} ${t(
              'textRecommendationDescription'
            ).toLowerCase()}...`}
            onChange={(e) => {
              const newValue = e.target.value;
              if (isValidLength(newValue, TextLength.VERY_LONG)) {
                setDescription(newValue);
              }
            }}
          />
        </Stack>
        {/* <Stack alignItems={'center'} spacing={2} sx={{ width: '100%' }}>
          <Box
            display="flex"
            justifyContent={'flex-end'}
            sx={{ width: '100%' }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddField}
              startIcon={<AddIcon />}
            >
              {t('addDataField')}
            </Button>
          </Box>

          <Stack spacing={2} sx={{ width: '100%' }}>
            {dynamicFields.map((field, index) => (
              <Stack key={index} direction="row" spacing={2}>
                <Stack spacing={1} sx={{ width: '100%' }}>
                  <TextField
                    label={t('fieldName')}
                    size="small"
                    value={field.fieldName}
                    onChange={(e) =>
                      handleFieldChange(index, 'fieldName', e.target.value)
                    }
                    fullWidth
                  />
                  <TextField
                    label={t('fieldContent')}
                    value={field.fieldValue}
                    onChange={(e) =>
                      handleFieldChange(index, 'fieldValue', e.target.value)
                    }
                    fullWidth
                    multiline
                    rows={3}
                  />
                </Stack>

                <IconButton
                  color="error"
                  aria-label="delete"
                  onClick={() => handleRemoveField(index)}
                >
                  <DeleteIcon />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        </Stack> */}
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
        <Button variant="outlined">{t('cancel')}</Button>
      </Box>
    </Stack>
  );
};

export default TextRecommendationPage;
