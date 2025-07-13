'use client';

import { useState } from 'react';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';

export const useLoginModal = () => {
  const { isAuthenticated, loading } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const router = useRouter();

  const handleOpenModal = () => {
    setShowLoginModal(true);
  };

  const handleCloseModal = () => {
    setShowLoginModal(false);
    router.replace('/');
  };

  return {
    isAuthenticated,
    loading,
    showLoginModal,
    handleOpenModal,
    handleCloseModal,
  };
};
