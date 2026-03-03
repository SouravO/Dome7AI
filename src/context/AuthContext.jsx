import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut } from 'firebase/auth';
import { AuthContext } from './useAuth';

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes (login, logout, token refresh, etc.)
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null);
  }

  const value = {
    // Firebase requires (auth, email, password), so we adapt the input
    signUp: ({ email, password }) => createUserWithEmailAndPassword(auth, email, password),
    signIn: ({ email, password }) => signInWithEmailAndPassword(auth, email, password),
    signOut,
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthProvider;