import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  error: Error | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const FirebaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAdmin(user?.email === 'rudoo6988@gmail.com');
      setLoading(false);
    }, (err) => {
      console.error('Auth state change error', err);
      setError(err);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (): Promise<User | null> => {
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const loggedInUser = result.user;
      
      // Sync user profile to Firestore
      try {
        const userRef = doc(db, 'users', loggedInUser.uid);
        await setDoc(userRef, {
          uid: loggedInUser.uid,
          email: loggedInUser.email,
          displayName: loggedInUser.displayName,
          photoURL: loggedInUser.photoURL,
          timestamp: serverTimestamp()
        }, { merge: true });
      } catch (syncErr) {
        console.error("User profile sync failed", syncErr);
        // We don't block login if sync fails, but we log it
      }

      return loggedInUser;
    } catch (err: any) {
      console.error('Login failed', err);
      setError(err instanceof Error ? err : new Error(String(err)));
      throw err;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Logout failed', err);
      setError(err instanceof Error ? err : new Error(String(err)));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a FirebaseProvider');
  }
  return context;
};
