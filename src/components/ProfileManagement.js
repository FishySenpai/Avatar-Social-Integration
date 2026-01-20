import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  Chip,
  Switch,
  FormControlLabel,
  Divider,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  RadioGroup,
  Radio,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Security as SecurityIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from '@mui/icons-material';
import { useAuth } from '../AuthContext';
import { doc, updateDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { avatarStyles, avatarCategories, avatarFeatures } from '../data/avatarData';

// Personality traits options
const personalityTraits = [
  'Creative', 'Analytical', 'Leader', 'Team Player', 'Innovative',
  'Detail-oriented', 'Adaptable', 'Strategic', 'Communicative', 'Enthusiastic'
];

const ProfileManagement = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Profile Data
  const [profileData, setProfileData] = useState({
    displayName: currentUser?.displayName || '',
    bio: '',
    selectedTraits: [],
    avatarStyle: '',
    privacySettings: {
      showEmail: true,
      showBio: true,
      showTraits: true,
    }
  });

  // Avatar Filter States
  const [avatarFilters, setAvatarFilters] = useState({
    category: '',
    gender: '',
    searchTerm: '',
  });

  // Edit States
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTrait, setSelectedTrait] = useState('');

  useEffect(() => {
    // Load user profile data
    const loadProfileData = async () => {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const userDocSnap = await userDocRef.get();
        
        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setProfileData({
            displayName: data.displayName || currentUser?.displayName || '',
            bio: data.bio || '',
            selectedTraits: data.traits || [],
            avatarStyle: data.avatarStyle || avatarStyles[0].url, // Set default avatar
            privacySettings: data.privacySettings || {
              showEmail: true,
              showBio: true,
              showTraits: true,
            }
          });
        } else {
          // Create default profile if it doesn't exist
          const defaultProfile = {
            displayName: currentUser?.displayName || '',
            bio: '',
            traits: [],
            avatarStyle: avatarStyles[0].url,
            privacySettings: {
              showEmail: true,
              showBio: true,
              showTraits: true,
            },
            createdAt: new Date().toISOString(),
          };
          
          await setDoc(userDocRef, defaultProfile);
          setProfileData(defaultProfile);
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Failed to load profile data');
      }
    };

    if (currentUser?.uid) {
      loadProfileData();
    }
  }, [currentUser]);

  const handleSaveProfile = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        displayName: profileData.displayName,
        bio: profileData.bio,
        traits: profileData.selectedTraits,
        avatarStyle: profileData.avatarStyle,
        privacySettings: profileData.privacySettings,
        updatedAt: new Date().toISOString(),
      });

      setSuccess('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTrait = () => {
    if (selectedTrait && !profileData.selectedTraits.includes(selectedTrait)) {
      setProfileData({
        ...profileData,
        selectedTraits: [...profileData.selectedTraits, selectedTrait]
      });
      setSelectedTrait('');
    }
  };

  const handleRemoveTrait = (trait) => {
    setProfileData({
      ...profileData,
      selectedTraits: profileData.selectedTraits.filter(t => t !== trait)
    });
  };

  const handlePrivacyChange = (setting) => {
    setProfileData({
      ...profileData,
      privacySettings: {
        ...profileData.privacySettings,
        [setting]: !profileData.privacySettings[setting]
      }
    });
  };

  // Filter avatars based on selected filters
  const filteredAvatars = avatarStyles.filter(avatar => {
    const matchesCategory = !avatarFilters.category || avatar.category === avatarFilters.category;
    const matchesGender = !avatarFilters.gender || avatar.gender === avatarFilters.gender;
    const matchesSearch = !avatarFilters.searchTerm || 
      avatar.name.toLowerCase().includes(avatarFilters.searchTerm.toLowerCase()) ||
      avatar.features.some(feature => feature.toLowerCase().includes(avatarFilters.searchTerm.toLowerCase()));
    
    return matchesCategory && matchesGender && matchesSearch;
  });

  // Handle avatar selection
  const handleAvatarSelect = (avatarUrl) => {
    setProfileData(prev => ({
      ...prev,
      avatarStyle: avatarUrl
    }));
    
    // Save immediately if we're not in edit mode
    if (!isEditing) {
      handleSaveProfile();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Profile Header */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Typography variant="h4">Profile Management</Typography>
              <Button
                variant="contained"
                startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
                onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                disabled={loading}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </Box>
          </Paper>
        </Grid>

        {/* Alerts */}
        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}
        {success && (
          <Grid item xs={12}>
            <Alert severity="success">{success}</Alert>
          </Grid>
        )}

        {/* Avatar Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Avatar Settings</Typography>
            
            {/* Current Avatar */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <Avatar
                src={profileData.avatarStyle || avatarStyles[0].url}
                sx={{ 
                  width: 150, 
                  height: 150, 
                  mb: 2,
                  border: '2px solid',
                  borderColor: 'primary.main'
                }}
              />
              <Typography variant="subtitle1" gutterBottom>
                Current Avatar
              </Typography>
            </Box>

            {/* Avatar Filters */}
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Search Avatars"
                value={avatarFilters.searchTerm}
                onChange={(e) => setAvatarFilters({
                  ...avatarFilters,
                  searchTerm: e.target.value
                })}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={avatarFilters.category}
                  onChange={(e) => setAvatarFilters({
                    ...avatarFilters,
                    category: e.target.value
                  })}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {avatarCategories.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl component="fieldset">
                <Typography variant="subtitle2" gutterBottom>Gender</Typography>
                <RadioGroup
                  row
                  value={avatarFilters.gender}
                  onChange={(e) => setAvatarFilters({
                    ...avatarFilters,
                    gender: e.target.value
                  })}
                >
                  <FormControlLabel value="" control={<Radio />} label="All" />
                  <FormControlLabel value="Male" control={<Radio />} label="Male" />
                  <FormControlLabel value="Female" control={<Radio />} label="Female" />
                </RadioGroup>
              </FormControl>
            </Box>

            {/* Avatar Grid */}
            <Grid container spacing={1}>
              {filteredAvatars.map((style) => (
                <Grid item xs={6} key={style.id}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      border: profileData.avatarStyle === style.url ? '2px solid' : '1px solid',
                      borderColor: profileData.avatarStyle === style.url ? 'primary.main' : 'grey.300',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'scale(1.02)',
                        transition: 'all 0.2s ease-in-out'
                      }
                    }}
                    onClick={() => handleAvatarSelect(style.url)}
                  >
                    <CardContent>
                      <Avatar
                        src={style.url}
                        sx={{ 
                          width: '100%', 
                          height: 'auto', 
                          aspectRatio: '1',
                          mb: 1,
                          border: '1px solid',
                          borderColor: 'grey.200'
                        }}
                      />
                      <Typography variant="caption" display="block" textAlign="center">
                        {style.name}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Profile Info Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Profile Information</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Display Name"
                  value={profileData.displayName}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    displayName: e.target.value
                  })}
                  disabled={!isEditing}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={4}
                  value={profileData.bio}
                  onChange={(e) => setProfileData({
                    ...profileData,
                    bio: e.target.value
                  })}
                  disabled={!isEditing}
                  helperText="Tell us about yourself"
                />
              </Grid>
            </Grid>
          </Paper>

          {/* Personality Traits Section */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Personality Traits</Typography>
            <Box sx={{ mb: 2 }}>
              <FormControl fullWidth disabled={!isEditing}>
                <InputLabel>Add Trait</InputLabel>
                <Select
                  value={selectedTrait}
                  onChange={(e) => setSelectedTrait(e.target.value)}
                >
                  {personalityTraits.map((trait) => (
                    <MenuItem key={trait} value={trait}>
                      {trait}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                onClick={handleAddTrait}
                disabled={!isEditing || !selectedTrait}
                sx={{ mt: 1 }}
              >
                Add Trait
              </Button>
            </Box>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {profileData.selectedTraits.map((trait) => (
                <Chip
                  key={trait}
                  label={trait}
                  onDelete={isEditing ? () => handleRemoveTrait(trait) : undefined}
                />
              ))}
            </Box>
          </Paper>

          {/* Privacy Settings Section */}
          <Paper sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" gutterBottom>Privacy Settings</Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={profileData.privacySettings.showEmail}
                  onChange={() => handlePrivacyChange('showEmail')}
                  disabled={!isEditing}
                />
              }
              label="Show Email"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={profileData.privacySettings.showBio}
                  onChange={() => handlePrivacyChange('showBio')}
                  disabled={!isEditing}
                />
              }
              label="Show Bio"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={profileData.privacySettings.showTraits}
                  onChange={() => handlePrivacyChange('showTraits')}
                  disabled={!isEditing}
                />
              }
              label="Show Personality Traits"
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProfileManagement; 