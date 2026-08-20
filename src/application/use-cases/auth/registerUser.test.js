import { beforeEach, describe, expect, it, vi } from 'vitest'
import { registerUser } from './registerUser'
import { POSITIONS } from '@/domain/constants/positions'

describe('registerUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const mockAuth = {
    createAccount: vi.fn().mockResolvedValue({ userId: 'user-123' }),
    deleteAccount: vi.fn().mockResolvedValue(undefined),
  }

  const validRegistrationData = {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phoneNumber: '+94771234567',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    branch: 'Warakapola',
    position: POSITIONS.ADVISOR,
    regCode: '12345',
  }

  it('successfully registers an advisor when inputs are valid', async () => {
    const mockUserProfiles = {
      findBranchManager: vi.fn().mockResolvedValue(null),
      create: vi.fn().mockResolvedValue({ userId: 'user-123' }),
    }

    const useCase = registerUser({ auth: mockAuth, userProfiles: mockUserProfiles })
    const res = await useCase(validRegistrationData)

    expect(res.success).toBe(true)
    expect(res.data).toEqual({ userId: 'user-123' })
    expect(mockAuth.createAccount).toHaveBeenCalledWith({
      email: 'john@example.com',
      password: 'Password123!',
    })
  })

  it('rejects registration if a Branch Manager already exists for the branch', async () => {
    const mockUserProfiles = {
      findBranchManager: vi.fn().mockResolvedValue({ userId: 'existing-bm', branch: 'Warakapola' }),
      create: vi.fn(),
    }

    const bmRegistrationData = {
      ...validRegistrationData,
      email: 'bm@example.com',
      position: POSITIONS.BRANCH_MANAGER,
    }

    const useCase = registerUser({ auth: mockAuth, userProfiles: mockUserProfiles })
    const res = await useCase(bmRegistrationData)

    expect(res.success).toBe(false)
    expect(res.error.message).toContain('A Branch Manager already exists for the Warakapola branch')
    expect(mockAuth.createAccount).not.toHaveBeenCalled()
  })
})
