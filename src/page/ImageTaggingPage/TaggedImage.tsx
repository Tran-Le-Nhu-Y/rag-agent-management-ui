import { Button, Stack } from '@mui/material';
import { TaggedImageList, Tags } from '../../component';
import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const TaggedImagePage = () => {
  const { t } = useTranslation();
  const [selectedTag, setSelectedTag] = useState<Label | null>(null);

  const imageDataFromBackend = useMemo(
    () => [
      {
        url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
        tag: 'White Spot',
      },
      {
        url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
        tag: 'Healthy',
      },
      {
        url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
        tag: 'White Spot',
      },
      {
        url: 'https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c',
        tag: 'Early Mortality Syndrome',
      },
      {
        url: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
        tag: 'White Spot',
      },
      {
        url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
        tag: 'Healthy',
      },
      {
        url: 'https://images.unsplash.com/photo-1516802273409-68526ee1bdd6',
        tag: 'Healthy',
      },
      {
        url: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
        tag: 'Early Mortality Syndrome',
      },
      {
        url: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
        tag: 'White Spot',
      },
      {
        url: 'https://images.unsplash.com/photo-1567306301408-9b74779a11af',
        tag: 'White Spot',
      },
      {
        url: 'https://images.unsplash.com/photo-1549388604-817d15aa0110',
        tag: 'Early Mortality Syndrome',
      },
      {
        url: 'https://images.unsplash.com/photo-1525097487452-6278ff080c31',
        tag: 'White Spot',
      },
      {
        url: 'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6',
        tag: 'Healthy',
      },
      {
        url: 'https://images.unsplash.com/photo-1563298723-dcfebaa392e3',
        tag: 'Early Mortality Syndrome',
      },
      {
        url: 'https://images.unsplash.com/photo-1588436706487-9d55d73a39e3',
        tag: 'Healthy',
      },
      {
        url: 'https://images.unsplash.com/photo-1574180045827-681f8a1a9622',
        tag: 'Healthy',
      },
      {
        url: 'https://images.unsplash.com/photo-1530731141654-5993c3016c77',
        tag: 'White Spot',
      },
      {
        url: 'https://images.unsplash.com/photo-1481277542470-605612bd2d61',
        tag: 'Early Mortality Syndrome',
      },
      {
        url: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7',
        tag: 'Healthy',
      },
      {
        url: 'https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee',
        tag: 'Early Mortality Syndrome',
      },
      {
        url: 'https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62',
        tag: 'Early Mortality Syndrome',
      },
      {
        url: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
        tag: 'Early Mortality Syndrome',
      },
    ],
    []
  );

  const tagData: Label[] = [
    {
      name: 'White Spot',
      id: '1',
      description: 'A',
    },
    {
      name: 'Early Mortality Syndrome',
      id: '2',
      description: 'B',
    },
    {
      name: 'Healthy',
      id: '3',
      description: 'C',
    },
  ];
  const filteredImages = useMemo(() => {
    if (selectedTag) {
      return imageDataFromBackend.filter((img) => img.tag === selectedTag.name);
    }
    return imageDataFromBackend;
  }, [imageDataFromBackend, selectedTag]);
  //   const [filteredImages, setFilteredImages] = useState(imageDataFromBackend);

  //   useEffect(() => {
  //     if (selectedTag) {
  //       const filtered = imageDataFromBackend.filter(
  //         (img) => img.tag === selectedTag.name
  //       );
  //       setFilteredImages(filtered);
  //     } else {
  //       setFilteredImages(imageDataFromBackend);
  //     }
  //   }, [imageDataFromBackend, selectedTag]);

  //   const handleDownloadAll = () => {
  //     currentPageImages.forEach((img, i) => {
  //       const link = document.createElement('a');
  //       link.href = img.url;
  //       link.download = `image-${i + 1}.jpg`;
  //       link.target = '_blank';
  //       link.rel = 'noopener noreferrer';
  //       document.body.appendChild(link);
  //       link.click();
  //       document.body.removeChild(link);
  //     });
  //   };

  return (
    <Stack justifyContent="center" alignItems="center" spacing={4}>
      <Stack direction="row" spacing={4} alignItems="center" width="80%">
        <Tags
          labelList={tagData}
          label={t('tagSearch')}
          onChange={setSelectedTag}
        />
        <Button
          variant="contained"
          endIcon={<FileDownloadIcon />}
          onClick={() => {}}
          disabled={filteredImages.length === 0}
          sx={{ width: '200px' }}
        >
          {t('downloadImages')}
        </Button>
      </Stack>

      <TaggedImageList items={filteredImages} cols={5} />
    </Stack>
  );
};

export default TaggedImagePage;
