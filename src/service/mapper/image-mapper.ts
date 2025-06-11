import type { Image, ImageHasLabels, Label } from '../../@types/entities';

function toEntity(response: ImageResponse): Image {
  const image: Image = {
    id: response.id,
    name: response.name,
    mime_type: response.mime_type,
    created_at: response.created_at,
  };
  return image;
}

function toImageHasLabelsEntity(
  response: ImageResponse[],
  labelsByImageId: Record<string, Label[]>
): ImageHasLabels[] {
  return response.map((image) => ({
    id: image.id,
    name: image.name,
    mime_type: image.mime_type,
    created_at: image.created_at,
    labels: (labelsByImageId[image.id] || []).map((label) => ({
      id: label.id,
      name: label.name,
      description: label.description,
    })),
  }));
}

export { toEntity, toImageHasLabelsEntity };
