import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  // Only run on admin routes
  if (!request.nextUrl.pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Skip authentication for the login page itself
  if (request.nextUrl.pathname === '/admin/login') {
    return NextResponse.next();
  }

  const authToken = request.cookies.get('admin_token');

  // If there's no auth token, redirect to login
  if (!authToken) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('from', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the token by making a request to our auth verification endpoint
    const verifyResponse = await fetch(new URL('/api/admin/auth/verify', request.url), {
      headers: {
        Cookie: `admin_token=${authToken.value}`,
      },
    });

    if (!verifyResponse.ok) {
      throw new Error('Invalid token');
    }

    return NextResponse.next();
  } catch (error) {
    // If verification fails, clear the cookie and redirect to login
    const response = NextResponse.redirect(new URL('/admin/login', request.url));
    response.cookies.delete('admin_token');
    return response;
  }
}

// Configure the middleware to run on specific paths
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
} 