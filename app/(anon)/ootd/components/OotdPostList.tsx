'use client';
import { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { BoardWithUser } from '@/(backend)/ootd/application/dtos/BoardDto';
import Image from 'next/image';
import Comment from '@/public/assets/icons/chat.svg';
import Like from '@/public/assets/icons/heart.svg';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';

const OotdPostList = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<BoardWithUser[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPosts = async (pageNum: number) => {
    const res = await axiosInstance.get('http://localhost:3000/api/posts', {
      params: { page: pageNum, limit: 6 },
    });
    const newPosts = res.data.data;
    if (pageNum === 1) {
      setPosts(newPosts);
    } else {
      setPosts((prev) => [...prev, ...newPosts]);
    }
    setHasMore(newPosts.length === 6);
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const fetchNext = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={fetchNext}
      hasMore={hasMore}
      loader={<div>로딩중...</div>}
      endMessage={
        <div className="w-full flex justify-center py-4">
          <span className="text-[#6A71E5] text-sm">모든 게시글을 불러왔습니다.</span>
        </div>
      }
    >
      <div className="flex justify-center w-full px-4">
        <div className="w-full max-w-[390px] grid grid-cols-2 gap-y-[16px] gap-x-[8px] pb-[30px]">
          {posts.map((post) => (
            <div
              key={post.id}
              className="w-full h-[258px] flex flex-col items-start gap-y-[10px] cursor-pointer"
              onClick={() => router.push(`/ootd/${post.id}`)}
            >
              <div className="w-full aspect-square relative overflow-hidden">
                {post.photos && post.photos.length > 0 && (
                  <Image
                    src={post.photos[0].img_url.trim()}
                    alt="게시글 썸네일"
                    fill
                    sizes="(max-width: 390px)"
                    className="object-cover rounded"
                    unoptimized
                  />
                )}
              </div>
              <div className="w-full h-[54px] inline-flex flex-col justify-start items-start gap-2 mt-2">
                <div className="w-full h-[25px] inline-flex justify-start items-center gap-1">
                  {post.user?.profile_img ? (
                    <Image
                      src={post.user.profile_img}
                      alt=""
                      width={25}
                      height={25}
                      className="rounded-full object-cover bg-secondary-e200"
                      unoptimized
                    />
                  ) : (
                    <div className="w-[25px] h-[25px] bg-secondary-e200 rounded-full flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="inline-flex justify-between items-center w-full">
                      <div className="text-black text-sm font-medium truncate max-w-[80px]">
                        {post.user?.name ?? '익명'}
                      </div>
                      <div className="flex justify-start items-center gap-2 ml-2">
                        {/* 댓글 수 */}
                        <div className="flex items-center gap-[4px] min-w-0">
                          <Comment className="w-[16px] h-[16px] flex-shrink-0 text-[#6A71E5]" />
                          <div className="text-black text-sm font-medium leading-none">
                            {post.comment_count ?? 0}
                          </div>
                        </div>
                        {/* 좋아요 수 */}
                        <div className="flex items-center gap-1 min-w-0">
                          <Like className="w-[16px] h-[16px] flex-shrink-0" />
                          <div className="text-black text-sm font-medium leading-none">
                            {post.like_count ?? 0}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full text-gray-900 text-sm font-normal leading-tight truncate">
                  {post.text}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </InfiniteScroll>
  );
};

export default OotdPostList;
