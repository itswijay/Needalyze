'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { FullScreenLoader } from '@/components/FullScreenLoader'
import { useAuth } from '@/context/AuthContext'
import { useMotion } from '@/lib/motion'

const HomePage = () => {
  const router = useRouter()
  const { isAuthenticated, isApproved, loading } = useAuth()
  const m = useMotion()

  useEffect(() => {
    // Redirect authenticated and approved users to dashboard
    if (!loading && isAuthenticated && isApproved) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isApproved, loading, router])

  if (loading) {
    return <FullScreenLoader brand message="Loading…" />
  }

  // Don't show landing page if user is authenticated (will redirect)
  if (isAuthenticated && isApproved) {
    return <FullScreenLoader brand message="Redirecting to dashboard…" />
  }

  // Show landing page for non-authenticated users
  return (
    <main className="bg-gradient-brand relative flex min-h-dvh w-full items-center justify-center overflow-hidden px-6">
      {/* Decorative depth. Drifts slowly, and not at all under reduced motion. */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 size-[28rem] rounded-full bg-primary-200/20 blur-3xl"
        animate={m.reduce ? undefined : { y: [0, 30, 0], x: [0, 18, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -bottom-32 size-[28rem] rounded-full bg-info-300/10 blur-3xl"
        animate={m.reduce ? undefined : { y: [0, -26, 0], x: [0, -20, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div
        variants={m.stagger(0.12)}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center"
      >
        <motion.div variants={m.fadeInUp}>
          <Image
            src="/images/logos/white-t.png"
            width={275}
            height={275}
            alt="Needalyze"
            className="h-auto w-[190px] md:w-[280px]"
            priority
          />
        </motion.div>

        <motion.p
          variants={m.fadeInUp}
          className="mt-6 max-w-2xl text-sm leading-relaxed text-white/65 md:text-base"
        >
          Needalyze makes insurance planning easier for both advisors and
          customers. By digitalizing the need analysis process, it enables
          smart, data-driven recommendations and seamless collaboration —
          anytime, anywhere.
        </motion.p>

        <motion.div variants={m.fadeInUp} className="mt-10">
          <Button
            asChild
            size="lg"
            className="group bg-base-white text-primary-700 shadow-xl hover:bg-gray-50 hover:text-primary-800"
          >
            <Link href="/login">
              Get Started
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </motion.div>
    </main>
  )
}

export default HomePage
