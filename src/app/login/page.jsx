'use client'
import toast from 'react-hot-toast'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from '@/lib/auth'
import { useAuth } from '@/context/AuthContext'

// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

const page = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, isApproved, loading: authLoading, signOut } = useAuth()
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(null) // null initially to prevent hydration mismatch
  const [errorMessage, setErrorMessage] = useState('')
  const [infoMessage, setInfoMessage] = useState('')

  // React Hook Form with Zod resolver - MUST be called before any early returns
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Check for redirect reason and show appropriate message - MUST run before auth redirect
  useEffect(() => {
    const reason = searchParams.get('reason')
    if (reason === 'not-approved') {
      const message = 'Your account is pending approval. Please contact your team leader or wait for approval to access the dashboard.'
      setInfoMessage(message)
      // Store in sessionStorage so it persists even if page reloads
      sessionStorage.setItem('loginInfoMessage', message)
      // Clean up the URL
      router.replace('/login', { shallow: true })
    } else {
      // Check if there's a stored message from redirect
      const storedMessage = sessionStorage.getItem('loginInfoMessage')
      if (storedMessage) {
        setInfoMessage(storedMessage)
      }
    }
  }, [searchParams, router])

  // Redirect to dashboard if already authenticated (but not if showing not-approved message)
  useEffect(() => {
    if (!authLoading && isAuthenticated && isApproved) {
      // Only redirect if user is both authenticated AND approved
      router.push('/dashboard')
    }
  }, [isAuthenticated, isApproved, authLoading, router])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show loading state while checking authentication or if authenticated AND approved
  // If authenticated but NOT approved, show the login page with the message
  if (authLoading || (isAuthenticated && isApproved)) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)]">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>
            {isAuthenticated && isApproved ? 'Redirecting to dashboard...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  const handleLogin = async (data) => {
  try {
    setLoading(true)
    setErrorMessage('')
    setInfoMessage('')
    sessionStorage.removeItem('loginInfoMessage')

    console.log('Attempting login for:', data.email)

    const result = await signIn(data.email, data.password)

    console.log('Login result:', {
      success: result.success,
      error: result.error,
      hasUser: !!result.user,
      hasSession: !!result.session
    })

    if (result.success) {
      toast.success('Login successful!')
      console.log('Login successful, waiting for auth state to update...')
    } else {
      toast.error(result.error || 'Login failed. Please try again.')
      setErrorMessage(result.error || 'Login failed. Please try again.')
      setLoading(false)
    }
  } catch (error) {
    console.error('Login error:', error)
    toast.error('An unexpected error occurred. Please try again.')
    setErrorMessage('An unexpected error occurred. Please try again.')
    setLoading(false)
  }
}

  const handleLogout = async () => {
  try {
    setLoading(true)
    setInfoMessage('')
    sessionStorage.removeItem('loginInfoMessage')
    await signOut()
    toast.success('Logged out successfully!')
    setLoading(false)
    window.location.reload()
  } catch (error) {
    toast.error('Logout failed, please try again.') 
    console.error('Logout error:', error)
    setLoading(false)
  }
}

const handleValidationErrors = (errors) => {
  Object.values(errors).forEach((err) => {
    toast.error(err.message);
  });
};

  return (
    <>
      <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)] flex flex-col justify-center items-center pt-6 pb-12 md:py-0 relative flex-shrink-0">
          <Image
            src="/images/logos/white-t.png"
            width="260"
            height="260"
            alt="Needalyze-Logo"
            priority
            className="w-32 h-32 md:w-[260px] md:h-[260px]"
          />

          {/* Curved bottom edge - only on mobile */}
          <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] md:hidden">
            <svg
              className="relative block w-full h-[60px]"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"
                className="fill-gray-50"
              ></path>
            </svg>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-start px-4 py-4 md:py-0 md:justify-center md:items-center bg-gray-50 md:bg-white flex-1 overflow-y-auto">
          <div className="w-full max-w-sm">
            {isMobile === null ? (
              /* Loading state - show nothing or skeleton to prevent flash */
              <div className="h-96"></div>
            ) : isMobile ? (
              /* Mobile View */
              <div>
                <h1 className="text-center text-2xl font-bold text-primary-900 mb-5 mt-2">
                  Login
                </h1>
                <div className="mx-4">
                  {/* Info Message */}
                  {infoMessage && (
                    <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-blue-800 text-sm font-medium">{infoMessage}</p>
                          {isAuthenticated && !isApproved && (
                            <button
                              onClick={handleLogout}
                              disabled={loading}
                              className="mt-3 text-blue-700 hover:text-blue-900 text-sm font-semibold underline disabled:opacity-50"
                            >
                              Logout and try different account
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Error Message */}
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {errorMessage}
                    </div>
                  )}
                  <form onSubmit={handleSubmit(handleLogin, handleValidationErrors)} noValidate>
                    <div className="mb-4">
                      <Input
                        className="rounded-full placeholder:text-xs p-5 bg-gray-200 border-0"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        {...register('email')}
                      />

                    </div>
                    <div className="mb-4">
                      <Input
                        className="rounded-full placeholder:text-xs p-5 bg-gray-200 border-0"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password')}
                      />

                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-full p-5 bg-primary-900 hover:bg-primary-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Loading...' : 'Login'}
                    </Button>
                  </form>
                  <div className="space-y-2">
                    <Link
                      href="/forget-password"
                      className="w-full block text-primary-900 hover:text-primary-700 text-sm font-semibold text-center mt-4"
                    >
                      Forget Password
                    </Link>
                    <p className="text-center text-primary-900 text-sm mt-2">
                      Don't have account?{' '}
                      <Link
                        href="/register"
                        className="text-primary-900 hover:text-primary-700 font-semibold inline"
                      >
                        Signup
                      </Link>
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Desktop View - Card */
              <Card className="shadow-sm">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">Login</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Info Message */}
                  {infoMessage && (
                    <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-300 rounded-lg">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <div className="flex-1">
                          <p className="text-blue-800 text-sm font-medium">{infoMessage}</p>
                          {isAuthenticated && !isApproved && (
                            <button
                              onClick={handleLogout}
                              disabled={loading}
                              className="mt-3 text-blue-700 hover:text-blue-900 text-sm font-semibold underline disabled:opacity-50"
                            >
                              Logout and try different account
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Error Message */}
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {errorMessage}
                    </div>
                  )}
                  <form onSubmit={handleSubmit(handleLogin, handleValidationErrors)} noValidate>
                    <div className="mb-4">
                      <Input
                        className="rounded-full placeholder:text-xs p-5"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        {...register('email')}
                      />
                      
                    </div>
                    <div className="mb-4">
                      <Input
                        className="rounded-full placeholder:text-xs p-5"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password')}
                      />

                    </div>
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-full p-5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Loading...' : 'Login'}
                    </Button>
                    <Link
                      href="/forget-password"
                      className="w-full block text-primary-600 hover:text-primary-400 text-xs font-semibold text-center mt-4 mb-2"
                    >
                      Forget Password
                    </Link>
                    <p className="text-center text-primary-600 text-xs mt-2">
                      Don't have account?{' '}
                      <Link
                        href="/register"
                        className="text-primary-400 hover:text-primary-200 font-semibold inline"
                      >
                        Signup
                      </Link>
                    </p>
                  </form>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default page
