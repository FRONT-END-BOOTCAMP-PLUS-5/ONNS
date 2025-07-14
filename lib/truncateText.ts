export const truncateText = (text: string, maxLength: number = 5): string => {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + '...';
};
