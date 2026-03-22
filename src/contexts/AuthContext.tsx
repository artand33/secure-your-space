import React, { createContext, useContext, useEffect, useState, useRef } from 'react';
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
  const isMounted = useRef(true);

  const fetchProfile = async (userId?: string) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (!isMounted.current) return;
      if (error) {
        console.warn('Profile fetch error:', error.message);
        setProfile(null);
      } else {
        setProfile(data);
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err);
      if (isMounted.current) setProfile(null);
    }
  };

  useEffect(() => {
    isMounted.current = true;

    // Hard safety net — no matter what, loading stops after 8 seconds
    const hardTimeout = setTimeout(() => {
      if (isMounted.current) {
        console.warn('Hard safety timeout — forcing loading to false');
        setLoading(false);
      }
    }, 8000);

    const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!isMounted.current) return;
      console.log('Auth event (non-awaited):', event, newSession?.user?.email);
      setSession(newSession);
      setUser(newSession?.user ?? null);
      
      if (newSession?.user) {
        // Fire and forget! Do NOT await this inside the listener.
        // GoTrue awaits listeners while holding a lock. If we await a .select() here, 
        // the client deadlocks trying to fetch the token header via getSession().
        fetchProfile(newSession.user.id).then(() => {
          if (isMounted.current) {
            clearTimeout(hardTimeout);
            setLoading(false);
          }
        });
      } else {
        setProfile(null);
        clearTimeout(hardTimeout);
        if (isMounted.current) setLoading(false);
      }
    });

    return () => {
      isMounted.current = false;
      clearTimeout(hardTimeout);
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } finally {
      setSession(null);
      setUser(null);
      setProfile(null);
      setLoading(false);
      window.location.href = '/auth/login';
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