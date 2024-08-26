import { NextResponse } from 'next/server';
import { parse } from 'cookie';

export async function middleware(req) {
  const url = req.nextUrl.clone();

  // Parse cookies from the request headers
  const cookies = parse(req.headers.get('cookie') || '');
  const user = cookies['user'];

  if (!user) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/my-account', '/settings'],
};
