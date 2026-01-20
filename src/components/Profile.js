import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Avatar,
  Grid,
  Card,
  CardContent,
  CardActions,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../AuthContext';

const Profile = () => {
  const { currentUser } = useAuth();
  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [photoURL, setPhotoURL] = useState(currentUser?.photoURL || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await currentUser.updateProfile({
        displayName,
        photoURL,
      });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeToPremium = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // Here you would typically integrate with a payment processor
      // and update the user's role in your database
      setSuccess('Successfully upgraded to Premium!');
    } catch (err) {
      setError('Failed to upgrade account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Profile Settings
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={photoURL}
                alt={displayName}
                sx={{ width: 100, height: 100, mr: 2 }}
              />
              <Box>
                <TextField
                  label="Profile Picture URL"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  fullWidth
                  margin="normal"
                  disabled={loading}
                />
              </Box>
            </Box>

            <TextField
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              fullWidth
              margin="normal"
              disabled={loading}
            />

            <TextField
              label="Email"
              value={currentUser?.email}
              fullWidth
              margin="normal"
              disabled
            />

            <Button
              variant="contained"
              onClick={handleUpdateProfile}
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Update Profile'}
            </Button>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Type
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Current Plan: {currentUser?.role || 'Basic'}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                variant="contained"
                color="primary"
                onClick={handleUpgradeToPremium}
                disabled={loading || currentUser?.role === 'Premium'}
                fullWidth
              >
                {currentUser?.role === 'Premium'
                  ? 'Premium Member'
                  : 'Upgrade to Premium'}
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Account Security
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Two-Factor Authentication: {currentUser?.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Email Verified: {currentUser?.emailVerified ? 'Yes' : 'No'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Profile; 