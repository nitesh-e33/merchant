import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import CryptoJS from 'crypto-js';
import { SECRET_KEY } from '../src/app/lib/constant'

export async function middleware(req) {
  const url = req.nextUrl.clone();
  const currentPath = url.pathname;

  // Parse cookies from the request headers
  const cookies = parse(req.headers.get('cookie') || '');
  const encryptedUser = cookies['user'];
  const storedDeviceId = cookies['device_id'];

  // Check if user or device ID is missing
  if (!encryptedUser || !storedDeviceId) {
    url.pathname = '/';
    url.searchParams.set('invaliduser', 'true');
    return NextResponse.redirect(url);
  }

  let userData;
  try {
    // Decrypt the user cookie data
    const bytes = CryptoJS.AES.decrypt(encryptedUser, SECRET_KEY);
    const decryptedUser = bytes.toString(CryptoJS.enc.Utf8);
    // Parse the decrypted data
    userData = JSON.parse(decryptedUser);
  } catch (error) {
    // Handle decryption error or invalid JSON
    url.pathname = '/';
    url.searchParams.set('invaliduser', 'true');
    return NextResponse.redirect(url);
  }

  const isKYCVerified = userData?.isKYCVerified;
  const userServices = userData?.services || {};
  // Convert object values to an array of services
  const servicesArray = Object.values(userServices);
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

  if (kycVerificationRequiredRoutes.includes(currentPath) && !isKYCVerified) {
    url.pathname = '/my-account';
    url.searchParams.set('error', 'kyc_verification');
    return NextResponse.redirect(url, {
      status: 302,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  // Check for service-based access control only for specified routes
  const serviceBasedRoutes = ['/easycollect', '/directdebit/debitrequests', '/directdebit/authorization'];
  if (serviceBasedRoutes.includes(currentPath)) {
    // Apply service-based access control for these routes
    if (
      (servicesArray.includes('AD') && currentPath.startsWith('/directdebit')) ||
      (servicesArray.includes('EC') && currentPath.startsWith('/easycollect'))
    ) {
      // If user has the right services, allow the request to continue
      return NextResponse.next();
    }
    // Redirect to dashboard if unauthorized
    url.pathname = '/dashboard';
    url.searchParams.set('exception', 'unauthorized_access');
    return NextResponse.redirect(url, {
      status: 302,
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
  }

  // For all other routes, proceed without applying service-based access control
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
    '/directdebit/authorization',
  ],
};
