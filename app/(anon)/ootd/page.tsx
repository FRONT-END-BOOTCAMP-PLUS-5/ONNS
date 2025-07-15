'use client';
import OotdSeasonDropdown from './components/SeasonFilter/OotdSeasonDropdown';
import TempFlt from './components/TempFlt/TempFlt';

const Ootd = () => {
  return (
    <div className="flex">
      <OotdSeasonDropdown />
      <TempFlt />
    </div>
  );
};

export default Ootd;
