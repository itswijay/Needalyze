'use client'

import { useCallback, useEffect, useState } from 'react'
import { AnimatePresence } from 'framer-motion'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { SelectField } from '@/components/ui/select-field'
import { apiClient } from '@/infrastructure/http/apiClient'
import { BRANCH_OPTIONS } from '@/domain/constants/branches'
import { POSITION_OPTIONS } from '@/domain/constants/positions'
import { useAuth } from '@/context/AuthContext'
import DeleteAccountVerify from './DeleteAccountVerify'

const Profile = ({ open, onOpenChange }) => {
  const { refreshUserProfile } = useAuth()
  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [phone_number, setPhoneNumber] = useState('')
  const [branch, setBranch] = useState('')
  const [position, setPosition] = useState('')
  const [isDelVerifyOpen, setIsDelVerifyOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoading(true)
      setError('')

      const { profile } = await apiClient.get('/api/me')

      setFirstName(profile.firstName || '')
      setLastName(profile.lastName || '')
      setPhoneNumber(profile.phoneNumber || '')
      setBranch(profile.branch || '')
      setPosition(profile.position || '')
    } catch (err) {
      setError(err.message || 'Failed to fetch profile data')
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch user profile on dialog open
  useEffect(() => {
    if (open) {
      fetchUserProfile()
    }
  }, [open, fetchUserProfile])

  const handleSubmit = async () => {
    try {
      setIsSaving(true)
      setError('')
      setSuccessMessage('')

      // Shape and format are validated server-side against the same schema the
      // registration form uses, so a malformed phone number is rejected here
      // too rather than only being checked for emptiness.
      await apiClient.patch('/api/me', {
        firstName: first_name,
        lastName: last_name,
        phoneNumber: phone_number,
        branch,
        position,
      })

      setSuccessMessage('Profile updated successfully!')

      // Refresh user profile in context to update navbar
      await refreshUserProfile()

      setTimeout(() => {
        setSuccessMessage('')
        onOpenChange(false)
      }, 800)
    } catch (err) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <DeleteAccountVerify
        open={isDelVerifyOpen}
        onOpenChange={setIsDelVerifyOpen}
      />

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit your details</DialogTitle>
            <DialogDescription>
              Update your profile information including name, phone number,
              branch, and position.
            </DialogDescription>
          </DialogHeader>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-10">
              <Spinner className="size-8 text-brand-foreground" />
              <p className="text-sm text-muted-foreground">
                Loading your profile…
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {error && <Alert variant="error">{error}</Alert>}
                {successMessage && (
                  <Alert variant="success">{successMessage}</Alert>
                )}
              </AnimatePresence>

              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="grid flex-1 gap-2">
                  <Label htmlFor="first_name">First name</Label>
                  <Input
                    id="first_name"
                    placeholder="Enter first name"
                    value={first_name}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>

                <div className="grid flex-1 gap-2">
                  <Label htmlFor="last_name">Last name</Label>
                  <Input
                    id="last_name"
                    placeholder="Enter last name"
                    value={last_name}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="phone_number">Phone number</Label>
                <Input
                  id="phone_number"
                  placeholder="Enter phone number"
                  value={phone_number}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="branch">Branch</Label>
                {/* Two hand-rolled dropdowns used to live here, each with its
                    own open flag and a document-level mousedown listener; the
                    branch one also kept a second copy of its value in state. */}
                <SelectField
                  id="branch"
                  value={branch}
                  onChange={setBranch}
                  options={BRANCH_OPTIONS}
                  placeholder="Select branch"
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="position">Position</Label>
                <SelectField
                  id="position"
                  value={position}
                  onChange={setPosition}
                  options={POSITION_OPTIONS}
                  placeholder="Select position"
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  onClick={handleSubmit}
                  disabled={isSaving || isLoading}
                  variant="brand"
                >
                  {isSaving ? (
                    <>
                      <Spinner className="size-4" />
                      Saving…
                    </>
                  ) : (
                    'Save your details'
                  )}
                </Button>
              </div>

              {/* Danger zone, visually separated from the rest of the form so
                  a destructive action cannot be mistaken for a routine one. */}
              <section className="mt-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
                <h3 className="text-sm font-semibold text-destructive">
                  Delete account
                </h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                  Your account will be scheduled for permanent deletion. You can
                  recover it within 7 days.
                </p>
                <Button
                  onClick={() => setIsDelVerifyOpen(true)}
                  variant="destructive"
                  size="sm"
                  className="mt-3"
                >
                  Delete account
                </Button>
              </section>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Profile
