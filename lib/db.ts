'use server';
import { neon, type NeonQueryFunction } from '@neondatabase/serverless';

let initializedDb: NeonQueryFunction<false, false> | null = null;

function initDb(): NeonQueryFunction<false, false> {
  if (initializedDb) return initializedDb;
  initializedDb = neon(process.env.DATABASE_URL as string);
  return initializedDb;
}

export async function getProducts() {
  const db = initDb();
  const products = await db`SELECT * FROM products`;
  return products;
}

export async function getFeaturedProducts() {
  const db = initDb();
  const featuredProducts =
    await db`SELECT * FROM products WHERE featured IS TRUE`;
  return featuredProducts;
}

export async function saveUser({
  email,
  passwordHash,
}: {
  email: string;
  passwordHash: string;
}) {
  const db = initDb();
  const [user] = await db`
    INSERT INTO users (email, password_hash)
    VALUES (${email}, ${passwordHash})
    RETURNING id, email, password_hash
  `;
  return user;
}

export async function getUserByEmail({ email }: { email: string }) {
  const db = initDb();
  const [user] = await db`SELECT * FROM users WHERE users.email = ${email}`;
  return user;
}
