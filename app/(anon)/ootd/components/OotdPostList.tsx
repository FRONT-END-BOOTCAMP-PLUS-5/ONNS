'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { BoardWithUser } from '@/(backend)/ootd/application/dtos/BoardDto';
import Image from 'next/image';
import ChatIcon from '@/public/icons/ChatIcon.svg';
import LikeIcon from '@/public/icons/LikeIcon.svg';

const OotdPostList = () => {
  const [posts, setPosts] = useState<BoardWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get('http://localhost:3000/api/posts')
      .then((res) => {
        console.log('API 응답:', res.data);
        setPosts(res.data.data); // 반드시 .data.data!
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>로딩중...</div>;
  if (!posts.length) return <div>게시글이 없습니다.</div>;

  return (
    <div className="w-[390px] h-[258px] grid grid-cols-2 gap-y-[16px] mx-[20px]">
      {posts.slice(0, 6).map((post) => (
        <div key={post.id} className="w-[190px] h-[258px] flex flex-col items-start gap-y-[10px]">
          <div className="w-[190px] h-[190px] relative overflow-hidden">
            {post.photos && post.photos.length > 0 && (
              <Image
                src={post.photos[0].img_url.trim()}
                alt="게시글 썸네일"
                fill
                sizes="190px"
                className="object-cover rounded"
                unoptimized
              />
            )}
          </div>
          <div className="  w-[190px] h-[54px] inline-flex flex-col justify-start items-start gap-2 mt-2">
            <div className=" w-[190px] h-[25px] inline-flex justify-start items-center gap-1">
              {post.user?.profile_img ? (
                <Image
                  src={post.user.profile_img}
                  alt="프로필"
                  width={25}
                  height={25}
                  className="rounded-full object-cover bg-secondary-e200"
                  unoptimized
                />
              ) : (
                <div className="w-[25px] h-[25px] bg-secondary-e200 rounded-full" />
              )}
              <div className="w-[160px] h-[17px] inline-flex flex-col justify-start items-start gap-2.5">
                <div className=" inline-flex justify-between items-center">
                  <div className="w-[80px] h-[17px] justify-start text-black text-sm font-medium truncate">
                    {post.user?.name ?? '익명'}
                  </div>
                  <div className="w-[64px] h-[17px] flex justify-start items-center gap-2">
                    {/* 댓글 수 */}
                    <div className="w-[29px] h-[17px] flex items-center gap-[4px]">
                      <ChatIcon />
                      <div className="w-[9px] h-[13px] flex items-center text-black text-sm font-medium leading-none">
                        {post.comment_count ?? 0}
                      </div>
                    </div>
                    {/* 좋아요 수 */}
                    <div className="flex items-center gap-1 h-[13px]">
                      <LikeIcon />
                      <div className="w-[9px] h-[13px] flex items-center text-black text-sm font-medium leading-none">
                        {post.like_count ?? 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className=" w-[190px] h-[21px] justify-start text-gray-900 text-sm font-normal leading-tight truncate">
              {post.text}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OotdPostList;
