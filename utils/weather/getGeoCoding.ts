// 사용자 위치의 정확한 한글 지명을 가져오는 함수
// 서울 중구 광희동2가 257-5에서 광희동2가를 반환
export async function getGeoCoding(lat: number, lon: number): Promise<string | null> {
  const url = `/api/home/weather?lat=${lat}&lon=${lon}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error('Geocoding fetch failed!', res.status, await res.text());
    return null;
  }
  const data = await res.json();

  if (data.documents && data.documents.length > 0) {
    return data.documents[0].address?.region_3depth_name ?? null;
  }
  return null;
}
