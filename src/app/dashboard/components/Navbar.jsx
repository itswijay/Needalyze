'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useState } from 'react'
import Profile from './Profile' // import Profile 


const Navbar = () => {
  const router = useRouter()
  const { userProfile, signOut, loading } = useAuth()
  const [isProfileOpen, setIsProfileOpen] = useState(false) // useState for Profile

  const handleSignOut = async () => {
    const { success } = await signOut()
    if (success) {
      router.push('/login')
    }
  }

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!userProfile) return 'U'
    const firstInitial = userProfile.first_name?.[0] || ''
    const lastInitial = userProfile.last_name?.[0] || ''
    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  return (
    <div className="">
      <ul className="flex justify-between items-center border-b p-5 border-gray-100">
        <li className="flex ">
          <Image
            src="/images/logos/main_favicon.png"
            width="25"
            height="25"
            alt="Needalyze-Logo"
            priority
          />
          <span className="text-lg font-semibold ml-2">Needalyze</span>
        </li>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <li>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </li>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold">
                  {userProfile?.first_name} {userProfile?.last_name}
                </span>
                <span className="text-xs font-normal text-gray-500">
                  {userProfile?.position}
                </span>
                <span className="text-xs font-normal text-gray-500">
                  {userProfile?.branch}
                </span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            {/* Clicking this opens Profile dialog */}
            <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onSelect={handleSignOut}
              className="text-red-600 focus:text-red-600 cursor-pointer"
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ul>

      {/* Profile Dialog Mounted Here */}
      <Profile open={isProfileOpen} onOpenChange={setIsProfileOpen} />
    
    </div>
  )
}

export default Navbar
