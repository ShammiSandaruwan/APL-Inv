// src/hooks/useAuth.tsx
import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

// Define a more specific type for the user profile
interface UserProfile {
  id: string;
  full_name: string;
  role: 'super_admin' | 'co_admin' | 'estate_user';
  // Add other profile fields as needed
}

interface Permissions {
  can_create_items: boolean;
  can_edit_items: boolean;
  can_delete_items: boolean;
  can_manage_estates: boolean;
  can_manage_buildings: boolean;
  can_manage_categories: boolean;
  can_generate_reports: boolean;
  can_view_audit_logs: boolean;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  permissions: Permissions | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [permissions, setPermissions] = useState<Permissions | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This effect runs once to get the initial session
    const getInitialSession = async () => {
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setUser(initialSession?.user ?? null);
      if (!initialSession) {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Set up a listener for auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      // If the user logs out, we can stop loading
      if (_event === 'SIGNED_OUT') {
        setProfile(null);
        setPermissions(null);
        setIsLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // This effect runs when the user state changes to fetch profile and permissions
    const fetchProfileAndPermissions = async () => {
      if (user) {
        // Fetch user profile
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setProfile(null);
        } else {
          setProfile(profileData as UserProfile);
        }

        // Fetch permissions if the user is a co_admin
        if (profileData?.role === 'co_admin') {
          const { data: permsData, error: permsError } = await supabase
            .from('co_admin_permissions')
            .select('*')
            .eq('user_id', user.id)
            .single();

          if (permsError) {
            console.error('Error fetching permissions:', permsError);
            setPermissions(null);
          } else {
            setPermissions(permsData);
          }
        } else {
          // Non-co_admins have no specific permissions
          setPermissions(null);
        }
      } else {
        // No user, so no profile or permissions
        setProfile(null);
        setPermissions(null);
      }
      // Finished loading profile data
      setIsLoading(false);
    };

    fetchProfileAndPermissions();
  }, [user]);

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const value = useMemo(() => ({
    session,
    user,
    profile,
    permissions,
    isLoading,
    signOut,
  }), [session, user, profile, permissions, isLoading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
