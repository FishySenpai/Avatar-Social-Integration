import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Sms as SmsIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

export default function PhoneVerification() {
  const [activeStep, setActiveStep] = useState(0);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState(null);
  const { sendPhoneOTP, verifyPhoneOTP, currentUser } = useAuth();
  const navigate = useNavigate();

  const steps = ['Enter Phone Number', 'Verify OTP', 'Verification Complete'];

  useEffect(() => {
    // Setup reCAPTCHA container
    return () => {
      // Cleanup
      if (window.recaptchaVerifier) {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = null;
      }
    };
  }, []);

  const formatPhoneNumber = (number) => {
    // Remove all non-numeric characters
    const cleaned = number.replace(/\D/g, '');
    
    // Add country code if not present
    if (!cleaned.startsWith('+')) {
      return `+1${cleaned}`;
    }
    return `+${cleaned}`;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const formattedPhone = formatPhoneNumber(phoneNumber);
      
      // Validate phone number format
      if (formattedPhone.length < 10) {
        throw new Error('Please enter a valid phone number');
      }

      // Send OTP
      const result = await sendPhoneOTP(formattedPhone, 'recaptcha-container');
      setConfirmationResult(result);
      setSuccess('OTP sent successfully! Please check your phone.');
      setActiveStep(1);
    } catch (err) {
      setError(err.message || 'Failed to send OTP. Please try again.');
      console.error('Phone verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (!otpCode || otpCode.length !== 6) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      // Verify OTP
      await verifyPhoneOTP(otpCode);
      setSuccess('Phone number verified successfully!');
      setActiveStep(2);
      
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Invalid OTP. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setOtpCode('');
    setActiveStep(0);
    setError('');
    setSuccess('');
    
    // Clear old reCAPTCHA
    if (window.recaptchaVerifier) {
      window.recaptchaVerifier.clear();
      window.recaptchaVerifier = null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: 600,
          width: '100%',
          p: 4,
          borderRadius: 3,
        }}
      >
        <Box textAlign="center" mb={3}>
          <PhoneIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Phone Verification
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Verify your phone number to enhance account security
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>
            {success}
          </Alert>
        )}

        {/* Step 1: Enter Phone Number */}
        {activeStep === 0 && (
          <Box component="form" onSubmit={handleSendOTP}>
            <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
              Enter your phone number to receive a verification code
            </Typography>
            
            <TextField
              fullWidth
              label="Phone Number"
              placeholder="+1 (555) 123-4567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon />
                  </InputAdornment>
                ),
              }}
              helperText="Include country code (e.g., +1 for US)"
              sx={{ mb: 2 }}
            />

            {/* reCAPTCHA Container */}
            <Box id="recaptcha-container" sx={{ mb: 2 }}></Box>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || !phoneNumber}
              sx={{ mb: 2 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </Button>

            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate('/dashboard')}
              disabled={loading}
            >
              Skip for Now
            </Button>
          </Box>
        )}

        {/* Step 2: Verify OTP */}
        {activeStep === 1 && (
          <Box component="form" onSubmit={handleVerifyOTP}>
            <Typography variant="body1" gutterBottom sx={{ mb: 2 }}>
              Enter the 6-digit code sent to <strong>{phoneNumber}</strong>
            </Typography>
            
            <TextField
              fullWidth
              label="OTP Code"
              placeholder="000000"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
              required
              disabled={loading}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SmsIcon />
                  </InputAdornment>
                ),
              }}
              inputProps={{
                maxLength: 6,
                style: { fontSize: '24px', textAlign: 'center', letterSpacing: '8px' }
              }}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={loading || otpCode.length !== 6}
              sx={{ mb: 2 }}
            >
              {loading ? (
                <>
                  <CircularProgress size={24} sx={{ mr: 1 }} />
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </Button>

            <Button
              variant="text"
              fullWidth
              onClick={handleResendOTP}
              disabled={loading}
            >
              Didn't receive code? Resend OTP
            </Button>
          </Box>
        )}

        {/* Step 3: Success */}
        {activeStep === 2 && (
          <Box textAlign="center">
            <CheckCircleIcon 
              sx={{ 
                fontSize: 80, 
                color: 'success.main', 
                mb: 2 
              }} 
            />
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Verification Complete!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Your phone number has been successfully verified.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Redirecting to dashboard...
            </Typography>
          </Box>
        )}

        {activeStep < 2 && (
          <Box mt={3} textAlign="center">
            <Typography variant="caption" color="text.secondary">
              Standard SMS rates may apply. Your phone number will be kept secure and private.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}


