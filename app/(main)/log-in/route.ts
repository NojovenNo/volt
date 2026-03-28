import { login } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const userId = await login(request);
    return new Response(JSON.stringify({ id: userId }), { status: 200 });
  } catch (reason) {
    if (reason instanceof Error && reason.name === '401') {
      return new Response(reason.message, { status: 401 });
    }

    const message =
      reason instanceof Error ? reason.message : 'Unexpected error';

    return new Response(message, { status: 500 });
  }
}
