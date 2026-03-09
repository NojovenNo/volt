export const dynamic = 'force-dynamic';

import { Suspense } from 'react';

import { ProductsPagination } from '@/components/pagination';
import { HeroCarousel } from '@/components/hero-carousel';
import { ProductGrid } from '@/components/product-grid';
import { categories } from '@/lib/products';

const DOMAIN = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Home({ searchParams }: PageProps) {
  const { page = 1, itemsPerPage = 10, category } = await searchParams;

  const getFeaturedProductsResponse = await fetch(
    `${DOMAIN}/get-featured-products`,
    {
      method: 'GET',
    },
  );
  const { data: featured } = await getFeaturedProductsResponse.json();

  const categoryParam = category ? `&category=${category}` : '';
  const allProductsResponse = await fetch(
    `${DOMAIN}/all-products?page=${page}&itemsPerPage=${itemsPerPage}${categoryParam}`,
    {
      method: 'GET',
    },
  );
  const {
    data: allProducts,
    currentPage,
    totalPages,
  } = await allProductsResponse.json();

  return (
    <>
      <HeroCarousel featured={featured} category={typeof category === 'string' ? category:undefined}/>
      <Suspense>
        <ProductGrid products={allProducts}  />
        <ProductsPagination currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </>
  );
}
