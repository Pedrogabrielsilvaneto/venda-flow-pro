import { auth } from "@/auth";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");

    if (isAdminPage && !isLoggedIn) {
        return Response.redirect(new URL("/auth/login", req.nextUrl));
    }

    if (isAuthPage && isLoggedIn) {
        return Response.redirect(new URL("/admin", req.nextUrl));
    }
});

export const config = {
    matcher: ["/admin/:path*", "/auth/:path*"],
};
