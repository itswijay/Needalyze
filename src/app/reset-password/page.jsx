'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { AuthShell } from '@/components/AuthShell'
import { resetPasswordSchema } from '@/application/validation/auth'
import { useAuth } from '@/context/AuthContext'
import { useMotion } from '@/lib/motion'

/**
 * Where the emailed reset link lands.
 *
 * The browser Supabase client has `detectSessionInUrl: true`, so by the time
 * this renders it has already traded the token in the URL for a short-lived
 * recovery session. That session is the authorisation to set a new password —
 * which is why the page's first job is to check whether one exists, and say so
 * plainly if it does not, rather than showing a form that cannot work.
 */
export default function ResetPasswordPage() {
  const router = useRouter()
  const { user, loading: authLoading, updatePassword, signOut } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const m = useMotion()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onSubmit',
    defaultValues: { password: '', confirmPassword: '' },
  })

  const hasRecoverySession = Boolean(user)

  useEffect(() => {
    if (!authLoading && !hasRecoverySession) {
      toast.error('This reset link is no longer valid.')
    }
  }, [authLoading, hasRecoverySession])

  const onSubmit = async (data) => {
    setIsSaving(true)
    const result = await updatePassword(data.password)

    if (!result.success) {
      setIsSaving(false)
      toast.error(result.error || 'Could not update your password.')
      return
    }

    // Sign the recovery session out so the new password has to be used, rather
    // than leaving the browser authenticated off the back of an email link.
    await signOut()
    toast.success('Password updated. Please log in.')
    router.push('/login')
  }

  const onError = (validationErrors) => {
    Object.values(validationErrors).forEach((error) => {
      if (error?.message) toast.error(error.message)
    })
  }

  const showErrors = (field) =>
    errors[field] && (
      <p className="mt-1.5 ml-4 text-xs text-destructive">
        {errors[field].message}
      </p>
    )

  // Which of the three states the card is showing. Naming it makes the
  // AnimatePresence key below obvious, and keeps the branch order in one place.
  const state = authLoading
    ? 'checking'
    : hasRecoverySession
      ? 'form'
      : 'expired'

  return (
    <AuthShell title="Choose a new password">
      <AnimatePresence mode="wait" initial={false}>
        {state === 'checking' && (
          <motion.div
            key="checking"
            variants={m.fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center gap-3 py-8"
          >
            <Spinner className="size-8 text-primary-300" />
            <p className="text-sm text-muted-foreground">Checking your link…</p>
          </motion.div>
        )}

        {state === 'expired' && (
          <motion.div
            key="expired"
            variants={m.fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="py-4 text-center"
          >
            <p className="text-sm text-muted-foreground">
              This reset link has expired or has already been used. Reset links
              are valid for one hour.
            </p>
            <Button asChild variant="brand" size="lg" className="mt-6 w-full">
              <Link href="/forget-password">Request a new link</Link>
            </Button>
          </motion.div>
        )}

        {state === 'form' && (
          <motion.form
            key="form"
            onSubmit={handleSubmit(onSubmit, onError)}
            noValidate
            variants={m.fadeIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-4"
          >
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                autoComplete="new-password"
                className="pr-12"
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((shown) => !shown)}
                className="absolute top-1/2 right-4 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              {showErrors('password')}
            </div>

            <div>
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm new password"
                autoComplete="new-password"
                aria-invalid={Boolean(errors.confirmPassword)}
                {...register('confirmPassword')}
              />
              {showErrors('confirmPassword')}
            </div>

            <Button
              type="submit"
              variant="brand"
              size="lg"
              disabled={isSaving}
              className="w-full"
            >
              {isSaving ? (
                <>
                  <Spinner className="size-4" />
                  Updating…
                </>
              ) : (
                'Update password'
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </AuthShell>
  )
}
