'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Link2, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Spinner } from '@/components/ui/spinner'
import WhatsappButton from './WhatsappButton'
import { useAuthContext } from '@/context/AuthContext'
import { DEFAULT_LINK_EXPIRY_HOURS } from '@/domain/constants/formStatus'
import { useMotion } from '@/lib/motion'

const CreateLinkDialog = () => {
  const [link, setLink] = useState('')
  const [copied, setCopied] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [linkCreated, setLinkCreated] = useState(false)
  const { session } = useAuthContext()
  const m = useMotion()

  const createNewLink = async () => {
    if (!session?.access_token) {
      toast.error('You must be logged in to create a link.')
      return
    }

    setIsCreating(true)
    try {
      const response = await fetch('/api/form-link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          // The expiry was written here as a bare `24*14`; the constant that
          // names it already existed in the domain layer.
          expiry_hours: DEFAULT_LINK_EXPIRY_HOURS,
        }),
      })

      const result = await response.json()

      if (result.success) {
        setLink(result.formUrl)
        setLinkCreated(true)
      } else {
        console.error('Failed to create link:', result.error)
        toast.error(result.error || 'Failed to create link. Please try again.')
      }
    } catch (error) {
      console.error('Error creating link:', error)
      toast.error('Error creating link. Please try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const resetDialog = () => {
    setLink('')
    setCopied(false)
    setLinkCreated(false)
  }

  const handleCopy = () => {
    navigator.clipboard
      .writeText(link)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  return (
    <Dialog onOpenChange={(open) => !open && resetDialog()}>
      <DialogTrigger asChild>
        <Button variant="accent" className="gap-2">
          <Plus className="size-4" />
          Create New Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create link</DialogTitle>
          <DialogDescription>
            {!linkCreated
              ? 'Generate a form link to share with a customer. It stays valid for 14 days.'
              : 'Copy this link to share with others.'}
          </DialogDescription>
        </DialogHeader>

        {/* mode="wait" so the created state does not overlap the button it
            replaces while the dialog is only a few hundred pixels tall. */}
        <AnimatePresence mode="wait" initial={false}>
          {!linkCreated ? (
            <motion.div
              key="create"
              variants={m.fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="flex justify-center py-4"
            >
              <Button onClick={createNewLink} disabled={isCreating} variant="accent">
                {isCreating ? (
                  <>
                    <Spinner className="size-4" />
                    Creating…
                  </>
                ) : (
                  <>
                    <Link2 className="size-4" />
                    Create New Link
                  </>
                )}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="created"
              variants={m.fadeIn}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="link" className="sr-only">
                  Link
                </Label>
                <Input id="link" value={link} readOnly className="text-xs" />
              </div>

              <DialogFooter>
                <div className="flex w-full items-center justify-end gap-1">
                  <WhatsappButton link={link} />
                  <Button type="button" variant="accent" onClick={handleCopy}>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.span
                        key={copied ? 'copied' : 'copy'}
                        initial={{ opacity: 0, scale: m.reduce ? 1 : 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: m.reduce ? 1 : 0.8 }}
                        transition={{ duration: m.duration(0.15) }}
                        className="inline-flex items-center gap-2"
                      >
                        {copied ? (
                          <>
                            <Check className="size-4" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy className="size-4" />
                            Copy Link
                          </>
                        )}
                      </motion.span>
                    </AnimatePresence>
                  </Button>
                </div>
              </DialogFooter>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  )
}

export default CreateLinkDialog
