import React from 'react';
import { prisma } from '@/lib/db';
import ProductList from './ProductList';
import styles from './products.module.css';

export const dynamic = 'force-dynamic';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const search = typeof params.search === 'string' ? params.search : undefined;
  const categorySlug = typeof params.category === 'string' ? params.category : undefined;

  const where: any = {};
  
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
          initialProducts={products as any[]} 
          categories={categories as any[]}
          activeCategory={categorySlug}
        />
      </main>
    </div>
  );
}
