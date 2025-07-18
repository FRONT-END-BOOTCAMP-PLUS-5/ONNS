'use client';
import React from 'react';
import Send from '@/public/assets/icons/send.svg';
interface InputProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSend?: () => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
}

const Input: React.FC<InputProps> = ({ value, onChange, onSend, inputRef }) => {
  const isEmpty = !value.trim();
  return (
    <div className="max-w-[430px] w-full mx-auto fixed bottom-0 left-1/2 -translate-x-1/2 bg-white z-50 pb-[36px]">
      {/* 상단 구분선 */}
      <div className="h-px bg-gray-100 mb-4 " />
      <div className="flex items-center h-11 ml-4 mr-4">
        <input
          type="text"
          ref={inputRef}
          className="flex-1 h-full bg-[#f1f0f0] rounded-l-xl rounded-r-xl px-4 py-2 text-[15px] text-black placeholder-gray-400 border-none outline-none focus:ring-0"
          placeholder={'댓글을 입력해주세요.'}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          className="h-11 px-3 flex items-center justify-center bg-[white] disabled:opacity-50"
          onClick={() => {
            if (!isEmpty && onSend) onSend();
          }}
          disabled={isEmpty}
        >
          <Send />
        </button>
      </div>
    </div>
  );
};

export default Input;
