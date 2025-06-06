function toEntity(response: ImageResponse): Image {
  const image: Image = {
    id: response.id,
    name: response.name,
    mime_type: response.mime_type,
    created_at: response.created_at,
  };
  return image;
}

export { toEntity };
