import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { mockAuth, MockUser } from '@/lib/mockData';

interface AuthContextType {
  user: MockUser | null;
  session: { user: MockUser } | null;
  loading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any; user: MockUser | null }>;
  signOut: () => Promise<{ error: any }>;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<MockUser | null>(null);
  const [session, setSession] = useState<{ user: MockUser } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for existing session on mount
    const currentUser = mockAuth.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
      setSession({ user: currentUser });
      setIsAdmin(mockAuth.isAdmin(currentUser.id));
    }
    setLoading(false);

    // Listen for storage changes (simulating auth state changes)
    const handleStorageChange = () => {
      const updatedUser = mockAuth.getCurrentUser();
      if (updatedUser) {
        setUser(updatedUser);
        setSession({ user: updatedUser });
        setIsAdmin(mockAuth.isAdmin(updatedUser.id));
      } else {
        setUser(null);
        setSession(null);
        setIsAdmin(false);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const signUp = async (email: string, password: string) => {
    const { user: newUser, error } = await mockAuth.signUp(email, password);
    if (newUser && !error) {
      setUser(newUser);
      setSession({ user: newUser });
      setIsAdmin(mockAuth.isAdmin(newUser.id));
    }
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { user: signedInUser, error } = await mockAuth.signIn(email, password);
    if (signedInUser && !error) {
      setUser(signedInUser);
      setSession({ user: signedInUser });
      setIsAdmin(mockAuth.isAdmin(signedInUser.id));
    }
    return { error, user: signedInUser };
  };

  const signOut = async () => {
    const { error } = await mockAuth.signOut();
    if (!error) {
      setUser(null);
      setSession(null);
      setIsAdmin(false);
    }
    return { error };
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
