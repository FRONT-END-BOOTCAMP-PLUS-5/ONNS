function getTempOptionsBySeason(season: string) {
  switch (season) {
    case '봄':
    case '가을':
      return ['전체', '5-9', '10-14', '15-19'];
    case '여름':
      return ['전체', '20-24', '25-29', '30~'];
    case '겨울':
      return ['전체', '0-4', '-5~ -1', '~(-6)'];
    default:
      return ['전체'];
  }
}

export default getTempOptionsBySeason;
