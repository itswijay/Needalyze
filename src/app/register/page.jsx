'use client';

import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Zod Validation Schema

const registerSchema = z.object({
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
    .regex(/^[0-9]{10}$/, 'Phone number must be 10 digits'),
  branch: z
    .string()
    .min(1, 'Please select a branch'),
  position: z
    .string()
    .min(1, 'Please select a position'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  // State for responsive behavior
  const [isMobile, setIsMobile] = useState(null);
  // ====

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const branches = ['Warakapola'];
  const positions = ['Branch Manager', 'Advisor', 'Team Leader'];

  // Check mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // React Hook Form with Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onSubmit',
    defaultValues: {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      branch: '',
      position: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // handleSubmit with react-hook-form
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      console.log('Form Data Submitted:', data);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      alert('Registration successful! (This is a demo)');
      
      // Reset form after successful registration
      reset();
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render loading state during hydration
  if (isMobile === null) {
    return <div className="h-screen"></div>;
  }

  // Mobile Layout

  if (isMobile) {
    return (
      <div className="w-full min-h-screen flex flex-col overflow-hidden">
        {/* Top Blue Section with Logo */}
        <div className="w-full bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)] flex flex-col justify-center items-center pt-6 pb-12 relative flex-shrink-0">
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
          <div className="w-full max-w-sm">
            <h1 className="text-center text-2xl font-bold text-primary-900 mb-5 mt-2">
              Register
            </h1>
            <div className="mx-4">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                {/* First Name */}
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="First Name"
                    className="w-full rounded-full placeholder:text-xs p-5 bg-gray-200 border-0 focus:outline-none focus:ring-0"
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
                    className="w-full rounded-full placeholder:text-xs p-5 bg-gray-200 border-0 focus:outline-none focus:ring-0"
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
                    className="w-full rounded-full placeholder:text-xs p-5 bg-gray-200 border-0 focus:outline-none focus:ring-0"
                    {...register('phoneNumber')}
                  />
                  {errors.phoneNumber && (
                    <p className="text-red-600 text-xs mt-1 ml-4">
                      {errors.phoneNumber.message}
                    </p>
                  )}
                </div>

                {/* Branch Dropdown */}
                <div className="mb-4 relative">
                  <select
                    className="w-full rounded-full placeholder:text-xs p-5 bg-gray-200 border-0 appearance-none cursor-pointer focus:outline-none focus:ring-0"
                    {...register('branch')}
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-5 pointer-events-none text-gray-600" size={20} />
                  {errors.branch && (
                    <p className="text-red-600 text-xs mt-1 ml-4">
                      {errors.branch.message}
                    </p>
                  )}
                </div>

                {/* Position Dropdown */}
                <div className="mb-4 relative">
                  <select
                    className="w-full rounded-full placeholder:text-xs p-5 bg-gray-200 border-0 appearance-none cursor-pointer focus:outline-none focus:ring-0"
                    {...register('position')}
                  >
                    <option value="">Select Position</option>
                    {positions.map((position) => (
                      <option key={position} value={position}>
                        {position}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-5 top-5 pointer-events-none text-gray-600" size={20} />
                  {errors.position && (
                    <p className="text-red-600 text-xs mt-1 ml-4">
                      {errors.position.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="mb-4">
                  <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    className="w-full rounded-full placeholder:text-xs p-5 bg-gray-200 border-0 focus:outline-none focus:ring-0"
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
                    className="w-full rounded-full placeholder:text-xs p-5 pr-12 bg-gray-200 border-0 focus:outline-none focus:ring-0"
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-5 top-5 text-gray-600 hover:text-gray-900 transition-colors"
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
                    className="w-full rounded-full placeholder:text-xs p-5 pr-12 bg-gray-200 border-0 focus:outline-none focus:ring-0"
                    {...register('confirmPassword')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-5 top-5 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                  className="w-full rounded-full p-5 bg-primary-900 hover:bg-primary-800 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
    );
  }

  // Desktop Layout

  return (
    <div className="w-full h-screen flex flex-row overflow-hidden">
      {/* Left Section - Blue Background*/}
      <div className="w-1/2 bg-[linear-gradient(to_bottom,_#24456e_0%,_#04182f_80%)] flex flex-col justify-center items-center p-8">
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
      <div className="w-1/2 bg-white flex-1 overflow-y-auto p-8 flex items-start justify-center pt-20">
        <div className="w-full max-w-sm">
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
            <h1 className="text-center text-2xl font-bold text-gray-900 mb-6">
              Register
            </h1>
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-3">
              {/* First Name */}
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  className="w-full rounded-full placeholder:text-xs px-5 py-3 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
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
                  className="w-full rounded-full placeholder:text-xs px-5 py-3 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
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
                  className="w-full rounded-full placeholder:text-xs px-5 py-3 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
                  {...register('phoneNumber')}
                />
                {errors.phoneNumber && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.phoneNumber.message}
                  </p>
                )}
              </div>

              {/* Branch Dropdown */}
              <div className="relative">
                <select
                  className="w-full rounded-full placeholder:text-xs px-5 py-3 border border-gray-300 appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-primary-600"
                  {...register('branch')}
                >
                  <option value="">Select Branch</option>
                  {branches.map((branch) => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-3.5 pointer-events-none text-gray-600" size={20} />
                {errors.branch && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.branch.message}
                  </p>
                )}
              </div>

              {/* Position Dropdown */}
              <div className="relative">
                <select
                  className="w-full rounded-full placeholder:text-xs px-5 py-3 border border-gray-300 appearance-none cursor-pointer focus:outline-none focus:ring-0 focus:border-primary-600"
                  {...register('position')}
                >
                  <option value="">Select Position</option>
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-5 top-3.5 pointer-events-none text-gray-600" size={20} />
                {errors.position && (
                  <p className="text-red-600 text-xs mt-1 ml-4">
                    {errors.position.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  className="w-full rounded-full placeholder:text-xs px-5 py-3 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
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
                  className="w-full rounded-full placeholder:text-xs px-5 py-3 pr-12 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-3.5 text-gray-600 hover:text-gray-900 transition-colors"
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
                  className="w-full rounded-full placeholder:text-xs px-5 py-3 pr-12 border border-gray-300 focus:outline-none focus:ring-0 focus:border-primary-600"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-3.5 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                className="w-full rounded-full py-3 px-5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </Button>

              {/* Login Link */}
              <p className="text-center text-primary-600 text-xs mt-4">
                Already have an Account?{' '}
                <Link
                  href="/login"
                  className="text-primary-400 hover:text-primary-200 font-semibold inline"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

