import { supabase } from './supabase'

/**
 * Admin helper functions
 * These functions should only be called by authenticated admin users
 * RLS policies will enforce permissions
 */

/**
 * Get all user profiles (admin only)
 * @returns {Object} { success, profiles, error }
 */
export async function getAllUserProfiles() {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        email,
        phone_number,
        branch,
        position,
        code_number,
        status,
        created_at,
        role:role_id (
          id,
          role_name
        )
      `)
      .order('created_at', { ascending: false })

    if (error) {
      return {
        success: false,
        profiles: null,
        error: error.message,
      }
    }

    return {
      success: true,
      profiles: data,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      profiles: null,
      error: error.message,
    }
  }
}

/**
 * Get pending user profiles (admin only)
 * @returns {Object} { success, profiles, error }
 */
export async function getPendingUsers() {
  try {
    const { data, error } = await supabase
      .from('user_profile')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        email,
        phone_number,
        branch,
        position,
        code_number,
        status,
        created_at,
        role:role_id (
          id,
          role_name
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) {
      return {
        success: false,
        profiles: null,
        error: error.message,
      }
    }

    return {
      success: true,
      profiles: data,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      profiles: null,
      error: error.message,
    }
  }
}

/**
 * Approve a user (change status from 'pending' to 'approved')
 * Uses secure database function to prevent other field modifications
 * @param {string} userId - The user_id to approve
 * @returns {Object} { success, error }
 */
export async function approveUser(userId) {
  try {
    const { data, error } = await supabase.rpc('update_user_status', {
      target_user_id: userId,
      new_status: 'approved',
    })

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
      error: error.message,
    }
  }
}

/**
 * Reject a user (change status from 'pending' to 'rejected')
 * Uses secure database function to prevent other field modifications
 * @param {string} userId - The user_id to reject
 * @returns {Object} { success, error }
 */
export async function rejectUser(userId) {
  try {
    const { data, error } = await supabase.rpc('update_user_status', {
      target_user_id: userId,
      new_status: 'rejected',
    })

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
      error: error.message,
    }
  }
}

/**
 * Update user status (generic)
 * Uses secure database function to prevent other field modifications
 * @param {string} userId - The user_id to update
 * @param {string} status - New status ('pending', 'approved', 'rejected')
 * @returns {Object} { success, error }
 */
export async function updateUserStatus(userId, status) {
  try {
    // Validate status on client side as well
    const validStatuses = ['pending', 'approved', 'rejected']
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      }
    }

    const { data, error } = await supabase.rpc('update_user_status', {
      target_user_id: userId,
      new_status: status,
    })

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
      error: error.message,
    }
  }
}

/**
 * Get user statistics (admin dashboard)
 * @returns {Object} { success, stats, error }
 */
export async function getUserStatistics() {
  try {
    // Get total users
    const { count: totalUsers, error: totalError } = await supabase
      .from('user_profile')
      .select('*', { count: 'exact', head: true })

    if (totalError) throw totalError

    // Get pending users
    const { count: pendingUsers, error: pendingError } = await supabase
      .from('user_profile')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending')

    if (pendingError) throw pendingError

    // Get approved users
    const { count: approvedUsers, error: approvedError } = await supabase
      .from('user_profile')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'approved')

    if (approvedError) throw approvedError

    // Get rejected users
    const { count: rejectedUsers, error: rejectedError } = await supabase
      .from('user_profile')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected')

    if (rejectedError) throw rejectedError

    return {
      success: true,
      stats: {
        total: totalUsers,
        pending: pendingUsers,
        approved: approvedUsers,
        rejected: rejectedUsers,
      },
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      stats: null,
      error: error.message,
    }
  }
}

/**
 * Delete a user profile (admin only - can only delete users, not admins)
 * @param {string} userId - The user_id to delete
 * @returns {Object} { success, error }
 */
export async function deleteUserProfile(userId) {
  try {
    // First check if the user is an admin (prevent deletion)
    const { data: targetProfile, error: checkError } = await supabase
      .from('user_profile')
      .select('role_id')
      .eq('user_id', userId)
      .single()

    if (checkError) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    // Prevent deletion of admin users
    if (targetProfile.role_id === 'fe33d24b-ed16-4cbb-a236-c642eff30320') {
      return {
        success: false,
        error: 'Cannot delete admin users. Only regular users can be deleted.',
      }
    }

    // Delete the user profile (RLS will enforce admin permission)
    const { error: deleteError } = await supabase
      .from('user_profile')
      .delete()
      .eq('user_id', userId)

    if (deleteError) {
      return {
        success: false,
        error: deleteError.message,
      }
    }

    return {
      success: true,
      error: null,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
