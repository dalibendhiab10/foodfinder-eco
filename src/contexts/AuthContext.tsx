
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<void>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;
      
      setSession(data.session);
      setUser(data.session?.user ?? null);
    } catch (error: any) {
      console.error('Error refreshing session:', error.message);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        if (event === 'SIGNED_IN') {
          toast({
            title: 'Signed in successfully',
            description: 'Welcome back!',
          });
        } else if (event === 'SIGNED_OUT') {
          toast({
            title: 'Signed out successfully',
            description: 'You have been signed out.',
          });
          navigate('/auth');
        }
        
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setIsLoading(false);
        
        // Check if user has admin role
        if (currentSession?.user?.app_metadata?.role === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      // Check if user has admin role
      if (currentSession?.user?.app_metadata?.role === 'admin') {
        setIsAdmin(true);
      }
      
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast, navigate]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign out failed',
        description: error.message || 'Something went wrong',
      });
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signOut,
    refreshSession,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
