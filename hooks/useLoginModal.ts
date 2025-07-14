'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useRouter, useSearchParams } from 'next/navigation';

export const useLoginModal = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.get('login')) {
      setShowLoginModal(false);
    }
  }, [searchParams]);

  const handleOpenModal = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);

    const params = new URLSearchParams(searchParams);
    params.delete('login');
    const newUrl = params.toString() ? `/?${params.toString()}` : '/';
    router.push(newUrl);
  };

  return {
    isAuthenticated,
    loading,
    showLoginModal,
    handleOpenModal,
    handleCloseModal,
  };
};
