'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const page = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
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
            <div className="md:hidden">
              <h1 className="text-center text-2xl font-bold text-primary-900 mb-4 mt-2">
                LOGIN
              </h1>
              <form onSubmit={handleLogin} className="space-y-4 mx-4">
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
                </div>
                <div>
                  <Input
                    className="rounded-full placeholder:text-xs p-5 bg-gray-200 border-0"
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <Button className="w-full rounded-full p-5 bg-primary-900 hover:bg-primary-800 text-white font-semibold">
                  Login
                </Button>
                <div>
                  <Link
                    href="#"
                    className="w-full block text-primary-900 hover:text-primary-700 text-sm font-semibold text-center mt-4"
                  >
                    Foget Password
                  </Link>
                  <p className="text-center text-primary-900 text-sm mt-2">
                    Don't have account?{' '}
                    <Link
                      href="#"
                      className="text-primary-900 hover:text-primary-700 font-semibold inline"
                    >
                      Signup here
                    </Link>
                  </p>
                </div>
              </form>
            </div>

            {/* Desktop Login Card */}
            <Card className="hidden md:block shadow-sm">
              <CardHeader>
                <CardTitle className="text-center text-2xl">Login</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin}>
                  <div>
                    <Input
                      className="rounded-full placeholder:text-xs p-5 my-4"
                      id="email-desktop"
                      type="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div>
                    <Input
                      className="mb-4 rounded-full placeholder:text-xs p-5"
                      id="password-desktop"
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      required
                    />
                  </div>
                  <Button className="w-full rounded-full p-5">Login</Button>
                  <Link
                    href="#"
                    className="w-full block text-primary-600 hover:text-primary-400 text-xs font-semibold text-center mt-4 mb-2"
                  >
                    Foget Password
                  </Link>
                  <p className="text-center text-primary-600 text-xs mt-2">
                    Don't have account?{' '}
                    <Link
                      href="#"
                      className="text-primary-400 hover:text-primary-200 font-semibold inline"
                    >
                      Signup here
                    </Link>
                  </p>
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
