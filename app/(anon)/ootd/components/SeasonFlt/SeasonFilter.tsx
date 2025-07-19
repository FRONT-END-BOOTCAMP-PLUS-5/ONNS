'use client';
import React from 'react';
import Arrow from '@/public/assets/icons/arrow.svg';

interface DropdownProps<T> {
  selected: T;
  setSelected: (value: T) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  ref: React.RefObject<HTMLDivElement | null>;
  setSelectedSeason: (season: string) => void;
}

function SeasonFilter<T extends string | number>({
  selected,
  setSelected,
  isOpen,
  setIsOpen,
  ref,
  setSelectedSeason,
}: DropdownProps<T>) {
  return (
    <div>
      <div ref={ref} className="relative inline-block pl-[20px] pt-[32px]">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-[59px] h-[26px] px-2.5 py-1.5 bg-white rounded-2xl outline outline-[1.20px] outline-offset-[-1.20px] outline-[#6A71E5] flex flex-col justify- items-center gap-2 overflow-hidden text-xs"
        >
          <span className="inline-flex items-center text-[#6A71E5] text-xs font-semibold">
            {selected}
            <Arrow
              className={`w-[8px] h-[8px] ml-1 text-[#6A71E5] transition-transform duration-200 ${isOpen ? '' : 'rotate-180'}`}
            />
          </span>
        </button>
        {isOpen && (
          <div className="w-[59px] h-[110px] bg-white rounded-2xl outline outline-[1.20px] outline-offset-[-1.20px] outline-[#6A71E5] inline-flex flex-col justify-center items-center overflow-hidden z-10 absolute left-0 mt-[4px] ml-[20px]">
            <div className="w-[59px] h-[110px] flex flex-col rounded-2xl overflow-hidden">
              {/* 봄 */}
              <div
                className="w-full h-1/4 flex items-center justify-center group cursor-pointer hover:bg-[#6A71E5] hover:text-white transition-colors px-2"
                onClick={() => {
                  setSelected('봄' as T);
                  setIsOpen(false);
                  setSelectedSeason('봄');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="text-[#6A71E5] w-11 py-1 min-h-[20px] inline-flex justify-between items-center group-hover:text-white">
                  <div className=" w-[11px] h-[14px] justify-start text-primary-p400 text-xs font-semibold group-hover:text-white">
                    봄
                  </div>
                </div>
              </div>
              {/* 여름 */}
              <div
                className="w-full h-1/4 flex items-center justify-center group cursor-pointer hover:bg-[#6A71E5] hover:text-white transition-colors px-2"
                onClick={() => {
                  setSelected('여름' as T);
                  setIsOpen(false);
                  setSelectedSeason('여름');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="text-[#6A71E5] w-11 py-1 min-h-[20px] inline-flex justify-between items-center group-hover:text-white">
                  <div className="w-[21px] h-[14px] justify-start text-primary-p400 text-xs font-semibold group-hover:text-white">
                    여름
                  </div>
                </div>
              </div>
              {/* 가을 */}
              <div
                className="w-full h-1/4 flex items-center justify-center group cursor-pointer hover:bg-[#6A71E5] hover:text-white transition-colors px-2"
                onClick={() => {
                  setSelected('가을' as T);
                  setIsOpen(false);
                  setSelectedSeason('가을');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="text-[#6A71E5] w-11 py-1 min-h-[20px] inline-flex justify-between items-center group-hover:text-white">
                  <div className="w-[21px] h-[14px] justify-start text-primary-p400 text-xs font-semibold group-hover:text-white">
                    가을
                  </div>
                </div>
              </div>
              {/* 겨울 */}
              <div
                className="w-full h-1/4 flex items-center justify-center group cursor-pointer hover:bg-[#6A71E5] hover:text-white transition-colors px-2"
                onClick={() => {
                  setSelected('겨울' as T);
                  setIsOpen(false);
                  setSelectedSeason('겨울');
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="text-[#6A71E5] w-11 py-1 min-h-[20px] inline-flex justify-between items-center group-hover:text-white">
                  <div className="w-[21px] h-[14px] justify-start text-primary-p400 text-xs font-semibold group-hover:text-white">
                    겨울
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SeasonFilter;
