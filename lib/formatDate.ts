export const formatDate = (dateCreated: string | Date): string => {
  try {
    const date = new Date(dateCreated);

    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return String(dateCreated);
    }

    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${month}/${day} ${hours}:${minutes}`;
  } catch (error) {
    console.error('Date formatting error:', error);
    return String(dateCreated);
  }
};
