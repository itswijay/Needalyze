'use client'

import React, { useState, useEffect } from 'react'
import { Eye, EyeOff, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useRouter } from 'next/navigation'
import { signUp } from '@/lib/auth'
import { useAuth } from '@/context/AuthContext'

// Zod Validation Schema
const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, 'First name is required')
      .regex(/^[a-zA-Z\s]+$/, 'First name should contain only letters'),
    lastName: z
      .string()
      .min(1, 'Last name is required')
      .regex(/^[a-zA-Z\s]+$/, 'Last name should contain only letters'),
    phoneNumber: z
      .string()
      .min(1, 'Phone number is required')
      .regex(
        /^\+\d{11}$/,
        'Phone number must be with valid country code (e.g. +94771234567 for Sri Lanka)'
      ),
    branch: z.string().min(1, 'Please select a branch'),
    position: z.string().min(1, 'Please select a position'),
    regCode: z.string().optional(),
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address'),
    password: z
      .string()
      .min(1, 'Password is required')
      .min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .refine(
    (data) => {
      // Registration code is required for Advisor and Team Leader
      if (data.position === 'Advisor' || data.position === 'Team Leader') {
        return data.regCode && data.regCode.trim().length > 0
      }
      return true
    },
    {
      message: 'Code number is required for this position',
      path: ['regCode'],
    }
  )

export default function Register() {
  const router = useRouter()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [isMobile, setIsMobile] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showBranchDropdown, setShowBranchDropdown] = useState(false)
  const [showPositionDropdown, setShowPositionDropdown] = useState(false)
  const [selectedBranch, setSelectedBranch] = useState('')
  const [selectedPosition, setSelectedPosition] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // ============= Desktop dropdowns state =============
  const [showBranchDropdownDesktop, setShowBranchDropdownDesktop] =
    useState(false)
  const [showPositionDropdownDesktop, setShowPositionDropdownDesktop] =
    useState(false)

  const branches = ['Warakapola']
  const positions = ['Branch Manager', 'Advisor', 'Team Leader']

  // React Hook Form with Zod - MUST be called before any early returns
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      branch: '',
      position: '',
      regCode: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, authLoading, router])

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)

    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setShowBranchDropdown(false)
        setShowPositionDropdown(false)
        setShowBranchDropdownDesktop(false)
        setShowPositionDropdownDesktop(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Show loading state while checking authentication or if already authenticated
  if (authLoading || isAuthenticated) {
    return (
      <div className="w-full h-screen flex justify-center items-center bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)]">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>
            {isAuthenticated ? 'Redirecting to dashboard...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  // Custom dropdown handlers
  const handleBranchSelect = (branch) => {
    setSelectedBranch(branch)
    setValue('branch', branch)
    setShowBranchDropdown(false)
    setShowBranchDropdownDesktop(false)
  }

  const handlePositionSelect = (position) => {
    setSelectedPosition(position)
    setValue('position', position)
    setShowPositionDropdown(false)
    setShowPositionDropdownDesktop(false)
  }

  // handleSubmit with react-hook-form
  const onSubmit = async (data) => {
    setIsLoading(true)
    setErrorMessage('')
    setSuccessMessage('')

    try {
      // Prepare user data for registration
      const userData = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        branch: data.branch,
        position: data.position,
        codeNumber: data.regCode || null,
      }

      // Call Supabase signUp function
      const result = await signUp(userData)

      if (result.success) {
        // Registration successful
        setSuccessMessage(
          'Registration successful! Please check your email to verify your account. After email verification, your account will be pending admin approval.'
        )

        // Reset form
        reset()
        setSelectedBranch('')
        setSelectedPosition('')

        // Redirect to login page after 3 seconds
        setTimeout(() => {
          router.push('/login')
        }, 5000)
      } else {
        // Registration failed - show error
        setErrorMessage(
          result.error || 'Registration failed. Please try again.'
        )
      }
    } catch (error) {
      console.error('Registration error:', error)
      setErrorMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Render loading state during hydration
  if (isMobile === null) {
    return <div className="h-screen"></div>
  }

  // Mobile Layout
  if (isMobile) {
    return (
      <div className="w-full min-h-screen flex flex-col overflow-hidden">
        {/* Top Blue Section with Logo */}
        <div className="w-full bg-[linear-gradient(to_bottom,#24456e_0%,#04182f_80%)] flex flex-col justify-center items-center pt-6 pb-12 relative flex-shrink-0">
          <Image
            src="/images/logos/white-t.png"
            width={128}
            height={128}
            alt="Needalyze Logo"
            priority
            className="w-32 h-32"
          />

          {/* Curved bottom edge */}
          <div className="absolute bottom-[-1px] left-0 w-full overflow-hidden leading-[0]">
            <svg
              className="relative block w-full h-[60px]"
              viewBox="0 0 1200 120"
              preserveAspectRatio="none"
            >
              <path
                d="M0,0 C300,120 900,120 1200,0 L1200,120 L0,120 Z"
                className="fill-gray-50"
              ></path>
            </svg>
          </div>
        </div>

        {/* Form Section */}
        <div className="w-full flex justify-center items-start px-4 py-4 bg-gray-50 flex-1 overflow-y-auto">
          <div className="w-full max-w-sm mb-12">
            <h1 className="text-center text-2xl font-bold text-primary-900 mb-5 mt-2">
              Register
            </h1>
            <div className="mx-4">
              {/* Success Message */}
              {successMessage && (
                <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {successMessage}
                </div>
              )}
              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* First Name */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full rounded-full placeholder:text-xs p-2.5 px-5 bg-gray-200 border-0 focus:outline-none focus:ring-0"
                    {...register('firstName')}
                  />
                  {errors.firstName && (
                    <p className="text-red-600 text-xs mt-1 ml-4">
                      {errors.firstName.message}
                    </p>
                  )}
                </div>
                {/* Last Name */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Last Name"
                    className="w-full rounded-full placeholder:text-xs p-2.5 px-5 bg-gray-200 border-0 focus:outline-none focus:ring-0"
                    {...register('lastName')}
                  />
                  {errors.lastName && (
                    <p className="text-red-600 text-xs mt-1 ml-4">
                      {errors.lastName.message}
                    </p>
                  )}
                </div>
                {/* Phone Number */}
                <div className="mb-4">
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    className="w-full rounded-full placeholder:text-xs p-2.5 px-5 bg-gray-200 border-0 focus:outline-none focus:ring-0"
                    {...register('phoneNumber')}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-600 text-xs mt-1 ml-4">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>
                {/* Branch Dropdown */}
                <div className="mb-4 relative dropdown-container">
                  <input type="hidden" {...register('branch')} />
                  <div
                    className="w-full rounded-full placeholder:text-xs p-2.5 px-5 bg-gray-200 border-0 focus:outline-none focus:ring-0 text-left cursor-pointer flex items-center justify-between"
                    onClick={() => setShowBranchDropdown(!showBranchDropdown)}
                  >
                    <span
                      className={
                        selectedBranch
                          ? 'text-gray-900'
                          : 'text-gray-500 text-xs'
                      }
                    >
                      {selectedBranch || 'Select Branch'}
                    </span>
                    <ChevronDown
                      className={`text-gray-600 transition-transform ${
                        showBranchDropdown ? 'rotate-180' : ''
                      }`}
                      size={20}
                    />
                  </div>
                  {showBranchDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto mt-1">
                      {selectedBranch && (
                        <div
                          className="px-5 py-3 hover:bg-red-50 cursor-pointer text-left text-sm text-red-600 border-b border-gray-200"
                          onClick={() => handleBranchSelect('')}
                        >
                          ✕ Clear Selection
                        </div>
                      )}
                      {branches.map((branch) => (
                        <div
                          key={branch}
                          className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-left text-sm"
                          onClick={() => handleBranchSelect(branch)}
                        >
                          {branch}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.branch && (
                    <p className="text-red-600 text-xs mt-1 ml-4">
                      {errors.branch.message}
                    </p>
                  )}
                </div>

                {/* Position Dropdown */}
                <div className="mb-4 relative dropdown-container">
                  <input type="hidden" {...register('position')} />
                  <div
                    className="w-full rounded-full placeholder:text-xs p-2.5 px-5 bg-gray-200 border-0 focus:outline-none focus:ring-0 text-left cursor-pointer flex items-center justify-between"
                    onClick={() =>
                      setShowPositionDropdown(!showPositionDropdown)
                    }
                  >
                    <span
                      className={
                        selectedPosition
                          ? 'text-gray-900'
                          : 'text-gray-500 text-xs'
                      }
                    >
                      {selectedPosition || 'Select Position'}
                    </span>
                    <ChevronDown
                      className={`text-gray-600 transition-transform ${
                        showPositionDropdown ? 'rotate-180' : ''
                      }`}
                      size={20}
                    />
                  </div>
                  {showPositionDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto mt-1">
                      {selectedPosition && (
                        <div
                          className="px-5 py-3 hover:bg-red-50 cursor-pointer text-left text-sm text-red-600 border-b border-gray-200"
                          onClick={() => handlePositionSelect('')}
                        >
                          ✕ Clear Selection
                        </div>
                      )}
                      {positions.map((position) => (
                        <div
                          key={position}
                          className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-left text-sm"
                          onClick={() => handlePositionSelect(position)}
                        >
                          {position}
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.position && (
                    <p className="text-red-600 text-xs mt-1 ml-4">
                      {errors.position.message}
                    </p>
                  )}
                </div>

                {/* Code Number - Show only for Advisor and Team Leader */}
                {(selectedPosition === 'Advisor' ||
                  selectedPosition === 'Team Leader') && (
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Code Number"
                      className="w-full rounded-full placeholder:text-xs p-2.5 px-5 bg-gray-200 border-0 focus:outline-none focus:ring-0"
                      {...register('regCode')}
                    />
                    {errors.regCode && (
                      <p className="text-red-600 text-xs mt-1 ml-4">
                        {errors.regCode.message}
                      </p>
                    )}
                  </div>
                )}

                {/* Email */}
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className="w-full rounded-full placeholder:text-xs p-2.5 px-5 bg-gray-200 border-0 focus:outline-none focus:ring-0"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-red-600 text-xs mt-1 ml-4">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Password */}
                <div className="mb-4 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    autoComplete="new-password"
                    className="w-full rounded-full placeholder:text-xs p-2.5 px-5 bg-gray-200 border-0 focus:outline-none focus:ring-0"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-3 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                  {errors.password && (
                    <p className="text-red-600 text-xs mt-1 ml-4">
                      {errors.password.message}
                    </p>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="mb-4 relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    autoComplete="new-password"
                    className="w-full rounded-full placeholder:text-xs p-2.5 px-5 bg-gray-200 border-0 focus:outline-none focus:ring-0"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-3 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                  {errors.confirmPassword && (
                    <p className="text-red-600 text-xs mt-1 ml-4">
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                {/* Register Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full p-5.5 bg-primary-900 hover:bg-primary-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
              </form>

              {/* Login Link */}
              <div className="space-y-2">
                <p className="text-center text-primary-900 text-sm mt-4">
                  Already have an Account?{' '}
                  <Link
                    href="/login"
                    className="text-primary-900 hover:text-primary-700 font-semibold inline"
                  >
                    Login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Desktop Layout

  return (
    <div className="w-full h-screen flex flex-row overflow-hidden">
      {/* Left Section - Blue Background*/}
      <div className="w-1/2 bg-[linear-gradient(to_bottom,#24456e_0%,#04182f_80%)] flex flex-col justify-center items-center p-8">
        <div className="text-center">
          <div className="mb-1">
            <div className="flex justify-center mb-1">
              <Image
                src="/images/logos/white-t.png"
                alt="Needalyze Logo"
                width={260}
                height={260}
                className="w-[260px] h-[260px] object-contain"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Form*/}
      <div className="w-1/2 bg-white flex-1 overflow-y-auto py-8 px-8 flex justify-center">
        <div className="w-full max-w-md my-auto">
          <div className="bg-white p-10 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-center text-2xl font-bold text-gray-900 mb-8">
              Register
            </h1>
            {/* Success Message */}
            {successMessage && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                {successMessage}
              </div>
            )}
            {/* Error Message */}
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {errorMessage}
              </div>
            )}
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-4"
            >
              {/* First Name */}
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full rounded-full placeholder:text-sm px-5 py-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.firstName.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  className="w-full rounded-full placeholder:text-sm px-5 py-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
                  {...register('lastName')}
                />
                {errors.lastName && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.lastName.message}
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full rounded-full placeholder:text-sm px-5 py-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
                  {...register('phoneNumber')}
                />
                {errors.phoneNumber && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Branch Dropdown */}
              <div className="relative dropdown-container">
                <input type="hidden" {...register('branch')} />
                <div
                  className="w-full rounded-full placeholder:text-sm px-5 py-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600 text-left cursor-pointer flex items-center justify-between bg-white"
                  onClick={() =>
                    setShowBranchDropdownDesktop(!showBranchDropdownDesktop)
                  }
                >
                  <span
                    className={
                      selectedBranch ? 'text-gray-900' : 'text-gray-500 text-sm'
                    }
                  >
                    {selectedBranch || 'Select Branch'}
                  </span>
                  <ChevronDown
                    className={`text-gray-600 transition-transform ${
                      showBranchDropdownDesktop ? 'rotate-180' : ''
                    }`}
                    size={20}
                  />
                </div>
                {showBranchDropdownDesktop && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto mt-1">
                    {selectedBranch && (
                      <div
                        className="px-5 py-3 hover:bg-red-50 cursor-pointer text-left text-sm text-red-600 border-b border-gray-200"
                        onClick={() => handleBranchSelect('')}
                      >
                        ✕ Clear Selection
                      </div>
                    )}
                    {branches.map((branch) => (
                      <div
                        key={branch}
                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-left text-sm"
                        onClick={() => handleBranchSelect(branch)}
                      >
                        {branch}
                      </div>
                    ))}
                  </div>
                )}
                {errors.branch && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.branch.message}
                  </p>
                )}
              </div>

              {/* Position Dropdown */}
              <div className="relative dropdown-container">
                <input type="hidden" {...register('position')} />
                <div
                  className="w-full rounded-full placeholder:text-sm px-5 py-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600 text-left cursor-pointer flex items-center justify-between bg-white"
                  onClick={() =>
                    setShowPositionDropdownDesktop(!showPositionDropdownDesktop)
                  }
                >
                  <span
                    className={
                      selectedPosition
                        ? 'text-gray-900'
                        : 'text-gray-500 text-sm'
                    }
                  >
                    {selectedPosition || 'Select Position'}
                  </span>
                  <ChevronDown
                    className={`text-gray-600 transition-transform ${
                      showPositionDropdownDesktop ? 'rotate-180' : ''
                    }`}
                    size={20}
                  />
                </div>
                {showPositionDropdownDesktop && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto mt-1">
                    {selectedPosition && (
                      <div
                        className="px-5 py-3 hover:bg-red-50 cursor-pointer text-left text-sm text-red-600 border-b border-gray-200"
                        onClick={() => handlePositionSelect('')}
                      >
                        ✕ Clear Selection
                      </div>
                    )}
                    {positions.map((position) => (
                      <div
                        key={position}
                        className="px-5 py-3 hover:bg-gray-100 cursor-pointer text-left text-sm"
                        onClick={() => handlePositionSelect(position)}
                      >
                        {position}
                      </div>
                    ))}
                  </div>
                )}
                {errors.position && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.position.message}
                  </p>
                )}
              </div>

              {/* Code Number - Show only for Advisor and Team Leader */}
              {(selectedPosition === 'Advisor' ||
                selectedPosition === 'Team Leader') && (
                <div>
                  <input
                    type="text"
                    placeholder="Code Number"
                    className="w-full rounded-full placeholder:text-sm px-5 py-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
                    {...register('regCode')}
                  />
                  {errors.regCode && (
                    <p className="text-red-600 text-xs mt-1 ml-4">
                      {errors.regCode.message}
                    </p>
                  )}
                </div>
              )}

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  className="w-full rounded-full placeholder:text-sm px-5 py-2 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
                  {...register('email')}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  autoComplete="new-password"
                  className="w-full rounded-full placeholder:text-sm px-5 py-2 pr-12 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-3 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {errors.password && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  autoComplete="new-password"
                  className="w-full rounded-full placeholder:text-sm px-5 py-2 pr-12 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-3 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              {/* Register Button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-full py-5.5 px-5 bg-primary-900 hover:bg-primary-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Registering...' : 'Register'}
                </Button>
              </div>

              {/* Login Link */}
              <p className="text-center text-gray-600 text-sm mt-6">
                Already have an Account?{' '}
                <Link
                  href="/login"
                  className="text-primary-600 hover:text-primary-700 font-semibold inline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
