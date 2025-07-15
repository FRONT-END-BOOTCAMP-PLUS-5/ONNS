'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';

// Photo 타입 정의
interface Photo {
  id: string;
  url: string;
  alt: string;
}

// PhotoGrid 컴포넌트 타입 정의
interface PhotoGridProps {
  type: 'liked' | 'my';
}

const PhotoGrid: React.FC<PhotoGridProps> = ({ type }) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  // Mock data - replace with actual API call
  const fetchPhotos = useCallback(async (pageNum: number) => {
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Mock data - replace with actual API call
    const mockPhotos: Photo[] = Array.from({ length: 10 }, (_, i) => ({
      id: `${pageNum}-${i}`,
      url: `https://picsum.photos/200/200?random=${pageNum}-${i}`,
      alt: `Photo ${pageNum}-${i}`,
    }));

    if (pageNum === 1) {
      setPhotos(mockPhotos);
    } else {
      setPhotos((prev) => [...prev, ...mockPhotos]);
    }

    // Stop loading more after 5 pages (50 photos)
    if (pageNum >= 5) {
      setHasMore(false);
    }

    setLoading(false);
  }, []);

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

  return (
    <div className="px-4 py-6 bg-white">
      {/* Photo Grid */}
      <div className="grid grid-cols-2 gap-2">
        {photos.map((photo) => (
          <div key={photo.id} className="aspect-square relative overflow-hidden rounded-lg">
            <Image
              src={photo.url}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 33vw"
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
    </div>
  );
};

export default PhotoGrid;
