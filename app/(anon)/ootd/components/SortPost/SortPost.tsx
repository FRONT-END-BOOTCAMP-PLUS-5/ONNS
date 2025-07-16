'use client';
import React from 'react';
import Arrow from '@/public/assets/icons/arrow.svg';
import useDropdown from '@/hooks/useDropdown';

const SORT_OPTIONS = ['최신순', '인기순'];

const SortPost = () => {
  const { isOpen, setIsOpen, selected, setSelected, ref } = useDropdown(SORT_OPTIONS[0]);

  return (
    <div ref={ref} className=" relative inline-block mr-[20px]">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-[59px] h-[27px] bg-white rounded-tl-[3px] rounded-tr-[3px] border border-zinc-300 flex items-center justify-between px-2"
      >
        <span className="w-[32px] h-[14px] text-neutral-400 text-xs font-medium">{selected}</span>
        <span className={`transition-transform duration-200 ${isOpen ? 'rotate-0' : 'rotate-180'}`}>
          <Arrow className="w-[8px] h-[8px] text-[#949494]" />
        </span>
      </button>
      {isOpen && (
        <div className="w-[59px] h-[26px] absolute left-0 bg-white border border-zinc-300 rounded-bl-[3px] rounded-br-[3px] shadow z-10">
          {SORT_OPTIONS.filter((option) => option !== selected).map((option) => (
            <button
              key={option}
              type="button"
              className="w-[59px] h-[26px] flex items-center px-2 text-neutral-400 text-xs font-medium hover:bg-zinc-100"
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
            >
              <span className="w-[32px] h-[14px] text-neutral-400 text-xs font-medium">
                {option}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortPost;
