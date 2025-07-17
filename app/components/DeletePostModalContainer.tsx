'use client';

import React from 'react';
import Modal from './Modal';
import { Button } from './Button';

interface DeletePostModalContainerProps {
  onDelete: () => void;
}

const DeletePostModalContainer: React.FC<DeletePostModalContainerProps> = ({ onDelete }) => {
  return (
    <Modal
      text="삭제 이후 되돌릴 수 없습니다.<br />삭제하시겠습니까?"
      btn={<Button content="삭제하기" big={false} onClick={onDelete} />}
      onClose={() => console.log('Delete modal closed')}
    />
  );
};

export default DeletePostModalContainer;
