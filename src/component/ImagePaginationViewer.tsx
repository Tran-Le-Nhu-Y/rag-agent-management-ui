import { useState } from 'react';
import { Box, IconButton, Pagination, Paper, Typography } from '@mui/material';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import type { ImageItem } from '../@types/entities';
import ConfirmDialog from './ConfirmDialog';

type Props = {
  images: ImageItem[];
  itemsPerPage?: number;
  onDelete?: (imageId: string) => void;
  onPageChange?: (page: number) => void;
  onImageDeleted?: () => void;
};

export default function ImagePaginationViewer({
  images,
  itemsPerPage = 1,
  onDelete,
  onPageChange,
  onImageDeleted,
}: Props) {
  const { t } = useTranslation('standard');
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(images.length / itemsPerPage);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    onPageChange?.(value);
  };
  const handleDelete = (imageId: string) => {
    // Gọi callback onDelete để truyền imageId ra ngoài
    onDelete?.(imageId);

    // Gọi callback onImageDeleted nếu có
    onImageDeleted?.();

    // Điều chỉnh trang hiện tại nếu cần thiết
    const newTotalPages = Math.ceil((images.length - 1) / itemsPerPage);
    if (page > newTotalPages && newTotalPages > 0) {
      setPage(newTotalPages);
      onPageChange?.(newTotalPages);
    }
  };

  const startIndex = (page - 1) * itemsPerPage;
  const currentImages = images.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2}
      p={2}
    >
      {images.length === 0 ? (
        <Paper
          elevation={3}
          sx={{
            overflow: 'hidden',
            borderRadius: 3,
            width: '100%',
            height: 440,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            bgcolor: '#f5f5f5',
          }}
        >
          <Typography
            variant="h6"
            color="textSecondary"
            sx={{
              position: 'absolute',
              zIndex: 2,
              textAlign: 'center',
              px: 2,
            }}
          >
            {t('noImage')}
          </Typography>
          <img
            src="/image.jpg"
            alt="No data"
            style={{
              width: '100%',
              height: 480,
              objectFit: 'cover',
              borderRadius: 12,
              opacity: 0.2,
            }}
          />
        </Paper>
      ) : (
        currentImages.map((img) => (
          <Paper
            key={img.id}
            elevation={3}
            sx={{
              overflow: 'hidden',
              borderRadius: 3,
              width: '100%',
              height: 440,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
            }}
          >
            <Zoom zoomMargin={15}>
              <img
                src={img.url}
                alt={`image-${img.id}`}
                style={{
                  width: '100%',
                  height: 480,
                  objectFit: 'cover',
                  borderRadius: 12,
                  cursor: 'zoom-in',
                }}
              />
            </Zoom>

            {onDelete && (
              <Box
                sx={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                }}
              >
                <ConfirmDialog
                  title={t('confirmDeleteTitle')}
                  message={t('deleteImageConfirm')}
                  confirmText={t('confirm')}
                  cancelText={t('cancel')}
                  successMessage={t('deleteImageSuccess')}
                  errorMessage={t('deleteImageFailed')}
                  onDelete={() => handleDelete(img.id)}
                  triggerButton={
                    <IconButton
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.7)',
                        '&:hover': {
                          backgroundColor: 'rgba(255, 0, 0, 0.8)',
                          color: 'white',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                />
              </Box>
            )}
          </Paper>
        ))
      )}

      {images.length > 0 && (
        <Pagination
          count={totalPages}
          page={page}
          onChange={handleChange}
          color="primary"
          shape="rounded"
        />
      )}
    </Box>
  );
}
