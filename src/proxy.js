import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isUserAdmin } from "@/lib/prisma-queries";

// 1. Define routes that require authentication
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
    // 2. Protect /admin routes
    if (isAdminRoute(req)) {
        const { userId } = await auth();

        // If not logged in, redirect to sign-in
        if (!userId) {
            const signInUrl = new URL("/sign-in", req.url);
            signInUrl.searchParams.set("redirect_url", req.url);
            return NextResponse.redirect(signInUrl);
        }

        // 3. Admin Check: Check role in Database
        try {
            const isAdmin = await isUserAdmin(userId);

            if (!isAdmin) {
                // Not an admin, redirect to unauthorized page
                return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
            }
        } catch (error) {
            console.error("Error checking admin role:", error);
            // Fallback to unauthorized on error for security
            return NextResponse.redirect(new URL("/admin/unauthorized", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
};