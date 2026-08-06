'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import toast from 'react-hot-toast'
import { Eye, EyeOff } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Spinner } from '@/components/ui/spinner'
import { resetPasswordSchema } from '@/application/validation/auth'
import { useAuth } from '@/context/AuthContext'

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
      <p className="text-red-600 text-xs mt-1 ml-4">{errors[field].message}</p>
    )

  return (
    <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden">
      <div className="w-full md:w-1/2 bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)] flex flex-col justify-center items-center pt-6 pb-12 md:py-0 relative flex-shrink-0">
        <Image
          src="/images/logos/white-t.png"
          width={260}
          height={260}
          alt="Needalyze"
          priority
          className="w-32 h-32 md:w-[260px] md:h-[260px]"
        />
        <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] md:hidden">
          <svg
            className="relative block w-full h-[60px]"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"
              className="fill-gray-50"
            />
          </svg>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex justify-center items-center px-4 py-8 bg-gray-50 md:bg-white flex-1 overflow-y-auto">
        <div className="w-full max-w-sm">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl">
                Choose a new password
              </CardTitle>
            </CardHeader>
            <CardContent>
              {authLoading ? (
                <div className="flex flex-col items-center gap-3 py-8">
                  <Spinner className="w-8 h-8 text-[#0C407C]" />
                  <p className="text-gray-600 text-sm">Checking your link…</p>
                </div>
              ) : !hasRecoverySession ? (
                <div className="py-4 text-center">
                  <p className="text-sm text-gray-700">
                    This reset link has expired or has already been used. Reset
                    links are valid for one hour.
                  </p>
                  <Link href="/forget-password">
                    <Button className="w-full rounded-full p-5 mt-6">
                      Request a new link
                    </Button>
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
                  <div className="mb-4 relative">
                    <Input
                      className="rounded-full placeholder:text-xs p-5 pr-12"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="New password"
                      autoComplete="new-password"
                      {...register('password')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((shown) => !shown)}
                      className="absolute right-5 top-3 text-gray-600 hover:text-gray-900 transition-colors"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                    </button>
                    {showErrors('password')}
                  </div>

                  <div className="mb-4">
                    <Input
                      className="rounded-full placeholder:text-xs p-5"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm new password"
                      autoComplete="new-password"
                      {...register('confirmPassword')}
                    />
                    {showErrors('confirmPassword')}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSaving}
                    className="w-full rounded-full p-5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? 'Updating…' : 'Update password'}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
