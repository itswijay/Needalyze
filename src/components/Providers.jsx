'use client'

import { FormProvider } from '@/context/FormContext'
import { AuthProvider } from '@/context/AuthContext'

export function Providers({ children }) {
  return (
    <AuthProvider>
      <FormProvider>{children}</FormProvider>
    </AuthProvider>
  )
}
