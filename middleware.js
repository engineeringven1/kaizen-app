import { NextResponse } from 'next/server';

const SESSION_COOKIE = 'kaizen_auth';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/login') || pathname.startsWith('/api/auth')) {
    return NextResponse.next();
  }

  const session = request.cookies.get(SESSION_COOKIE);
  const secret  = process.env.KAIZEN_ACCESS_KEY;

  if (!secret || !session || session.value !== secret) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
