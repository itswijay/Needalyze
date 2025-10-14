'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@radix-ui/react-label'
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
      <div className="w-full min-h-screen flex">
        <div className="w-1/2 bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)] flex flex-col justify-center items-center">
          <Image
            src="/images/logos/white-t.png"
            width="260"
            height="260"
            alt="Needalyze-Logo"
            priority
          />
          {/* <p className='text-white text-justify px-22 text-sm'>
            Needalyze makes insurance planning easier for both advisors and
            customers. By digitalizing the need analysis process, it enables
            smart, data-driven recommendations and seamless collaboration
          </p> */}
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl">Login</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div>
                  <Input
                    className="rounded-full placeholder:text-xs p-5"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Input
                    className="my-4 rounded-full placeholder:text-xs p-5"
                    id="password"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button className="w-full rounded-full p-5">Login</Button>
                <Link
                  href="#"
                  className="w-full block text-primary-600 hover:text-primary-200 text-xs font-semibold text-center mt-4 mb-2"
                >
                  Forget Password
                </Link>
                <Link
                  href="#"
                  className="w-full block text-primary-400 hover:text-primary-300 text-xs font-semibold text-center"
                >
                  Create an Account
                </Link>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default page
