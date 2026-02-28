import { NextResponse } from "next/server";

export function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAdminPage = pathname.startsWith("/admin");
    const isAuthPage = pathname.startsWith("/auth");

    // NextAuth v5 uses JWE-encrypted cookies — we can't decode them in Edge middleware
    // without the full auth() setup. Instead, we check if the session cookie exists.
    const secureCookie = req.url.startsWith("https");
    const sessionCookieName = secureCookie
        ? "__Secure-authjs.session-token"
        : "authjs.session-token";

    const sessionCookie = req.cookies.get(sessionCookieName);
    const isLoggedIn = !!sessionCookie?.value;

    if (isAdminPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
    }

    if (isAuthPage && isLoggedIn) {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/auth/:path*"],
};
