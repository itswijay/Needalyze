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
import { useEffect, useState } from 'react'
import Profile from './Profile'
import { Button } from '@/components/ui/button'
import ApproveUser from './ApproveUser'
import { Users } from 'lucide-react'
import { usePendingUsers } from '@/hooks/usePendingUsers'
import { fullName, initials } from '@/domain/entities/userProfile'

const Navbar = () => {
  const router = useRouter()
  const { userProfile, isAdmin, signOut } = useAuth()

  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isApproveUserOpen, setIsApproveUserOpen] = useState(false)
  const { pendingCount, refreshCount } = usePendingUsers({ enabled: isAdmin })

  useEffect(() => {
    refreshCount()
  }, [refreshCount])

  const handleSignOut = async () => {
    const { success } = await signOut()
    if (success) {
      router.push('/login')
    }
  }

  const getUserInitials = () => initials(userProfile)

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
          <span className="text-lg font-semibold ml-2 text-[#2265d0]">
            Needalyze
          </span>
        </li>

        {/* --- Center: Pending Approvals Button (admins only) --- */}
        {isAdmin && (
          <li className="flex-grow flex justify-end mr-1 md:mr-5">
            {/* Mobile Button */}
            <Button
              onClick={() => setIsApproveUserOpen(true)}
              className="md:hidden bg-transparent rounded-full text-[#2265d0] mb-1"
            >
              <div className="w-6 h-24 flex items-center justify-center">
                <Users
                  style={{ width: '25px', height: '25px' }}
                  strokeWidth={1.5}
                />
              </div>
            </Button>

            {/* Desktop Button */}
            <Button
              onClick={() => setIsApproveUserOpen(true)}
              className="hidden md:inline bg-gradient-to-r from-[#2265d0] to-[#2265d0] px-5 py-2 rounded-full text-white text-sm"
            >
              Pending Approvals ({pendingCount})
            </Button>
          </li>
        )}

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
                    {fullName(userProfile)}
                  </span>
                  <span className="text-xs text-gray-500">
                    {userProfile?.position}
                  </span>
                  <span className="text-xs text-gray-500">
                    {userProfile?.branch}
                  </span>
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

      {/* --- Approve User Dialog (admins only) --- */}
      {isAdmin && (
        <ApproveUser
          open={isApproveUserOpen}
          onOpenChange={(open) => {
            setIsApproveUserOpen(open)
            if (!open) refreshCount()
          }}
          onChange={refreshCount}
        />
      )}
    </div>
  )
}

export default Navbar
