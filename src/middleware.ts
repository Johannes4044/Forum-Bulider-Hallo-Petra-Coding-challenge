import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl

    // If user is authenticated and tries to go to root, redirect to admin
    if (pathname === '/' && req.nextauth.token) {
      return NextResponse.redirect(new URL('/admin', req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to public form routes
        if (pathname.startsWith('/forms/') && !pathname.includes('/admin')) {
          return true
        }

        // Allow access to login page
        if (pathname === '/login') {
          return true
        }

        // For root path: allow if authenticated (will be redirected above), deny if not
        if (pathname === '/') {
          return !!token
        }

        // All other routes require authentication
        return !!token
      },
    },
    pages: {
      signIn: '/login?callbackUrl=/admin', // Force admin callback
    },
  }
)

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes except auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - forms/[id] (public form routes, but not admin subroutes)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|forms/[^/]+$).*)',
  ]
}