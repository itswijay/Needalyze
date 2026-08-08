'use client'

import toast from 'react-hot-toast'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Eye, EyeOff } from 'lucide-react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { SelectField } from '@/components/ui/select-field'
import { AuthShell } from '@/components/AuthShell'
import { FullScreenLoader } from '@/components/FullScreenLoader'
import { apiClient } from '@/infrastructure/http/apiClient'
import { registerSchema } from '@/application/validation/auth'
import { BRANCH_OPTIONS } from '@/domain/constants/branches'
import {
  POSITION_OPTIONS,
  requiresCodeNumber,
} from '@/domain/constants/positions'
import { useAuth } from '@/context/AuthContext'
import { useMotion } from '@/lib/motion'

/** Show/hide control sitting inside a password field. */
const PasswordToggle = ({ shown, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={shown ? 'Hide password' : 'Show password'}
    className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
  >
    {shown ? <Eye size={18} /> : <EyeOff size={18} />}
  </button>
)

export default function Register() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const m = useMotion()

  // React Hook Form with Zod - MUST be called before any early returns
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      branch: '',
      position: '',
      regCode: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // Drives the conditional code-number field. Watching the form is what makes
  // the two dropdowns plain controlled fields — they previously each kept a
  // second copy of their value in component state purely to answer this.
  const selectedPosition = watch('position')

  const handleValidationErrors = (validationErrors) => {
    Object.values(validationErrors).forEach((err) => {
      toast.error(err.message)
    })
  }

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, router])

  // Show loading state while checking authentication or if already authenticated
  if (authLoading || isAuthenticated) {
    return (
      <FullScreenLoader
        brand
        message={isAuthenticated ? 'Redirecting to dashboard…' : 'Loading…'}
      />
    )
  }

  // handleSubmit with react-hook-form
  const onSubmit = async (data) => {
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // The browser is never signed in during registration now: the account is
      // created server-side, so there is no session to immediately sign out of.
      await apiClient.post('/api/auth/register', data, { auth: false })

      setSuccessMessage(
        'Registration successful! Please check your email to verify your account. After email verification, your account will be pending admin approval.'
      )

      reset()

      setTimeout(() => {
        router.push('/login')
      }, 5000)
    } catch (error) {
      setErrorMessage(error.message || 'Registration failed. Please try again.')
      toast.error(error.message || 'Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join Needalyze to start analysing customer needs"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-brand-foreground transition-colors hover:text-brand-foreground-muted"
          >
            Login
          </Link>
        </p>
      }
    >
      <AnimatePresence initial={false}>
        {successMessage && (
          <Alert variant="success" className="mb-5">
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert variant="error" className="mb-5">
            {errorMessage}
          </Alert>
        )}
      </AnimatePresence>

      <motion.form
        onSubmit={handleSubmit(onSubmit, handleValidationErrors)}
        noValidate
        variants={m.stagger(0.04, 0.05)}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <motion.div variants={m.fadeInUp} className="flex flex-col gap-4 sm:flex-row">
          <Input
            type="text"
            placeholder="First name"
            autoComplete="given-name"
            aria-invalid={Boolean(errors.firstName)}
            {...register('firstName')}
          />
          <Input
            type="text"
            placeholder="Last name"
            autoComplete="family-name"
            aria-invalid={Boolean(errors.lastName)}
            {...register('lastName')}
          />
        </motion.div>

        <motion.div variants={m.fadeInUp}>
          <Input
            type="tel"
            placeholder="Phone number"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phoneNumber)}
            {...register('phoneNumber')}
          />
        </motion.div>

        <motion.div variants={m.fadeInUp}>
          <Controller
            control={control}
            name="branch"
            render={({ field }) => (
              <SelectField
                value={field.value}
                onChange={field.onChange}
                options={BRANCH_OPTIONS}
                placeholder="Select branch"
                invalid={Boolean(errors.branch)}
              />
            )}
          />
        </motion.div>

        <motion.div variants={m.fadeInUp}>
          <Controller
            control={control}
            name="position"
            render={({ field }) => (
              <SelectField
                value={field.value}
                onChange={field.onChange}
                options={POSITION_OPTIONS}
                placeholder="Select position"
                invalid={Boolean(errors.position)}
              />
            )}
          />
        </motion.div>

        {/* Code number, for the positions that require one. */}
        <AnimatePresence initial={false}>
          {requiresCodeNumber(selectedPosition) && (
            <motion.div
              key="regCode"
              variants={m.collapse}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="overflow-hidden"
            >
              <Input
                type="text"
                placeholder="Code number"
                aria-invalid={Boolean(errors.regCode)}
                {...register('regCode')}
              />
            </motion.div>
          )}
        </AnimatePresence>

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
            autoComplete="new-password"
            className="pr-12"
            aria-invalid={Boolean(errors.password)}
            {...register('password')}
          />
          <PasswordToggle
            shown={showPassword}
            onToggle={() => setShowPassword((shown) => !shown)}
          />
        </motion.div>

        <motion.div variants={m.fadeInUp} className="relative">
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm password"
            autoComplete="new-password"
            className="pr-12"
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register('confirmPassword')}
          />
          <PasswordToggle
            shown={showConfirmPassword}
            onToggle={() => setShowConfirmPassword((shown) => !shown)}
          />
        </motion.div>

        <motion.div variants={m.fadeInUp} className="pt-1">
          <Button
            type="submit"
            variant="brand"
            size="lg"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Spinner className="size-4" />
                Registering…
              </>
            ) : (
              'Register'
            )}
          </Button>
        </motion.div>
      </motion.form>
    </AuthShell>
  )
}
