/**
 * Authentication Helper Functions
 */

/**
 * Check if user account exists in Firestore
 * @param {Object} db - Firestore database instance
 * @param {string} userId - User ID to check
 * @returns {Promise<boolean>} - True if user exists, false otherwise
 */
export const checkUserExists = async (db, userId) => {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const userDoc = await getDoc(doc(db, 'users', userId));
    return userDoc.exists();
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {Object} - Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (password.length < 6) {
    return { isValid: false, message: 'Password must be at least 6 characters long' };
  }

  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Get user-friendly error message from Firebase error code
 * @param {string} errorCode - Firebase error code
 * @param {string} errorMessage - Original error message
 * @returns {string} - User-friendly error message
 */
export const getAuthErrorMessage = (errorCode, errorMessage = '') => {
  // Check for custom error messages first
  if (errorMessage && errorMessage.includes('Account not found')) {
    return 'Account not found. Please sign up first';
  }

  // Firebase error codes
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address format';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up first';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again';
    case 'auth/invalid-credential':
      return 'Invalid email or password. Please check your credentials';
    case 'auth/too-many-requests':
      return 'Too many failed login attempts. Please try again later';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection';
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login instead';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is not enabled. Please contact support';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked. Please allow pop-ups for this site';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with this email using a different sign-in method';
    case 'auth/cancelled-popup-request':
      // Silent error - user is switching between popup windows
      return null;
    default:
      return errorMessage || 'An error occurred. Please try again';
  }
};

/**
 * Suppress console warnings for specific patterns
 * Useful for known, harmless warnings like COOP policy warnings
 */
export const suppressKnownWarnings = () => {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    // Suppress Cross-Origin-Opener-Policy warnings from Firebase popup auth
    if (args[0]?.includes?.('Cross-Origin-Opener-Policy')) {
      return;
    }
    originalWarn(...args);
  };
};


