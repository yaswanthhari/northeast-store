import React from 'react';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await prisma.product.findMany({ select: { id: true } });
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await prisma.product.findUnique({
    where: { id },
    include: { category: true },
  });

  if (!product) notFound();

  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      NOT: { id: product.id },
    },
    include: { category: true },
    take: 6,
  });

  return <ProductDetailClient product={product} related={related} />;
}