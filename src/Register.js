// UpdatedRegister.js
import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import {
  Avatar,
  Button,
  TextField,
  Grid,
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  InputAdornment,
  IconButton,
  Alert,
  Fade,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');
  const navigate = useNavigate();
  const { signup, setTimeActive } = useAuth();

  // Generate random 6-digit OTP
  const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  useEffect(() => {
    // Cleanup function to prevent memory leaks
    return () => {
      setError('');
      setOtpError('');
    };
  }, []);

  // Calculate password strength
  useEffect(() => {
    if (password.length === 0) {
      setPasswordStrength('');
      return;
    }

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength <= 2) setPasswordStrength('weak');
    else if (strength <= 4) setPasswordStrength('medium');
    else setPasswordStrength('strong');
  }, [password]);

  const validatePassword = () => {
    // Check if passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Check password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Check password strength
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      setError('Password must contain at least one uppercase letter, one lowercase letter, and one number');
      return false;
    }

    return true;
  };

  const handleRegisterDetails = async (e) => {
    e.preventDefault();
    setError('');

    // Validate first name
    if (!firstName || firstName.trim() === '') {
      setError('First name is required');
      return;
    }

    if (firstName.trim().length < 2) {
      setError('First name must be at least 2 characters long');
      return;
    }

    // Validate last name
    if (!lastName || lastName.trim() === '') {
      setError('Last name is required');
      return;
    }

    if (lastName.trim().length < 2) {
      setError('Last name must be at least 2 characters long');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!validatePassword()) {
      return;
    }

    // Generate random OTP
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    setShowOtp(true);
    setOtpSent(true);
    
    // Log OTP to console for development
    console.log('='.repeat(60));
    console.log('🔐 REGISTRATION OTP');
    console.log('='.repeat(60));
    console.log('Email:', email);
    console.log('OTP Code:', newOtp);
    console.log('Valid for: 10 minutes');
    console.log('='.repeat(60));
  };

  const handleResendOtp = () => {
    setOtpError('');
    setOtp('');
    setOtpSent(true);
    
    // Generate new random OTP
    const newOtp = generateOTP();
    setGeneratedOtp(newOtp);
    
    // Log OTP to console again
    console.log('='.repeat(60));
    console.log('🔄 RESEND OTP');
    console.log('='.repeat(60));
    console.log('Email:', email);
    console.log('OTP Code:', newOtp);
    console.log('Valid for: 10 minutes');
    console.log('='.repeat(60));
    
    // Show success message
    setOtpError('');
    setTimeout(() => {
      setOtpError('✅ OTP resent successfully! Check console for the new code.');
    }, 100);
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');

    // Validate OTP
    if (!otp || otp.trim() === '') {
      setOtpError('Please enter the OTP code');
      return;
    }

    if (otp !== generatedOtp) {
      setOtpError(`Invalid OTP. Please enter the correct 6-digit code from console (F12)`);
      return;
    }

    try {
      await signup(email, password, firstName, lastName);
      setTimeActive(true);
      navigate('/verify-email');
    } catch (err) {
      // Handle specific Firebase auth errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          setOtpError('This email is already registered. Please login instead');
          break;
        case 'auth/invalid-email':
          setOtpError('Invalid email address format');
          break;
        case 'auth/operation-not-allowed':
          setOtpError('Email/password accounts are not enabled. Please contact support');
          break;
        case 'auth/weak-password':
          setOtpError('Password is too weak. Please choose a stronger password');
          break;
        case 'auth/network-request-failed':
          setOtpError('Network error. Please check your internet connection');
          break;
        default:
          setOtpError(err.message || 'Failed to create account. Please try again');
      }
    }
  };

  return (
    <Box
      sx={{
        bgcolor: '#f5f5f5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
      }}
    >
      <Container component="main" maxWidth="sm">
        <Fade in timeout={600}>
          <Card
            sx={{
              borderRadius: 4,
              backgroundColor: '#ffffff',
              boxShadow: 8,
              p: 3,
            }}
          >
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ textAlign: 'center' }}>
                <Avatar sx={{ m: 'auto', bgcolor: 'primary.main' }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography variant="h3" fontWeight="700" color="primary.main" sx={{ mb: 1, letterSpacing: 1 }}>
                  Avatar Social App
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                  {showOtp ? 'Verify OTP' : 'Create your account'}
                </Typography>
              </Box>

              {error && !showOtp && (
                <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>
              )}

              {!showOtp ? (
                <Box component="form" onSubmit={handleRegisterDetails} sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required fullWidth label="First Name"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        autoComplete="given-name"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.1rem' }, '& .MuiInputLabel-root': { fontSize: '1.1rem' } }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        required fullWidth label="Last Name"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        autoComplete="family-name"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.1rem' }, '& .MuiInputLabel-root': { fontSize: '1.1rem' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required fullWidth label="Email"
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        autoComplete="email"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.1rem' }, '& .MuiInputLabel-root': { fontSize: '1.1rem' } }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required fullWidth label="Password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        autoComplete="new-password"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.1rem' }, '& .MuiInputLabel-root': { fontSize: '1.1rem' } }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                      {password && (
                        <Box sx={{ mt: 1 }}>
                          <Typography variant="caption" sx={{ 
                            color: passwordStrength === 'weak' ? 'error.main' : 
                                   passwordStrength === 'medium' ? 'warning.main' : 'success.main',
                            fontWeight: 600
                          }}>
                            Password strength: {passwordStrength === 'weak' ? '⚠️ Weak' : 
                                              passwordStrength === 'medium' ? '⚡ Medium' : '✅ Strong'}
                          </Typography>
                          <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
                            Use at least 6 characters with uppercase, lowercase, and numbers
                          </Typography>
                        </Box>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        required fullWidth label="Confirm Password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                        autoComplete="new-password"
                        sx={{ '& .MuiInputBase-input': { fontSize: '1.1rem' }, '& .MuiInputLabel-root': { fontSize: '1.1rem' } }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{
                      mt: 2.5,
                      py: 1.8,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    Register
                  </Button>

                  <Typography align="center" sx={{ mt: 2, fontSize: '1rem' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 600 }}>
                      Login
                    </Link>
                  </Typography>
                </Box>
              ) : (
                <Box component="form" onSubmit={handleOtpSubmit} sx={{ mt: 3 }}>
                  <Typography color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                    {otpSent ? '🔐 OTP sent! Check browser console (F12) for your code' : 'Enter OTP'}
                  </Typography>
                  <TextField
                    required fullWidth label="Enter 6-Digit OTP"
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    autoComplete="off"
                    placeholder="e.g., 123456"
                    inputProps={{ maxLength: 6 }}
                    sx={{ 
                      '& .MuiInputBase-input': { fontSize: '1.3rem', letterSpacing: '0.3rem', textAlign: 'center' }, 
                      '& .MuiInputLabel-root': { fontSize: '1.1rem' } 
                    }}
                  />
                  {otpError && (
                    <Alert 
                      severity={otpError.includes('✅') ? 'success' : 'error'} 
                      sx={{ mt: 2 }}
                    >
                      {otpError}
                    </Alert>
                  )}
                  
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{
                      mt: 3,
                      py: 1.4,
                      fontWeight: 'bold',
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    Verify OTP
                  </Button>

                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={handleResendOtp}
                    sx={{
                      mt: 2,
                      py: 1.2,
                      fontWeight: 'bold',
                      letterSpacing: 0.5,
                      textTransform: 'uppercase',
                      borderWidth: 2,
                      '&:hover': {
                        borderWidth: 2,
                      }
                    }}
                  >
                    🔄 Resend OTP
                  </Button>

                  <Typography align="center" sx={{ mt: 2, fontSize: '0.95rem', color: 'text.secondary' }}>
                    Didn't receive the code? Check your console (F12)
                  </Typography>

                  <Button
                    fullWidth
                    variant="text"
                    onClick={() => setShowOtp(false)}
                    sx={{
                      mt: 1,
                      py: 1,
                      color: 'text.secondary',
                      '&:hover': {
                        backgroundColor: 'rgba(0,0,0,0.04)',
                      }
                    }}
                  >
                    ← Back to Registration
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Fade>
      </Container>
    </Box>
  );
}

export default Register;
