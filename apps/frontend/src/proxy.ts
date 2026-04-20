import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export default async function proxy(request: NextRequest) {
  const { cookies, url } = request;

  const token = cookies.get('token')?.value;
  const isAuthPage = url.includes('/signin') || url.includes('/signup') || url.includes('/authentication');
  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL('/overview/new', url));
    }

    return NextResponse.next();
  }

  if (!token) {
    const originPath = request.nextUrl.pathname;

    const loginUrl = new URL('/signin', request.url);
    loginUrl.searchParams.set('redirectTo', originPath);

    return NextResponse.redirect(loginUrl);
  }
  if (request.nextUrl.pathname === '/overview') {
    return NextResponse.redirect(new URL('/overview/new', url));
  }
}

export const config = {
  matcher: ['/signin', '/signup', '/authentication', '/overview/:path*'],
};
