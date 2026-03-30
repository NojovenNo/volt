import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

import {
  getUserByEmail,
  getUserById,
  getUserPasswordHashById,
  saveUser,
  updateUserPasswordHash,
} from './db';

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createToken(userId: string) {
  return await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d')
    .sign(secret);
}

export async function verifyToken(token: string) {
  const { payload } = await jwtVerify(token, secret);
  return payload;
}

export async function signUp(request: Request) {
  const { email, password } = await request.json();

  const passwordHash = await hashPassword(password);

  try {
    const user = await saveUser({
      email,
      passwordHash,
    });

    const token = await createToken(user.id);

    const cookieStore = await cookies();
    cookieStore.set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return user.id;
  } catch (err) {
    console.error(err);
    return null;
  }
}

export async function login(request: Request) {
  const { email, password } = await request.json();

  // using user email fetch the user to get the hashed password
  const user = await getUserByEmail({ email });

  if (!user) {
    const err = new Error('Email or password are incorrect');
    err.name = '401';
    throw err;
  }

  // compare the password the user gave with the hashed password we retrieved from db
  const passwordMatch = await verifyPassword(password, user.password_hash);

  // if no match return error
  if (!passwordMatch) {
    const err = new Error('Email or password are incorrect');
    err.name = '401';
    throw err;
  }

  const token = await createToken(user.id);

  const cookieStore = await cookies();
  cookieStore.set('session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });

  return user.id;
}

export async function isLoggedIn() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  const jwt = sessionCookie?.value;

  if (!jwt) {
    if (sessionCookie) {
      cookieStore.delete('session');
    }

    return false;
  }

  try {
    await verifyToken(jwt);
    return true;
  } catch {
    cookieStore.delete('session');
    return false;
  }
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('session');
  const jwt = sessionCookie?.value;

  if (!jwt) {
    if (sessionCookie) {
      cookieStore.delete('session');
    }

    return null;
  }

  try {
    const payload = await verifyToken(jwt);

    if (!payload.sub) {
      cookieStore.delete('session');
      return null;
    }

    const user = await getUserById({ id: payload.sub });

    if (!user) {
      cookieStore.delete('session');
      return null;
    }

    return { id: user.id, email: user.email } as const;
  } catch {
    cookieStore.delete('session');
    return null;
  }
}

const MIN_PASSWORD_LENGTH = 8;

export async function changePassword(request: Request) {
  const body = await request.json();
  const currentPassword =
    typeof body.currentPassword === 'string' ? body.currentPassword : '';
  const newPassword =
    typeof body.newPassword === 'string' ? body.newPassword : '';

  if (!currentPassword || !newPassword) {
    const err = new Error('Current password and new password are required');
    err.name = '400';
    throw err;
  }

  if (newPassword.length < MIN_PASSWORD_LENGTH) {
    const err = new Error(
      `Password must be at least ${MIN_PASSWORD_LENGTH} characters`,
    );
    err.name = '400';
    throw err;
  }

  const sessionUser = await getCurrentUser();
  if (!sessionUser) {
    const err = new Error('Unauthorized');
    err.name = '401';
    throw err;
  }

  const row = await getUserPasswordHashById({ id: sessionUser.id });
  if (!row) {
    const err = new Error('Unauthorized');
    err.name = '401';
    throw err;
  }

  const passwordMatch = await verifyPassword(
    currentPassword,
    row.password_hash,
  );
  if (!passwordMatch) {
    const err = new Error('Current password is incorrect');
    err.name = '401';
    throw err;
  }

  const passwordHash = await hashPassword(newPassword);
  await updateUserPasswordHash({
    id: sessionUser.id,
    passwordHash,
  });
}
