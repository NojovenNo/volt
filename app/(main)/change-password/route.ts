import { changePassword } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await changePassword(request);
    return Response.json({ ok: true });
  } catch (reason) {
    if (reason instanceof Error && reason.name === '400') {
      return Response.json({ error: reason.message }, { status: 400 });
    }
    if (reason instanceof Error && reason.name === '401') {
      return Response.json({ error: reason.message }, { status: 401 });
    }

    const message =
      reason instanceof Error ? reason.message : 'Unexpected error';
    return Response.json({ error: message }, { status: 500 });
  }
}
