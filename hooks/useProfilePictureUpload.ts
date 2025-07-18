import { useState, useRef } from 'react';
import api from '@/utils/axiosInstance';
import { User } from '@/(backend)/my/domain/entities/User';
import { AxiosError } from 'axios';

interface UseProfilePictureUploadReturn {
  isUploading: boolean;
  error: string | null;
  uploadProfilePicture: (file: File) => Promise<{ success: boolean; user?: User }>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  openFileDialog: () => void;
}

export const useProfilePictureUpload = (): UseProfilePictureUploadReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadProfilePicture = async (file: File): Promise<{ success: boolean; user?: User }> => {
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/users/me/profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.ok) {
        return { success: true, user: response.data.user };
      } else {
        setError(response.data.error || 'Upload failed');
        console.log('response', response.data);
        return { success: false };
      }
    } catch (err: unknown) {
      const errorMessage =
        (err as AxiosError<{ error?: string }>).response?.data?.error || 'Upload failed';
      setError(errorMessage);
      return { success: false };
    } finally {
      setIsUploading(false);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return {
    isUploading,
    error,
    uploadProfilePicture,
    fileInputRef,
    openFileDialog,
  };
};
