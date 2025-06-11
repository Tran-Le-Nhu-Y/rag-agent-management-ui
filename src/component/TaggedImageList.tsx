import { Chip, Typography, Tooltip, Box } from '@mui/material';
import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

export type ImageItem = {
  url: string;
  labels: string[];
  author?: string;
};

type Props = {
  items: ImageItem[];
  cols: number;
  onItemClick?: (item: ImageItem) => void;
};

export default function TaggedImageList({ items, cols, onItemClick }: Props) {
  return (
    <ImageList cols={cols} gap={8} sx={{ width: '100%', padding: 1 }}>
      {items.map((item) => (
        <ImageListItem
          key={`${item.url}-${item.labels.join(',')}`}
          onClick={() => onItemClick?.(item)}
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            boxShadow: 2,
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            backgroundColor: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
              transform: 'scale(1.01)',
              boxShadow: 4,
            },
          }}
        >
          <Box
            sx={{
              width: '100%',
              height: 180,
              backgroundColor: 'rgba(5, 4, 4, 0.1)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Zoom zoomMargin={5}>
              <img
                src={item.url}
                alt={item.labels.join(', ')}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.3s ease',
                }}
              />
            </Zoom>
          </Box>

          {/* Label and author box */}
          <Box
            sx={{
              padding: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            {/* Labels */}
            <Tooltip
              title={item.labels.join(', ')}
              arrow
              placement="bottom-start"
            >
              <Box
                sx={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  overflow: 'hidden',
                }}
              >
                {item.labels.slice(0, 2).map((label) => (
                  <Chip
                    key={label}
                    label={label}
                    size="small"
                    variant="filled"
                    sx={{
                      maxWidth: 100,
                      textOverflow: 'ellipsis',
                      overflow: 'hidden',
                    }}
                  />
                ))}
                {item.labels.length > 2 && (
                  <Chip
                    label={`+${item.labels.length - 2}`}
                    size="small"
                    variant="outlined"
                    sx={{ backgroundColor: '#f5f5f5' }}
                  />
                )}
              </Box>
            </Tooltip>

            {/* Author */}
            {item.author && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ marginTop: 0.5 }}
              >
                by {item.author}
              </Typography>
            )}
          </Box>
        </ImageListItem>
      ))}
    </ImageList>
  );
}
