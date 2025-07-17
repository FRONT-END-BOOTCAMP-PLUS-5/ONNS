'use client';

import CloseIcon from '@/public/assets/icons/close.svg';
import React, { useState } from 'react';

interface ModalProps {
  btn: React.ReactNode;
  text: string;
  onClose?: () => void;
  isOpen?: boolean;
  className?: string;
  defaultOpen?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  btn,
  text,
  onClose,
  isOpen,
  className = '',
  defaultOpen = true,
}) => {
  // Internal state management
  const [internalIsOpen, setInternalIsOpen] = useState(defaultOpen);

  // Use external isOpen if provided, otherwise use internal state
  const isModalOpen = isOpen !== undefined ? isOpen : internalIsOpen;

  const handleClose = () => {
    setInternalIsOpen(false);
    onClose?.();
  };

  if (!isModalOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed top-0 left-0 w-full h-full bg-black opacity-50 z-[9999]" />

      {/* Modal */}
      <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-[10000]">
        <div
          className={`w-[335px] pb-[20px] bg-neutral-50 rounded-xl inline-flex flex-col justify-start items-center gap-[16px] ${className}`}
        >
          <div className="self-stretch p-[12px] inline-flex justify-end items-center gap-100px">
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <CloseIcon className="relative" alt="close" width={20} height={20} />
            </button>
          </div>
          <div className="flex flex-col justify-start items-center gap-[35px]">
            <div className="w-[212px] h-[48px] relative">
              <div
                className="text-[var(--black,#202020)] text-center font-[Pretendard] text-base font-medium leading-6 tracking-[-0.32px]"
                dangerouslySetInnerHTML={{ __html: text.replace(/\n/g, '<br />') }}
              />
            </div>
            {btn}
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
