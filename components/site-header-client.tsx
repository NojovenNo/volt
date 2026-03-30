'use client';

import Link from 'next/link';
import { ShoppingBag, Menu, X, LogIn, CircleUser } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useCart } from '@/lib/cart-store';
import { Badge } from '@/components/ui/badge';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Components', href: '/?category=Components' },
  { label: 'Phones', href: '/?category=Phones' },
  { label: 'Gaming', href: '/?category=Gaming' },
  { label: 'Laptops', href: '/?category=Laptops' },
  { label: 'Audio', href: '/?category=Audio' },
];

type SiteHeaderClientProps = {
  userEmail: string | null;
};

export function SiteHeaderClient({ userEmail }: SiteHeaderClientProps) {
  const { count } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDocumentMouseDown(event: MouseEvent) {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }

    document.addEventListener('mousedown', onDocumentMouseDown);
    return () => {
      document.removeEventListener('mousedown', onDocumentMouseDown);
    };
  }, []);

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
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className='flex items-center gap-2'>
          <ThemeToggle />
          {userEmail ? (
            <div className='relative' ref={accountRef}>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                className='h-9 w-9'
                onClick={() => setAccountOpen((value) => !value)}
              >
                <CircleUser className='h-4 w-4' />
                <span className='sr-only'>Account</span>
              </Button>
              {accountOpen && (
                <div className='absolute right-0 top-11 z-50 w-56 rounded-md border border-border bg-popover p-3 shadow-md'>
                  <p className='mb-2 text-xs text-muted-foreground'>Logged in as</p>
                  <p className='truncate text-sm font-medium'>{userEmail}</p>
                  <form action='/logout' method='post' className='mt-3'>
                    <Button type='submit' variant='outline' className='w-full'>
                      Logout
                    </Button>
                  </form>
                </div>
              )}
            </div>
          ) : (
            <Link href='/login'>
              <Button variant='ghost' size='icon' className='h-9 w-9'>
                <LogIn className='h-4 w-4' />
                <span className='sr-only'>Login</span>
              </Button>
            </Link>
          )}
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
            {userEmail ? (
              <div className='mt-2 rounded-md border border-border p-3'>
                <p className='text-xs text-muted-foreground'>Logged in as</p>
                <p className='truncate text-sm font-medium'>{userEmail}</p>
                <form action='/logout' method='post' className='mt-3'>
                  <Button type='submit' variant='outline' className='w-full'>
                    Logout
                  </Button>
                </form>
              </div>
            ) : (
              <Link href='/login' onClick={() => setMobileOpen(false)}>
                <Button variant='outline' className='w-full'>
                  <LogIn className='mr-2 h-4 w-4' />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
