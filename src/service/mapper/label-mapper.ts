function toEntity(response: LabelResponse): Label {
  const label: Label = {
    id: response.id,
    name: response.name,
    description: response.description,
  };
  return label;
}

export { toEntity };
