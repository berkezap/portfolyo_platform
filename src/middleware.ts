import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    // Middleware runs after auth check
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Protect these routes - require authentication
        const protectedRoutes = [
          '/dashboard',
          '/my-portfolios',
          '/dashboard/edit'
        ]
        
        // Check if current path is protected
        const isProtectedRoute = protectedRoutes.some(route => 
          pathname.startsWith(route)
        )
        
        // Allow access if not a protected route OR if user has valid token
        return !isProtectedRoute || !!token
      },
    },
    pages: {
      signIn: '/',  // Redirect unauthorized users to home page
    },
  }
)

export const config = {
  matcher: [
    // Match all request paths except static files and API routes
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.svg$).*)',
  ],
} 