'use client';

import React, { useState, useRef, useEffect } from 'react';
import PostUserInfo from '@/app/(anon)/ootd/[id]/components/PostUserInfo';
import Image from 'next/image';
import Heart from '@/public/assets/icons/heart.svg';
import StrokeHeart from '@/public/assets/icons/stroke_heart.svg';
import StrokeComment from '@/public/assets/icons/stroke_comment.svg';
import CommentBox from '@/app/(anon)/ootd/[id]/components/CommentBox';
import Input from './components/Input';
import { useParams, useRouter } from 'next/navigation';
import api from '@/utils/axiosInstance';
import type { CommentWithUser } from '@/(backend)/comments/application/dtos/CommentDto';
import type { BoardWithUser } from '@/(backend)/ootd/application/dtos/BoardDto';

//ootd detail
export default function OotdDetail() {
  const { id } = useParams();
  const [post, setPost] = useState<BoardWithUser>();
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<CommentWithUser[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const [parentId, setParentId] = useState<number | null>(null);
  const router = useRouter();
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  // const [isLikeLoading, setIsLikedLoading] = useState(false);

  const fetchPost = async () => {
    try {
      setIsLoadingPost(true);
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingPost(false);
    }
  };

  const fetchComments = async () => {
    try {
      setIsLoadingComments(true);
      const res = await api.get(`/posts/${id}/comments`);
      setComments(res.data.comments as CommentWithUser[]);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const fetchLikeStatus = async () => {
    try {
      const res = await api.get(`/posts/${id}/likes`);
      setIsLiked(res.data.isLiked);
    } catch (error) {
      console.error(error);
    }
  };

  const handlePostDelete = async () => {
    try {
      await api.delete(`/posts/${id}`);
      router.back();
    } catch (error) {
      console.error(error);
    }
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
      await fetchComments();
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

  const handleLike = async () => {
    try {
      await api.post(`/posts/${id}/likes`);
      await fetchLikeStatus();
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

  useEffect(() => {
    fetchLikeStatus();
  }, [id]);

  return (
    <>
      {isLoadingPost ? (
        <div className="w-full flex justify-center items-center h-[200px] text-gray-400 text-lg">
          게시글 로딩 중...
        </div>
      ) : (
        post && (
          <>
            <PostUserInfo
              id={post.id}
              profile_image={post.user?.profile_img || ''}
              nickname={post.user?.name || ''}
              isMyPost={post.isMyPost}
              handlePostDelete={handlePostDelete}
            />
            <Image
              src={post.photos && post.photos.length > 0 ? post.photos[0].img_url : ''}
              alt="게시글 이미지"
              className="w-full h-[429px] bg-neutral-200"
              width={600}
              height={429}
            />
            {/* 좋아요, 댓글 수 영역 */}
            <div className="flex flex-row ml-[20px] mr-[20px] pt-[12px] pb-[12px] ">
              <div onClick={handleLike}>
                {isLiked ? (
                  <Heart className="w-[24px] h-[24px] mr-[3px]" />
                ) : (
                  <StrokeHeart className="w-[24px] h-[24px] mr-[3px]" />
                )}
              </div>
              <span className="text-[14px] align-middle font-normal mr-[10px]">
                {post.like_count ?? 0}
              </span>
              <StrokeComment className="w-[24px] h-[24px] mb-[4px] mr-[3px]" />
              <span className="text-[14px] align-middle font-normal">
                {post.comment_count ?? 0}
              </span>
            </div>
            {/* 텍스트 영역 */}
            <div className="ml-[20px] mr-[20px] text-[14px] font-normal leading-[21px] whitespace-pre-line">
              {post.text}
            </div>
          </>
        )
      )}
      {/* 댓글 영역 */}
      <div className="ml-4 mr-4">
        {isLoadingComments ? (
          <div className="w-full flex justify-center items-center h-[100px] text-gray-400 text-base">
            댓글 로딩 중...
          </div>
        ) : (
          comments.map((comment) => (
            <CommentBox
              key={comment.id}
              {...comment}
              onReply={handleReply}
              onDelete={handleCommentDelete}
            />
          ))
        )}
      </div>
      <Input value={comment} onChange={handleChange} inputRef={inputRef} onSend={handleSend} />
    </>
  );
}
