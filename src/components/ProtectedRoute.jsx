'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

/**
 * Protected Route Component
 * Wraps pages that require authentication
 * Redirects to login if user is not authenticated
 */
export function ProtectedRoute({ children, requireApproval = false }) {
  const router = useRouter()
  const { isAuthenticated, isApproved, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push('/login')
      }
      // If authentication is required and user is not approved
      else if (requireApproval && !isApproved) {
        router.push('/login')
      }
    }
  }, [isAuthenticated, isApproved, loading, requireApproval, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated or not approved, show nothing (will redirect)
  if (!isAuthenticated || (requireApproval && !isApproved)) {
    return null
  }

  // User is authenticated and approved, show the protected content
  return <>{children}</>
}
