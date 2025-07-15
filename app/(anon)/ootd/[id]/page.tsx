'use client';

import PostUserInfo from '@/app/(anon)/ootd/[id]/components/PostUserInfo';
import Image from 'next/image';
// import Heart from '@/public/assets/icons/heart.svg';
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
      {/* 좋아요, 댓글 수 */}
      <div className="flex flex-row ml-[20px] mr-[20px] pt-[12px] pb-[12px] ">
        {/* <Heart className="w-[24px] h-[24px] mr-[4px]" />
        <span className="w-[14px] align-middle font-normal">{3}</span> */}
        <StrokeHeart className="w-[24px] h-[24px] mr-[3px]" />
        <span className="text-[14px] align-middle font-normal mr-[10px]">{3}</span>

        <StrokeComment className="w-[24px] h-[24px] mb-[4px] mr-[3px]" />
        <span className="text-[14px] align-middle font-normal">{0}</span>
      </div>
      {/* 텍스트 내용 */}
      <div className="ml-[20px] mr-[20px] text-[14px] font-normal leading-[21px] whitespace-pre-line">
        {
          '옷 스타일은 어쩌구 저쩌구 입니다. 날씨가 더워서 이렇게 입었어요. 요즘 같은 날씨에는 무조건 반바지 입어야 합니다. \n날씨 너무 더워요. 폭염 싫은데.. 밖에 5분만 서 있어도 땀이 날 거 같아요ㅠㅠ'
        }
      </div>
    </>
  );
}
