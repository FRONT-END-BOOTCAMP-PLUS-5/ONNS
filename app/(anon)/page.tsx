import { Suspense } from 'react';
import Home from './home/HomeClient';

export default function Page() {
  return (
    <>
      <Suspense
        fallback={
          <div className="w-full h-screen flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--b400)]"></div>
          </div>
        }
      >
        <Home />
      </Suspense>
    </>
  );
}
