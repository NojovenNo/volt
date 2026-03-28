import { signUp } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const userId = await signUp(request);
    return new Response(JSON.stringify({ id: userId }), { status: 200 });
  } catch (reason) {
    const message =
      reason instanceof Error ? reason.message : 'Unexpected error';

    return new Response(message, { status: 500 });
  }
}
