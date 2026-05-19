import React from 'react';
import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/db';
import ProductList from './ProductList';
import styles from './products.module.css';

export const revalidate = 60;

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const categorySlug = typeof params.category === 'string' ? params.category : undefined;

  const where: Prisma.ProductWhereInput = {};
  
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { description: { contains: search } },
    ];
  }

  if (categorySlug) {
    where.category = { slug: categorySlug };
  }

  const products = await prisma.product.findMany({
    where,
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } }
  });

  return (
    <div className={styles.pageWrapper}>
      <header className={styles.header}>
        <div className="container">
          <h1 className={styles.title}>
            {categorySlug ? categories.find(c => c.slug === categorySlug)?.name : 'Food Collections'}
          </h1>
          <p className={styles.subtitle}>
            Explore the authentic flavors and unique treasures from the eight states of Northeast India.
          </p>
        </div>
      </header>

      <main className="container py-12">
        <ProductList 
          initialProducts={products} 
          categories={categories}
          activeCategory={categorySlug}
        />
      </main>
    </div>
  );
}
