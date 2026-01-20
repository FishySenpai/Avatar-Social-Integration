import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './forms.css';
import { useAuth } from './AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Grid,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { 
  Google as GoogleIcon, 
  Facebook as FacebookIcon,
  Visibility,
  VisibilityOff,
} from '@mui/icons-material';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [show2FA, setShow2FA] = useState(false);
  const [twoFactorCode, setTwoFactorCode] = useState('');
  const { setTimeActive, login, signInWithGoogle, signInWithFacebook } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Cleanup function to prevent memory leaks
    return () => {
      setLoading(false);
      setError('');
    };
  }, []);

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const result = await login(email, password);
      const user = result.user;

      // Check Firestore for verification status (not Firebase Auth)
      const { doc, getDoc } = await import('firebase/firestore');
      const { db } = await import('./firebase');
      
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      // Check if user has verified via OTP (Firestore check, not Firebase Auth)
      if (userData && !userData.emailVerified) {
        setTimeActive(true);
        navigate('/verify-email');
      } else if (user.twoFactorEnabled || userData?.twoFactorEnabled) {
        setShow2FA(true);
      } else {
        // User is verified, allow login
        navigate('/');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific Firebase auth errors
      let errorMessage = '';
      
      switch (err.code) {
        case 'auth/invalid-email':
          errorMessage = '❌ Invalid email address format';
          break;
        case 'auth/user-disabled':
          errorMessage = '🚫 This account has been disabled. Please contact support';
          break;
        case 'auth/user-not-found':
          errorMessage = '❌ No account exists with this email. Please sign up first';
          break;
        case 'auth/wrong-password':
          errorMessage = '❌ Incorrect password. Please try again';
          break;
        case 'auth/invalid-credential':
          errorMessage = '❌ Invalid credentials. No account found with this email OR password is incorrect. Please sign up first if you don\'t have an account';
          break;
        case 'auth/too-many-requests':
          errorMessage = '⚠️ Too many failed attempts. Please try again later or reset your password';
          break;
        case 'auth/network-request-failed':
          errorMessage = '📡 Network error. Please check your internet connection';
          break;
        case 'auth/invalid-login-credentials':
          errorMessage = '❌ No account found with this email OR incorrect password. Please sign up if you don\'t have an account';
          break;
        case 'auth/cancelled-popup-request':
          // Ignore this error
          return;
        default:
          // Check if it's our custom "Account not found" error
          if (err.message && err.message.includes('Account not found')) {
            errorMessage = '❌ Account not found. Please sign up first';
          } else if (err.message && err.message.includes('invalid-login-credentials')) {
            errorMessage = '❌ Account does not exist OR password is incorrect. Please sign up if you don\'t have an account';
          } else if (err.message && err.message.includes('INVALID_LOGIN_CREDENTIALS')) {
            errorMessage = '❌ No account found OR wrong password. Please sign up if you\'re new here';
          } else {
            errorMessage = `❌ ${err.message || 'Login failed. If you don\'t have an account, please sign up first'}`;
          }
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithGoogle();
      const user = result.user;

      if (!user.emailVerified) {
        setTimeActive(true);
        navigate('/verify-email');
      } else {
        navigate('/');
      }
    } catch (err) {
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          setError('Google sign-in was cancelled');
          break;
        case 'auth/popup-blocked':
          setError('Pop-up was blocked. Please allow pop-ups for this site');
          break;
        case 'auth/cancelled-popup-request':
          // Ignore this error
          break;
        case 'auth/account-exists-with-different-credential':
          setError('An account already exists with this email using a different sign-in method');
          break;
        default:
          setError(err.message || 'Failed to sign in with Google');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await signInWithFacebook();
      const user = result.user;

      if (!user.emailVerified) {
        setTimeActive(true);
        navigate('/verify-email');
      } else {
        navigate('/');
      }
    } catch (err) {
      switch (err.code) {
        case 'auth/popup-closed-by-user':
          setError('Facebook sign-in was cancelled');
          break;
        case 'auth/popup-blocked':
          setError('Pop-up was blocked. Please allow pop-ups for this site');
          break;
        case 'auth/cancelled-popup-request':
          // Ignore this error
          break;
        case 'auth/account-exists-with-different-credential':
          setError('An account already exists with this email using a different sign-in method');
          break;
        default:
          setError(err.message || 'Failed to sign in with Facebook');
      }
    } finally {
      setLoading(false);
    }
  };

  const handle2FAVerification = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!twoFactorCode || twoFactorCode.trim() === '') {
        setError('Please enter the 2FA code');
        setLoading(false);
        return;
      }

      if (!/^\d{6}$/.test(twoFactorCode)) {
        setError('Invalid verification code. Please enter a 6-digit number');
        setLoading(false);
        return;
      }

      // Verify the 2FA code (this is a demo, replace with actual verification)
      navigate('/');
    } catch (err) {
      setError(err.message || 'Failed to verify 2FA code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#f5f5f5',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        py: 4,
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 600,
          padding: 4,
          borderRadius: 3,
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography variant="h3" fontWeight="700" color="primary.main" sx={{ letterSpacing: 1, mb: 1 }}>
            Avatar Social App
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 500 }}>
            Sign in to manage your social content
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2, fontWeight: 600, fontSize: '0.95rem' }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleEmailLogin} autoComplete="on">
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Email Address"
                fullWidth
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                size="medium"
                autoComplete="email"
                sx={{ '& .MuiInputBase-input': { fontSize: '1.1rem' }, '& .MuiInputLabel-root': { fontSize: '1.1rem' } }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Password"
                fullWidth
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                size="medium"
                autoComplete="current-password"
                sx={{ '& .MuiInputBase-input': { fontSize: '1.1rem' }, '& .MuiInputLabel-root': { fontSize: '1.1rem' } }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.8,
              fontWeight: '700',
              fontSize: '1.1rem',
              backgroundColor: '#004e89',
              '&:hover': {
                backgroundColor: '#003f6b',
              },
              boxShadow: '0 4px 12px rgba(0,78,137,0.4)',
            }}
          >
            {loading ? <CircularProgress size={28} color="inherit" /> : 'LOG IN'}
          </Button>
        </form>

        <Typography
          variant="body2"
          align="center"
          mt={2}
          sx={{ color: 'text.secondary' }}
        >
          <Link
            to="/forgot-password"
            style={{ textDecoration: 'none', color: '#004e89', fontWeight: 600 }}
          >
            Forgot your password?
          </Link>
        </Typography>

        <Divider sx={{ my: 3, color: 'grey.400' }}>OR</Divider>

        <Button
          variant="outlined"
          startIcon={<GoogleIcon />}
          fullWidth
          onClick={handleGoogleLogin}
          sx={{
            mb: 1.5,
            py: 1.5,
            borderColor: '#db4437',
            color: '#db4437',
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': {
              borderColor: '#a33629',
              backgroundColor: 'rgba(219, 68, 55, 0.08)',
            },
          }}
          disabled={loading}
        >
          Continue with Google
        </Button>

        <Button
          variant="outlined"
          startIcon={<FacebookIcon />}
          fullWidth
          onClick={handleFacebookLogin}
          sx={{
            py: 1.5,
            borderColor: '#3b5998',
            color: '#3b5998',
            fontWeight: 600,
            fontSize: '1rem',
            '&:hover': {
              borderColor: '#2d4373',
              backgroundColor: 'rgba(59, 89, 152, 0.08)',
            },
          }}
          disabled={loading}
        >
          Continue with Facebook
        </Button>

        <Typography
          variant="body1"
          align="center"
          mt={3}
          sx={{ color: 'text.secondary', fontWeight: 500, fontSize: '1rem' }}
        >
          Don't have an account?{' '}
          <Link
            to="/register"
            style={{ textDecoration: 'none', color: '#004e89', fontWeight: 700 }}
          >
            Sign up here
          </Link>
        </Typography>
        
        <Typography
          variant="body2"
          align="center"
          mt={1.5}
          sx={{ 
            color: 'info.main', 
            fontWeight: 500, 
            fontSize: '0.875rem',
            bgcolor: '#e3f2fd',
            p: 1.5,
            borderRadius: 1,
            border: '1px solid #90caf9'
          }}
        >
          💡 <strong>New here?</strong> You must create an account first before logging in
        </Typography>

        <Dialog open={show2FA} onClose={() => setShow2FA(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, color: '#004e89' }}>
            Two-Factor Verification
          </DialogTitle>
          <DialogContent>
            <Typography variant="body2" gutterBottom sx={{ mb: 2, color: 'text.primary' }}>
              Enter the 6-digit code from your authenticator app:
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              label="2FA Code"
              type="text"
              fullWidth
              variant="outlined"
              value={twoFactorCode}
              onChange={(e) => setTwoFactorCode(e.target.value)}
              disabled={loading}
              inputProps={{ maxLength: 6, style: { letterSpacing: '0.3em', fontSize: '1.2rem', textAlign: 'center' } }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShow2FA(false)} disabled={loading}>
              Cancel
            </Button>
            <Button
              onClick={handle2FAVerification}
              disabled={loading}
              variant="contained"
              sx={{ backgroundColor: '#004e89', '&:hover': { backgroundColor: '#003f6b' } }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
}

export default Login;
