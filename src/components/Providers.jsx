'use client'

import { FormProvider } from '@/context/FormContext'

export function Providers({ children }) {
  return <FormProvider>{children}</FormProvider>
}
