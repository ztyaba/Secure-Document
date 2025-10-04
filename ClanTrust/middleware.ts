import { authMiddleware } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

const mockClerk = process.env.NEXT_PUBLIC_CLERK_MOCK_MODE === 'true';

export default mockClerk
  ? ((req) => {
      const res = NextResponse.next();
      res.headers.set('x-clantrust-trace', req.nextUrl.pathname);
      return res;
    })
  : authMiddleware({
      publicRoutes: ['/', '/onboarding', '/offline'],
      afterAuth: (_, req) => {
        const res = NextResponse.next();
        res.headers.set('x-clantrust-trace', req.nextUrl.pathname);
        return res;
      }
    });

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
