// 강수량이 0.1 이상일 경우 우산지수 반환
export function getUmbrellaIndex(rainAmount: number): boolean {
  return rainAmount >= 0.1;
}
// 미세먼지 농도가 80 이상일 경우 미세먼지지수 반환
export function getDustIndex(dustAmount: number): boolean {
  return dustAmount >= 80;
}
