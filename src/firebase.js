import { initializeApp } from 'firebase/app'
import { 
  getAuth, 
  GoogleAuthProvider, 
  FacebookAuthProvider, 
  TwitterAuthProvider,
  PhoneAuthProvider,
  RecaptchaVerifier,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  signInWithPhoneNumber,
  linkWithPhoneNumber,
  updatePhoneNumber,
} from 'firebase/auth'
import { getFirestore, doc, setDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCbMYh9a12F-mSFsgRRvX7K7QfOBfrIAB0",
  authDomain: "avatarsocial-16409.firebaseapp.com",
  projectId: "avatarsocial-16409",
  storageBucket: "avatarsocial-16409.appspot.com",
  messagingSenderId: "614658254954",
  appId: "1:614658254954:web:213d26149de45022be4213"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize services
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

// Authentication providers
const googleProvider = new GoogleAuthProvider()
const facebookProvider = new FacebookAuthProvider()
const twitterProvider = new TwitterAuthProvider()

// Social sign-in methods
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Store user data in Firestore
    await createOrUpdateUserProfile(user)
    return user
  } catch (error) {
    console.error("Google sign-in error:", error)
    throw error
  }
}

const signInWithFacebook = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider)
    const user = result.user
    
    // Store user data in Firestore
    await createOrUpdateUserProfile(user)
    return user
  } catch (error) {
    console.error("Facebook sign-in error:", error)
    throw error
  }
}

const signInWithTwitter = async () => {
  try {
    const result = await signInWithPopup(auth, twitterProvider)
    const user = result.user
    
    // Store user data in Firestore
    await createOrUpdateUserProfile(user)
    return user
  } catch (error) {
    console.error("Twitter sign-in error:", error)
    throw error
  }
}

// Email/Password authentication methods
const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password)
    return result.user
  } catch (error) {
    console.error("Email sign-in error:", error)
    throw error
  }
}

const signUpWithEmail = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password)
    const user = result.user
    
    // Store user data in Firestore
    await createOrUpdateUserProfile(user)
    return user
  } catch (error) {
    console.error("Email sign-up error:", error)
    throw error
  }
}

const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
  } catch (error) {
    console.error("Password reset error:", error)
    throw error
  }
}

const logout = async () => {
  try {
    await signOut(auth)
  } catch (error) {
    console.error("Logout error:", error)
    throw error
  }
}

// Helper function to create/update user profile in Firestore
const createOrUpdateUserProfile = async (user) => {
  if (!user) return

  const userRef = doc(db, 'users', user.uid)
  const userData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    providerId: user.providerData[0]?.providerId || 'email',
    lastLoginAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  try {
    await setDoc(userRef, userData, { merge: true })
  } catch (error) {
    console.error('Error creating user profile:', error)
    throw error
  }
}

// Phone Authentication Functions
const setupRecaptcha = (elementId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, elementId, {
      size: 'normal',
      callback: (response) => {
        // reCAPTCHA solved
        console.log('reCAPTCHA verified');
      },
      'expired-callback': () => {
        // Reset reCAPTCHA
        console.log('reCAPTCHA expired');
      }
    });
  }
  return window.recaptchaVerifier;
};

const sendPhoneVerification = async (phoneNumber, recaptchaElementId) => {
  try {
    const recaptchaVerifier = setupRecaptcha(recaptchaElementId);
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error('Error sending phone verification:', error);
    throw error;
  }
};

const verifyPhoneCode = async (code) => {
  try {
    const result = await window.confirmationResult.confirm(code);
    const user = result.user;
    
    // Store user data in Firestore
    await createOrUpdateUserProfile(user, { phoneNumber: user.phoneNumber });
    return user;
  } catch (error) {
    console.error('Error verifying phone code:', error);
    throw error;
  }
};

const linkPhoneNumber = async (phoneNumber, recaptchaElementId) => {
  try {
    const recaptchaVerifier = setupRecaptcha(recaptchaElementId);
    const user = auth.currentUser;
    if (!user) throw new Error('No user logged in');
    
    const confirmationResult = await linkWithPhoneNumber(user, phoneNumber, recaptchaVerifier);
    window.confirmationResult = confirmationResult;
    return confirmationResult;
  } catch (error) {
    console.error('Error linking phone number:', error);
    throw error;
  }
};

export {
  auth,
  db,
  storage,
  signInWithGoogle,
  signInWithFacebook,
  signInWithTwitter,
  signInWithEmail,
  signUpWithEmail,
  resetPassword,
  logout,
  createOrUpdateUserProfile,
  sendPhoneVerification,
  verifyPhoneCode,
  linkPhoneNumber,
  setupRecaptcha,
  RecaptchaVerifier,
}

export default app
