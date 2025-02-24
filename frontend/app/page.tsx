'use client';

import Hero from '@/components/Hero';
import ProductList from '@/components/products/ProductList';

export default function Home() {
  return (
    <div className="min-h-screen  font-[family-name:var(--font-geist-sans)]">
      <div className="">
        <Hero />
        <ProductList />
      </div>
    </div>
  );
}
