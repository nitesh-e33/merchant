import { NextResponse } from 'next/server';
import { parse } from 'cookie';

export async function middleware(req) {
  const url = req.nextUrl.clone();

  // Parse cookies from the request headers
  const cookies = parse(req.headers.get('cookie') || '');
  const user = cookies['user'];
  const storedDeviceId = cookies['device_id'];

  if (!user || !storedDeviceId) {
    url.pathname = '/';
    url.searchParams.set('invaliduser', 'true');
    return NextResponse.redirect(url);
  }

  const userData = JSON.parse(user);
  const isKYCVerified = userData?.isKYCVerified;

  // Check if user needs KYC verification for specific routes
  const kycVerificationRequiredRoutes = [
    '/settings',
    '/dashboard',
    '/transactions',
    '/refunds',
    '/easycollect',
    '/directdebit/debitrequests',
    '/directdebit/authorization',
  ];

  if (kycVerificationRequiredRoutes.includes(url.pathname) && !isKYCVerified) {
    url.pathname = '/my-account';
    url.searchParams.set('error', 'kyc_verification');
    return NextResponse.redirect(url, {
      status: 302,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/my-account',
    '/settings',
    '/dashboard',
    '/transactions',
    '/refunds',
    '/easycollect',
    '/directdebit/debitrequests',
    '/directdebit/authorization'
  ],
};
