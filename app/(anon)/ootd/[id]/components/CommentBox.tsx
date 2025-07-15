'use client';

import MiniMore from '@/public/assets/icons/mini_more.svg';
interface CommentProps {
  profile_image: string;
  nickname: string;
  isMyComment: boolean;
  isChild?: boolean;
  createdAt: string;
  content: string;
  onReply?: () => void;
  onDelete?: () => void;
  replies?: CommentProps[];
}

const CommentBox = ({
  profile_image,
  nickname,
  isMyComment,
  isChild = false,
  createdAt,
  content,
  onReply,
  // onDelete,
  replies,
}: CommentProps) => {
  return (
    <div>
      {/* 구분선 */}
      {!isChild && <div className="border-b border-gray-200 mt-[14px]" />}
      {/* 댓글 본문 */}
      <div className="flex items-start gap-2 py-2">
        {/* 프로필 이미지 */}
        <div className="w-7 h-7 rounded-full bg-blue-200 flex-shrink-0 overflow-hidden">
          {profile_image}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[14px] text-gray-800">{nickname}</span>
              <span className="text-xs text-gray-400">{createdAt}</span>
            </div>
            {isMyComment && <MiniMore />}
          </div>
          <div className="text-[14px] text-gray-800 mt-0.5">{content}</div>
          <div className="flex items-center gap-2 mt-1">
            {!isChild && (
              <button className="text-xs text-gray-400 hover:underline" onClick={onReply}>
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
    </div>
  );
};

export default CommentBox;
