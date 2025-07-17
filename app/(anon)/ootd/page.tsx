'use client';
import OotdSeasonDropdown from './components/SeasonFlt/OotdSeasonDropdown';
import TempFlt from './components/TempFlt/TempFlt';
import SortPost from './components/SortPost/SortPost';
import OotdPostList from './components/OotdPostList';

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
      <OotdPostList />
    </div>
  );
};

export default Ootd;
