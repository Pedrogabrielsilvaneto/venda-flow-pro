import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
    try {
        const token = await getToken({
            req,
            secret: process.env.AUTH_SECRET || "venda_flow_default_secret_7626919b74d81",
        });
        const isLoggedIn = !!token;
        const { pathname } = req.nextUrl;

        const isAdminPage = pathname.startsWith("/admin");
        const isAuthPage = pathname.startsWith("/auth");

        if (isAdminPage && !isLoggedIn) {
            return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
        }

        if (isAuthPage && isLoggedIn) {
            return NextResponse.redirect(new URL("/admin", req.nextUrl));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Middleware error:", error.message);
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/admin/:path*", "/auth/:path*"],
};
