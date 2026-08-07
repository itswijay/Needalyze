'use client'

import toast from 'react-hot-toast'
import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter, useSearchParams } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { AuthShell } from '@/components/AuthShell'
import { FullScreenLoader } from '@/components/FullScreenLoader'
import { loginSchema } from '@/application/validation/auth'
import { useAuth } from '@/context/AuthContext'
import { useMotion } from '@/lib/motion'

// Separate component for handling search params
const SearchParamsHandler = ({ setInfoMessage }) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const reason = searchParams.get('reason')
    if (reason === 'not-approved') {
      const message =
        'Your account is pending approval. Please contact your team leader or wait for approval to access the dashboard.'
      setInfoMessage(message)
      // Store in sessionStorage so it persists even if page reloads
      sessionStorage.setItem('loginInfoMessage', message)
      // Clean up the URL
      // `shallow` was a Pages Router option and does nothing here; the App
      // Router replaces the entry either way, which is all this needs.
      router.replace('/login')
    } else {
      // Check if there's a stored message from redirect
      const storedMessage = sessionStorage.getItem('loginInfoMessage')
      if (storedMessage) {
        setInfoMessage(storedMessage)
      }
    }
  }, [searchParams, router, setInfoMessage])

  return null
}

const LoginPage = () => {
  const router = useRouter()
  const {
    isAuthenticated,
    isApproved,
    loading: authLoading,
    signIn,
    signOut,
  } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [infoMessage, setInfoMessage] = useState('')
  const m = useMotion()

  // React Hook Form with Zod resolver - MUST be called before any early returns
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Redirect to dashboard if already authenticated (but not if showing not-approved message)
  useEffect(() => {
    if (!authLoading && isAuthenticated && isApproved) {
      // Only redirect if user is both authenticated AND approved
      router.push('/dashboard')
    }
  }, [isAuthenticated, isApproved, authLoading, router])

  // Show loading state while checking authentication or if authenticated AND approved
  // If authenticated but NOT approved, show the login page with the message
  if (authLoading || (isAuthenticated && isApproved)) {
    return (
      <FullScreenLoader
        brand
        message={
          isAuthenticated && isApproved
            ? 'Redirecting to dashboard…'
            : 'Loading…'
        }
      />
    )
  }

  const handleLogin = async (data) => {
    try {
      setLoading(true)
      setInfoMessage('') // Clear info message on login attempt
      // Clear stored message when user attempts login
      sessionStorage.removeItem('loginInfoMessage')

      const result = await signIn(data.email, data.password)

      if (result.success) {
        // AuthContext holds the session now; the effect above redirects once
        // the auth state settles.
        return
      }

      toast.error(result.error || 'Login failed. Please try again.')
      setLoading(false)
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Unexpected error occurred.')
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      setLoading(true)
      setInfoMessage('')
      sessionStorage.removeItem('loginInfoMessage')
      await signOut()
      setLoading(false)
      // Force reload to clear any cached state
      window.location.reload()
    } catch (error) {
      console.error('Logout error:', error)
      setLoading(false)
    }
  }

  const handleValidationErrors = (validationErrors) => {
    Object.values(validationErrors).forEach((err) => {
      toast.error(err.message)
    })
  }

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler setInfoMessage={setInfoMessage} />
      </Suspense>

      <AuthShell
        title="Welcome back"
        subtitle="Sign in to continue to your dashboard"
        footer={
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="font-semibold text-primary-300 transition-colors hover:text-primary-200"
            >
              Sign up
            </Link>
          </p>
        }
      >
        <AnimatePresence initial={false}>
          {infoMessage && (
            <Alert variant="info" className="mb-5">
              {infoMessage}
              {isAuthenticated && !isApproved && (
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loading}
                  className="mt-3 block cursor-pointer text-sm font-semibold underline underline-offset-2 disabled:opacity-50"
                >
                  Log out and try a different account
                </button>
              )}
            </Alert>
          )}
        </AnimatePresence>

        <motion.form
          onSubmit={handleSubmit(handleLogin, handleValidationErrors)}
          noValidate
          variants={m.stagger(0.05, 0.05)}
          initial="hidden"
          animate="visible"
          className="space-y-4"
        >
          <motion.div variants={m.fadeInUp}>
            <Input
              type="email"
              placeholder="Email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...register('email')}
            />
          </motion.div>

          <motion.div variants={m.fadeInUp} className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              autoComplete="current-password"
              className="pr-12"
              aria-invalid={Boolean(errors.password)}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword((shown) => !shown)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
            >
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </motion.div>

          <motion.div variants={m.fadeInUp} className="flex justify-end">
            <Link
              href="/forget-password"
              className="text-xs font-semibold text-muted-foreground transition-colors hover:text-primary-300"
            >
              Forgot password?
            </Link>
          </motion.div>

          <motion.div variants={m.fadeInUp}>
            <Button
              type="submit"
              variant="brand"
              size="lg"
              disabled={loading}
              className="w-full"
            >
              {loading ? (
                <>
                  <Spinner className="size-4" />
                  Signing in…
                </>
              ) : (
                'Login'
              )}
            </Button>
          </motion.div>
        </motion.form>
      </AuthShell>
    </>
  )
}

const LoginRoute = () => {
  return (
    <Suspense fallback={<FullScreenLoader brand />}>
      <LoginPage />
    </Suspense>
  )
}

export default LoginRoute
