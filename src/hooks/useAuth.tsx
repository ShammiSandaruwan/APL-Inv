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
    let isMounted = true;

    const fetchSessionAndProfile = async (session: Session | null) => {
      if (!isMounted) return;

      let userProfile: UserProfile | null = null;
      let userPermissions: Permissions | null = null;

      if (session?.user) {
        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        } else {
          userProfile = profileData as UserProfile;
          if (userProfile?.role === 'co_admin') {
            const { data: permsData, error: permsError } = await supabase
              .from('co_admin_permissions')
              .select('*')
              .eq('user_id', session.user.id)
              .single();
            if (permsError) {
              console.error('Error fetching permissions:', permsError);
            } else {
              userPermissions = permsData;
            }
          }
        }
      }

      if (isMounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setProfile(userProfile);
        setPermissions(userPermissions);
        setIsLoading(false);
      }
    };

    // Fetch initial session
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        fetchSessionAndProfile(session);
      })
      .catch((error) => {
        console.error('Error getting session:', error);
        if (isMounted) {
          setIsLoading(false);
        }
      });

    // Subscribe to auth state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      fetchSessionAndProfile(session);
    });

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

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
