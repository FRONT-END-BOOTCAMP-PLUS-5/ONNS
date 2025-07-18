'use client';

import React from 'react';
import Modal from './Modal';
import { Button } from './Button';

interface UnenrollModalContainerProps {
  onUnenroll: () => void;
}

const UnenrollModalContainer: React.FC<UnenrollModalContainerProps> = ({ onUnenroll }) => {
  return (
    <Modal
      text="모든 게시물과 정보가 삭제됩니다. 정말로 탈퇴하시겠어요?"
      btn={<Button content="탈퇴하기" big={false} onClick={onUnenroll} />}
      onClose={() => console.log('Unenroll modal closed')}
    />
  );
};

export default UnenrollModalContainer;
