import { supabase } from './supabase'

// Role IDs from the database
const ROLE_IDS = {
  USER: '31181c75-79f9-4fee-8629-e706ce8c905b',
  ADMIN: 'fe33d24b-ed16-4cbb-a236-c642eff30320',
}

/**
 * Get role_id based on position
 * @param {string} position - User's position (Advisor, Team Leader, Branch Manager)
 * @returns {string} role_id UUID
 */
function getRoleIdByPosition(position) {
  // Advisor => user role
  if (position === 'Advisor') {
    return ROLE_IDS.USER
  }
  // Team Leader or Branch Manager => admin role
  if (position === 'Team Leader' || position === 'Branch Manager') {
    return ROLE_IDS.ADMIN
  }
  // Default to user role
  return ROLE_IDS.USER
}

/**
 * Sign up a new user with email/password and create user profile
 * @param {Object} userData - User registration data
 * @returns {Object} { success, error, user }
 */
export async function signUp(userData) {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      branch,
      position,
      codeNumber,
    } = userData

    // Step 1: Sign up user in auth.users
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) {
      // Handle specific error cases with user-friendly messages
      let errorMessage = authError.message

      // Check for duplicate email (user already exists)
      if (
        authError.message.includes('User already registered') ||
        authError.message.includes('already registered') ||
        authError.code === 'user_already_exists'
      ) {
        errorMessage =
          'This email address is already registered. Please login or use a different email address.'
      }

      return {
        success: false,
        error: errorMessage,
        user: null,
      }
    }

    // If email confirmation is required and user is not confirmed
    if (authData.user && !authData.user.confirmed_at) {
      // Note: You might want to handle email confirmation here
      console.log('User created but email confirmation may be required')
    }

    // Step 2: Get role_id based on position
    const roleId = getRoleIdByPosition(position)

    // Step 3: Insert user profile with 'pending' status
    const { error: profileError } = await supabase.from('user_profile').insert({
      user_id: authData.user.id,
      first_name: firstName,
      last_name: lastName,
      phone_number: phoneNumber,
      branch,
      position,
      code_number: codeNumber || null,
      role_id: roleId,
      status: 'pending', // Default status - requires admin approval
    })

    if (profileError) {
      // If profile creation fails, we should ideally delete the auth user
      // but Supabase doesn't allow this from client side easily
      // You might want to handle this with a database trigger or cloud function

      let errorMessage = profileError.message

      // Handle foreign key constraint error (usually means duplicate email)
      if (
        profileError.message.includes('user_profile_user_id_fkey') ||
        profileError.message.includes('foreign key constraint') ||
        profileError.code === '23503'
      ) {
        errorMessage =
          'This email address is already registered. Please login or use a different email address.'
      }

      // Handle duplicate phone number
      if (
        profileError.message.includes('user_profile_phone_number_key') ||
        profileError.message.includes('duplicate key') ||
        profileError.code === '23505'
      ) {
        errorMessage =
          'This phone number is already registered. Please use a different phone number.'
      }

      return {
        success: false,
        error: errorMessage,
        user: null,
      }
    }

    // Step 4: Sign out the user (since redirect to login page)
    await supabase.auth.signOut()

    return {
      success: true,
      error: null,
      user: authData.user,
    }
  } catch (error) {
    console.error('Registration error:', error)

    // Provide user-friendly error message
    let errorMessage =
      'An unexpected error occurred during registration. Please try again.'

    // Check if it's a network error
    if (error.message && error.message.includes('fetch')) {
      errorMessage =
        'Network error. Please check your internet connection and try again.'
    }

    return {
      success: false,
      error: errorMessage,
      user: null,
    }
  }
}

/**
 * Sign in a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Object} { success, error, user, session }
 */
export async function signIn(email, password) {
  try {
    // Step 1: Authenticate with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return {
        success: false,
        error: error.message,
        user: null,
        session: null,
      }
    }

    // Step 2: Check if email is confirmed
    if (data.user && !data.user.email_confirmed_at) {
      // Sign out the user if email is not confirmed
      await supabase.auth.signOut()
      return {
        success: false,
        error:
          'Please verify your email address before logging in. Check your inbox for the confirmation link.',
        user: null,
        session: null,
      }
    }

    // Step 3: Check user profile status
    const { data: profile, error: profileError } = await supabase
      .from('user_profile')
      .select('status')
      .eq('user_id', data.user.id)
      .single()

    if (profileError) {
      // Sign out the user if profile check fails
      await supabase.auth.signOut()
      return {
        success: false,
        error: 'Unable to verify account status. Please contact support.',
        user: null,
        session: null,
      }
    }

    // Step 4: Verify account is approved
    if (profile.status !== 'approved') {
      // Sign out the user if not approved
      console.log('User not approved, status:', profile.status)
      await supabase.auth.signOut()

      // Add a small delay to ensure signOut completes
      await new Promise((resolve) => setTimeout(resolve, 100))

      return {
        success: false,
        error:
          'Your account is pending approval. Please wait for admin approval.',
        user: null,
        session: null,
      }
    }

    // Step 5: Return success with user and session
    return {
      success: true,
      error: null,
      user: data.user,
      session: data.session,
    }
  } catch (error) {
    console.error('SignIn error:', error)
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      user: null,
      session: null,
    }
  }
}

/**
 * Sign out the current user
 * @returns {Object} { success, error }
 */
export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) {
      return {
        success: false,
        error: error.message,
      }
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
    }
  }
}

/**
 * Get the current authenticated user
 * @returns {Object} { user, session }
 */
export async function getCurrentUser() {
  try {
    // Get session from localStorage
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession()

    if (error) {
      console.error('Error getting session:', error)
      return {
        user: null,
        session: null,
      }
    }

    return {
      user: session?.user || null,
      session: session,
    }
  } catch (error) {
    console.error('Error in getCurrentUser:', error)
    return {
      user: null,
      session: null,
    }
  }
}

/**
 * Get user profile data by user_id
 * @param {string} userId - User's UUID
 * @returns {Object} { success, error, profile }
 */
export async function getUserProfile(userId) {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
        profile: null,
      }
    }

    return {
      success: true,
      error: null,
      profile: data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      profile: null,
    }
  }
}

/**
 * Update user profile
 * @param {string} userId - User's UUID
 * @param {Object} updates - Profile fields to update
 * @returns {Object} { success, error, profile }
 */
export async function updateUserProfile(userId, updates) {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .update(updates)
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: error.message,
        profile: null,
      }
    }

    return {
      success: true,
      error: null,
      profile: data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message || 'An unexpected error occurred',
      profile: null,
    }
  }
}
