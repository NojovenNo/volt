'use client';
import { useState, useEffect } from 'react';
import { categories, Product } from '@/lib/products';
import { ProductCard } from '@/components/product-card';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { Field, FieldLabel } from '@/components/ui/field';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from '@/components/ui/select';

type Props = {
  products: Product[];
};

export function ProductGrid({ products }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const categoryParam = searchParams.get('category');
  const [active, setActive] = useState(categoryParam || 'All');

  const changePageSize = (size: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('itemsPerPage', String(size));
    params.set('page', '1');
    router.push(pathname + '?' + params.toString(), { scroll: false });
  };

  // Sincronizar estado con la URL cuando cambia
  useEffect(() => {
    const category = categoryParam || 'All';
    setActive(category);
  }, [categoryParam, pathname]);

  const handleCategoryClick = (category: string) => {
    setActive(category);
    const params = new URLSearchParams(searchParams.toString());
    if (category === 'All') {
      params.delete('category');
      router.push('/' + '?' + params.toString(), { scroll: false });
    } else {
      params.set('category', category);
      params.delete('page');
      router.push('/' + '?' + params.toString(), { scroll: false });
    }
  };

  return (
    <section className='mx-auto max-w-7xl px-4 py-16 lg:px-8'>
      <div className='flex items-center justify-between'>
        <h2 className='text-2xl font-semibold tracking-tight'>All Products</h2>
      </div>

      <div className='mt-6 flex flex-wrap items-center gap-2'>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${active === cat
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
              }`}
          >
            {cat}
          </button>
        ))}
        <div className='flex flex-1 items-center justify-end gap-4 mr-4'>
          <Field orientation='horizontal' className='w-fit'>
            <FieldLabel htmlFor='select-rows-per-page'>
              Products per page
            </FieldLabel>
            <Select
              defaultValue='10'
              onValueChange={(value) => changePageSize(Number(value))}
            >
              <SelectTrigger className='w-20' id='select-rows-per-page'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent align='start'>
                <SelectGroup>
                  <SelectItem value='10'>10</SelectItem>
                  <SelectItem value='25'>25</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
        </div>
      </div>

      <div className='mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {products.length === 0 && (
        <p className='mt-12 text-center text-muted-foreground'>
          No products found in this category.
        </p>
      )}
    </section>
  );
}
