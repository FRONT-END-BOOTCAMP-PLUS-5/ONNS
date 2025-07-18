'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import api from '@/utils/axiosInstance';
import { PostWithPhotos } from '@/(backend)/my/domain/repositories/IUserRepository';

// Photo 타입 정의
interface Photo {
  id: string;
  url: string;
  alt: string;
  postId: string;
  img_url: string;
}

// PhotoGrid 컴포넌트 타입 정의
interface PhotoGridProps {
  type: 'liked' | 'my';
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ type }) => {
  const router = useRouter();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Fetch photos based on type
  const fetchPhotos = useCallback(
    async (pageNum: number) => {
      setLoading(true);

      try {
        let response;

        if (type === 'my') {
          // Fetch user's own posts
          response = await api.get(`/users/me/posts?page=${pageNum}&limit=10`);
        } else {
          // Fetch user's liked posts
          response = await api.get(`/users/me/likes?page=${pageNum}&limit=10`);
        }

        if (response.data.ok) {
          const newPhotos: Photo[] = [];

          // Extract photos from posts
          response.data.posts?.forEach((post: PostWithPhotos) => {
            if (post.photos && post.photos.length > 0) {
              post.photos.forEach((photo: { id: number; img_url: string }) => {
                newPhotos.push({
                  id: `${post.id}-${photo.id}`,
                  url: photo.img_url,
                  alt: `Photo from post ${post.id}`,
                  postId: post.id.toString(),
                  img_url: photo.img_url,
                });
              });
            }
          });

          if (pageNum === 1) {
            setPhotos(newPhotos);
          } else {
            setPhotos((prev) => [...prev, ...newPhotos]);
          }

          // Check if we have more data based on API response
          setHasMore(response.data.hasMore || false);
        } else {
          console.error('Error fetching photos:', response.data.error);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    },
    [type],
  );

  // Load initial photos
  useEffect(() => {
    setPhotos([]);
    setPage(1);
    setHasMore(true);
    fetchPhotos(1);
  }, [type, fetchPhotos]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (loading || !hasMore) return;

    const scrollTop = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;

    // Load more when user is near bottom
    if (scrollTop + windowHeight >= documentHeight - 100) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPhotos(nextPage);
    }
  }, [loading, hasMore, page, fetchPhotos]);

  // Add scroll listener
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Handle photo click
  const handlePhotoClick = (postId: string) => {
    router.push(`/ootd/${postId}`);
  };

  return (
    <div className="px-4 py-6 bg-white">
      {/* Photo Grid */}
      <div className="grid grid-cols-2 gap-2">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="aspect-square relative overflow-hidden rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handlePhotoClick(photo.postId)}
          >
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(max-width: 430px) 50vw, 33vw"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* Loading indicator */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--b400)]"></div>
        </div>
      )}

      {/* End of content */}
      {!hasMore && photos.length > 0 && (
        <div className="text-center py-4 text-gray-500">No more photos to load</div>
      )}

      {/* Empty state */}
      {!loading && photos.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          {type === 'my' ? 'No photos yet' : 'No liked photos yet'}
        </div>
      )}
    </div>
  );
};

export default PhotoGrid;
