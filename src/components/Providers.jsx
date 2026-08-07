'use client'

import { FormProvider } from '@/context/FormContext'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/components/ThemeProvider'

export function Providers({ children }) {
  return (
    // Theme sits outermost: it only touches the <html> class and has no
    // dependency on auth or form state, but everything below it renders
    // against the tokens it selects.
    <ThemeProvider>
      <AuthProvider>
        <FormProvider>{children}</FormProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
