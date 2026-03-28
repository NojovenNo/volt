'use client';
import { FormEvent, useState } from 'react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

const DOMAIN = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${DOMAIN}/log-in`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push('/');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className='flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-12'>
      <div className='w-full max-w-md rounded-xl border border-border/60 bg-card/80 p-8 shadow-lg backdrop-blur'>
        <div className='mb-6 text-center'>
          <h1 className='text-2xl font-semibold tracking-tight'>
            Welcome back!
          </h1>
          <p className='mt-1 text-sm text-muted-foreground'>
            Log in to access your account and manage your cart.
          </p>
        </div>

        <form onSubmit={handleLogin} className='space-y-4'>
          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <Input
              id='email'
              type='email'
              autoComplete='email'
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='you@example.com'
            />
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <Input
              id='password'
              type='password'
              autoComplete='new-password'
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='••••••••'
            />
          </div>

          <Button type='submit' className='mt-2 w-full' disabled={isSubmitting}>
            {isSubmitting ? 'Log in...' : 'Log in'}
          </Button>
        </form>

        <p className='mt-6 text-center text-sm text-muted-foreground'>
          Need an account?{' '}
          <Link
            href='/signup'
            className='font-medium text-primary underline-offset-4 hover:underline'
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
