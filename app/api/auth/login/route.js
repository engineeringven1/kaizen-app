import { NextResponse } from 'next/server';

export async function POST(request) {
  const { password } = await request.json();

  if (!password || password !== process.env.KAIZEN_ACCESS_KEY) {
    return NextResponse.json({ error: 'Contraseña incorrecta.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set('kaizen_auth', process.env.APP_SESSION_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return response;
}
