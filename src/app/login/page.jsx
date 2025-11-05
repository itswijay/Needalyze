'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { signIn } from '@/lib/auth'

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
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(null) // null initially to prevent hydration mismatch
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // React Hook Form with Zod resolver
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

  const handleLogin = async (data) => {
    try {
      setLoading(true)
      setErrorMessage('')

      // Call Supabase signIn function
      const result = await signIn(data.email, data.password)

      if (result.success) {
        // Login successful - redirect to dashboard
        router.push('/dashboard')
      } else {
        // Login failed - show error message
        setErrorMessage(result.error || 'Login failed. Please try again.')
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

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
                  {/* Error Message */}
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {errorMessage}
                    </div>
                  )}
                  <form onSubmit={handleSubmit(handleLogin)} noValidate>
                    <div className="mb-4">
                      <Input
                        className="rounded-full placeholder:text-xs p-5 bg-gray-200 border-0"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-xs mt-1 ml-4">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Input
                        className="rounded-full placeholder:text-xs p-5 bg-gray-200 border-0"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password')}
                      />
                      {errors.password && (
                        <p className="text-red-600 text-xs mt-1 ml-4">
                          {errors.password.message}
                        </p>
                      )}
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
                  {/* Error Message */}
                  {errorMessage && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {errorMessage}
                    </div>
                  )}
                  <form onSubmit={handleSubmit(handleLogin)} noValidate>
                    <div className="mb-4">
                      <Input
                        className="rounded-full placeholder:text-xs p-5"
                        type="email"
                        placeholder="Email"
                        autoComplete="email"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-red-600 text-xs mt-1 ml-4">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                    <div className="mb-4">
                      <Input
                        className="rounded-full placeholder:text-xs p-5"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        {...register('password')}
                      />
                      {errors.password && (
                        <p className="text-red-600 text-xs mt-1 ml-4">
                          {errors.password.message}
                        </p>
                      )}
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
