'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { FullScreenLoader } from '@/components/FullScreenLoader'

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
        router.push('/login?reason=not-approved')
      }
    }
  }, [isAuthenticated, isApproved, loading, requireApproval, router])

  // Show loading state while checking authentication
  if (loading) {
    return <FullScreenLoader message="Loading…" />
  }

  // If not authenticated or not approved, show nothing (will redirect)
  if (!isAuthenticated || (requireApproval && !isApproved)) {
    return null
  }

  // User is authenticated and approved, show the protected content
  return <>{children}</>
}
