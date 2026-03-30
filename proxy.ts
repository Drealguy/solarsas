import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
  const url = req.nextUrl;
  const hostname = req.headers.get('host') || '';

  const baseDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'solarsas.com';
  const isLocalhost = hostname.startsWith('localhost');

  // 1. Local development — always serve the landing page at root
  if (isLocalhost) {
    return NextResponse.rewrite(new URL(`${url.pathname}`, req.url));
  }

  // 2. Route to the Brand Admin Dashboard (app.solarsas.com)
  if (hostname === `app.${baseDomain}`) {
    return NextResponse.rewrite(new URL(`/dashboard${url.pathname}`, req.url));
  }

 // 3. Route to the Main Landing Page (solarsas.com, www.solarsas.com, or Vercel)
  if (
    hostname === baseDomain || 
    hostname === `www.${baseDomain}` || 
    hostname === 'usesolarsas.vercel.app' // 👈 YOUR NEW VERCEL LINK!
  ) {
    return NextResponse.rewrite(new URL(`${url.pathname}`, req.url));
  }

  // 4. Route everything else to the Tenant Calculators (e.g., mybrand.solarsas.com)
  return NextResponse.rewrite(new URL(`/${hostname}${url.pathname}`, req.url));
}

// Ensure the proxy only runs on actual pages, not static files or APIs
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
