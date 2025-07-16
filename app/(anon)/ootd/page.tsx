'use client';
import OotdSeasonDropdown from './components/SeasonFlt/OotdSeasonDropdown';
import TempFlt from './components/TempFlt/TempFlt';
import SortPost from './components/SortPost/SortPost';

const Ootd = () => {
  return (
    <div>
      <div className="flex">
        <OotdSeasonDropdown />
        <TempFlt />
      </div>
      <div className="flex justify-end">
        <SortPost />
      </div>
    </div>
  );
};

export default Ootd;
