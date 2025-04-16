import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware configuration
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/admin/auth (auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api/admin/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};

export async function middleware(request: NextRequest) {
  // Handle admin routes protection
  if (request.nextUrl.pathname.startsWith('/admin')) {
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

  // Handle analytics tracking for non-admin routes
  if (
    !request.nextUrl.pathname.startsWith('/api') &&
    !request.nextUrl.pathname.startsWith('/_next') &&
    !request.nextUrl.pathname.match(/\.(ico|png|jpg|jpeg|gif|svg|css|js|woff|woff2|ttf|eot)$/) &&
    request.method === 'GET'
  ) {
    // Get visitor ID from cookies
    const visitorId = request.cookies.get('visitor_id');
    const isNewVisitor = !visitorId;

    // Track analytics
    try {
      const baseUrl = request.nextUrl.origin;
      await fetch(`${baseUrl}/api/analytics/track`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isNewVisitor,
          path: request.nextUrl.pathname,
          userAgent: request.headers.get('user-agent'),
          referer: request.headers.get('referer'),
        }),
      });
    } catch (error) {
      console.error('Error tracking analytics:', error);
    }

    // Set visitor cookie for new visitors
    const response = NextResponse.next();
    
    if (isNewVisitor) {
      const newVisitorId = crypto.randomUUID();
      // Set cookie to expire in 1 year
      response.cookies.set('visitor_id', newVisitorId, {
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        sameSite: 'lax',
        path: '/',
      });
    }

    return response;
  }

  return NextResponse.next();
} 