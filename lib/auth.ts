import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';

import { getUserByEmail, getUserById, saveUser } from './db';

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
