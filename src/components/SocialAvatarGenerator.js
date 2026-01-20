import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextareaAutosize,
  CircularProgress,
  Avatar,
  Tabs,
  Tab,
  Tooltip,
  LinearProgress,
} from '@mui/material';
import {
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  YouTube as YouTubeIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
  Check as CheckIcon,
  Link as LinkIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  Tag as TagIcon,
  Preview as PreviewIcon,
  Tune as TuneIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { socialMediaService } from '../services/socialMediaService';
import DateTimePickerWrapper from './DateTimePickerWrapper';

// Kaggle dataset URL for professional avatars and social media content
const KAGGLE_AVATAR_DATASET = 'https://www.kaggle.com/datasets/professional-avatars';
const KAGGLE_CONTENT_DATASET = 'https://www.kaggle.com/datasets/social-media-content';

// Enhanced social platforms with posting time recommendations
const socialPlatforms = [
  { 
    name: 'Instagram', 
    icon: <InstagramIcon />, 
    color: '#E1306C',
    bestTimes: ['11:00', '14:00', '19:00'],
    hashtagLimit: 30,
    imageRatio: '1:1',
  },
  { 
    name: 'Facebook', 
    icon: <FacebookIcon />, 
    color: '#4267B2',
    bestTimes: ['9:00', '13:00', '15:00'],
    hashtagLimit: 10,
    imageRatio: '16:9',
  },
  { 
    name: 'Twitter', 
    icon: <TwitterIcon />, 
    color: '#1DA1F2',
    bestTimes: ['8:00', '12:00', '17:00'],
    hashtagLimit: 5,
    imageRatio: '16:9',
  },
  { 
    name: 'LinkedIn', 
    icon: <LinkedInIcon />, 
    color: '#0077B5',
    bestTimes: ['10:00', '14:00', '16:00'],
    hashtagLimit: 8,
    imageRatio: '1.91:1',
  },
  { 
    name: 'YouTube', 
    icon: <YouTubeIcon />, 
    color: '#FF0000',
    bestTimes: ['15:00', '17:00', '20:00'],
    hashtagLimit: 15,
    imageRatio: '16:9',
  },
];

// Avatar styles with professional categories
const avatarStyles = [
  { id: 'professional', name: 'Professional', category: 'Business' },
  { id: 'casual', name: 'Casual', category: 'Social' },
  { id: 'creative', name: 'Creative', category: 'Art' },
  { id: 'tech', name: 'Tech-Savvy', category: 'Technology' },
  { id: 'lifestyle', name: 'Lifestyle', category: 'Personal' },
  { id: 'fitness', name: 'Fitness', category: 'Health' },
  { id: 'travel', name: 'Travel', category: 'Adventure' },
  { id: 'food', name: 'Food & Culinary', category: 'Hospitality' },
];

const SocialAvatarGenerator = () => {
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('');
  const [generatedAvatars, setGeneratedAvatars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(new Set());
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [postContent, setPostContent] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [posting, setPosting] = useState(false);
  const [postResults, setPostResults] = useState({});
  const [connectedPlatforms, setConnectedPlatforms] = useState(new Set());
  
  // Avatar customization options
  const [customization, setCustomization] = useState({
    mood: 50, // 0-100 scale for expression intensity
    professionalism: 50,
    creativity: 50,
    lighting: 50,
  });

  // New state variables for enhanced features
  const [selectedTab, setSelectedTab] = useState(0);
  const [scheduledTime, setScheduledTime] = useState(new Date());
  const [suggestedHashtags, setSuggestedHashtags] = useState([]);
  const [contentScore, setContentScore] = useState(0);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [previewMode, setPreviewMode] = useState('');
  const [postAnalytics, setPostAnalytics] = useState({
    engagement: 0,
    reach: 0,
    sentiment: 'neutral',
  });

  useEffect(() => {
    // Load connected platforms on component mount
    setConnectedPlatforms(new Set(socialMediaService.getConnectedPlatforms()));
  }, []);

  const handlePlatformConnect = async (platform) => {
    try {
      await socialMediaService.connectPlatform(platform);
      setConnectedPlatforms(new Set(socialMediaService.getConnectedPlatforms()));
    } catch (error) {
      setError(`Failed to connect to ${platform}: ${error.message}`);
    }
  };

  const handlePlatformSelect = (platform) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(platform)) {
      newSelected.delete(platform);
    } else {
      newSelected.add(platform);
    }
    setSelectedPlatforms(newSelected);
  };

  const handleShareClick = (avatar) => {
    setSelectedAvatar(avatar);
    setPostContent(`Check out my new ${avatar.style} avatar for ${avatar.platform}! #AIAvatar #SocialMedia`);
    setPostDialogOpen(true);
  };

  // Function to generate relevant hashtags based on content and platform
  const generateHashtags = async (content, platform) => {
    try {
      const response = await fetch(`${KAGGLE_CONTENT_DATASET}/hashtags?platform=${platform}&content=${encodeURIComponent(content)}`);
      const data = await response.json();
      setSuggestedHashtags(data.hashtags);
    } catch (error) {
      console.error('Failed to generate hashtags:', error);
    }
  };

  // Function to estimate post performance
  const estimatePerformance = async (content, platform) => {
    try {
      setIsOptimizing(true);
      const response = await fetch(`${KAGGLE_CONTENT_DATASET}/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, platform }),
      });
      const data = await response.json();
      setContentScore(data.score);
      setPostAnalytics({
        engagement: data.estimatedEngagement,
        reach: data.estimatedReach,
        sentiment: data.sentiment,
      });
    } catch (error) {
      console.error('Failed to estimate performance:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Function to optimize post content
  const optimizeContent = async () => {
    try {
      setIsOptimizing(true);
      const response = await fetch(`${KAGGLE_CONTENT_DATASET}/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: postContent,
          platform: selectedPlatform,
          style: selectedStyle,
        }),
      });
      const data = await response.json();
      setPostContent(data.optimizedContent);
      setSuggestedHashtags(data.suggestedHashtags);
    } catch (error) {
      console.error('Failed to optimize content:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  // Enhanced post handler with scheduling
  const handlePost = async () => {
    if (!selectedAvatar || selectedPlatforms.size === 0) {
      setError('Please select platforms to post to');
      return;
    }

    setPosting(true);
    setError('');
    setPostResults({});

    try {
      const results = await socialMediaService.schedulePostToMultiplePlatforms(
        postContent,
        Array.from(selectedPlatforms),
        selectedAvatar.url,
        scheduledTime,
        suggestedHashtags
      );
      setPostResults(results);
      
      if (Object.values(results).every(r => r.success)) {
        setTimeout(() => {
          setPostDialogOpen(false);
          setPostResults({});
        }, 2000);
      }
    } catch (error) {
      setError('Failed to schedule posts');
    } finally {
      setPosting(false);
    }
  };

  const generateAvatarUrl = (style, platform) => {
    // Using DiceBear API for avatar generation
    const seed = `${style}-${platform}-${Date.now()}`; // Add timestamp for uniqueness
    const style_param = style.toLowerCase();
    
    return `https://api.dicebear.com/7.x/avataaars/svg` +
      `?seed=${encodeURIComponent(seed)}` +
      `&backgroundColor=random` +
      `&radius=50` +
      `&accessories=variant01,variant02,variant03` +
      `&clothing=variant01,variant02,variant03,variant04` +
      `&eyes=variant01,variant02,variant03,variant04,variant05` +
      `&eyebrows=variant01,variant02,variant03,variant04` +
      `&mouth=variant01,variant02,variant03,variant04,variant05` +
      `&hair=variant01,variant02,variant03,variant04,variant05,variant06,variant07` +
      `&skinColor=variant01,variant02,variant03,variant04` +
      `&hairColor=variant01,variant02,variant03,variant04,variant05`;
  };

  const handleGenerate = async () => {
    if (!selectedPlatform || !selectedStyle) {
      setError('Please select both platform and style');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Generate multiple variations
      const newAvatars = Array(4).fill(null).map(() => ({
        id: Math.random().toString(36).substr(2, 9),
        url: generateAvatarUrl(selectedStyle, selectedPlatform),
        platform: selectedPlatform,
        style: selectedStyle,
        timestamp: new Date().toISOString(),
      }));

      setGeneratedAvatars(prev => [...newAvatars, ...prev].slice(0, 12));
    } catch (error) {
      setError('Failed to generate avatars. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (avatarUrl) => {
    try {
      const response = await fetch(avatarUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `social-avatar-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      setError('Failed to download avatar');
    }
  };

  // Update the share dialog content
  const ShareDialog = () => (
    <Dialog
      open={postDialogOpen}
      onClose={() => !posting && setPostDialogOpen(false)}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab icon={<EditIcon />} label="Content" />
          <Tab icon={<PreviewIcon />} label="Preview" />
          <Tab icon={<AnalyticsIcon />} label="Analytics" />
          <Tab icon={<ScheduleIcon />} label="Schedule" />
        </Tabs>
      </DialogTitle>
      <DialogContent>
        {selectedTab === 0 && (
          <Box>
            <TextareaAutosize
              minRows={4}
              placeholder="Write your post content..."
              value={postContent}
              onChange={(e) => {
                setPostContent(e.target.value);
                generateHashtags(e.target.value, selectedPlatform);
                estimatePerformance(e.target.value, selectedPlatform);
              }}
              style={{
                width: '100%',
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
            <Button
              startIcon={<TuneIcon />}
              onClick={optimizeContent}
              disabled={isOptimizing}
              sx={{ mt: 2 }}
            >
              {isOptimizing ? 'Optimizing...' : 'Optimize Content'}
            </Button>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2">Suggested Hashtags</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {suggestedHashtags.map((tag) => (
                  <Chip
                    key={tag}
                    label={`#${tag}`}
                    onClick={() => setPostContent(prev => `${prev} #${tag}`)}
                    size="small"
                  />
                ))}
              </Stack>
            </Box>
          </Box>
        )}

        {selectedTab === 1 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>Platform Preview</Typography>
            {Array.from(selectedPlatforms).map((platform) => (
              <Card key={platform} sx={{ mb: 2, p: 2 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  {socialPlatforms.find(p => p.name === platform)?.icon}
                  <Typography variant="subtitle1">{platform}</Typography>
                </Stack>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                  <Typography>{postContent}</Typography>
                  {selectedAvatar && (
                    <img
                      src={selectedAvatar.url}
                      alt="Preview"
                      style={{ maxWidth: '100%', marginTop: 8 }}
                    />
                  )}
                </Box>
              </Card>
            ))}
          </Box>
        )}

        {selectedTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>Content Performance Estimation</Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle2">Content Score</Typography>
              <LinearProgress
                variant="determinate"
                value={contentScore}
                sx={{ mt: 1, mb: 2 }}
              />
              <Typography variant="body2" color="textSecondary">
                {contentScore}% - {contentScore > 70 ? 'Good' : contentScore > 40 ? 'Average' : 'Needs Improvement'}
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Typography variant="subtitle2">Estimated Engagement</Typography>
                <Typography variant="h6">{postAnalytics.engagement}%</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2">Estimated Reach</Typography>
                <Typography variant="h6">{postAnalytics.reach}</Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle2">Sentiment Analysis</Typography>
                <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
                  {postAnalytics.sentiment}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}

        {selectedTab === 3 && (
          <Box>
            <Typography variant="subtitle2" gutterBottom>Schedule Post</Typography>
            <DateTimePickerWrapper
              value={scheduledTime}
              onChange={(newValue) => setScheduledTime(newValue)}
            />
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle2" gutterBottom>Recommended Posting Times</Typography>
              {Array.from(selectedPlatforms).map((platform) => {
                const platformData = socialPlatforms.find(p => p.name === platform);
                return (
                  <Box key={platform} sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      {platform}: {platformData?.bestTimes.join(', ')}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setPostDialogOpen(false)}
          disabled={posting}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePost}
          variant="contained"
          disabled={posting || selectedPlatforms.size === 0}
          startIcon={posting ? <CircularProgress size={20} /> : <ShareIcon />}
        >
          {posting ? 'Scheduling...' : 'Schedule Posts'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Social Media Avatar Generator
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Controls Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Avatar Settings
            </Typography>

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Social Platform</InputLabel>
              <Select
                value={selectedPlatform}
                onChange={(e) => setSelectedPlatform(e.target.value)}
                label="Social Platform"
              >
                {socialPlatforms.map((platform) => (
                  <MenuItem key={platform.name} value={platform.name}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {platform.icon}
                      {platform.name}
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Avatar Style</InputLabel>
              <Select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value)}
                label="Avatar Style"
              >
                {avatarStyles.map((style) => (
                  <MenuItem key={style.id} value={style.id}>
                    {style.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Social Media Connections */}
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Connected Platforms
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {socialPlatforms.map((platform) => (
                <Chip
                  key={platform.name}
                  icon={platform.icon}
                  label={platform.name}
                  color={connectedPlatforms.has(platform.name) ? "success" : "default"}
                  onClick={() => handlePlatformConnect(platform.name)}
                  sx={{ 
                    bgcolor: connectedPlatforms.has(platform.name) ? 'success.light' : 'default',
                    '&:hover': {
                      bgcolor: connectedPlatforms.has(platform.name) ? 'success.main' : 'default',
                    }
                  }}
                />
              ))}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
              Customization
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">Mood Expression</Typography>
              <Slider
                value={customization.mood}
                onChange={(e, value) => setCustomization(prev => ({ ...prev, mood: value }))}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">Professionalism</Typography>
              <Slider
                value={customization.professionalism}
                onChange={(e, value) => setCustomization(prev => ({ ...prev, professionalism: value }))}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="body2">Creativity</Typography>
              <Slider
                value={customization.creativity}
                onChange={(e, value) => setCustomization(prev => ({ ...prev, creativity: value }))}
                valueLabelDisplay="auto"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2">Lighting</Typography>
              <Slider
                value={customization.lighting}
                onChange={(e, value) => setCustomization(prev => ({ ...prev, lighting: value }))}
                valueLabelDisplay="auto"
              />
            </Box>

            <Button
              variant="contained"
              fullWidth
              onClick={handleGenerate}
              disabled={loading}
              startIcon={<RefreshIcon />}
            >
              {loading ? 'Generating...' : 'Generate Avatars'}
            </Button>
          </Paper>
        </Grid>

        {/* Generated Avatars Grid */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Generated Avatars
            </Typography>
            
            <Grid container spacing={2}>
              {generatedAvatars.map((avatar) => (
                <Grid item xs={12} sm={6} md={4} key={avatar.id}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="200"
                      image={avatar.url}
                      alt={`${avatar.style} avatar for ${avatar.platform}`}
                      sx={{ objectFit: 'contain', p: 2 }}
                    />
                    <CardContent sx={{ pt: 1 }}>
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                        <Chip
                          icon={socialPlatforms.find(p => p.name === avatar.platform)?.icon}
                          label={avatar.platform}
                          size="small"
                        />
                        <Box>
                          <IconButton
                            onClick={() => handleDownload(avatar.url)}
                            size="small"
                            color="primary"
                          >
                            <DownloadIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleShareClick(avatar)}
                            size="small"
                            color="primary"
                          >
                            <ShareIcon />
                          </IconButton>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {generatedAvatars.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography color="textSecondary">
                  No avatars generated yet. Select your preferences and click Generate!
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      <ShareDialog />
    </Box>
  );
};

export default SocialAvatarGenerator; 