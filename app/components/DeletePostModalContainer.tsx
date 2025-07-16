'use client';

import React from 'react';
import Modal from './Modal';
import { Button } from './Button';

interface DeletePostModalContainerProps {
  onDelete: () => void;
  onClose: () => void;
}

const DeletePostModalContainer: React.FC<DeletePostModalContainerProps> = ({
  onDelete,
  onClose,
}) => {
  return (
    <Modal
      text="삭제 이후 되돌릴 수 없습니다.<br />삭제하시겠습니까?"
      btn={<Button content="삭제하기" big={false} onClick={onDelete} />}
      onClose={onClose}
    />
  );
};

export default DeletePostModalContainer;
