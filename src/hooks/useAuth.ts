import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  display_name?: string;
  avatar_url?: string;
  phone?: string;
  mobile?: string;
  address?: string;
  state?: string;
  country?: string;
  postcode?: string;
  has_plus_one?: boolean;
  plus_one_name?: string;
  plus_one_email?: string;
  plus_one_invited?: boolean;
  rsvp_completed?: boolean;
  created_at?: string;
  updated_at?: string;
}

interface UserRole {
  role: 'guest' | 'admin' | 'couple';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
        
        if (session?.user) {
          // Defer Supabase calls with setTimeout to prevent auth deadlock
          setTimeout(() => {
            fetchUserData(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setUserRole(null);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchUserData(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch profile from profiles table
      const { data: profileData } = await (supabase as any)
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();
      
      setProfile(profileData);

      // Fetch user role from user_roles table
      let roleData = null;
      if (profileData) {
        const { data: userRoleData } = await (supabase as any)
          .from('user_roles')
          .select('role')
          .eq('user_id', userId)
          .maybeSingle();
        
        roleData = userRoleData ? { role: userRoleData.role } : { role: 'guest' };
      }
      setUserRole(roleData);
      
      console.log('User data fetched:', { profileData, roleData });
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

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
    
    const { error } = await (supabase as any)
      .from('profiles')
      .upsert({
        user_id: user.id,
        email: user.email,
        ...updates
      }, {
        onConflict: 'user_id'
      });
    
    if (!error) {
      await fetchUserData(user.id);
    }
    
    return { error };
  };

  return {
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
};