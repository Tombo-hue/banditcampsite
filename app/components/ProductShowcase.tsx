'use client';

import { useState } from 'react';
import ScrollButton from './ScrollButton';

interface ProductMedia {
  id: number;
  url: string;
  alt: string | null;
  isMain: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: ProductMedia[];
  slug: string;
}

interface ProductShowcaseProps {
  products: Product[];
}

export default function ProductShowcase({ products }: ProductShowcaseProps) {
  return (
    <nav className="flex items-center space-x-8">
      <ScrollButton targetId="products">
        PRODUCTS
      </ScrollButton>
      <ScrollButton targetId="contact">
        CONTACT
      </ScrollButton>
    </nav>
  );
} 