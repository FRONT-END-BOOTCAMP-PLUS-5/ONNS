'use client';

import React, { useState } from 'react';

const SEASONS = ['봄', '여름', '가을', '겨울'];

const Season = () => {
  const [selected, setSelected] = useState(SEASONS[0]);

  return (
    <select
      value={selected}
      onChange={(e) => setSelected(e.target.value)}
      className="border rounded px-2 py-1"
    >
      {SEASONS.map((season) => (
        <option key={season} value={season}>
          {season}
        </option>
      ))}
    </select>
  );
};

export default Season;
