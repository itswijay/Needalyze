"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getCurrentUser,
  getUserProfile,
  signOut as authSignOut,
} from "@/lib/auth";
import { supabase } from "@/lib/supabase";

// Create the Auth Context
const AuthContext = createContext(undefined);

// Custom hook to use the Auth Context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Auth Provider Component
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  // Load user session on mount
  useEffect(() => {
    loadUser();

    // Listen for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session);

        if (event === "SIGNED_IN") {
          setUser(session?.user || null);
          setSession(session);
          await loadUserProfile(session?.user?.id);
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setUserProfile(null);
          setSession(null);
        } else if (event === "TOKEN_REFRESHED") {
          setUser(session?.user || null);
          setSession(session);
        }
      }
    );

    // Cleanup subscription
    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Load current user and their profile
  const loadUser = async () => {
    try {
      setLoading(true);

      // Get current user from Supabase
      const { user: currentUser, session: currentSession } =
        await getCurrentUser();

      if (currentUser) {
        setUser(currentUser);
        setSession(currentSession);

        // Load user profile
        await loadUserProfile(currentUser.id);
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load user profile from database
  const loadUserProfile = async (userId) => {
    if (!userId) return;

    try {
      const { success, profile } = await getUserProfile(userId);

      if (success && profile) {
        setUserProfile(profile);
        console.log("User profile loaded:", {
          status: profile.status,
          isApproved: profile.status === "approved",
          profile,
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      const { success } = await authSignOut();

      if (success) {
        setUser(null);
        setUserProfile(null);
        setSession(null);
        return { success: true };
      }

      return { success: false, error: "Sign out failed" };
    } catch (error) {
      console.error("Error signing out:", error);
      return { success: false, error: error.message };
    }
  };

  // Refresh user profile
  const refreshUserProfile = async () => {
    if (user?.id) {
      await loadUserProfile(user.id);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user && !!session;

  // Check if user is admin (based on role)
  const isAdmin =
    userProfile?.role_id === "fe33d24b-ed16-4cbb-a236-c642eff30320";

  // Check if user status is approved
  const isApproved = userProfile?.status === "approved";

  const value = {
    user,
    userProfile,
    session,
    loading,
    isAuthenticated,
    isAdmin,
    isApproved,
    signOut,
    refreshUserProfile,
    loadUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use the Auth Context
export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
