'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

const DeleteAccountVerify = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
        <DialogHeader>
          <DialogTitle>Delete account</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete your account?
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="bg-red-600 hover:bg-red-800" onClick={() => {
            //call delete API then close dialog
          }}>
            Confirm
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteAccountVerify