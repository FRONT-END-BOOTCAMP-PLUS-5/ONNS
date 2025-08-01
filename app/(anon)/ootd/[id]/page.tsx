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
import { formatDate } from '@/utils/date/formatDate';
import { useCallback } from 'react';

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
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);

  const fetchPost = useCallback(async () => {
    try {
      setIsLoadingPost(true);
      const res = await api.get(`/posts/${id}`);
      setPost(res.data);
      setLikeCount(res.data.like_count ?? 0);
      setCommentCount(res.data.comment_count ?? 0);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingPost(false);
    }
  }, [id]);

  const fetchComments = useCallback(async () => {
    try {
      setIsLoadingComments(true);
      const res = await api.get(`/posts/${id}/comments`);
      setComments(res.data.comments as CommentWithUser[]);
      setCommentCount(res.data.comments.length);
    } finally {
      setIsLoadingComments(false);
    }
  }, [id]);

  const fetchLikeStatus = useCallback(async () => {
    try {
      const res = await api.get(`/posts/${id}/likes`);
      setIsLiked(res.data.isLiked);
      setLikeCount(res.data.likeCount);
    } catch (error) {
      console.error(error);
    }
  }, [id]);

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
    // Optimistic UI
    setCommentCount((prev) => prev + 1);
    try {
      await api.post(`/posts/${id}/comments`, { text: comment, parent_id: parentId });
      setComment('');
      setParentId(null);
      await fetchComments();
    } catch (error) {
      setCommentCount((prev) => prev - 1);
      alert('댓글 등록에 실패했습니다.');
      console.error(error);
    }
  };

  const handleCommentDelete = async (commentId: number) => {
    setCommentCount((prev) => prev - 1);
    try {
      await api.delete(`/comments/${commentId}`);
      await fetchComments();
    } catch (error) {
      setCommentCount((prev) => prev + 1);
      console.error(error);
    }
  };

  const handleLike = async () => {
    setIsLiked((prev) => !prev);
    setLikeCount((prev) => prev + (isLiked ? -1 : 1));
    try {
      await api.post(`/posts/${id}/likes`);
      fetchLikeStatus();
    } catch (error) {
      setIsLiked((prev) => !prev);
      setLikeCount((prev) => prev + (isLiked ? 1 : -1));
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id, fetchPost]);

  useEffect(() => {
    fetchComments();
  }, [id, fetchComments]);

  useEffect(() => {
    fetchLikeStatus();
  }, [id, fetchLikeStatus]);

  return (
    <>
      {isLoadingPost ? (
        <div className="w-full flex justify-center items-center h-[200px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--b400)]"></div>
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
            <div className="relative w-full h-[429px] bg-neutral-200 object-cover">
              <Image
                src={post.photos && post.photos.length > 0 ? post.photos[0].img_url : ''}
                alt="게시글 이미지"
                className="object-cover"
                fill
                priority
              />
            </div>

            {/* <div className="w-full h-[429px] bg-neutral-200" />  */}
            {/* 좋아요, 댓글 수 영역 */}
            <div className="flex flex-row ml-[20px] mr-[20px] pt-[12px] pb-[12px] ">
              <div onClick={handleLike} className="cursor-pointer">
                {isLiked ? (
                  <Heart className="w-[24px] h-[24px] mr-[3px]" />
                ) : (
                  <StrokeHeart className="w-[24px] h-[24px] mr-[3px]" />
                )}
              </div>
              <span className="text-[14px] align-middle font-normal mr-[10px] text-black">
                {likeCount}
              </span>
              <StrokeComment className="w-[24px] h-[24px] mb-[4px] mr-[3px]" />
              <span className="text-[14px] align-middle font-normal text-black">
                {commentCount}
              </span>
            </div>
            {/* 텍스트 영역 */}
            <div className="ml-[20px] mr-[20px] text-[14px] font-normal leading-[21px] whitespace-pre-line text-black">
              {post.text}
            </div>
            <span className="text-xs text-gray-400 ml-[20px] mr-[20px]">
              {formatDate(post.date_created)}
            </span>
          </>
        )
      )}
      {/* 댓글 영역 */}
      <div className="ml-4 mr-4">
        {isLoadingComments ? (
          <div className="w-full flex justify-center items-center h-[100px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--b400)]"></div>
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
