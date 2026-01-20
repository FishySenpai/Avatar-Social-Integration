import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  TextField,
  Avatar,
  Tab,
  Tabs,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  IconButton,
  Divider,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputAdornment,
  Chip,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  PhotoCamera as PhotoCameraIcon,
  Visibility,
  VisibilityOff,
  Save as SaveIcon,
  CheckCircle as CheckCircleIcon,
  Lock as LockIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  VpnKey as VpnKeyIcon,
  Shield as ShieldIcon,
} from '@mui/icons-material';
import { useAuth } from '../AuthContext';
import { auth, db } from '../firebase';
import { 
  updateProfile, 
  updateEmail, 
  updatePassword, 
  EmailAuthProvider, 
  reauthenticateWithCredential,
  sendEmailVerification,
  deleteUser 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';

const ProfileSettings = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  
  // Profile State
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    email: currentUser?.email || '',
    photoURL: currentUser?.photoURL || '',
    phoneNumber: currentUser?.phoneNumber || '',
    bio: '',
  });

  // Password State
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Email Update State
  const [emailData, setEmailData] = useState({
    newEmail: '',
    password: '',
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    loginAlerts: true,
    sessionTimeout: 30,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showPhone: false,
    activityStatus: true,
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    marketingEmails: false,
  });

  // Delete Account Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');

  // Load user data
  useEffect(() => {
    const loadUserData = async () => {
      if (currentUser) {
        // Load basic info from Firebase Auth
        const basicData = {
          displayName: currentUser.displayName || '',
          email: currentUser.email || '',
          photoURL: currentUser.photoURL || '',
          phoneNumber: currentUser.phoneNumber || '',
          bio: '',
          role: 'basic',
        };

        // Try to load additional data from Firestore
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDocSnap = await getDoc(userDocRef);
          
          if (userDocSnap.exists()) {
            const firestoreData = userDocSnap.data();
            basicData.bio = firestoreData.bio || '';
            basicData.role = firestoreData.role || 'basic';
          }
        } catch (error) {
          console.log('Could not load from Firestore:', error);
        }

        setProfileData(basicData);

        // Load from localStorage
        const savedSettings = localStorage.getItem(`userSettings_${currentUser.uid}`);
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);
          if (parsed.security) setSecuritySettings(parsed.security);
          if (parsed.privacy) setPrivacySettings(parsed.privacy);
          if (parsed.notifications) setNotificationSettings(parsed.notifications);
        }
      }
    };

    loadUserData();
  }, [currentUser]);

  // Save settings to localStorage
  const saveSettings = () => {
    if (currentUser) {
      const settings = {
        security: securitySettings,
        privacy: privacySettings,
        notifications: notificationSettings,
      };
      localStorage.setItem(`userSettings_${currentUser.uid}`, JSON.stringify(settings));
    }
  };

  // Update Profile
  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      // Update Firebase Auth profile
      await updateProfile(auth.currentUser, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL,
      });
      
      // Save additional data to Firestore
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        await setDoc(userDocRef, {
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: profileData.displayName,
          photoURL: profileData.photoURL,
          phoneNumber: profileData.phoneNumber,
          bio: profileData.bio,
          role: profileData.role || 'basic',
          updatedAt: new Date().toISOString(),
        }, { merge: true });
      } catch (firestoreError) {
        console.log('Firestore update skipped:', firestoreError);
      }
      
      setSnack({ open: true, message: '✅ Profile updated successfully!', severity: 'success' });
    } catch (error) {
      setSnack({ open: true, message: `❌ Error: ${error.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Update Email
  const handleUpdateEmail = async () => {
    if (!emailData.newEmail || !emailData.password) {
      setSnack({ open: true, message: '⚠️ Please fill all fields', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        emailData.password
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update email
      await updateEmail(auth.currentUser, emailData.newEmail);
      await sendEmailVerification(auth.currentUser);

      setEmailData({ newEmail: '', password: '' });
      setSnack({ 
        open: true, 
        message: '✅ Email updated! Please check your new email for verification.', 
        severity: 'success' 
      });
    } catch (error) {
      setSnack({ open: true, message: `❌ Error: ${error.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Change Password
  const handleChangePassword = async () => {
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setSnack({ open: true, message: '⚠️ Please fill all password fields', severity: 'warning' });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setSnack({ open: true, message: '⚠️ New passwords do not match', severity: 'warning' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setSnack({ open: true, message: '⚠️ Password must be at least 6 characters', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        passwordData.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, passwordData.newPassword);

      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setSnack({ open: true, message: '✅ Password changed successfully!', severity: 'success' });
    } catch (error) {
      setSnack({ open: true, message: `❌ Error: ${error.message}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (!deleteConfirmPassword) {
      setSnack({ open: true, message: '⚠️ Please enter your password', severity: 'warning' });
      return;
    }

    setLoading(true);
    try {
      // Re-authenticate user
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        deleteConfirmPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Delete user
      await deleteUser(auth.currentUser);

      setSnack({ open: true, message: '✅ Account deleted successfully', severity: 'success' });
    } catch (error) {
      setSnack({ open: true, message: `❌ Error: ${error.message}`, severity: 'error' });
      setLoading(false);
    }
  };

  // Save Security Settings
  const handleSaveSecuritySettings = () => {
    saveSettings();
    setSnack({ open: true, message: '✅ Security settings saved!', severity: 'success' });
  };

  // Save Privacy Settings
  const handleSavePrivacySettings = () => {
    saveSettings();
    setSnack({ open: true, message: '✅ Privacy settings saved!', severity: 'success' });
  };

  // Save Notification Settings
  const handleSaveNotificationSettings = () => {
    saveSettings();
    setSnack({ open: true, message: '✅ Notification settings saved!', severity: 'success' });
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: 4,
            p: 4,
            mb: 4,
            color: '#fff',
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src={profileData.photoURL}
              sx={{ width: 80, height: 80, border: '4px solid rgba(255,255,255,0.3)' }}
            >
              {profileData.displayName?.charAt(0) || 'U'}
            </Avatar>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Profile Settings
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.9 }}>
                Manage your account, security, and preferences
              </Typography>
            </Box>
          </Stack>
        </Box>
      </motion.div>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: '4px 4px 0 0',
            },
          }}
        >
          <Tab icon={<PersonIcon />} label="Profile" iconPosition="start" />
          <Tab icon={<SecurityIcon />} label="Security" iconPosition="start" />
          <Tab icon={<ShieldIcon />} label="Privacy" iconPosition="start" />
          <Tab icon={<NotificationsIcon />} label="Notifications" iconPosition="start" />
          <Tab icon={<SettingsIcon />} label="Account" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <motion.div
          key="profile"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Grid container spacing={3}>
            {/* Profile Information */}
            <Grid item xs={12} md={8}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Basic Information
                </Typography>

                <Stack spacing={3}>
                  <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Avatar
                      src={profileData.photoURL}
                      sx={{ width: 120, height: 120, margin: '0 auto', mb: 2 }}
                    >
                      {profileData.displayName?.charAt(0) || 'U'}
                    </Avatar>
                    <TextField
                      fullWidth
                      label="Profile Picture URL"
                      value={profileData.photoURL}
                      onChange={(e) => setProfileData({ ...profileData, photoURL: e.target.value })}
                      placeholder="https://example.com/avatar.jpg"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhotoCameraIcon />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Display Name"
                    value={profileData.displayName}
                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Email"
                    value={profileData.email}
                    disabled
                    helperText="Use the Security tab to change your email"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    label="Phone Number"
                    value={profileData.phoneNumber}
                    onChange={(e) => setProfileData({ ...profileData, phoneNumber: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                  />

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                    onClick={handleUpdateProfile}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      py: 1.5,
                    }}
                  >
                    Save Profile
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Profile Stats */}
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={2}>
                  Account Status
                </Typography>
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Email Verified</Typography>
                    <Chip
                      label={currentUser?.emailVerified ? 'Verified' : 'Not Verified'}
                      color={currentUser?.emailVerified ? 'success' : 'warning'}
                      size="small"
                      icon={currentUser?.emailVerified ? <CheckCircleIcon /> : <WarningIcon />}
                    />
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Role</Typography>
                    <Chip 
                      label={profileData.role === 'admin' ? 'Admin' : profileData.role === 'premium' ? 'Premium' : 'Basic'} 
                      size="small" 
                      color={profileData.role === 'admin' ? 'error' : profileData.role === 'premium' ? 'secondary' : 'primary'} 
                    />
                  </Box>
                  <Divider />
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Typography variant="body2">Member Since</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleDateString() : 'N/A'}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>

              <Alert severity="info" sx={{ borderRadius: 2 }}>
                <Typography variant="body2" fontWeight="bold" mb={1}>
                  Profile Completeness
                </Typography>
                <Typography variant="body2">
                  {profileData.displayName && profileData.photoURL && profileData.bio 
                    ? '100% Complete!'
                    : 'Complete your profile for better experience'}
                </Typography>
              </Alert>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {activeTab === 1 && (
        <motion.div
          key="security"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Grid container spacing={3}>
            {/* Change Password */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <LockIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Change Password
                  </Typography>
                </Stack>

                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    type={showPasswords.current ? 'text' : 'password'}
                    label="Current Password"
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                          >
                            {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    type={showPasswords.new ? 'text' : 'password'}
                    label="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    helperText="Minimum 6 characters"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                          >
                            {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    type={showPasswords.confirm ? 'text' : 'password'}
                    label="Confirm New Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                          >
                            {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <LockIcon />}
                    onClick={handleChangePassword}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    }}
                  >
                    Change Password
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Change Email */}
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                  <EmailIcon color="primary" />
                  <Typography variant="h6" fontWeight="bold">
                    Change Email
                  </Typography>
                </Stack>

                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Current Email"
                    value={currentUser?.email}
                    disabled
                  />

                  <TextField
                    fullWidth
                    type="email"
                    label="New Email"
                    value={emailData.newEmail}
                    onChange={(e) => setEmailData({ ...emailData, newEmail: e.target.value })}
                    placeholder="newemail@example.com"
                  />

                  <TextField
                    fullWidth
                    type="password"
                    label="Confirm Password"
                    value={emailData.password}
                    onChange={(e) => setEmailData({ ...emailData, password: e.target.value })}
                    helperText="Enter your password to confirm"
                  />

                  <Button
                    variant="contained"
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <EmailIcon />}
                    onClick={handleUpdateEmail}
                    disabled={loading}
                    sx={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    Update Email
                  </Button>
                </Stack>
              </Paper>
            </Grid>

            {/* Security Settings */}
            <Grid item xs={12}>
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight="bold" mb={3}>
                  Security Settings
                </Typography>

                <List>
                  <ListItem>
                    <ListItemIcon>
                      <VpnKeyIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Two-Factor Authentication"
                      secondary="Add an extra layer of security to your account"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={securitySettings.twoFactorEnabled}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: e.target.checked })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <ListItemIcon>
                      <ShieldIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Login Alerts"
                      secondary="Get notified when someone logs into your account"
                    />
                    <ListItemSecondaryAction>
                      <Switch
                        checked={securitySettings.loginAlerts}
                        onChange={(e) => setSecuritySettings({ ...securitySettings, loginAlerts: e.target.checked })}
                      />
                    </ListItemSecondaryAction>
                  </ListItem>
                </List>

                <Box sx={{ mt: 3 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveSecuritySettings}
                  >
                    Save Security Settings
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </motion.div>
      )}

      {activeTab === 2 && (
        <motion.div
          key="privacy"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Privacy Settings
            </Typography>

            <List>
              <ListItem>
                <ListItemText
                  primary="Profile Visibility"
                  secondary="Control who can see your profile"
                />
                <ListItemSecondaryAction>
                  <Chip label={privacySettings.profileVisibility} color="primary" />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Show Email"
                  secondary="Display your email on public profile"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={privacySettings.showEmail}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, showEmail: e.target.checked })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Show Phone"
                  secondary="Display your phone number on public profile"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={privacySettings.showPhone}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, showPhone: e.target.checked })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Activity Status"
                  secondary="Show when you're online"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={privacySettings.activityStatus}
                    onChange={(e) => setPrivacySettings({ ...privacySettings, activityStatus: e.target.checked })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSavePrivacySettings}
              >
                Save Privacy Settings
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}

      {activeTab === 3 && (
        <motion.div
          key="notifications"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={3}>
              Notification Preferences
            </Typography>

            <List>
              <ListItem>
                <ListItemText
                  primary="Email Notifications"
                  secondary="Receive notifications via email"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.emailNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Push Notifications"
                  secondary="Receive push notifications in browser"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.pushNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="SMS Notifications"
                  secondary="Receive notifications via SMS"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.smsNotifications}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText
                  primary="Marketing Emails"
                  secondary="Receive promotional content and updates"
                />
                <ListItemSecondaryAction>
                  <Switch
                    checked={notificationSettings.marketingEmails}
                    onChange={(e) => setNotificationSettings({ ...notificationSettings, marketingEmails: e.target.checked })}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            </List>

            <Box sx={{ mt: 3 }}>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                onClick={handleSaveNotificationSettings}
              >
                Save Notification Settings
              </Button>
            </Box>
          </Paper>
        </motion.div>
      )}

      {activeTab === 4 && (
        <motion.div
          key="account"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
            <Typography variant="h6" fontWeight="bold" mb={2}>
              Account Information
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">User ID:</Typography>
                <Typography variant="body2" fontFamily="monospace">{currentUser?.uid}</Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Created:</Typography>
                <Typography variant="body2">
                  {currentUser?.metadata?.creationTime ? new Date(currentUser.metadata.creationTime).toLocaleString() : 'N/A'}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Last Sign In:</Typography>
                <Typography variant="body2">
                  {currentUser?.metadata?.lastSignInTime ? new Date(currentUser.metadata.lastSignInTime).toLocaleString() : 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </Paper>

          <Paper sx={{ p: 3, borderRadius: 3, border: '2px solid #f44336' }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={2}>
              <WarningIcon color="error" />
              <Typography variant="h6" fontWeight="bold" color="error">
                Danger Zone
              </Typography>
            </Stack>
            <Typography variant="body2" color="text.secondary" mb={3}>
              Once you delete your account, there is no going back. Please be certain.
            </Typography>
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setDeleteDialogOpen(true)}
            >
              Delete Account
            </Button>
          </Paper>
        </motion.div>
      )}

      {/* Delete Account Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#f44336', color: '#fff' }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <WarningIcon />
            <Typography variant="h6" fontWeight="bold">
              Delete Account
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight="bold">
              This action cannot be undone!
            </Typography>
            <Typography variant="body2">
              All your data, including profile, posts, and settings will be permanently deleted.
            </Typography>
          </Alert>
          <TextField
            fullWidth
            type="password"
            label="Confirm Password"
            value={deleteConfirmPassword}
            onChange={(e) => setDeleteConfirmPassword(e.target.value)}
            placeholder="Enter your password to confirm"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <DeleteIcon />}
            onClick={handleDeleteAccount}
            disabled={loading || !deleteConfirmPassword}
          >
            Permanently Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      {snack.open && (
        <Alert
          severity={snack.severity}
          onClose={() => setSnack({ ...snack, open: false })}
          sx={{
            position: 'fixed',
            top: 16,
            right: 16,
            zIndex: 9999,
            minWidth: 300,
            boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
          }}
        >
          {snack.message}
        </Alert>
      )}
    </Box>
  );
};

export default ProfileSettings;

