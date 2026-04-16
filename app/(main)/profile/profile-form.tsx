'use client';

import { FormEvent, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type ProfileFormProps = {
  email: string;
};

export function ProfileForm({ email }: ProfileFormProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  async function handleChangePassword(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmNewPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match.' });
      return;
    }

    setIsSavingPassword(true);
    try {
      const response = await fetch('/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        error?: string;
      };

      if (!response.ok) {
        setMessage({
          type: 'error',
          text: data.error ?? 'Could not update password.',
        });
        return;
      }

      setMessage({ type: 'success', text: 'Password updated.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
    } finally {
      setIsSavingPassword(false);
    }
  }

  return (
    <div className='space-y-8'>
      <div className='rounded-xl border border-border/60 bg-card/80 p-6 shadow-sm'>
        <h2 className='text-lg font-medium'>Account</h2>
        <p className='mt-1 text-xs text-muted-foreground'>Email you use to sign in.</p>
        <p className='mt-4 text-sm font-medium'>{email}</p>
      </div>

      <div className='rounded-xl border border-border/60 bg-card/80 p-6 shadow-sm'>
        <h2 className='text-lg font-medium'>Password</h2>
        <p className='mt-1 text-xs text-muted-foreground'>
          Change the password you use to sign in. Use at least 8 characters.
        </p>

        <form onSubmit={handleChangePassword} className='mt-4 space-y-3'>
          {message && (
            <p
              className={
                message.type === 'success'
                  ? 'text-sm text-emerald-600 dark:text-emerald-400'
                  : 'text-sm text-destructive'
              }
              role='alert'
            >
              {message.text}
            </p>
          )}
          <div className='space-y-1.5'>
            <Label htmlFor='current-password'>Current password</Label>
            <Input
              id='current-password'
              type='password'
              autoComplete='current-password'
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='new-password'>New password</Label>
            <Input
              id='new-password'
              type='password'
              autoComplete='new-password'
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <div className='space-y-1.5'>
            <Label htmlFor='confirm-new-password'>Confirm new password</Label>
            <Input
              id='confirm-new-password'
              type='password'
              autoComplete='new-password'
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
          </div>

          <Button
            type='submit'
            className='mt-2 w-full sm:w-auto'
            disabled={isSavingPassword}
          >
            {isSavingPassword ? 'Updating...' : 'Change password'}
          </Button>
        </form>
      </div>
    </div>
  );
}
