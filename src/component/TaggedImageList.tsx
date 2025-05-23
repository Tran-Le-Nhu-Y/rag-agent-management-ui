import ImageList from '@mui/material/ImageList';
import ImageListItem from '@mui/material/ImageListItem';
import ImageListItemBar from '@mui/material/ImageListItemBar';

export type ImageItem = {
  url: string;
  tag: string;
  author?: string;
};

type Props = {
  items: ImageItem[];
  cols: number;
  onItemClick?: (item: ImageItem) => void;
};

export default function TaggedImageList({ items, cols, onItemClick }: Props) {
  return (
    <ImageList cols={cols} gap={8}>
      {items.map((item) => (
        <ImageListItem
          key={`${item.url}-${item.tag}`}
          onClick={() => onItemClick?.(item)}
        >
          <img
            srcSet={`${item.url}?w=248&fit=crop&auto=format&dpr=2 2x`}
            src={`${item.url}?w=248&fit=crop&auto=format`}
            alt={item.tag}
            loading="lazy"
          />
          <ImageListItemBar
            title={item.tag}
            //subtitle={<span>by: {item.author}</span>}
            position="below"
          />
        </ImageListItem>
      ))}
    </ImageList>
  );
}
