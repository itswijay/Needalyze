'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const page = () => {
  const router = useRouter()
  const { isAuthenticated, isApproved, loading } = useAuth()

  useEffect(() => {
    // Redirect authenticated and approved users to dashboard
    if (!loading && isAuthenticated && isApproved) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, isApproved, loading, router])

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)]">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  // Don't show landing page if user is authenticated (will redirect)
  if (isAuthenticated && isApproved) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)]">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  // Show landing page for non-authenticated users
  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)]">
      <div className="md:relative flex flex-col justify-center items-center">
        <Image
          src="/images/logos/white-t.png"
          width={275}
          height={275}
          alt="Needalyze-Logo"
          className="md:absolute md:top-0 top-1 w-[180px]  md:w-[260px] h-auto"
          priority
        />

        <p className=" text-white/70 md:text-xs md:max-w-2xl md:mx-auto  md:mt-54 md:mb-1 md:leading-relaxed hidden sm:block text-center">
          Needalyze makes insurance planning easier for both advisors and
          customers. By digitalizing the need analysis process, it enables
          smart, data-driven recommendations and seamless collaboration -
          anytime, anywhere.
        </p>

        <Link href="/login">
          <Button className="md:mt-8 rounded-full   px-3.5 py-0  mt-0 md:px-5 md:py-1 text-black text-sm bg-[#F2F6FA] hover:bg-[#dcdee0] cursor-pointer">
            Get Started
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default page
