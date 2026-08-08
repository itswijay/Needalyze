'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Alert } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { AuthShell } from '@/components/AuthShell'
import { forgotPasswordSchema } from '@/application/validation/auth'
import { useAuth } from '@/context/AuthContext'
import { useMotion } from '@/lib/motion'

const ForgetPasswordPage = () => {
  const { requestPasswordReset } = useAuth()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const m = useMotion()

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
      email: '',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)

    const result = await requestPasswordReset(data.email)

    setLoading(false)

    if (!result.success) {
      toast.error(
        result.error || 'Could not send the reset link. Please try again.'
      )
      return
    }

    // Deliberately the same outcome whether or not the address is registered —
    // a different message here would tell anyone who asks which email addresses
    // have accounts.
    reset()
    setSent(true)
  }

  return (
    <AuthShell
      title="Forgot password"
      subtitle="We'll email you a link to choose a new one"
      footer={
        <p className="text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-semibold text-brand-foreground transition-colors hover:text-brand-foreground-muted"
          >
            Back to login
          </Link>
        </p>
      }
    >
      <AnimatePresence initial={false}>
        {sent && (
          <Alert variant="info" className="mb-5">
            If an account exists for that address, we&apos;ve sent a link to
            reset the password. The link expires in one hour.
          </Alert>
        )}
      </AnimatePresence>

      <motion.form
        onSubmit={handleSubmit(onSubmit)}
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
          {errors.email && (
            <p className="mt-1.5 ml-4 text-xs text-destructive">
              {errors.email.message}
            </p>
          )}
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
                Sending…
              </>
            ) : (
              'Send reset link'
            )}
          </Button>
        </motion.div>
      </motion.form>
    </AuthShell>
  )
}

export default ForgetPasswordPage
