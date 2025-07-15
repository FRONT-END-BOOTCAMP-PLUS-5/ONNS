'use client';
import OotdSeasonDropdown from './components/SeasonFlt/OotdSeasonDropdown';
import TempFlt from './components/TempFlt/TempFlt';
import SortPost from './components/SortPost/SortPost';

const Ootd = () => {
  return (
    <div className="flex">
      <OotdSeasonDropdown />
      <TempFlt />
      <SortPost />
    </div>
  );
};

export default Ootd;
