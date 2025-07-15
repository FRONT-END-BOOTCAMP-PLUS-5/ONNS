'use client';
import React from 'react';
import useDropdown from '@/hooks/useDropdown';
import SeasonFilter from './SeasonFilter';

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return '봄';
  if (month >= 6 && month <= 8) return '여름';
  if (month >= 9 && month <= 11) return '가을';
  return '겨울';
}

const OotdSeasonDropdown = () => {
  const { isOpen, setIsOpen, selected, setSelected, ref } = useDropdown(getCurrentSeason());

  return (
    <SeasonFilter
      selected={selected}
      setSelected={setSelected}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      ref={ref}
    />
  );
};

export default OotdSeasonDropdown;
