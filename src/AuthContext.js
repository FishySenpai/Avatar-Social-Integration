import React, { useContext, useState, useEffect } from 'react';
import { auth, db } from './firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  FacebookAuthProvider,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { saveUserToDatabase } from './utils/saveUserToDB';

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeActive, setTimeActive] = useState(false);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener');
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        console.log('AuthProvider: Auth state changed', user ? 'User exists' : 'No user');
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setCurrentUser({
            ...user,
            ...userDoc.data(),
          });
        } else {
          setCurrentUser(user);
        }
      } else {
        setCurrentUser(null);
      }
      } catch (err) {
        console.error('AuthProvider: Error in auth state change', err);
        setError(err);
      } finally {
      setLoading(false);
      }
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      unsubscribe();
    };
  }, []);

  // Sign up with email and password
  const signup = async (email, password, firstName, lastName) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(result.user);
    
    // Update display name
    await updateProfile(result.user, {
      displayName: `${firstName} ${lastName}`,
    });
    
    // Save user data to Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      email: result.user.email,
      displayName: `${firstName} ${lastName}`,
      firstName: firstName,
      lastName: lastName,
      role: 'basic',
      twoFactorEnabled: false,
      emailVerified: false, // Will be set to true after OTP verification
      createdAt: new Date().toISOString(),
    });
    
    // Save user data to MySQL database
    try {
      await saveUserToDatabase({
        uid: result.user.uid,
        email: result.user.email,
        firstName: firstName,
        lastName: lastName,
        displayName: `${firstName} ${lastName}`,
        photoURL: result.user.photoURL,
        phoneNumber: result.user.phoneNumber,
        role: 'user',
        emailVerified: result.user.emailVerified,
      });
      console.log('✅ User data saved to MySQL database');
    } catch (dbError) {
      console.error('⚠️ Failed to save to MySQL (continuing anyway):', dbError);
      // Don't throw error - allow signup to continue even if DB save fails
    }
    
    return result;
  };

  // Sign in with email and password
  const login = async (email, password) => {
    try {
      // Attempt to sign in
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if user exists in Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // User authenticated in Firebase Auth but not in Firestore
        // This shouldn't happen in normal flow, sign them out
        await signOut(auth);
        throw new Error('Account not found. Please sign up first.');
      }
      
      return result;
    } catch (error) {
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    
    const result = await signInWithPopup(auth, provider);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    // Check if this is a new user
    if (!userDoc.exists()) {
      // Create user profile for first-time Google sign-in
      const nameParts = result.user.displayName?.split(' ') || ['', ''];
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName || '',
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        photoURL: result.user.photoURL || '',
        role: 'basic',
        twoFactorEnabled: false,
        emailVerified: result.user.emailVerified,
        createdAt: new Date().toISOString(),
      });
    }
    
    return result;
  };

  // Sign in with Facebook
  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider();
    
    const result = await signInWithPopup(auth, provider);
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    // Check if this is a new user
    if (!userDoc.exists()) {
      // Create user profile for first-time Facebook sign-in
      const nameParts = result.user.displayName?.split(' ') || ['', ''];
      await setDoc(doc(db, 'users', result.user.uid), {
        email: result.user.email,
        displayName: result.user.displayName || '',
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        photoURL: result.user.photoURL || '',
        role: 'basic',
        twoFactorEnabled: false,
        emailVerified: result.user.emailVerified,
        createdAt: new Date().toISOString(),
      });
    }
    
    return result;
  };

  // Logout
  const logout = () => {
    return signOut(auth);
  };

  // Reset password
  const resetPassword = (email) => {
    return auth.sendPasswordResetEmail(email);
  };

  // Update user profile
  const updateUserProfile = async (data) => {
    if (currentUser) {
      await updateProfile(currentUser, data);
      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...data,
        updatedAt: new Date().toISOString(),
      });
    }
  };

  // Update user role
  const updateUserRole = async (userId, role) => {
    await updateDoc(doc(db, 'users', userId), {
      role,
      updatedAt: new Date().toISOString(),
    });
  };

  // Update 2FA status
  const update2FAStatus = async (userId, enabled) => {
    await updateDoc(doc(db, 'users', userId), {
      twoFactorEnabled: enabled,
      updatedAt: new Date().toISOString(),
    });
  };

  // Phone Authentication Methods
  const sendPhoneOTP = async (phoneNumber, recaptchaElementId) => {
    try {
      const { sendPhoneVerification } = await import('./firebase');
      return await sendPhoneVerification(phoneNumber, recaptchaElementId);
    } catch (error) {
      console.error('Error sending phone OTP:', error);
      throw error;
    }
  };

  const verifyPhoneOTP = async (code) => {
    try {
      const { verifyPhoneCode } = await import('./firebase');
      const user = await verifyPhoneCode(code);
      
      // Update Firestore with phone verification
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          phoneNumber: user.phoneNumber,
          phoneVerified: true,
          updatedAt: new Date().toISOString(),
        });
      }
      return user;
    } catch (error) {
      console.error('Error verifying phone OTP:', error);
      throw error;
    }
  };

  const linkUserPhoneNumber = async (phoneNumber, recaptchaElementId) => {
    try {
      const { linkPhoneNumber } = await import('./firebase');
      return await linkPhoneNumber(phoneNumber, recaptchaElementId);
    } catch (error) {
      console.error('Error linking phone number:', error);
      throw error;
    }
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    signInWithFacebook,
    updateUserProfile,
    updateUserRole,
    update2FAStatus,
    sendPhoneOTP,
    verifyPhoneOTP,
    linkUserPhoneNumber,
    timeActive,
    setTimeActive,
    error
  };

  if (error) {
    console.error('AuthProvider: Rendering error state', error);
    return (
      <div className="error-container">
        <div>
          <h2>Error</h2>
          <p>{error.message}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  if (loading) {
    console.log('AuthProvider: Still loading...');
    return (
      <div className="loading-container">
        <div>
          <h2>Loading...</h2>
          <p>Please wait while we initialize the application.</p>
        </div>
      </div>
    );
  }

  console.log('AuthProvider: Rendering children');
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
