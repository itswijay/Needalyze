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
import Profile from './Profile'
import { Button } from '@/components/ui/button'
import ApproveUser from './ApproveUser'

const Navbar = () => {
  const router = useRouter()
  const { userProfile, signOut } = useAuth()

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isApproveUserOpen, setIsApproveUserOpen] = useState(false)

  const handleSignOut = async () => {
    const { success } = await signOut()
    if (success) {
      router.push('/login')
    }
  }

  const getUserInitials = () => {
    if (!userProfile) return 'U'
    const firstInitial = userProfile.first_name?.[0] || ''
    const lastInitial = userProfile.last_name?.[0] || ''
    return `${firstInitial}${lastInitial}`.toUpperCase()
  }

  return (
    <div>
      <ul className="flex justify-between items-center border-b p-5 border-gray-100">
        
        {/* --- Left: Logo --- */}
        <li className="flex items-center">
          <Image
            src="/images/logos/main_favicon.png"
            width="25"
            height="25"
            alt="Needalyze-Logo"
            priority
          />
          <span className="text-lg font-semibold ml-2">Needalyze</span>
        </li>

        {/* --- Center: Pending Approvals Button --- */}
        <li className="flex-grow flex justify-end mr-5">
          <Button 
            onClick={() => setIsApproveUserOpen(true)}
            className="bg-gradient-to-r from-[#2265d0] to-[#2265d0] px-5 py-2 rounded-full text-white text-sm"
          >
            Pending Approvals (4)
          </Button>
        </li>

        {/* --- Right: Avatar Menu --- */}
        <li>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>{getUserInitials()}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent>
              <DropdownMenuLabel>
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {userProfile?.first_name} {userProfile?.last_name}
                  </span>
                  <span className="text-xs text-gray-500">{userProfile?.position}</span>
                  <span className="text-xs text-gray-500">{userProfile?.branch}</span>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem
                onSelect={handleSignOut}
                className="text-red-600 focus:text-red-600"
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </li>

      </ul>

      {/* --- Profile Dialog --- */}
      <Profile open={isProfileOpen} onOpenChange={setIsProfileOpen} />

      {/* --- Approve User Dialog --- */}
      <ApproveUser open={isApproveUserOpen} onOpenChange={setIsApproveUserOpen} />
    </div>
  )
}

export default Navbar
