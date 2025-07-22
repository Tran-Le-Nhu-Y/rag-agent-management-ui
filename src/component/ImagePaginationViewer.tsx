import { useEffect, useMemo, useState } from 'react';
import { Box, IconButton, Pagination, Paper, Typography } from '@mui/material';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import type { ImageItem } from '../@types/entities';
import ConfirmDialog from './ConfirmDialog';

interface Props {
  images: ImageItem[];
  itemsPerPage?: number;
  onDelete?: (imageId: string) => void;
  onPageChange?: (page: number) => void;
  onImageDeleted?: () => void;
}

export default function ImagePaginationViewer({
  images,
  itemsPerPage = 1,
  onDelete,
  onPageChange,
  onImageDeleted,
}: Props) {
  const MIN_PAGE = 0;
  const { t } = useTranslation('standard');
  const [page, setPage] = useState(MIN_PAGE);
  const [imageIdToDelete, setImageIdToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (images.length > 0 && page === MIN_PAGE) setPage(1);
  }, [images.length, page]);

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
    const newPage = Math.max(MIN_PAGE, page - 1);
    setPage(newPage);
    onPageChange?.(newPage);
  };

  const currentImages = useMemo(() => {
    const startIndex = Math.max(0, page - 1) * itemsPerPage;
    return images.slice(startIndex, startIndex + itemsPerPage);
  }, [images, itemsPerPage, page]);

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

            <Box
              sx={{
                position: 'absolute',
                top: 8,
                right: 8,
              }}
            >
              <IconButton
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 0, 0, 0.8)',
                    color: 'white',
                  },
                }}
                onClick={() => setImageIdToDelete(img.id)}
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>
          </Paper>
        ))
      )}
      {imageIdToDelete && (
        <ConfirmDialog
          open={true}
          title={t('confirmDeleteTitle')}
          message={t('deleteImageConfirm')}
          confirmText={t('confirm')}
          cancelText={t('cancel')}
          successMessage={t('deleteImageSuccess')}
          errorMessage={t('deleteImageFailed')}
          onClose={() => setImageIdToDelete(null)}
          onDelete={() => {
            handleDelete(imageIdToDelete);
            setImageIdToDelete(null);
          }}
        />
      )}

      {images.length > 0 && (
        <Pagination
          count={Math.ceil(images.length / itemsPerPage)}
          page={page}
          onChange={handleChange}
          color="primary"
          shape="rounded"
        />
      )}
    </Box>
  );
}
