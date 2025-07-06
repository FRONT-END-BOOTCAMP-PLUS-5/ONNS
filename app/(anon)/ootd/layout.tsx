import Header from '@/app/components/Header';
import Nav from '@/app/components/Nav';
import React, { ReactNode } from 'react';


interface LayoutProps {
    children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="w-full flex justify-center bg-gray-50">
    <div className="w-[430px] h-[1004px] bg-white relative flex flex-col">
      <Header/>
      <main className="flex-1">{children}</main>
      <nav className="fixed bottom-0 w-[430px]">
        <Nav/>
      </nav>
    </div>
  </div>
);

export default Layout;