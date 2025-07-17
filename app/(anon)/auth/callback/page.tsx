import { Suspense } from 'react';
import Callback from './CallBack';

export default function Page() {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <Callback />
    </Suspense>
  );
}
