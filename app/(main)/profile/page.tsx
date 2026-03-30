import { redirect } from 'next/navigation';

import { getCurrentUser } from '@/lib/auth';

import { ProfileForm } from './profile-form';

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect('/login');
  }

  return (
    <div className='mx-auto w-full max-w-lg px-4 py-10'>
      <header className='mb-8 mx-4'>
        <h1 className='text-3xl font-semibold tracking-tight'>Profile</h1>
        <p className='mt-1 text-sm text-muted-foreground'>
          Your account email and password settings.
        </p>
      </header>
      <ProfileForm email={user.email} />
    </div>
  );
}
