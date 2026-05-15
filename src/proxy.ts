import { createServerClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function proxy(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { req, res }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Proteksi halaman dashboard
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Jika sudah login, jangan biarkan ke halaman login lagi
  if (session && req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
