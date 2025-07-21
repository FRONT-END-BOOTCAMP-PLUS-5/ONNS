'use client';
import React, { useEffect } from 'react';
import Arrow from '@/public/assets/icons/arrow.svg';
import useDropdown from '@/hooks/useDropdown';
import getTempOptionsBySeason from '@/utils/ootd/getTempOptionsBySeason';

interface TempFltProps {
  selectedSeason: string;
  selectedTemp: string;
  setSelectedTemp: (temp: string) => void;
}

const TempFlt = ({ selectedSeason, selectedTemp, setSelectedTemp }: TempFltProps) => {
  const TEMP_RANGES = getTempOptionsBySeason(selectedSeason);
  const { isOpen, setIsOpen, selected, setSelected, ref } = useDropdown(
    selectedTemp || TEMP_RANGES[0],
  );

  useEffect(() => {
    if (!TEMP_RANGES.includes(selected)) {
      setSelected(TEMP_RANGES[0]);
    }
    setSelectedTemp(selected);
  }, [selected, TEMP_RANGES, setSelectedTemp, setSelected]);

  return (
    <div>
      <div ref={ref} className="relative inline-block pt-[32px] pl-[8px]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-[81px] h-[26px] px-2.5 py-1.5 bg-white rounded-2xl outline outline-[1.20px] outline-offset-[-1.20px] outline-[#6A71E5] flex flex-col justify-start items-center gap-2 overflow-hidden text-xs"
        >
          <div className="h-[14px] inline-flex justify-center items-center gap-1">
            <span className="w-[44px] inline-flex items-center text-[#6A71E5] text-xs font-semibold">
              {selected}
            </span>
            <Arrow
              className={`w-[8px] h-[8px] text-[#6A71E5] transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`}
            />
          </div>
        </button>
        {isOpen && (
          <div className="w-[81px] bg-white rounded-2xl outline outline-[1.20px] outline-offset-[-1.20px] outline-[#6A71E5] flex flex-col z-10 absolute left-[8px] mt-[4px]">
            <div className="flex flex-col rounded-2xl overflow-hidden">
              {TEMP_RANGES.map((range) => (
                <div
                  key={range}
                  className="w-[81px] h-[30px] flex items-center justify-start cursor-pointer hover:bg-[#6A71E5] transition-colors group"
                  onClick={() => {
                    setSelected(range);
                    setIsOpen(false);
                  }}
                >
                  <span className="w-[43px] h-[14px] text-[#6A71E5] group-hover:text-white text-xs font-semibold pl-[8px]">
                    {range}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TempFlt;
