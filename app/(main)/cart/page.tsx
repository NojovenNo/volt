import type { Metadata } from 'next';

import { CartView } from '@/components/cart-view';
import { isLoggedIn } from '@/lib/auth';
import { redirect } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Cart — VOLT',
  description: 'Review your cart and proceed to checkout.',
};

export default async function Cart() {
  const loggedIn = await isLoggedIn();

  if (!loggedIn) {
    redirect('/login');
  }

  return <CartView />;
}
