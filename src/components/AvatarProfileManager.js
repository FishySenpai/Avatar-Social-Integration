import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Grid,
  Typography,
  TextField,
  Button,
  Chip,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Slider,
  Avatar,
  IconButton,
  Alert,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Save as SaveIcon,
  Refresh as RefreshIcon,
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  Help as HelpIcon,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import {
  saveAvatarProfile,
  getAvatarProfile,
  updateProfileCompletion,
} from "../services/userDataService";

// Personality traits dataset
const personalityTraits = [
  "Creative",
  "Analytical",
  "Leader",
  "Team Player",
  "Innovative",
  "Detail-oriented",
  "Adaptable",
  "Strategic",
  "Communicative",
  "Empathetic",
  "Problem Solver",
  "Organized",
  "Self-motivated",
  "Patient",
  "Enthusiastic",
];

// Avatar customization options
// First, update the avatar options with correct API parameter values
const avatarOptions = {
  hairstyles: [
    { label: "Short", value: "ShortHairShortFlat" },
    { label: "Long", value: "LongHairStraight" },
    { label: "Curly", value: "LongHairCurly" },
    { label: "Straight", value: "LongHairStraight2" },
    { label: "Wavy", value: "LongHairDreads" },
    { label: "Bald", value: "NoHair" },
  ],
  hairColors: [
    { label: "Black", value: "Black" },
    { label: "Brown", value: "Brown" },
    { label: "Blonde", value: "Blonde" },
    { label: "Red", value: "Red" },
    { label: "Gray", value: "Gray" },
    { label: "Custom", value: "Platinum" },
  ],
  skinTones: [
    { label: "Light", value: "Light" },
    { label: "Medium", value: "Tanned" },
    { label: "Dark", value: "DarkBrown" },
    { label: "Olive", value: "Brown" },
    { label: "Fair", value: "Pale" },
    { label: "Deep", value: "Black" },
  ],
  clothing: [
    { label: "Casual", value: "ShirtCrewNeck" },
    { label: "Professional", value: "BlazerShirt" },
    { label: "Sporty", value: "ShirtScoopNeck" },
    { label: "Formal", value: "BlazerSweater" },
    { label: "Creative", value: "GraphicShirt" },
  ],
  accessories: [
    { label: "Glasses", value: "Prescription01" },
    { label: "Earrings", value: "Earring" },
    { label: "Necklace", value: "Round" },
    { label: "Hat", value: "Hat" },
    { label: "None", value: "Blank" },
  ],
};

// Bio templates based on traits
const bioTemplates = {
  Creative: "An imaginative individual who thinks outside the box",
  Analytical: "Data-driven professional with a strategic mindset",
  Leader: "Natural leader who inspires and motivates teams",
  "Team Player": "Collaborative professional who thrives in team environments",
  Innovative: "Forward-thinking individual passionate about innovation",
};

const AvatarProfileManager = ({ onSaveComplete }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    displayName: "",
    bio: "",
    selectedTraits: [],
    avatarStyle: {
      hairstyle: "ShortHairShortFlat", // Updated to match API values
      hairColor: "Black",
      skinTone: "Light",
      clothing: "ShirtCrewNeck",
      accessories: "Blank",
    },
    privacySettings: {
      showEmail: true,
      showBio: true,
      showTraits: true,
    },
  });
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({
    show: false,
    message: "",
    type: "info",
  });

  // Load user profile
  useEffect(() => {
    const loadProfile = async () => {
      if (currentUser) {
        try {
          const profileData = await getAvatarProfile(currentUser.uid);
          
          // Ensure avatarStyle has all required fields with default values
          const defaultAvatarStyle = {
            hairstyle: "ShortHairShortFlat",
            hairColor: "Black",
            skinTone: "Light",
            clothing: "ShirtCrewNeck",
            accessories: "Blank",
          };
          
          setProfile((prev) => ({
            ...prev,
            ...profileData,
            avatarStyle: {
              ...defaultAvatarStyle,
              ...(profileData.avatarStyle || {}),
            },
            privacySettings:
              profileData.privacySettings || prev.privacySettings,
          }));

          setLoading(false);
        } catch (error) {
          console.error("Error loading profile:", error);
          setNotification({
            show: true,
            message: "Error loading profile",
            type: "error",
          });
          setLoading(false);
        }
      }
    };

    loadProfile();
  }, [currentUser]);

  // Generate bio suggestions based on traits
  const generateBioSuggestion = () => {
    if (profile.selectedTraits.length === 0) return "";

    const mainTrait = profile.selectedTraits[0];
    const template = bioTemplates[mainTrait] || "";

    const traits = profile.selectedTraits.slice(1, 4).join(", ");
    return `${template}. Also known for being ${traits}.`;
  };

  // Handle trait selection
  const handleTraitToggle = (trait) => {
    setProfile((prev) => {
      const traits = prev.selectedTraits.includes(trait)
        ? prev.selectedTraits.filter((t) => t !== trait)
        : [...prev.selectedTraits, trait].slice(0, 5);

      return { ...prev, selectedTraits: traits };
    });
  };

  // Handle avatar style changes
  const handleAvatarStyleChange = (category, value) => {
    setProfile((prev) => ({
      ...prev,
      avatarStyle: {
        ...prev.avatarStyle,
        [category]: value,
      },
    }));
  };

  // Handle privacy toggle
  const handlePrivacyToggle = (setting) => {
    setProfile((prev) => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [setting]: !prev.privacySettings[setting],
      },
    }));
  };

  // Generate avatar URL from current avatar style
  const getAvatarUrl = () => {
    return `https://avataaars.io/?avatarStyle=Transparent&topType=${profile.avatarStyle.hairstyle}&hairColor=${profile.avatarStyle.hairColor}&skinColor=${profile.avatarStyle.skinTone}&clotheType=${profile.avatarStyle.clothing}&accessoriesType=${profile.avatarStyle.accessories}`;
  };

  // Save profile changes
  const handleSave = async () => {
    console.log("🔵 Save button clicked!");
    console.log("🔵 Current user:", currentUser?.uid);
    console.log("🔵 Profile data:", profile);
    
    if (!currentUser) {
      setNotification({
        show: true,
        message: "Please login to save your profile",
        type: "error",
      });
      return;
    }
    
    try {
      console.log("🟢 Saving profile...");
      
      // Generate avatar URL
      const avatarURL = getAvatarUrl();
      console.log("🎨 Generated avatar URL:", avatarURL);
      
      // Update Firebase Auth profile with avatar using auth.currentUser
      // This ensures we're using the actual Firebase Auth user object with all methods
      const firebaseUser = auth.currentUser;
      if (firebaseUser) {
        await updateProfile(firebaseUser, {
          photoURL: avatarURL,
          displayName: profile.displayName || currentUser.displayName
        });
        console.log("✅ Firebase Auth profile updated with avatar!");
      }
      
      // Save to Firestore (including the avatar URL as photoURL)
      const profileData = {
        ...profile,
        photoURL: avatarURL, // Save avatar URL to Firestore as well
      };
      await saveAvatarProfile(currentUser.uid, profileData);
      console.log("✅ Profile saved to Firestore!");

      // Update profile completion
      const completionScore = getProfileCompletion();
      console.log("🟢 Updating completion score:", completionScore);
      await updateProfileCompletion(currentUser.uid, {
        score: completionScore,
        lastUpdated: new Date().toISOString(),
      });
      console.log("✅ Completion updated!");

      setNotification({
        show: true,
        message: "Profile saved successfully! Avatar updated! Redirecting to dashboard...",
        type: "success",
      });
      
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        console.log("🔵 Redirecting to dashboard...");
        if (onSaveComplete) {
          onSaveComplete();
        } else {
          navigate('/dashboard');
        }
      }, 1500);
    } catch (error) {
      console.error("❌ Error saving profile:", error);
      console.error("Error details:", error.message, error.stack);
      setNotification({
        show: true,
        message: `Error saving profile: ${error.message}`,
        type: "error",
      });
    }
  };

  // Get profile completion percentage
  const getProfileCompletion = () => {
    let score = 0;
    if (profile.displayName && profile.displayName.trim()) score += 20;
    if (profile.bio && profile.bio.trim()) score += 20;
    if (profile.selectedTraits.length > 0) score += 20;
    // Check if all avatar style fields are set (they always are now with defaults)
    if (profile.avatarStyle && 
        profile.avatarStyle.hairstyle && 
        profile.avatarStyle.hairColor && 
        profile.avatarStyle.skinTone && 
        profile.avatarStyle.clothing && 
        profile.avatarStyle.accessories) score += 20;
    // Privacy settings are configured (all fields are defined)
    if (profile.privacySettings && 
        typeof profile.privacySettings.showEmail !== 'undefined' &&
        typeof profile.privacySettings.showBio !== 'undefined' &&
        typeof profile.privacySettings.showTraits !== 'undefined') score += 20;
    return score;
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Typography>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Avatar Profile Manager
      </Typography>

      <Grid container spacing={3}>
        {/* Avatar Preview and Customization */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar
                src={`https://avataaars.io/?avatarStyle=Transparent&topType=${profile.avatarStyle.hairstyle}&hairColor=${profile.avatarStyle.hairColor}&skinColor=${profile.avatarStyle.skinTone}&clotheType=${profile.avatarStyle.clothing}&accessoriesType=${profile.avatarStyle.accessories}`}
                sx={{ 
                  width: 200, 
                  height: 200, 
                  mb: 2,
                  bgcolor: 'primary.light',
                  border: '4px solid',
                  borderColor: 'primary.main'
                }}
              />
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                component="label"
              >
                Upload Custom Avatar
                <input type="file" hidden accept="image/*" />
              </Button>
            </Box>
            {/* Avatar Customization Controls */}
            {Object.entries(avatarOptions).map(([category, options]) => {
              // Convert category name to match the property in profile.avatarStyle
              const propertyMapping = {
                hairstyles: "hairstyle",
                hairColors: "hairColor",
                skinTones: "skinTone",
                clothing: "clothing",
                accessories: "accessories",
              };

              const propertyName = propertyMapping[category];

              return (
                <FormControl fullWidth margin="normal" key={category}>
                  <InputLabel>
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </InputLabel>
                  <Select
                    value={profile.avatarStyle[propertyName]}
                    onChange={(e) =>
                      handleAvatarStyleChange(propertyName, e.target.value)
                    }
                    label={category.charAt(0).toUpperCase() + category.slice(1)}
                  >
                    {options.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              );
            })}
          </Paper>
        </Grid>

        {/* Profile Information */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Basic Information
            </Typography>

            <TextField
              fullWidth
              label="Display Name"
              value={profile.displayName}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, displayName: e.target.value }))
              }
              margin="normal"
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Bio"
              value={profile.bio}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, bio: e.target.value }))
              }
              margin="normal"
            />

            <Box sx={{ mt: 2, mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Personality Traits (Select up to 5)
              </Typography>
              <Box display="flex" flexWrap="wrap" gap={1}>
                {personalityTraits.map((trait) => (
                  <Chip
                    key={trait}
                    label={trait}
                    onClick={() => handleTraitToggle(trait)}
                    color={
                      profile.selectedTraits.includes(trait)
                        ? "primary"
                        : "default"
                    }
                  />
                ))}
              </Box>
            </Box>

            <Button
              startIcon={<RefreshIcon />}
              onClick={() =>
                setProfile((prev) => ({
                  ...prev,
                  bio: generateBioSuggestion(),
                }))
              }
              sx={{ mt: 2 }}
            >
              Generate Bio Suggestion
            </Button>
          </Paper>

          {/* Privacy Settings */}
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Privacy Settings
            </Typography>

            <Grid container spacing={2}>
              {Object.entries(profile.privacySettings).map(
                ([setting, value]) => (
                  <Grid item xs={12} sm={6} key={setting}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={value}
                          onChange={() => handlePrivacyToggle(setting)}
                          color="primary"
                        />
                      }
                      label={`Show ${setting.replace("show", "")}`}
                    />
                  </Grid>
                )
              )}
            </Grid>
          </Paper>

          {/* Profile Completion */}
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Profile Completion
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                {getProfileCompletion()}% Complete
              </Typography>
              <LinearProgress
                variant="determinate"
                value={getProfileCompletion()}
              />
            </Box>

            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              fullWidth
            >
              Save Profile
            </Button>
          </Paper>
        </Grid>
      </Grid>

      {/* Notification Alert */}
      {notification.show && (
        <Alert
          severity={notification.type}
          onClose={() => setNotification((prev) => ({ ...prev, show: false }))}
          sx={{ position: "fixed", bottom: 24, right: 24 }}
        >
          {notification.message}
        </Alert>
      )}
    </Box>
  );
};

export default AvatarProfileManager;
