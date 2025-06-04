function toEntity(response: ImageResponse): Image {
  const image: Image = {
    id: response.id,
    name: response.name,
    mime_type: response.mime_type,
  };
  return image;
}

export { toEntity };
