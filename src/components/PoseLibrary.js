import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Chip,
  TextField,
  InputAdornment,
  Alert,
  Tabs,
  Tab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  PlayArrow as PlayArrowIcon,
  Add as AddIcon,
  FilterList as FilterIcon,
  ContentCopy as CopyIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

// Predefined pose library
const poseCategories = {
  casual: {
    name: 'Casual Poses',
    color: '#4CAF50',
    poses: [
      { id: 'casual-1', name: 'Standing Relaxed', description: 'Natural standing pose with weight on one leg' },
      { id: 'casual-2', name: 'Arms Crossed', description: 'Confident pose with arms crossed' },
      { id: 'casual-3', name: 'Hands in Pockets', description: 'Casual stance with hands in pockets' },
      { id: 'casual-4', name: 'Leaning', description: 'Leaning against a wall or surface' },
      { id: 'casual-5', name: 'Walking', description: 'Mid-walk natural movement' },
    ]
  },
  professional: {
    name: 'Professional Poses',
    color: '#2196F3',
    poses: [
      { id: 'prof-1', name: 'Corporate Standing', description: 'Professional standing pose, hands at sides' },
      { id: 'prof-2', name: 'Presenting', description: 'One arm gesturing, presenting to audience' },
      { id: 'prof-3', name: 'Thinking', description: 'Hand on chin, thoughtful expression' },
      { id: 'prof-4', name: 'Handshake', description: 'Extended hand for handshake' },
      { id: 'prof-5', name: 'Sitting at Desk', description: 'Professional seated position' },
    ]
  },
  expressive: {
    name: 'Expressive Gestures',
    color: '#FF9800',
    poses: [
      { id: 'expr-1', name: 'Waving', description: 'Friendly wave gesture' },
      { id: 'expr-2', name: 'Thumbs Up', description: 'Positive thumbs up gesture' },
      { id: 'expr-3', name: 'Peace Sign', description: 'Two fingers peace/victory sign' },
      { id: 'expr-4', name: 'Pointing', description: 'Pointing gesture for emphasis' },
      { id: 'expr-5', name: 'Open Arms', description: 'Welcoming open arms gesture' },
      { id: 'expr-6', name: 'Clapping', description: 'Hands together in clapping motion' },
    ]
  },
  sitting: {
    name: 'Sitting Poses',
    color: '#9C27B0',
    poses: [
      { id: 'sit-1', name: 'Sitting Upright', description: 'Formal upright sitting position' },
      { id: 'sit-2', name: 'Sitting Relaxed', description: 'Casual relaxed sitting' },
      { id: 'sit-3', name: 'Cross-Legged', description: 'Sitting cross-legged on floor' },
      { id: 'sit-4', name: 'Legs Crossed', description: 'Sitting with legs crossed' },
      { id: 'sit-5', name: 'Leaning Back', description: 'Relaxed leaning back pose' },
    ]
  },
  action: {
    name: 'Action Poses',
    color: '#F44336',
    poses: [
      { id: 'act-1', name: 'Running', description: 'Dynamic running pose' },
      { id: 'act-2', name: 'Jumping', description: 'Mid-jump action pose' },
      { id: 'act-3', name: 'Reaching Up', description: 'Reaching upward motion' },
      { id: 'act-4', name: 'Dancing', description: 'Energetic dance move' },
      { id: 'act-5', name: 'Yoga Pose', description: 'Balanced yoga position' },
    ]
  },
  social: {
    name: 'Social Media',
    color: '#E91E63',
    poses: [
      { id: 'social-1', name: 'Selfie Pose', description: 'Classic selfie pose with phone' },
      { id: 'social-2', name: 'Instagram Pose', description: 'Trendy Instagram-style pose' },
      { id: 'social-3', name: 'Model Pose', description: 'Fashion model standing pose' },
      { id: 'social-4', name: 'Looking Away', description: 'Looking to the side thoughtfully' },
      { id: 'social-5', name: 'Power Pose', description: 'Confident power stance' },
    ]
  }
};

// Generate pose data (keypoints) for each pose
const generatePoseKeypoints = (poseId) => {
  // This is a simplified version. In production, these would be actual pose coordinates
  const basePose = {
    'casual-1': { shoulders: 0.5, elbows: 0.6, hips: 0.7, knees: 0.8 },
    'casual-2': { shoulders: 0.4, elbows: 0.5, hips: 0.7, knees: 0.85 },
    'prof-1': { shoulders: 0.45, elbows: 0.65, hips: 0.7, knees: 0.85 },
    'expr-1': { shoulders: 0.4, elbows: 0.3, hips: 0.7, knees: 0.85 },
  };
  
  return basePose[poseId] || { shoulders: 0.5, elbows: 0.6, hips: 0.7, knees: 0.8 };
};

const PoseLibrary = () => {
  const { currentUser } = useAuth();
  const [activeCategory, setActiveCategory] = useState('casual');
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [customPoses, setCustomPoses] = useState([]);
  const [selectedPose, setSelectedPose] = useState(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [filterDifficulty, setFilterDifficulty] = useState('all');

  useEffect(() => {
    if (currentUser) {
      loadFavorites();
      loadCustomPoses();
    }
  }, [currentUser]);

  const loadFavorites = async () => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, 'poseFavorites'),
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const favs = snapshot.docs.map(doc => doc.data().poseId);
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  const loadCustomPoses = async () => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, 'customPoses'),
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const poses = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCustomPoses(poses);
    } catch (error) {
      console.error('Error loading custom poses:', error);
    }
  };

  const toggleFavorite = async (poseId) => {
    if (!currentUser) return;
    
    try {
      if (favorites.includes(poseId)) {
        // Remove from favorites
        const q = query(
          collection(db, 'poseFavorites'),
          where('userId', '==', currentUser.uid),
          where('poseId', '==', poseId)
        );
        const snapshot = await getDocs(q);
        snapshot.docs.forEach(async (document) => {
          await deleteDoc(doc(db, 'poseFavorites', document.id));
        });
        setFavorites(favorites.filter(id => id !== poseId));
        showNotification('Removed from favorites', 'info');
      } else {
        // Add to favorites
        await addDoc(collection(db, 'poseFavorites'), {
          userId: currentUser.uid,
          poseId: poseId,
          createdAt: new Date().toISOString()
        });
        setFavorites([...favorites, poseId]);
        showNotification('Added to favorites!', 'success');
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showNotification('Failed to update favorites', 'error');
    }
  };

  const showNotification = (message, severity = 'info') => {
    setNotification({ open: true, message, severity });
    setTimeout(() => setNotification({ ...notification, open: false }), 3000);
  };

  const handleApplyPose = (pose) => {
    setSelectedPose(pose);
    setPreviewOpen(true);
  };

  const handleDownloadPose = (pose) => {
    const poseData = {
      ...pose,
      keypoints: generatePoseKeypoints(pose.id),
      category: activeCategory,
    };
    const dataStr = JSON.stringify(poseData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${pose.name.replace(/\s+/g, '_')}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    showNotification('Pose downloaded!', 'success');
  };

  const handleCopyPose = (pose) => {
    const poseData = generatePoseKeypoints(pose.id);
    navigator.clipboard.writeText(JSON.stringify(poseData));
    showNotification('Pose data copied to clipboard!', 'success');
  };

  const getAllPoses = () => {
    return Object.values(poseCategories).flatMap(cat => cat.poses);
  };

  const getFilteredPoses = () => {
    const categoryPoses = poseCategories[activeCategory]?.poses || [];
    return categoryPoses.filter(pose =>
      pose.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pose.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const getFavoritePoses = () => {
    return getAllPoses().filter(pose => favorites.includes(pose.id));
  };

  const renderPoseCard = (pose, category) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={pose.id}>
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card 
          sx={{ 
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            '&:hover': {
              boxShadow: 6
            }
          }}
        >
          {/* Pose Preview Image Placeholder */}
          <Box 
            sx={{ 
              height: 200, 
              bgcolor: category ? poseCategories[category].color : '#9e9e9e',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              background: `linear-gradient(135deg, ${category ? poseCategories[category].color : '#9e9e9e'} 0%, ${category ? poseCategories[category].color : '#9e9e9e'}99 100%)`
            }}
          >
            <Typography variant="h1" sx={{ color: 'white', opacity: 0.3, fontSize: '100px' }}>
              🧍
            </Typography>
            <IconButton
              onClick={() => toggleFavorite(pose.id)}
              sx={{ 
                position: 'absolute', 
                top: 8, 
                right: 8,
                bgcolor: 'rgba(255,255,255,0.9)',
                '&:hover': { bgcolor: 'white' }
              }}
            >
              {favorites.includes(pose.id) ? (
                <FavoriteIcon color="error" />
              ) : (
                <FavoriteBorderIcon />
              )}
            </IconButton>
          </Box>

          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              {pose.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              {pose.description}
            </Typography>
            
            {category && (
              <Chip 
                label={poseCategories[category].name}
                size="small"
                sx={{ 
                  bgcolor: `${poseCategories[category].color}20`,
                  color: poseCategories[category].color,
                  fontWeight: 'bold'
                }}
              />
            )}
          </CardContent>

          <Box sx={{ p: 2, pt: 0, display: 'flex', gap: 1 }}>
            <Tooltip title="Preview">
              <IconButton 
                onClick={() => handleApplyPose(pose)}
                color="primary"
                size="small"
              >
                <VisibilityIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Copy Data">
              <IconButton 
                onClick={() => handleCopyPose(pose)}
                color="primary"
                size="small"
              >
                <CopyIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Download">
              <IconButton 
                onClick={() => handleDownloadPose(pose)}
                color="primary"
                size="small"
              >
                <DownloadIcon />
              </IconButton>
            </Tooltip>
            <Button
              fullWidth
              variant="contained"
              size="small"
              startIcon={<PlayArrowIcon />}
              onClick={() => handleApplyPose(pose)}
              sx={{ 
                ml: 'auto',
                background: `linear-gradient(45deg, ${category ? poseCategories[category].color : '#667eea'} 30%, ${category ? poseCategories[category].color : '#764ba2'}99 90%)`
              }}
            >
              Apply
            </Button>
          </Box>
        </Card>
      </motion.div>
    </Grid>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#667eea', mb: 1 }}>
            🎯 Pose Library
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Browse and apply professional poses to your avatar
          </Typography>
        </Box>

        {/* Search and Filters */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search poses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Difficulty</InputLabel>
                <Select
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                  label="Difficulty"
                >
                  <MenuItem value="all">All Levels</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="advanced">Advanced</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip 
                  label={`${getAllPoses().length} Total Poses`}
                  color="primary"
                  variant="outlined"
                />
                <Chip 
                  label={`${favorites.length} Favorites`}
                  color="error"
                  icon={<FavoriteIcon />}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Category Tabs */}
        <Paper sx={{ mb: 3 }}>
          <Tabs
            value={activeCategory}
            onChange={(e, val) => setActiveCategory(val)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {Object.entries(poseCategories).map(([key, cat]) => (
              <Tab
                key={key}
                value={key}
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box 
                      sx={{ 
                        width: 12, 
                        height: 12, 
                        borderRadius: '50%', 
                        bgcolor: cat.color 
                      }} 
                    />
                    {cat.name}
                    <Chip 
                      label={cat.poses.length}
                      size="small"
                      sx={{ ml: 0.5, height: 20 }}
                    />
                  </Box>
                }
              />
            ))}
            <Tab
              value="favorites"
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <FavoriteIcon />
                  Favorites
                  <Chip 
                    label={favorites.length}
                    size="small"
                    sx={{ ml: 0.5, height: 20 }}
                  />
                </Box>
              }
            />
          </Tabs>
        </Paper>

        {/* Poses Grid */}
        <Grid container spacing={3}>
          {activeCategory === 'favorites' ? (
            getFavoritePoses().length > 0 ? (
              getFavoritePoses().map(pose => {
                const category = Object.keys(poseCategories).find(key =>
                  poseCategories[key].poses.some(p => p.id === pose.id)
                );
                return renderPoseCard(pose, category);
              })
            ) : (
              <Grid item xs={12}>
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                  <FavoriteBorderIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h5" gutterBottom>
                    No Favorite Poses Yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Click the heart icon on poses to add them to your favorites
                  </Typography>
                </Paper>
              </Grid>
            )
          ) : (
            getFilteredPoses().map(pose => renderPoseCard(pose, activeCategory))
          )}
        </Grid>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle>
            {selectedPose?.name}
          </DialogTitle>
          <DialogContent>
            {selectedPose && (
              <Box>
                <Box 
                  sx={{ 
                    height: 400, 
                    bgcolor: '#f5f5f5',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 2,
                    mb: 2
                  }}
                >
                  <Typography variant="h1" sx={{ fontSize: '200px' }}>
                    🧍
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {selectedPose.description}
                </Typography>
                <Alert severity="info">
                  Click "Apply to Avatar" to use this pose in your motion capture or avatar generation.
                </Alert>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewOpen(false)}>Close</Button>
            <Button 
              variant="contained" 
              startIcon={<PlayArrowIcon />}
              onClick={() => {
                showNotification('Pose applied to avatar!', 'success');
                setPreviewOpen(false);
              }}
            >
              Apply to Avatar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification */}
        {notification.open && (
          <Alert
            severity={notification.severity}
            onClose={() => setNotification({ ...notification, open: false })}
            sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 9999 }}
          >
            {notification.message}
          </Alert>
        )}
      </motion.div>
    </Container>
  );
};

export default PoseLibrary;


