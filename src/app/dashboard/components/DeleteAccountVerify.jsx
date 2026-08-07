'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { Alert } from '@/components/ui/alert'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { apiClient } from '@/infrastructure/http/apiClient'
import { useAuth } from '@/context/AuthContext'

const DeleteAccountVerify = ({ open, onOpenChange }) => {
  const router = useRouter()
  const { signOut } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleConfirmDelete = async () => {
    try {
      setIsDeleting(true)
      setError('')

      // The account to delete is whoever the request is authenticated as; the
      // browser no longer passes a user id for the server to trust.
      await apiClient.delete('/api/me')

      await signOut()
      router.push('/login')
    } catch (err) {
      console.error('Delete account error:', err)
      setError(err.message || 'An error occurred while deleting your account')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setError('')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-left text-destructive">Delete account</DialogTitle>
          <DialogDescription className="text-left">
            Are you sure you want to delete your account? This action cannot be
            undone, but your account can be recovered within 7 days.
          </DialogDescription>
        </DialogHeader>

        <AnimatePresence initial={false}>
          {error && <Alert variant="error">{error}</Alert>}
        </AnimatePresence>

        <DialogFooter className="mt-2 flex-row justify-end gap-2">
          <Button variant="ghost" onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner className="size-4" />
                Deleting…
              </>
            ) : (
              'Confirm delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAccountVerify
