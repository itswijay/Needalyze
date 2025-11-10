'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const Profile = ({ open, onOpenChange }) => {

  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [phone_number, setPhoneNumber] = useState('')
  const [branch, setBranch] = useState('')
  const [position, setPosition] = useState('')

  const branches = ['Warakapola'];
  const positions = ['Branch Manager','Team Leader','Advisor'];


  const handleSubmit = () => {
    
  }

  return (

    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-4xl mx-auto px-3 sm:px-4 md:px-6">
        <DialogHeader>
          <DialogTitle>Edit Your Details</DialogTitle>
        </DialogHeader>

           {/* First & Last Name in one row */}
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

          {/* choose branch */}
          <div className="grid gap-2">
            <Label htmlFor="branch" className="text-sm font-medium text-gray-700">
              Branch
            </Label>
                <select
                  id="branch"
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="border border-gray-300 rounded-full p-1.5 text-gray-700 text-sm focus:outline-none"
                >
                  <option value="" disabled>
                    Select a branch
                  </option>
                  {branches.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
          </div>

          {/* choose position */}
          <div className="grid gap-2">
            <Label htmlFor="branch" className="text-sm font-medium text-gray-700">
              Position
            </Label>
              <select
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="border border-gray-300 rounded-full p-2 text-gray-700 text-sm focus:outline-none right-4"
              >
                <option value="" disabled className='right-4'>
                  Select your position
                </option>
                {positions.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
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

              <div className='flex justify-end'>
                <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-800 mt-2">Delete account</Button>
              </div>
            </div>

          </div>
          
     
      </DialogContent>
    </Dialog>
  )
}

export default Profile
