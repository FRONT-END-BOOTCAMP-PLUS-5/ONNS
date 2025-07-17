import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const routes = ['/ootd', '/my'];

  if (routes.some((route) => pathname.startsWith(route))) {
    const token = request.cookies.get('token');
    const refreshToken = request.cookies.get('refresh_token');

    if (!token && !refreshToken) {
      const url = request.nextUrl.clone();
      url.pathname = '/';
      url.searchParams.set('login', '1');
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}
