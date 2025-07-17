'use client';
import { useEffect, useState, useCallback } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import { BoardWithUser } from '@/(backend)/ootd/application/dtos/BoardDto';
import Image from 'next/image';
import Comment from '@/public/assets/icons/chat.svg';
import Like from '@/public/assets/icons/heart.svg';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useSeasonStore } from '@/stores/seasonStore';
import { usePathname } from 'next/navigation';
import { useTempFilterStore } from '@/stores/tempFilterStore';

function getCurrentSeason() {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return '봄';
  if (month >= 6 && month <= 8) return '여름';
  if (month >= 9 && month <= 11) return '가을';
  return '겨울';
}

const LIMIT = 6;

const OotdPostList = () => {
  const router = useRouter();
  const selectedSeason = useSeasonStore((state) => state.selectedSeason);
  const pathname = usePathname();
  const setSelectedSeason = useSeasonStore((state) => state.setSelectedSeason);
  const [posts, setPosts] = useState<BoardWithUser[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const selectedTemp = useTempFilterStore((state) => state.selectedTemp);

  // 온도 구간 파싱 함수 (TempFlt와 동일하게 유지)
  function parseTempRange(tempRange: string) {
    if (tempRange === '전체') return {};
    if (tempRange.includes('-')) {
      const [min, max] = tempRange.split('-').map(Number);
      return { min, max };
    }
    if (tempRange.endsWith('~')) {
      const min = Number(tempRange.replace('~', ''));
      return { min };
    }
    if (tempRange.startsWith('~')) {
      const max = Number(tempRange.replace('~', ''));
      return { max };
    }
    return {};
  }

  const loadPosts = useCallback(
    async (pageNum: number, season?: string) => {
      const params: Record<string, string | number | undefined> = { page: pageNum, limit: LIMIT };
      if (season) params.season = season;
      const tempParams = parseTempRange(selectedTemp);
      if (tempParams.min !== undefined) params.min = tempParams.min;
      if (tempParams.max !== undefined) params.max = tempParams.max;
      const res = await axiosInstance.get('http://localhost:3000/api/posts', { params });
      const newPosts = res.data.data;
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
      setHasMore(newPosts.length === LIMIT);
    },
    [selectedTemp],
  );

  useEffect(() => {
    if (pathname === '/ootd') {
      setSelectedSeason(getCurrentSeason());
    }
  }, [pathname, setSelectedSeason]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    loadPosts(1, selectedSeason);
  }, [selectedSeason, selectedTemp, loadPosts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage, selectedSeason);
  };

  return (
    <InfiniteScroll
      dataLength={posts.length}
      next={handleLoadMore}
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
                      className="w-[25px] h-[25px] rounded-full object-cover bg-secondary-e200"
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
                        <div className="flex items-center gap-[4px] min-w-0">
                          <Comment className="w-[16px] h-[16px] flex-shrink-0 text-[#6A71E5]" />
                          <div className="text-black text-sm font-medium leading-none">
                            {post.comment_count ?? 0}
                          </div>
                        </div>
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
