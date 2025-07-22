import type { Label } from '../../@types/entities';

function toEntity(response: LabelResponse): Label {
  const label: Label = {
    id: response.id,
    name: response.name,
    description: response.description ?? '',
    source: response.source,
  };
  return label;
}

export { toEntity };
