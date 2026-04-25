import { useState, useEffect } from 'react';
import { auth } from '../lib/firebase';
import { onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, sendPasswordResetEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider, confirmPasswordReset } from 'firebase/auth';
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

  const updateUserPassword = async (oldPassword, newPassword) => {
    if (!user || !user.email) throw new Error("No authenticated user.");
    const credential = EmailAuthProvider.credential(user.email, oldPassword);
    await reauthenticateWithCredential(user, credential);
    await updatePassword(user, newPassword);
  };

  const confirmUserPasswordReset = (oobCode, newPassword) => confirmPasswordReset(auth, oobCode, newPassword);

  const value = {
    // Firebase requires (auth, email, password), so we adapt the input
    signUp: ({ email, password }) => createUserWithEmailAndPassword(auth, email, password),
    signIn: ({ email, password }) => signInWithEmailAndPassword(auth, email, password),
    resetPassword: (email) => sendPasswordResetEmail(auth, email),
    updateUserPassword,
    confirmUserPasswordReset,
    signOut,
    user,
    loading,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};

export default AuthProvider;