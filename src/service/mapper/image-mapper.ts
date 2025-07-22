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
  labels: Label[]
): ImageHasLabels[] {
  return response.map((image) => ({
    id: image.id,
    name: image.name,
    mime_type: image.mime_type,
    created_at: image.created_at,
    labels: labels.filter((label) =>
      image.assigned_label_ids?.includes(label.id)
    ),
    recommenedLabels: labels.filter((label) =>
      image.classified_label_ids?.includes(label.id)
    ),
  }));
}

export { toEntity, toImageHasLabelsEntity };
