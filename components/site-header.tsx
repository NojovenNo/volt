'use client';
import Link from 'next/link';
import { ShoppingBag, Menu, X, LogIn } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useCart } from '@/lib/cart-store';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/products';

const navLinks = [
  { label: 'Store', href: '/' },
  { label: 'Components', href: '/?category=Components' },
  { label: 'Phones', href: '/?category=Phones' },
  { label: 'Gaming', href: '/?category=Gaming' },
  { label: 'Laptops', href: '/?category=Laptops' },
  { label: 'Audio', href: '/?category=Audio' },
];

interface Props {
  featuredProducts: Product[];
}

export function SiteHeader({ featuredProducts }: Props) {
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setdropOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const getFeaturedByCategory = (category: string): Product[] => {
    return featuredProducts.filter(p => p.category === category && p.featured);
  };

  return (
    <header className='sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg'>
      <div className='mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-8'>
        <div className='flex items-center gap-8'>
          <Link href='/' className='text-lg font-semibold tracking-tight'>
            VOLT
          </Link>
          <nav className='hidden items-center gap-6 md:flex'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                onMouseEnter={() => {
                  // const products = getFeaturedByCategory(link.label);
                  // console.log(products);
                  if (link.label === 'Store') {
                    setActiveMenu('store');
                    setdropOpen(true);
                  } else {
                    setActiveMenu(null);
                    setdropOpen(false);
                  }
                }}>
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className='flex items-center gap-2'>
          <ThemeToggle />
          <Link href='/login'>
            <Button variant='ghost' size='icon' className='h-9 w-9'>
              <LogIn className='h-4 w-4' />
              <span className='sr-only'>Login</span>
            </Button>
          </Link>
          <Link href='/cart'>
            <Button variant='ghost' size='icon' className='relative h-9 w-9'>
              <ShoppingBag className='h-4 w-4' />
              {count > 0 && (
                <Badge className='absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center p-0 text-[10px]'>
                  {count}
                </Badge>
              )}
              <span className='sr-only'>Cart</span>
            </Button>
          </Link>
          <Button
            variant='ghost'
            size='icon'
            className='h-9 w-9 md:hidden'
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className='h-4 w-4' />
            ) : (
              <Menu className='h-4 w-4' />
            )}
            <span className='sr-only'>Menu</span>
          </Button>
        </div>
      </div>

      {dropOpen && activeMenu === `store` && (
        <>
          <div
            className='fixed inset-0 top-16 z-30 bg-background/60 backdrop-blur-md'
            onClick={() => {
              setdropOpen(false);
              setActiveMenu(null);
            }}
          />
          <div
            className='absolute left-0 right-0 top-16 z-40 border-b border-border/40 bg-background/95 px-8 py-6 shadow-xl backdrop-blur-lg'
            onMouseLeave={() => {
              setdropOpen(false);
              setActiveMenu(null);
            }}
          >
            <div className='mx-auto grid max-w-7xl grid-cols-4 gap-8 text-sm'>
              <div>
                <div className='mb-2 text-xs font-semibold uppercase text-muted-foreground'>
                  Sort
                </div>
                <ul className='space-y-1 text-foreground/80'>
                  <li>New</li>
                  <li>Popular</li>
                  <li>More listening</li>
                  <li>More reviews</li>
                </ul>
              </div>
              <div>
                <div className='mb-2 text-xs font-semibold uppercase text-muted-foreground'>
                  By age
                </div>
                <ul className='space-y-1 text-foreground/80'>
                  <li>2 to 5</li>
                  <li>5 to 9</li>
                  <li>9 to 13</li>
                  <li>13 to 15</li>
                </ul>
              </div>
              <div>
                <div className='mb-2 text-xs font-semibold uppercase text-muted-foreground'>
                  Special ones
                </div>
                <ul className='space-y-1 text-foreground/80'>
                  <li>Dyslexia</li>
                  <li>Dysgraphia</li>
                  <li>Dyscalculia</li>
                  <li>Autism</li>
                </ul>
              </div>
              <div>
                <div className='mb-2 text-xs font-semibold uppercase text-muted-foreground'>
                  Categories
                </div>
                <ul className='space-y-1 text-foreground/80'>
                  <li>Kids&apos; Best Sellers</li>
                  <li>Podcasts for your kids</li>
                  <li>Coming Soon</li>
                  <li>Sleep</li>
                  <li>Bestsellers</li>
                  <li>Editors&apos; Picks</li>
                </ul>
              </div>
            </div>
          </div>
        </>
      )}

      {mobileOpen && (
        <nav className='border-t border-border/40 bg-background px-4 py-4 md:hidden'>
          <div className='flex flex-col gap-3'>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
