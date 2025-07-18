'use client';
import Image from 'next/image';
import More from '@/public/assets/icons/more.svg';
import { useEffect, useRef, useState } from 'react';
import { DeletePostModalContainer } from '@/app/components';
interface PostUserInfoProps {
  id: number;
  profile_image: string | null;
  nickname: string | null;
  isMyPost: boolean | null;
  handlePostDelete?: (id: number) => void;
}
const PostUserInfo = ({
  id,
  profile_image,
  nickname,
  isMyPost,
  handlePostDelete,
}: PostUserInfoProps) => {
  const [open, setOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [open]);
  return (
    <>
      <div className="flex justify-between items-center px-4 pt-[8px] pb-[8px]">
        <div className="flex w-[200px] items-center ">
          <div className="relative w-[38px] h-[38px] mr-[6px]">
            <Image
              src={profile_image || ''}
              alt="글쓴이 프로필"
              fill
              sizes="38px"
              className="rounded-full bg-neutral-200"
            />
          </div>
          <div className="w-[120px] align-middle text-[14px] font-medium text-sm whitespace-nowrap overflow-hidden text-ellipsis text-black">
            {nickname}
          </div>
        </div>
        {isMyPost && (
          <div className="relative" ref={popoverRef}>
            <button onClick={() => setOpen((v) => !v)}>
              <More />
            </button>
            {open && (
              <button
                className="w-[58px] h-[30px] absolute top-5 right-0 border-[#F0EEEE] bg-[#F0EEEE] rounded-[10px] text-[12px] font-light"
                onClick={() => {
                  setOpen(false);
                  setShowModal(true);
                }}
              >
                삭제하기
              </button>
            )}
          </div>
        )}
      </div>
      {showModal && (
        <DeletePostModalContainer
          onDelete={() => {
            // 게시글 삭제 API 호출
            handlePostDelete?.(id);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default PostUserInfo;
