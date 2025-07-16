'use client';

import MiniMore from '@/public/assets/icons/mini_more.svg';
import type { CommentWithUser } from '@/(backend)/comments/application/dtos/CommentDto';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import DeletePostModalContainer from '@/app/components/DeletePostModalContainer';
interface CommentBoxExtraProps {
  isChild?: boolean;
  onReply?: (id: number) => void;
  onDelete?: (id: number) => void;
}
type CommentBoxProps = CommentWithUser & CommentBoxExtraProps;

const CommentBox = ({
  id,
  user,
  isMyComment,
  date_created,
  text,
  replies,
  isChild = false,
  onReply,
  onDelete,
}: CommentBoxProps) => {
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // 팝오버 외부 클릭 시 닫기
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
      {/* 구분선 */}
      {!isChild && <div className="border-b border-gray-200 mt-[14px]" />}
      {/* 댓글 본문 */}
      <div className="flex items-start gap-2 py-2">
        {/* 프로필 이미지 */}
        <div className="relative w-7 h-7">
          <Image
            src={user.profile_img || ''}
            alt="댓글자 이미지"
            sizes="28px"
            fill
            className="rounded-full bg-blue-200 flex-shrink-0 overflow-hidden"
          />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[14px] text-gray-800">{user.name}</span>
              <span className="text-xs text-gray-400">{date_created}</span>
            </div>
            {isMyComment && (
              <div className="relative" ref={popoverRef}>
                <button onClick={() => setOpen((v) => !v)}>
                  <MiniMore />
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
          <div className="text-[14px] text-gray-800 mt-0.5">{text}</div>
          <div className="flex items-center gap-2 mt-1">
            {!isChild && (
              <button
                className="text-xs text-gray-400 hover:underline"
                onClick={() => onReply?.(id)}
              >
                답글 달기
              </button>
            )}
          </div>
          {/* 대댓글(자식 댓글) */}
          {replies && replies.length > 0 && (
            <>
              {replies.map((reply, idx) => (
                <CommentBox key={idx} {...reply} isChild={true} />
              ))}
            </>
          )}
        </div>
      </div>
      {showModal && (
        <DeletePostModalContainer
          onDelete={() => {
            console.log('댓글 삭제 시도', id);
            // 댓글 삭제 API 호출
            onDelete?.(id);
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default CommentBox;
