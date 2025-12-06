import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;

    // /admin配下のアクセス制御
    if (req.nextUrl.pathname.startsWith('/admin')) {
      if (!token) {
        // 未認証の場合はログイン画面へ
        const signInUrl = new URL('/auth/signin', req.url);
        signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
      }

      // 管理者権限チェック
      if (token.role !== 'admin') {
        // 一般ユーザーの場合は403エラーページへ
        return NextResponse.rewrite(new URL('/admin/403', req.url));
      }
    }

    // /dashboard配下のアクセス制御（既存の機能）
    if (req.nextUrl.pathname.startsWith('/dashboard')) {
      if (!token) {
        const signInUrl = new URL('/auth/signin', req.url);
        signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
        return NextResponse.redirect(signInUrl);
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // /admin配下の場合は管理者権限が必要
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }
        // /dashboard配下の場合は認証済みであればOK
        if (req.nextUrl.pathname.startsWith('/dashboard')) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};
