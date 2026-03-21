import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchingProfile, setFetchingProfile] = useState<string | null>(null);

  const fetchProfile = async (userId: string) => {
    // Prevent duplicate profile fetches for the same user
    if (fetchingProfile === userId) return;
    
    setFetchingProfile(userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Profile record not found or error:', error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
    } finally {
      if (mountedRef.current) {
        setLoading(false);
        setFetchingProfile(null);
      }
    }
  };

  const mountedRef = React.useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    // Safety timeout to avoid getting stuck in loading state (e.g. storage lock issue)
    const safetyTimer = setTimeout(() => {
      if (mountedRef.current) {
        setLoading(false);
      }
    }, 10000);

    let authSubscription: { unsubscribe: () => void } | null = null;

    // Single source of truth for auth state - using onAuthStateChange ONLY 
    // to avoid storage lock collisions with redundant getSession() calls.
    const { data } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth transition:', event, currentSession?.user?.email);
      
      if (!mountedRef.current) return;

      setSession(currentSession);
      setUser(currentSession?.user ?? null);

      if (currentSession?.user) {
        // Only fetch profile if not already in state or if user changed
        await fetchProfile(currentSession.user.id);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    authSubscription = data.subscription;

    return () => {
      mountedRef.current = false;
      if (authSubscription) authSubscription.unsubscribe();
      clearTimeout(safetyTimer);
    };
  }, []);

  const signOut = async () => {
    try {
      setLoading(true);
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Signout error:', err);
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setFetchingProfile(null);
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{ session, user, profile, loading, signOut, refreshProfile }}>
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
