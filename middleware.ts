import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('invoice_session')?.value;
  const path = req.nextUrl.pathname;
  if ((path.startsWith('/app') || path.startsWith('/admin')) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*']
};
