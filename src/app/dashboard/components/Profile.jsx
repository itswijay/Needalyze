'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronDown } from "lucide-react";
import DeleteAccountVerify from './DeleteAccountVerify'

const Profile = ({ open, onOpenChange }) => {

  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [phone_number, setPhoneNumber] = useState('')
  const [branch, setBranch] = useState('')
  const [position, setPosition] = useState('')
  const [isDelVerifyOpen, setIsDelVerifyOpen] = useState(false)
  const [showBranchDropdown, setShowBranchDropdown] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);

  const branches = ['Warakapola'];
  const positions = ['Branch Manager','Team Leader','Advisor'];


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowBranchDropdown(false)
        setShowPositionDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  
  // For Future Work
  const handleSubmit = () => {
    
  }



  return (
  <>
    <DeleteAccountVerify open={isDelVerifyOpen} onOpenChange={setIsDelVerifyOpen} />

    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] sm:w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
        
        <DialogHeader>
          <DialogTitle>Edit Your Details</DialogTitle>
        </DialogHeader>

           {/* First Name*/}
          <div className="flex flex-col sm:flex-row gap-4 py-2">
            <div className="flex-1 grid gap-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                placeholder="Enter first name"
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-full"
              />
            </div>
 
            {/* Last Name */}
            <div className="flex-1 grid gap-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                placeholder="Enter last name"
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-full"
              />
            </div>
          </div>

          {/* phone number */}
          <div className="grid gap-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              placeholder="Enter phone number"
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="rounded-full"
            />
          </div>

 
          {/* Select Branch */}
          <div className="grid gap-2 relative dropdown-container">
            <Label htmlFor="branch" className="text-sm font-medium text-gray-700">
              Branch
            </Label>

            <div
              className="w-full rounded-full border border-gray-300 py-2 px-3 text-sm text-left cursor-pointer flex items-center justify-between bg-white"
              onClick={() => setShowBranchDropdown(!showBranchDropdown)}
            >
              <span className={selectedBranch ? 'text-gray-900' : 'text-gray-500'}>
                {selectedBranch || 'Select Branch'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  showBranchDropdown ? 'rotate-180' : ''
                }`}
              />
            </div>

            {showBranchDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto mt-1">
                {selectedBranch && (
                  <div
                    className="px-4 py-2 hover:bg-red-50 text-red-600 text-sm cursor-pointer border-b border-gray-200"
                    onClick={() => {
                      setSelectedBranch('')
                      setBranch('')
                      setShowBranchDropdown(false)
                    }}
                  >
                    ✕ Clear Selection
                  </div>
                )}
                {branches.map((b) => (
                  <div
                    key={b}
                    className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
                    onClick={() => {
                      setSelectedBranch(b)
                      setBranch(b)
                      setShowBranchDropdown(false)
                    }}
                  >
                    {b}
                  </div>
                ))}
              </div>
            )}
          </div>


          {/* Select Position */}
          <div className="grid gap-2 relative dropdown-container">
            <Label htmlFor="position" className="text-sm font-medium text-gray-700">
              Position
            </Label>

            <div
              className="w-full rounded-full border border-gray-300 py-2 px-3 text-sm text-left cursor-pointer flex items-center justify-between bg-white"
              onClick={() => setShowPositionDropdown(!showPositionDropdown)}
            >
              <span className={position ? 'text-gray-900' : 'text-gray-500'}>
                {position || 'Select Position'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-gray-500 transition-transform ${
                  showPositionDropdown ? 'rotate-180' : ''
                }`}
              />
            </div>

            {showPositionDropdown && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto mt-1">
                {position && (
                  <div
                    className="px-4 py-2 hover:bg-red-50 text-red-600 text-sm cursor-pointer border-b border-gray-200"
                    onClick={() => {
                      setPosition('')
                      setShowPositionDropdown(false)
                    }}
                  >
                    ✕ Clear Selection
                  </div>
                )}
                {positions.map((p) => (
                  <div
                    key={p}
                    className="px-4 py-2 hover:bg-gray-100 text-gray-700 text-sm cursor-pointer"
                    onClick={() => {
                      setPosition(p)
                      setShowPositionDropdown(false)
                    }}
                  >
                    {p}
                  </div>
                ))}
              </div>
            )}
          </div>

          
          {/* save details or delete account */}
          <div className='flex flex-col pt-4'>

            <div className='flex justify-end'>
              <Button onClick={handleSubmit} className="bg-sky-800 hover:bg-sky-700">Save your details</Button>
            </div>

            <div className='mt-5'>
              <Label className="text-base text-red-600">Delete Account</Label>

              <hr className="border-t border-gray-300" />

              <p className='text-xs mt-2'>
               Delete Account, your account will be scheduled for permanent deletion. You can recover your account within 7 days
              </p>

              <div className='flex'>
                <Button onClick={() => setIsDelVerifyOpen(true)} className="bg-red-600 hover:bg-red-800 mt-2">Delete account</Button>
              </div>

            </div>
          </div>
      </DialogContent>
    </Dialog>

  </>
  )
}

export default Profile
