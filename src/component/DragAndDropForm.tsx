import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AttachFile, CloudUpload, ErrorOutline } from '@mui/icons-material';
import ClearIcon from '@mui/icons-material/Clear';
import {
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { getFileSize } from '../util';

const DEFAULT_FILE_MAX_BYTES = 128 * 1000 * 1000; // 128MB

export interface FileAttachment {
  id: number;
  status: 'loading' | 'failed' | 'complete';
  progress: number;
  error?: string;
  file: File;
}

export interface DragAndDropFormProps {
  maxBytes?: number;
  acceptedFileTypes?: string[];
  onFilesChange: (files: File[]) => void;
}

export const DragAndDropForm: React.FC<DragAndDropFormProps> = ({
  maxBytes = DEFAULT_FILE_MAX_BYTES,
  acceptedFileTypes = [],
  onFilesChange,
}) => {
  const { t } = useTranslation('standard');

  const [files, setFiles] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file upload
  const selectFileHandler = (selectedFiles: File[]) => {
    const mapped: FileAttachment[] = selectedFiles.map((file) => {
      const size = file.size;
      return {
        id: Date.now() + Math.random(),
        status: size > DEFAULT_FILE_MAX_BYTES ? 'failed' : 'loading',
        progress: size > DEFAULT_FILE_MAX_BYTES ? 0 : 0,
        error: size > DEFAULT_FILE_MAX_BYTES ? 'File too large' : undefined,
        file: file,
      };
    });
    const newFiles = [...files, ...mapped];
    setFiles(newFiles);
    onFilesChange(newFiles.map((f) => f.file));
  };

  const dragOverFileHandler = (e: React.DragEvent) => {
    e.preventDefault();
  };
  const dropFileHandler = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      selectFileHandler(Array.from(e.dataTransfer.files));
    }
  };

  const removeFileHandler = (id: number) => {
    const newFiles = files.filter((file) => file.id !== id);
    setFiles(newFiles);
    onFilesChange(newFiles.map((f) => f.file));
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 1,
        textAlign: 'center',
        justifyContent: 'center',
        border: '2px dashed #ccc',
        borderRadius: 2,
        cursor: 'pointer',
        width: '100%',
      }}
      onDragOver={dragOverFileHandler}
      onDrop={dropFileHandler}
      onClick={() => {
        fileInputRef.current?.click();
      }}
    >
      {files.length === 0 && (
        <Stack direction={'column'} spacing={1} alignItems={'center'}>
          <Typography variant="subtitle1">{t('dragAndDrop')}</Typography>
          <CloudUpload
            sx={{ fontSize: 40, color: 'lightskyblue', display: 'block' }}
          />
          <Typography variant="caption">
            {`${t('sizeLimit')} ${getFileSize(maxBytes)}`}
          </Typography>
        </Stack>
      )}

      <List
        sx={{
          width: '100%',
          maxHeight: 200,
          overflowY: 'auto',

          //   display: 'flex',
          //   flexDirection: 'column',
        }}
      >
        {files.map((file) => (
          <ListItem
            key={file.id}
            disableGutters
            sx={{
              display: 'flex',
              justifyContent: 'flex-start',
              px: 1,
              //   py: 1,
              //   width: 'fit-content',
            }}
          >
            <Paper
              elevation={1}
              sx={{
                width: '100%',
                padding: 1,
                display: 'flex',
                alignItems: 'center',
                minWidth: 250,
                position: 'relative',
                backgroundColor: file.status === 'failed' ? '#ffe6e6' : 'white',
                border: file.status === 'failed' ? '1px solid #ff4d4d' : 'none',
              }}
            >
              {file.status === 'failed' ? (
                <ErrorOutline color="error" sx={{ mr: 1 }} />
              ) : (
                <AttachFile color="primary" sx={{ mr: 1 }} />
              )}
              <Box display={'flex'} flexDirection={'column'}>
                <Typography
                  variant="caption"
                  fontWeight="bold"
                  color={file.status === 'failed' ? 'error' : 'textPrimary'}
                >
                  {file.file.name}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {getFileSize(file.file.size)}
                </Typography>

                {/* {file.status === 'loading' && (
                  <LinearProgress
                    variant="determinate"
                    value={file.progress}
                    sx={{ mt: 1 }}
                  />
                )} */}

                {file.status === 'failed' && (
                  <LinearProgress
                    variant="determinate"
                    value={100}
                    sx={{
                      mt: 1,
                      backgroundColor: '#ffcccc',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#ff4d4d',
                      },
                    }}
                  />
                )}
              </Box>

              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFileHandler(file.id);
                }}
                sx={{
                  position: 'absolute',
                  top: -5,
                  right: -5,
                  color: '#ccc',
                }}
              >
                <ClearIcon />
              </IconButton>
            </Paper>
          </ListItem>
        ))}
      </List>
      <input
        multiple
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        ref={fileInputRef}
        accept={acceptedFileTypes.join(',')}
        onChange={(e) => {
          if (e.target.files) {
            selectFileHandler(Array.from(e.target.files));
            e.target.value = ''; // Clear the input value after selection
          }
        }}
      />
    </Paper>
  );
};
