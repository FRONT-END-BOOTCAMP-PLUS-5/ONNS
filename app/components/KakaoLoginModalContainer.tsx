'use client';

import React from 'react';
import KakaoTalkLoginBtn from './KakaoTalkLoginBtn';
import Modal from './Modal';

interface KakaoLoginModalContainerProps {
  onLogin: () => void;
  onClose: () => void;
}

const KakaoLoginModalContainer: React.FC<KakaoLoginModalContainerProps> = ({
  onLogin,
  onClose,
}) => {
  return (
    <Modal
      text="로그인 하시면<br />더 많은 기능을 이용하실 수 있어요."
      btn={<KakaoTalkLoginBtn onClick={onLogin} />}
      onClose={onClose}
    />
  );
};

export default KakaoLoginModalContainer;
