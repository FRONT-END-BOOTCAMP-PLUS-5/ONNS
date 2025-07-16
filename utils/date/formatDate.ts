export const formatDate = (originalDate: string) => {
  const date = new Date(originalDate);

  // 연도, 월, 일 추출
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  // 시간, 분 추출
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  // 요일 추출 (0: 일요일, 6: 토요일)
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
  const dayOfWeek = daysOfWeek[date.getDay()];

  // 최종 형식: 연도.월.일 (요일) 시간:분
  return `${year}.${month}.${day} (${dayOfWeek}) ${hours}:${minutes}`;
};
