'use client';

import React, { useState, useRef, useEffect } from 'react';
import PostUserInfo from '@/app/(anon)/ootd/[id]/components/PostUserInfo';
import Image from 'next/image';
// import Heart from '@/public/assets/icons/heart.svg';
import StrokeHeart from '@/public/assets/icons/stroke_heart.svg';
import StrokeComment from '@/public/assets/icons/stroke_comment.svg';
import CommentBox from '@/app/(anon)/ootd/[id]/components/CommentBox';
import Input from './components/Input';
import { useParams } from 'next/navigation';
import api from '@/utils/axiosInstance';
import type { CommentWithUser } from '@/(backend)/comments/application/dtos/CommentDto';

//ootd detail
export default function OotdDetail() {
  const { id } = useParams();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [parentId, setParentId] = useState<number | null>(null);

  const fetchPost = async () => {
    try {
      const res = await api.get(`/posts/${id}`);
      // setPost(res.data); // 게시글 상태가 필요하다면 이렇게 저장
      console.log(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchComments = async () => {
    const res = await api.get(`/posts/${id}/comments`);
    setComments(res.data.comments as CommentWithUser[]);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setComment(e.target.value);
  };

  const handleReply = (commentId: number) => {
    setParentId(commentId);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSend = async () => {
    if (!comment.trim()) return;
    try {
      await api.post(`/posts/${id}/comments`, { text: comment, parent_id: parentId });
      setComment('');
      setParentId(null);
      // 댓글 새로고침
      const res = await api.get(`/posts/${id}/comments`);
      setComments(res.data.comments as CommentWithUser[]);
    } catch (error) {
      alert('댓글 등록에 실패했습니다.');
      console.error(error);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    try {
      await api.delete(`/comments/${commentId}`);
      await fetchComments();
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  useEffect(() => {
    fetchComments();
  }, [id]);

  return (
    <>
      <PostUserInfo profile_image={''} nickname={'주현주현주현주현주현주현주현'} isMyPost={true} />
      <Image src={''} alt="게시글 이미지" className="w-full h-[429px] bg-neutral-200" />
      {/* 좋아요, 댓글 수 영역 */}
      <div className="flex flex-row ml-[20px] mr-[20px] pt-[12px] pb-[12px] ">
        {/* 좋아요 체크하면 채워진 걸로 변경해야 함. 애초에 좋아요 체크했는지도 확인해야 함. */}
        {/* <Heart className="w-[24px] h-[24px] mr-[4px]" />
        <span className="w-[14px] align-middle font-normal">{3}</span> */}
        <StrokeHeart className="w-[24px] h-[24px] mr-[3px]" />
        <span className="text-[14px] align-middle font-normal mr-[10px]">{3}</span>
        <StrokeComment className="w-[24px] h-[24px] mb-[4px] mr-[3px]" />
        <span className="text-[14px] align-middle font-normal">{0}</span>
      </div>
      {/* 텍스트 영역 */}
      <div className="ml-[20px] mr-[20px] text-[14px] font-normal leading-[21px] whitespace-pre-line">
        {
          '옷 스타일은 어쩌구 저쩌구 입니다. 날씨가 더워서 이렇게 입었어요. 요즘 같은 날씨에는 무조건 반바지 입어야 합니다. \n날씨 너무 더워요. 폭염 싫은데.. 밖에 5분만 서 있어도 땀이 날 거 같아요ㅠㅠ'
        }
      </div>
      {/* 댓글 영역 */}
      <div className="ml-4 mr-4">
        {comments.map((comment) => (
          <CommentBox
            key={comment.id}
            {...comment}
            onReply={() => handleReply(comment.id)}
            onDelete={() => handleCommentDelete(comment.id)}
          />
        ))}
      </div>
      <Input value={comment} onChange={handleChange} inputRef={inputRef} onSend={handleSend} />
    </>
  );
}
