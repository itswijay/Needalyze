'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { LogOut, User as UserIcon, Users } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/ThemeToggle'
import Profile from './Profile'
import ApproveUser from './ApproveUser'
import { usePendingUsers } from '@/hooks/usePendingUsers'
import { fullName, initials } from '@/domain/entities/userProfile'
import { useMotion } from '@/lib/motion'

const Navbar = () => {
  const router = useRouter()
  const { userProfile, isAdmin, signOut } = useAuth()
  const m = useMotion()

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
    <>
      {/* A <header>/<nav> pair rather than the <ul>/<li> this used to be:
          these are landmarks and controls, not a list of items. */}
      <header className="bg-surface-page/80 sticky top-0 z-30 -mx-6 border-b border-border px-6 backdrop-blur-md lg:-mx-10 lg:px-10">
        <nav className="flex items-center justify-between gap-3 py-4">
          {/* --- Left: Logo --- */}
          <div className="flex items-center gap-2">
            <Image
              src="/images/logos/main_favicon.png"
              width={26}
              height={26}
              alt=""
              priority
            />
            <span className="text-lg font-semibold tracking-tight text-brand-foreground">
              Needalyze
            </span>
          </div>

          {/* --- Right: actions --- */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {isAdmin && (
              // One responsive button rather than the two that used to be
              // rendered and hidden at opposite breakpoints.
              <Button
                onClick={() => setIsApproveUserOpen(true)}
                variant="brand"
                className="relative gap-2 px-3 sm:px-5"
              >
                <Users className="size-[18px]" strokeWidth={1.75} />
                <span className="hidden sm:inline">Pending Approvals</span>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={pendingCount}
                    initial={{ scale: m.reduce ? 1 : 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: m.reduce ? 1 : 0.5, opacity: 0 }}
                    transition={{ duration: m.duration(0.2) }}
                    className="inline-flex min-w-5 items-center justify-center rounded-full bg-white/20 px-1.5 text-xs font-semibold"
                  >
                    {pendingCount}
                  </motion.span>
                </AnimatePresence>
              </Button>
            )}

            <ThemeToggle />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* No AvatarImage: there is no avatar upload anywhere in the app.
                    This used to point at https://github.com/shadcn.png from the
                    component scaffold, which loaded fine and so showed every
                    advisor the same stranger's face while the initials below
                    never rendered. */}
                <button
                  type="button"
                  aria-label="Account menu"
                  className="cursor-pointer rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
                >
                  <Avatar className="border border-border transition-transform duration-200 hover:scale-105">
                    <AvatarFallback className="bg-surface-sunken text-sm font-semibold text-brand-foreground">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold">{fullName(userProfile)}</span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {userProfile?.position}
                    </span>
                    <span className="text-xs font-normal text-muted-foreground">
                      {userProfile?.branch}
                    </span>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem onSelect={() => setIsProfileOpen(true)}>
                  <UserIcon className="size-4" />
                  Profile
                </DropdownMenuItem>

                <DropdownMenuItem
                  onSelect={handleSignOut}
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                >
                  <LogOut className="size-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
      </header>

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
    </>
  )
}

export default Navbar
