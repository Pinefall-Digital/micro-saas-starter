import { clerkMiddleware } from "@clerk/nextjs/server";

// Clerk middleware protects routes and manages auth sessions.
// By default all routes are public. Use clerkMiddleware options or
// route-level auth() checks to protect specific pages.
//
// See: https://clerk.com/docs/references/nextjs/clerk-middleware
export default clerkMiddleware();

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
