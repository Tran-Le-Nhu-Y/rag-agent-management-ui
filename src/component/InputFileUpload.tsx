import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type React from 'react';
import {
  Box,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  Paper,
  Typography,
} from '@mui/material';
import { AttachFile, ErrorOutline } from '@mui/icons-material';
import { ClearIcon } from '@mui/x-date-pickers';
import { getFileSize } from '../util';
import { useEffect, useState } from 'react';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export interface FileAttachment {
  id: number;
  status: 'loading' | 'failed' | 'complete';
  progress: number;
  error?: string;
  file: File;
}

export interface InputFileUploadProps {
  onFilesChange: (files: File[]) => void;
  acceptedFileTypes: string[];
  resetSignal?: boolean;
}

const FILE_MAX_BYTES = 128 * 1000 * 1000; // 128MB

export const InputFileUpload: React.FC<InputFileUploadProps> = ({
  onFilesChange,
  acceptedFileTypes,
  resetSignal,
}) => {
  const [files, setFiles] = useState<FileAttachment[]>([]);

  //Check file type
  const isAcceptedFile = (file: File, accepted: string[]) => {
    const fileName = file.name.toLowerCase();
    return accepted.some(
      (type) => fileName.endsWith(type) || file.type === type
    );
  };

  // Handle file upload
  const selectFileHandler = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter((file) =>
      isAcceptedFile(file, acceptedFileTypes)
    );

    if (validFiles.length === 0) {
      alert(`Only files of type: ${acceptedFileTypes.join(', ')} are allowed.`);
      return;
    }

    const file = validFiles[0];
    const size = file.size;

    const newFile: FileAttachment = {
      id: Date.now() + Math.random(),
      status: size > FILE_MAX_BYTES ? 'failed' : 'loading',
      progress: size > FILE_MAX_BYTES ? 0 : 0,
      error: size > FILE_MAX_BYTES ? 'File too large' : undefined,
      file: file,
    };

    setFiles([newFile]);
    onFilesChange([file]);
  };

  const removeFileHandler = (id: number) => {
    const newFiles = files.filter((file) => file.id !== id);
    setFiles(newFiles);
    onFilesChange(newFiles.map((f) => f.file));
  };

  useEffect(() => {
    if (resetSignal) {
      setFiles([]);
    }
  }, [resetSignal]);

  return (
    <Box display={'flex'}>
      {files.length === 0 && (
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
        >
          <CloudUploadIcon />
          <VisuallyHiddenInput
            type="file"
            accept={acceptedFileTypes.join(',')}
            onChange={(e) => {
              if (e.target.files) {
                selectFileHandler(Array.from(e.target.files));
                e.target.value = ''; // Clear the input value after selection
              }
            }}
          />
        </Button>
      )}
      <List
        sx={{
          width: '100%',
          maxHeight: 340,
          overflow: 'auto',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {files.map((file) => (
          <ListItem key={file.id} sx={{ width: 'fit-content' }}>
            <Paper
              elevation={1}
              sx={{
                padding: 2,
                display: 'flex',
                alignItems: 'center',
                minWidth: 200,
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
    </Box>
  );
};
