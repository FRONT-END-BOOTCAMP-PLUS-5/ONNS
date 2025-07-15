'use client';

import PostUserInfo from '@/app/(anon)/ootd/[id]/components/PostUserInfo';
import Image from 'next/image';
import Heart from '@/public/assets/icons/heart.svg';
import StrokeHeart from '@/public/assets/icons/stroke_heart.svg';
import StrokeComment from '@/public/assets/icons/stroke_comment.svg';

//ootd detail
export default function OotdDetail() {
  // 프로필 이미지, 닉네임
  // 게시글 이미지, 텍스트, 좋아요 수, 댓글 수, 내 포스트인지 여부
  // 댓글 작성자 프로필 이미지, 닉네임, 댓글 내용, 내 댓글인지 여부

  return (
    <>
      <PostUserInfo profile_image={''} nickname={'주현주현주현주현주현주현주현'} isMyPost={true} />
      <Image src={''} alt="게시글 이미지" className="w-full h-[429px] bg-neutral-200" />
      <div className="flex ml-[20px] mr-[20px] pt-[12px] pb-[12px]"></div>
      <div className="flex flex-row">
        <Heart className="w-[24px] h-[24px]" />
        <StrokeHeart className="w-[24px] h-[24px]" />
        <StrokeComment className="w-[24px] h-[24px]" />
      </div>
    </>
  );
}
