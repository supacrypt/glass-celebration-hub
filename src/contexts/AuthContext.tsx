import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type UserRole = Database['public']['Tables']['user_roles']['Row'];

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  userRole: UserRole | null;
  loading: boolean;
  signUp: (email: string, password: string, firstName?: string, lastName?: string, profileData?: any) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<{ error: any }>;
  signInWithMagicLink: (email: string) => Promise<{ error: any }>;
  resetPassword: (email: string) => Promise<{ error: any }>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Track if we're currently fetching to prevent duplicates
  const fetchingRef = useRef<string | null>(null);
  const dataCache = useRef<{ profile: Profile | null; userRole: UserRole | null; userId: string } | null>(null);
  const lastFetch = useRef<number>(0);

  const fetchUserData = useCallback(async (userId: string) => {
    // Prevent duplicate fetches for the same user
    if (fetchingRef.current === userId) {
      return;
    }

    // Use cache if data is fresh (less than 10 seconds old)
    const now = Date.now();
    if (dataCache.current && dataCache.current.userId === userId && now - lastFetch.current < 10000) {
      setProfile(dataCache.current.profile);
      setUserRole(dataCache.current.userRole);
      return;
    }

    fetchingRef.current = userId;

    try {
      console.log('Fetching user data for:', userId);
      
      // Fetch both profile and user role in parallel
      const [profileResult, roleResult] = await Promise.all([
        supabase
          .from('profiles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle(),
        supabase
          .from('user_roles')
          .select('*')
          .eq('user_id', userId)
          .maybeSingle()
      ]);

      if (profileResult.error) {
        console.error('Error fetching profile:', profileResult.error);
      }
      
      if (roleResult.error) {
        console.error('Error fetching user role:', roleResult.error);
      }
      
      // Update cache
      dataCache.current = {
        profile: profileResult.data,
        userRole: roleResult.data || null,
        userId
      };
      lastFetch.current = Date.now();
      
      // Update state
      setProfile(profileResult.data);
      setUserRole(roleResult.data || null);
      
      console.log('User data fetched successfully:', { profile: profileResult.data, userRole: roleResult.data });
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      fetchingRef.current = null;
    }
  }, []);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          // Defer Supabase calls to prevent auth deadlock
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 100);
        } else {
          setProfile(null);
          setUserRole(null);
          // Clear cache when user logs out
          dataCache.current = null;
          lastFetch.current = 0;
          fetchingRef.current = null;
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Initial session check:', session?.user?.id);
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []); // Empty dependency array - this effect should only run once

  const signUp = async (email: string, password: string, firstName?: string, lastName?: string, profileData?: any) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          name: firstName && lastName ? `${firstName} ${lastName}` : firstName,
          phone: profileData?.phone,
          role: 'guest' // Default role for new users
        }
      }
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { error };
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  };

  const signInWithMagicLink = async (email: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    return { error };
  };

  const resetPassword = async (email: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    return { error };
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error('No user logged in') };
    
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        email: user.email || '',
        ...updates
      }, {
        onConflict: 'user_id'
      });
    
    if (!error) {
      // Clear cache and refetch to get updated data
      dataCache.current = null;
      lastFetch.current = 0;
      fetchingRef.current = null;
      await fetchUserData(user.id);
    }
    
    return { error };
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    userRole,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithMagicLink,
    resetPassword,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};