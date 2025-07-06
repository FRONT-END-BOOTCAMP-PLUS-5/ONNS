'use client';
import Arrow from '@/public/assets/icons/arrow.svg';
import React, { useState, useRef, useEffect } from 'react';

const SEASONS = ['봄', '여름', '가을', '겨울'];

const OotdFilter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState('계절');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const Dropdown = () => {
    setIsOpen((prev) => !prev);
  };

  const handleSelect = (season: string) => {
    setSelected(season);
    setIsOpen(false);
  };

  return (
    <div className="w-[245px] h-[121px] inline-flex justify-center items-start gap-[8px] pt-[16px]">
      {/* 최신순 */}
      <div className="w-[52px] h-[26px] flex justify-center items-center gap-[10px] p-[6px] px-[10px] rounded-[16px] border border-[1.2px] border-[#6A71E5] bg-[#6A71E5]">
        <div className="w-[32px] h-[14px] flex items-center justify-center text-white text-[10px] font-semibold">
          최신순
        </div>
      </div>

      {/* 인기순 */}
      <div className="w-[52px] h-[26px] flex justify-center items-center gap-[10px] p-[6px] px-[10px] rounded-[16px] border border-[1.2px] border-[#6A71E5] bg-[#fff]">
        <div className="w-[32px] h-[14px] flex items-center justify-center text-[#6A71E5] text-[10px] font-semibold">
          인기순
        </div>
      </div>

      {/* 계절 드롭다운 */}
      <div
        ref={dropdownRef}
        onClick={Dropdown}
        className="w-[64px] min-h-[26px] px-[10px] py-[0px] flex flex-col items-start justify-center gap-[8px] rounded-[16px] border border-[1.2px] border-[#6A71E5] bg-white cursor-pointer">
        <div className="flex flex-row items-center justify-center gap-[4px] h-[14px]">
          <span className="text-[#6A71E5] text-[12px] font-semibold leading-none">
            {selected}
          </span>
           <Arrow className={`w-[8px] h-[8px] ml-[5px] text-[#6A71E5] transition-transform duration-200 ${!isOpen ? 'rotate-180' : ''}`}/>
        </div>
       

        {isOpen && (
          <div className="flex flex-col items-start gap-[2px] mt-[4px]">
            {SEASONS.map((season) => (
              <button
                key={season}
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelect(season);
                }}
                className={`w-full text-left text-[12px] rounded-[8px] px-2 py-[2px] ${selected === season
                    ? 'bg-[#6A71E5] text-white'
                    : 'text-[#6A71E5] '
                  }`}
              >
                {season}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OotdFilter;
