import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default async function proxy(request: NextRequest) {
  const { cookies, nextUrl } = request;
  const { pathname, searchParams } = nextUrl;

  const token = cookies.get('token')?.value;

  const isAuthPage = pathname.startsWith('/signin') || pathname.startsWith('/signup') || pathname.startsWith('/authentication');

  if (isAuthPage) {
    if (token) {
      const redirectTo = searchParams.get('redirectTo') || '/overview/new';
      return NextResponse.redirect(new URL(redirectTo, request.url));
    }

    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/signin', request.url);
    loginUrl.searchParams.set('redirectTo', pathname);

    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/overview') {
    return NextResponse.redirect(new URL('/overview/new', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/signin', '/signup', '/authentication', '/overview/:path*'],
};
