'use client';

import { useState } from 'react';
import { Eye, EyeOff, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    branch: '',
    position: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const branches = [
    'Colombo',
    'Gampaha',
    'Kalutara',
    'Galle',
    'Matara',
    'Anuradhapura',
    'Rathnapura',
    'Jaffna',
    'Tricomalee',
    'Kandy',
  ];

  const positions = ['Branch Manager', 'Advisor', 'Team Leader'];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!formData.branch) newErrors.branch = 'Please select a branch';
    if (!formData.position) newErrors.position = 'Please select a position';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email format';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('Form Data Submitted:', formData);
      alert('Registration successful! (This is a demo)');
      setFormData({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        branch: '',
        position: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Section */}
      <div className="w-full lg:w-1/2 bg-white flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-900">Register</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name */}
            <div>
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md border-2 transition-colors focus:outline-none focus:border-primary ${
                  errors.firstName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
              />
              {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md border-2 transition-colors focus:outline-none focus:border-primary ${
                  errors.lastName ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
              />
              {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <input
                type="tel"
                name="phoneNumber"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md border-2 transition-colors focus:outline-none focus:border-primary ${
                  errors.phoneNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{errors.phoneNumber}</p>}
            </div>

            {/* Branch Dropdown */}
            <div className="relative">
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md border-2 transition-colors focus:outline-none focus:border-primary appearance-none cursor-pointer ${
                  errors.branch ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                <option value="">Select Branch</option>
                {branches.map((branch) => (
                  <option key={branch} value={branch}>
                    {branch}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 pointer-events-none text-gray-600" size={20} />
              {errors.branch && <p className="text-red-500 text-sm mt-1">{errors.branch}</p>}
            </div>

            {/* Position Dropdown */}
            <div className="relative">
              <select
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md border-2 transition-colors focus:outline-none focus:border-primary appearance-none cursor-pointer ${
                  errors.position ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
              >
                <option value="">Select Position</option>
                {positions.map((position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3.5 pointer-events-none text-gray-600" size={20} />
              {errors.position && <p className="text-red-500 text-sm mt-1">{errors.position}</p>}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-md border-2 transition-colors focus:outline-none focus:border-primary ${
                  errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 rounded-md border-2 transition-colors focus:outline-none focus:border-primary ${
                  errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full px-4 py-3 pr-12 rounded-md border-2 transition-colors focus:outline-none focus:border-primary ${
                  errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3.5 text-gray-600 hover:text-gray-900 transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Register Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 mt-6 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md transition-all"
            >
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-gray-700">
              Already have an Account ?{' '}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section - Blue Background */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-primary-600 to-primary-800 flex-col items-center justify-center p-8">
        <div className="text-center">
          {/* Logo - NEW: Using Image component with white-t.png */}
          <div className="mb-1">
            <div className="flex justify-center mb-1">
              <img
                src="/images/logos/white-t.png"
                alt="Needalyze Logo"
                className="w-60 h-60 object-contain"
              />
            </div>
            
          </div>

          {/* Description */}

          <div className="flex-1 flex items-end justify-center pb-8">
          <p className="text-white leading-relaxed max-w-lg text-left text-base font-normal">
            The inner titles of a section of the screen you are designing. For example this text style can be
            used for the titles of a services card in a services section in your home screen of your website
          </p>
        </div>
          
        </div>
      </div>
    </div>
  );
}
