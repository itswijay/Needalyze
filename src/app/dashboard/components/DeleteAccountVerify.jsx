'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { deleteUserAccount } from '@/lib/auth'
import { useAuth } from '@/context/AuthContext'

const DeleteAccountVerify = ({ open, onOpenChange }) => {
  const router = useRouter()
  const { user } = useAuth()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleConfirmDelete = async () => {
    if (!user?.id) {
      setError('User information not found')
      return
    }

    try {
      setIsDeleting(true)
      setError('')

      // Call delete account function
      const { success, error: deleteError } = await deleteUserAccount(user.id)

      if (!success) {
        setError(deleteError || 'Failed to delete account')
        return
      }

      // Account deleted successfully
      // Redirect to login page
      router.push('/login')
    } catch (err) {
      console.error('Delete account error:', err)
      setError('An error occurred while deleting your account')
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
      <DialogContent className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-3xl mx-auto px-2 sm:px-4 md:px-6">
        <DialogHeader>
          <DialogTitle className="text-left mx-4">Delete account</DialogTitle>
          <DialogDescription className="text-left mx-4">
            Are you sure you want to delete your account? This action cannot be
            undone, but your account can be recovered within 7 days.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="mx-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        <DialogFooter className="flex justify-end gap-2 mt-4 mx-2 flex-row">
          <Button variant="ghost" onClick={handleCancel} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleConfirmDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Deleting...
              </>
            ) : (
              'Confirm Delete'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAccountVerify
