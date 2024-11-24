import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const planArr = [
  {
    identifier: 'Basic',
    allowedRoutes: [
      '/dashboard',
      '/settings',
      '/inbox',
      '/bookings',
      '/explore',
    ],
  },
  {
    identifier: 'Starter',
    allowedRoutes: ['/dashboard', '/settings', '/inbox', '/bookings'],
  },
  {
    identifier: 'Business',
    allowedRoutes: ['/dashboard', '/settings', '/inbox', '/bookings'],
  },
];

export async function middleware(request) {
  try {
    const url = request.nextUrl.clone();
    const pathname = url.pathname; 
    const cookieStore = cookies();
    const token = cookieStore.get('user_token');
    const gottenToken = token?.value;

    if (!gottenToken) {
      return NextResponse.next();
    }

    // If token exists, validate it with the backend
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_REACT_APP_BASE_URL}/users/retrieve-token`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${gottenToken}`,
        },
        body: {
          token: gottenToken
        }
      }
    );

    if (!response.ok || response.status === 401) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const data = await response.json();

    const userPlan = data?.planIdentifier; 
    const allowedRoutes = planArr.find((plan) => plan.identifier === userPlan)?.allowedRoutes || [];

    if (!allowedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}

export const config = {
  matcher: ['/', '/signup', '/settings', '/inbox', '/bookings', '/explore'],
};
