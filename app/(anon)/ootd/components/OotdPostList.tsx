'use client';
import { useEffect, useState, useCallback } from 'react';
import { BoardWithUser } from '@/(backend)/ootd/application/dtos/BoardDto';
import Image from 'next/image';
import Comment from '@/public/assets/icons/chat.svg';
import Like from '@/public/assets/icons/heart.svg';
import { useRouter } from 'next/navigation';
import InfiniteScroll from 'react-infinite-scroll-component';
import { usePathname } from 'next/navigation';
import Postfloating from './Postfloating';
import TempFlt from './TempFlt/TempFlt';
import SortPost from './SortPost/SortPost';
import OotdSeasonDropdown from './SeasonFlt/OotdSeasonDropdown';
import api from '@/utils/axiosInstance';

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
  const pathname = usePathname();
  const [selectedSeason, setSelectedSeason] = useState(getCurrentSeason());
  const [selectedTemp, setSelectedTemp] = useState('전체');
  const [sort, setSort] = useState('recent');
  const [posts, setPosts] = useState<BoardWithUser[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  function parseTempRange(tempRange: string) {
    if (tempRange === '전체') return {};

    if (tempRange.includes('-') && !tempRange.includes('~')) {
      const [min, max] = tempRange.split('-').map(Number);
      return { min, max };
    }

    if (tempRange.startsWith('~(') && tempRange.endsWith(')')) {
      const max = Number(tempRange.replace('~(', '').replace(')', ''));
      return { max };
    }

    if (tempRange.includes('~')) {
      const [minStr, maxStr] = tempRange.split('~');
      const min = minStr.trim() !== '' ? Number(minStr.trim()) : undefined;
      const max = maxStr.trim() !== '' ? Number(maxStr.trim()) : undefined;
      return { ...(min !== undefined ? { min } : {}), ...(max !== undefined ? { max } : {}) };
    }

    return {};
  }

  const loadPosts = useCallback(
    async (pageNum: number, season?: string) => {
      const params: Record<string, string | number | undefined> = { page: pageNum, limit: LIMIT };
      if (season) params.season = season;
      if (sort) params.sort = sort;
      const tempParams = parseTempRange(selectedTemp);
      if (tempParams.min !== undefined) params.min = tempParams.min;
      if (tempParams.max !== undefined) params.max = tempParams.max;
      const res = await api.get('/posts', { params });
      const newPosts = res.data.data;
      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
      }
      setHasMore(newPosts.length === LIMIT);
    },
    [selectedTemp, sort],
  );

  useEffect(() => {
    if (pathname === '/ootd') {
      setSelectedSeason(getCurrentSeason());
    }
  }, [pathname]);

  useEffect(() => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    loadPosts(1, selectedSeason);
  }, [selectedSeason, selectedTemp, sort, loadPosts]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPosts(nextPage, selectedSeason);
  };

  return (
    <>
      <div className="flex">
        <OotdSeasonDropdown selectedSeason={selectedSeason} setSelectedSeason={setSelectedSeason} />
        <TempFlt
          selectedSeason={selectedSeason}
          selectedTemp={selectedTemp}
          setSelectedTemp={setSelectedTemp}
        />
      </div>
      <div className="flex justify-end">
        <SortPost sort={sort} setSort={setSort} />
      </div>
      <InfiniteScroll
        dataLength={posts.length}
        next={handleLoadMore}
        hasMore={hasMore}
        loader={
          <div className="w-full flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--b400)]"></div>
          </div>
        }
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
      <Postfloating />
    </>
  );
};

export default OotdPostList;
