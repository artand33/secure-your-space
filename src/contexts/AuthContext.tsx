import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { Database } from '@/types/supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: Profile | null | undefined;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const mountedRef = React.useRef(true);

  const fetchProfile = async (userId?: string) => {
    setLoading(true);
    try {
      if (!userId) {
        setProfile(null);
        return;
      }
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!mountedRef.current) return;

      if (error) {
        console.warn('Profile fetch error:', error.message);
        setProfile(null);
      } else {
        console.log('Profile fetched:', data);
        setProfile(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      if (mountedRef.current) setProfile(null);
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  useEffect(() => {
    mountedRef.current = true;

    const { data } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      if (!mountedRef.current) return;

      console.log('Auth event:', event, currentSession?.user?.email);

      // onAuthStateChange is the single source of truth — update everything here
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      await fetchProfile(currentSession?.user?.id);
    });

    return () => {
      mountedRef.current = false;
      data.subscription.unsubscribe();
    };
  }, []);

  // signOut only triggers the Supabase call — onAuthStateChange handles state cleanup
  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Signout error:', err);
      // Manual cleanup only if signOut itself threw
      if (mountedRef.current) {
        setSession(null);
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
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