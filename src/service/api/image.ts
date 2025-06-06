const getImageUrl = (imageId: string) => {
  return `${import.meta.env.VITE_API_GATEWAY}/api/v1/images/${imageId}/show`;
};

export { getImageUrl };
