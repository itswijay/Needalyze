'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import * as z from 'zod'


// Zod validation schema
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
})


const page = () => {

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error , setError] = useState('');

  const handleFogetPass = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

  // Validete email using Zod
  const result = loginSchema.safeParse({ email });

  if (!result.success) {
    console.log(result.error.errors) 
    setError(result.error.errors[0].message)
    setLoading(false)
    return
  }

    // Continue with your async logic here
      console.log('Valid email:', result.data.email)

      setLoading(false)

  }


  return (
    <>
      <div className="w-full h-screen flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-1/2 bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)] flex flex-col justify-center items-center pt-6 pb-12 md:py-0 relative flex-shrink-0">
          <Image
            src="/images/logos/white-t.png"
            width="260"
            height="260"
            alt="Needalyze-Logo"
            priority
            className="w-32 h-32 md:w-[260px] md:h-[260px]"
          />
          
        {/* Curved bottom edge - only on mobile */}
          <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0] md:hidden">
            <svg
              className="relative block w-full h-[60px]"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"
                className="fill-gray-50"
              ></path>
            </svg>
          </div>
        </div>

        <div className="w-full md:w-1/2 flex justify-center items-start px-4 py-4 md:py-0 md:justify-center md:items-center bg-gray-50 md:bg-white flex-1 overflow-y-auto">
          <div className="w-full max-w-sm">

            {/* Mobile Login Card */}
            <div className="md:hidden mt-16">
              <h1 className="text-center text-2xl font-bold text-primary-900 mb-4 mt-2">
                FORGET PASSWORD
              </h1>
              <form onSubmit={handleFogetPass} className="space-y-7 mx-4">
                <div>
                  <Input
                    className="rounded-full placeholder:text-xs p-5 bg-gray-200 border-0"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                  />
                  {error && (
                        <p className="text-red-600 text-xs mt-1 ml-4">
                          {error}
                        </p>
                  )}
                </div>

                <Button className="w-full rounded-full p-5 bg-primary-900 hover:bg-primary-800 text-white font-semibold"
                        disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify Email'}
                </Button>
                
              </form>
            </div>
        
        
          {/* Desktop Login Card */}
          <Card className="hidden md:block shadow-sm w-[400px] h-[350px]">
            <CardHeader>
              <div className='mt-7'>
                <CardTitle className="text-center text-2xl">FOGET PASSWORD</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleFogetPass}>
                <div>
                  <Input
                    className="rounded-full placeholder:text-xs p-5 mt-12 h-[50px]"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  {error && (
                        <p className="text-red-600 text-xs mt-1 ml-4">
                          {error}
                        </p>
                  )}
                </div>
                <div className='mt-5'>
                  <Button className="w-full rounded-full p-5 bg-[linear-gradient(to_right,_#24456e_30%,_#04182f_80%)] h-[50px]"
                          disabled={loading}
                  >
                  {loading ? 'Verifying...' : 'Verify Email'}</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    </>
  )
}

export default page
