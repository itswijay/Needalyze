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

  const branches = ['warakapola', 'galle', 'matara','awissawella','hambantota','monaragala','anuradhapura','colombo'];
  const positions = ['branch manager 1','branch manager 2','branch manager 3'];


  const handleSubmit = () => {
    
  }


  return (

    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Your Details</DialogTitle>
        </DialogHeader>
        
        {/* update first name */}
        <div className="grid gap-4 py-2">
          <div className="grid gap-2">
            <Label htmlFor="first_name">First Name</Label>
            <Input
              id="first_name"
              placeholder="Enter first name"
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          {/* update last name */}
          <div className="grid gap-2">
            <Label htmlFor="last_name">Last Name</Label>
            <Input
              id="last_name"
              placeholder="Enter last name"
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
          
          {/* phone number */}
          <div className="grid gap-2">
            <Label htmlFor="phone_number">Phone Number</Label>
            <Input
              id="phone_number"
              placeholder="Enter phone number"
              value={phone_number}
              onChange={(e) => setPhoneNumber(e.target.value)}
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
                  className="border border-gray-300 rounded-md p-1.5 text-gray-700 text-sm focus:outline-none"
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
              className="border border-gray-300 rounded-md p-1.5 text-gray-700 text-sm focus:outline-none"
            >
              <option value="" disabled>
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
          <div className='flex justify-center gap-3 pt-4'>
            <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-800">Delete account</Button>
            <Button onClick={handleSubmit} >Save your details</Button>
          </div>
          
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default Profile
