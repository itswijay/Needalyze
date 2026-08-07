'use client'

import { MotionConfig } from 'framer-motion'

import { FormProvider } from '@/context/FormContext'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/components/ThemeProvider'

export function Providers({ children }) {
  return (
    // Theme sits outermost: it only touches the <html> class and has no
    // dependency on auth or form state, but everything below it renders
    // against the tokens it selects.
    <ThemeProvider>
      {/* reducedMotion="user" makes Framer skip transform animations for
          anyone who has asked their OS for reduced motion, independently of
          the variant values in lib/motion.js. Opacity is left alone: a fade
          is not what causes discomfort, movement is. */}
      <MotionConfig reducedMotion="user">
        <AuthProvider>
          <FormProvider>{children}</FormProvider>
        </AuthProvider>
      </MotionConfig>
    </ThemeProvider>
  )
}
