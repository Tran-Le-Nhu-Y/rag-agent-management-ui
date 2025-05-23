import { useState } from 'react';
import { Box, Pagination, Paper, Typography } from '@mui/material';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export type ImageItem = {
  url: string;
  title?: string;
};

type Props = {
  images: ImageItem[];
  itemsPerPage?: number;
};

export default function ImagePaginationViewer({
  images,
  itemsPerPage = 1,
}: Props) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(images.length / itemsPerPage);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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
      {currentImages.map((img, idx) => (
        <Paper
          key={idx}
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
              alt={img.title || `image-${idx}`}
              style={{
                width: '100%',
                height: 480,
                objectFit: 'cover',
                borderRadius: 12,
                cursor: 'zoom-in',
              }}
            />
          </Zoom>
          {img.title && (
            <Typography
              variant="caption"
              sx={{
                position: 'absolute',
                bottom: 8,
                left: 12,
                color: 'white',
                background: 'rgba(0, 0, 0, 0.4)',
                borderRadius: 1,
                px: 1,
              }}
            >
              {img.title}
            </Typography>
          )}
        </Paper>
      ))}

      <Pagination
        count={totalPages}
        page={page}
        onChange={handleChange}
        color="primary"
        shape="rounded"
      />
    </Box>
  );
}
