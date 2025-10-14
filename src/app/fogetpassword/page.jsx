'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

const page = () => {
  const [email, setEmail] = useState('')

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
          <Card className='w-[400px] h-[350px]'>
            <CardHeader>
              <div className='mt-7'>
                <CardTitle className="text-center text-2xl">FOGET PASSWORD</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
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
                </div>
                <div className='mt-5'>
                  <Button className="w-full rounded-full p-5 bg-[linear-gradient(to_right,_#24456e_30%,_#04182f_80%)] h-[50px]">verify email</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}

export default page
