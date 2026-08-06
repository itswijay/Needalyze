'use client'
import Image from 'next/image'
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { forgotPasswordSchema } from '@/application/validation/auth'
import { useAuth } from '@/context/AuthContext'

const ForgetPasswordPage = () => {
  const { requestPasswordReset } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [isMobile, setIsMobile] = useState(null) // null initially to prevent hydration mismatch

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
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: ''
    },
  })
  const handleLogin = async (data) => {
    setLoading(true)

    const result = await requestPasswordReset(data.email)

    setLoading(false)

    if (!result.success) {
      toast.error(result.error || 'Could not send the reset link. Please try again.')
      return
    }

    // Deliberately the same outcome whether or not the address is registered —
    // a different message here would tell anyone who asks which email addresses
    // have accounts.
    reset()
    setSent(true)
  }

  const confirmation = (
    <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
      If an account exists for that address, we&apos;ve sent a link to reset the
      password. The link expires in one hour.
    </div>
  )
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
                  FORGET PASSWORD
                </h1>
                <div className="mx-4">
                  {sent && confirmation}
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

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-full p-5 bg-primary-900 hover:bg-primary-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Sending...' : 'Send reset link'}
                    </Button>
                  </form>
                  <p className="text-center text-primary-900 text-sm mt-4">
                    <Link href="/login" className="font-semibold hover:underline">
                      Back to login
                    </Link>
                  </p>
                </div>
              </div>
            ) : (
              /* Desktop View - Card */
              <Card className="shadow-sm w-[400px]">
                <CardHeader>
                  <div className="mt-7">
                    <CardTitle className="text-center text-2xl">
                      FORGET PASSWORD
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  {sent && confirmation}
                  <form onSubmit={handleSubmit(handleLogin)} noValidate>
                    <div className="mb-4">
                      <Input
                        className="rounded-full placeholder:text-xs p-5 mt-6 h-[50px]"
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
                    <div className="mt-5">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full p-5 bg-[linear-gradient(to_right,_#24456e_30%,_#04182f_80%)] h-[50px]"
                      >
                        {loading ? 'Sending...' : 'Send reset link'}
                      </Button>
                    </div>
                  </form>
                  <p className="text-center text-primary-600 text-xs mt-4">
                    <Link href="/login" className="font-semibold hover:underline">
                      Back to login
                    </Link>
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default ForgetPasswordPage