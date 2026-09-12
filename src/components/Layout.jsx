import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-[#f1f2f4] text-[#111827]">
      <Navbar />
      <main className="flex-grow pt-[148px] sm:pt-[152px] pb-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
