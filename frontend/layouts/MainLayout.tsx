'use client';

import { usePathname } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // List of paths that should NOT have Header & Footer
  const hideLayout =
    pathname.startsWith('/dashboard') ||
    pathname.startsWith('/seller') ||
    pathname.startsWith('/admin');

  return (
    <div>
      {!hideLayout && <Header />}
      <main className={hideLayout ? 'h-screen' : ''}>{children}</main>
      {!hideLayout && <Footer />}
    </div>
  );
}
