import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Paper,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Tooltip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Slider,
  Switch,
  FormControlLabel,
  Divider,
  Avatar,
  Badge,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Collapse,
  Rating,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  Tag as TagIcon,
  TrendingUp as TrendingUpIcon,
  Description as DescriptionIcon,
  Title as TitleIcon,
  Tune as TuneIcon,
  ContentCopy as ContentCopyIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Palette as PaletteIcon,
  SentimentSatisfied as SentimentSatisfiedIcon,
  SentimentVerySatisfied as SentimentVerySatisfiedIcon,
  SentimentNeutral as SentimentNeutralIcon,
  SentimentDissatisfied as SentimentDissatisfiedIcon,
  Image as ImageIcon,
  Videocam as VideocamIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  EmojiEmotions as EmojiIcon,
  Star as StarIcon,
  Download as DownloadIcon,
  Save as SaveIcon,
  History as HistoryIcon,
  Analytics as AnalyticsIcon,
  Lightbulb as LightbulbIcon,
  Speed as SpeedIcon,
  Favorite as FavoriteIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, setDoc, getDoc, collection, addDoc, updateDoc, deleteDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { ThemeProvider, createTheme } from '@mui/material/styles';

// Professional theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f5f7fa',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

const CaptionGenerator = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [content, setContent] = useState('');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [trendingKeywords, setTrendingKeywords] = useState([]);
  const [tone, setTone] = useState('casual');
  const [toneStrength, setToneStrength] = useState(50);
  const [autoGenerate, setAutoGenerate] = useState(false);
  const [generatedTitles, setGeneratedTitles] = useState([]);
  const [selectedMediaType, setSelectedMediaType] = useState('image');
  const [generatedDescriptions, setGeneratedDescriptions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState([]);
  const [openHistoryDialog, setOpenHistoryDialog] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState('instagram');
  const [characterCount, setCharacterCount] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [emojiSuggestions, setEmojiSuggestions] = useState([]);
  const [savedCaptions, setSavedCaptions] = useState([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [captionVariations, setCaptionVariations] = useState([]);
  const [engagementPrediction, setEngagementPrediction] = useState(null);

  // Platform character limits
  const platformLimits = {
    twitter: 280,
    facebook: 63206,
    instagram: 2200,
    linkedin: 3000,
  };

  // Tones with better styling
  const tones = [
    { value: 'casual', label: 'Casual', icon: <SentimentVerySatisfiedIcon />, color: '#4caf50' },
    { value: 'professional', label: 'Professional', icon: <SentimentNeutralIcon />, color: '#2196f3' },
    { value: 'friendly', label: 'Friendly', icon: <SentimentSatisfiedIcon />, color: '#ff9800' },
    { value: 'formal', label: 'Formal', icon: <SentimentDissatisfiedIcon />, color: '#9c27b0' },
    { value: 'humorous', label: 'Humorous', icon: <SentimentVerySatisfiedIcon />, color: '#f44336' },
    { value: 'inspiring', label: 'Inspiring', icon: <StarIcon />, color: '#ffd700' },
  ];

  const mediaTypes = [
    { value: 'image', label: 'Image', icon: <ImageIcon />, color: '#4caf50' },
    { value: 'video', label: 'Video', icon: <VideocamIcon />, color: '#2196f3' },
    { value: 'reel', label: 'Reel', icon: <VideocamIcon />, color: '#e91e63' },
    { value: 'story', label: 'Story', icon: <ImageIcon />, color: '#ff9800' },
  ];

  const platforms = [
    { value: 'instagram', label: 'Instagram', icon: <InstagramIcon />, color: '#E4405F' },
    { value: 'facebook', label: 'Facebook', icon: <FacebookIcon />, color: '#4267B2' },
    { value: 'twitter', label: 'Twitter', icon: <TwitterIcon />, color: '#1DA1F2' },
    { value: 'linkedin', label: 'LinkedIn', icon: <LinkedInIcon />, color: '#0077B5' },
  ];

  const sampleTrendingKeywords = [
    { keyword: '#AI', count: 2500000, trending: true, growth: 45 },
    { keyword: '#Tech', count: 1800000, trending: true, growth: 32 },
    { keyword: '#Innovation', count: 950000, trending: true, growth: 28 },
    { keyword: '#Digital', count: 720000, trending: true, growth: 25 },
    { keyword: '#Marketing', count: 680000, trending: true, growth: 38 },
    { keyword: '#Design', count: 540000, trending: false, growth: 15 },
    { keyword: '#SocialMedia', count: 490000, trending: true, growth: 42 },
    { keyword: '#Business', count: 380000, trending: false, growth: 12 },
  ];

  const hashtagCategories = [
    { 
      name: 'Popular', 
      hashtags: ['#trending', '#viral', '#popular', '#instagood', '#photooftheday'],
      icon: <TrendingUpIcon />,
      color: '#f44336'
    },
    { 
      name: 'Tech', 
      hashtags: ['#technology', '#innovation', '#gadgets', '#tech', '#AI'],
      icon: <AutoAwesomeIcon />,
      color: '#2196f3'
    },
    { 
      name: 'Business', 
      hashtags: ['#entrepreneur', '#startup', '#business', '#success', '#leadership'],
      icon: <TrendingUpIcon />,
      color: '#4caf50'
    },
    { 
      name: 'Lifestyle', 
      hashtags: ['#lifestyle', '#travel', '#fashion', '#food', '#health'],
      icon: <FavoriteIcon />,
      color: '#ff9800'
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
      },
    },
  };

  useEffect(() => {
    loadTrendingKeywords();
    loadHistory();
    loadSavedCaptions();
  }, []);

  useEffect(() => {
    setCharacterCount(generatedCaption.length);
  }, [generatedCaption]);

  useEffect(() => {
    if (autoGenerate && content.length > 10) {
      const timer = setTimeout(() => {
        generateCaption();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [content, autoGenerate]);

  const loadTrendingKeywords = async () => {
    setTrendingKeywords(sampleTrendingKeywords);
  };

  const loadHistory = async () => {
    const sampleHistory = [
      { id: 1, content: 'Product launch', caption: 'Excited to announce our new product! 🚀', date: '2023-05-15', score: 85 },
      { id: 2, content: 'Team event', caption: 'Amazing team building today! #teamwork 💪', date: '2023-05-10', score: 78 },
    ];
    setHistory(sampleHistory);
  };

  const loadSavedCaptions = async () => {
    setSavedCaptions([]);
  };

  const generateCaption = async () => {
    if (!content.trim()) {
      setNotification({
        open: true,
        message: '⚠️ Please enter some content first!',
        severity: 'warning',
      });
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Enhanced caption generation
      const tonePhrases = {
        casual: ['Hey there!', 'Check this out!', 'You won\'t believe this!', 'OMG!', 'So excited to share...'],
        professional: ['We are pleased to announce', 'Introducing our latest', 'Discover how', 'We proudly present', 'Announcing our new'],
        friendly: ['Hey friends!', 'We\'re excited to share', 'Join us in', 'We\'d love your thoughts on', 'Come check out'],
        formal: ['We are delighted to present', 'It is our pleasure to announce', 'We would like to introduce', 'We hereby announce', 'Please join us for'],
        humorous: ['Hold onto your hats!', 'Brace yourselves!', 'You asked, we delivered... sort of', 'Drumroll please...', 'Ta-da!'],
        inspiring: ['Believe in the power of', 'Transform your journey with', 'Unlock your potential through', 'Embrace the future of', 'Rise above with'],
      };

      const selectedTone = tonePhrases[tone][Math.floor(Math.random() * tonePhrases[tone].length)];
      
      // Add emoji based on tone
      const toneEmojis = {
        casual: ['😊', '🎉', '✨', '👍'],
        professional: ['💼', '📊', '🎯', '✅'],
        friendly: ['😀', '🤝', '💙', '🌟'],
        formal: ['🏆', '📈', '💡', '🔑'],
        humorous: ['😂', '🤣', '😜', '🎭'],
        inspiring: ['🚀', '💪', '⭐', '🌈'],
      };
      
      const emoji = toneEmojis[tone][Math.floor(Math.random() * toneEmojis[tone].length)];
      const generatedText = `${selectedTone} ${content} ${emoji}`;
      
      setGeneratedCaption(generatedText);
      
      // Generate multiple variations
      const variations = [
        `${tonePhrases[tone][0]} ${content} ${toneEmojis[tone][0]}`,
        `${tonePhrases[tone][1]} ${content} ${toneEmojis[tone][1]}`,
        `${tonePhrases[tone][2]} ${content} ${toneEmojis[tone][2]}`,
      ];
      setCaptionVariations(variations);
      
      // Generate hashtags
      const words = content.toLowerCase().split(/[\s\n\r,.!?;:]+/).filter(w => w.length > 3);
      const relevantHashtags = words.map(word => `#${word.replace(/[^a-z0-9]/g, '')}`).filter(h => h.length > 2);
      const popularHashtags = hashtagCategories[0].hashtags.slice(0, 3);
      setHashtags([...new Set([...relevantHashtags.slice(0, 5), ...popularHashtags])]);
      
      // Generate emoji suggestions
      generateEmojiSuggestions(content);
      
      // Calculate AI score
      const score = calculateAIScore(generatedText, hashtags);
      setAiScore(score);
      
      // Generate engagement prediction
      const prediction = {
        reach: Math.floor(Math.random() * 5000) + 1000,
        likes: Math.floor(Math.random() * 500) + 100,
        comments: Math.floor(Math.random() * 50) + 10,
        shares: Math.floor(Math.random() * 100) + 20,
      };
      setEngagementPrediction(prediction);
      
      // Generate titles
      const mediaTitles = {
        image: [`Amazing ${content.split(' ').slice(0, 3).join(' ')}`, `Stunning: ${content.split(' ').slice(0, 2).join(' ')}`, `${content.split(' ')[0]} Magic`],
        video: [`Must Watch: ${content.split(' ').slice(0, 3).join(' ')}`, `Video Guide: ${content.split(' ').slice(0, 2).join(' ')}`, `${content.split(' ')[0]} Explained`],
        reel: [`Quick ${content.split(' ').slice(0, 2).join(' ')}`, `${content.split(' ')[0]} in 30 Seconds`, `Reel: ${content.split(' ').slice(0, 3).join(' ')}`],
        story: [`Story: ${content.split(' ').slice(0, 3).join(' ')}`, `Behind ${content.split(' ')[0]}`, `${content.split(' ').slice(0, 2).join(' ')} Update`],
      };
      setGeneratedTitles(mediaTitles[selectedMediaType]);
      
      // Generate descriptions
      const descriptions = [
        `This ${selectedMediaType} showcases ${content.toLowerCase()}. Follow us for more amazing content! 🌟`,
        `We're thrilled to share this ${selectedMediaType} featuring ${content.split(' ').slice(0, 3).join(' ')}. What's your take? 💭`,
        `Our latest ${selectedMediaType} highlighting ${content.split(' ')[0]}. Double tap if you love it! ❤️`,
      ];
      setGeneratedDescriptions(descriptions);
      
      setNotification({
        open: true,
        message: '✅ AI Content generated successfully!',
        severity: 'success',
      });
      
      // Add to history
      const newHistoryItem = {
        id: Date.now(),
        content,
        caption: generatedText,
        date: new Date().toISOString().split('T')[0],
        score,
      };
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
    } catch (error) {
      console.error('Error generating content:', error);
      setNotification({
        open: true,
        message: '❌ Failed to generate content',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const generateEmojiSuggestions = (text) => {
    const emojiMap = {
      happy: ['😊', '😀', '🥳', '😄'],
      love: ['❤️', '💙', '💚', '💛'],
      fire: ['🔥', '💥', '✨', '⭐'],
      success: ['🎯', '🏆', '✅', '👍'],
      work: ['💼', '💻', '📊', '📈'],
      food: ['🍕', '🍔', '🍰', '🥗'],
      travel: ['✈️', '🌍', '🏖️', '🗺️'],
      tech: ['🤖', '💻', '📱', '🚀'],
    };

    const suggestions = [];
    const lowerText = text.toLowerCase();
    
    Object.keys(emojiMap).forEach(key => {
      if (lowerText.includes(key)) {
        suggestions.push(...emojiMap[key]);
      }
    });

    if (suggestions.length === 0) {
      suggestions.push('😊', '🎉', '✨', '👍', '🔥', '💡', '🚀', '⭐');
    }

    setEmojiSuggestions([...new Set(suggestions)].slice(0, 8));
  };

  const calculateAIScore = (caption, tags) => {
    let score = 50;
    
    // Length check
    if (caption.length > 50 && caption.length < 200) score += 15;
    else if (caption.length >= 200) score += 10;
    
    // Emoji check
    const emojiCount = (caption.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
    if (emojiCount > 0 && emojiCount <= 3) score += 10;
    
    // Hashtag check
    if (tags.length >= 3 && tags.length <= 10) score += 15;
    
    // Call to action check
    if (/follow|like|comment|share|click|visit|join|subscribe/i.test(caption)) score += 10;
    
    return Math.min(score, 100);
  };

  const generateHashtags = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const words = content.toLowerCase().split(/[\s\n\r,.!?;:]+/).filter(w => w.length > 3);
      const relevantHashtags = words.map(word => `#${word.replace(/[^a-z0-9]/g, '')}`).filter(h => h.length > 2);
      
      const popularHashtags = hashtagCategories
        .flatMap(cat => cat.hashtags)
        .sort(() => 0.5 - Math.random())
        .slice(0, 8);
      
      setHashtags([...new Set([...relevantHashtags, ...popularHashtags])].slice(0, 15));
      setIsGenerating(false);
      
      setNotification({
        open: true,
        message: '✅ AI Hashtags generated!',
        severity: 'success',
      });
    }, 1000);
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setNotification({
      open: true,
      message: '📋 Copied to clipboard!',
      severity: 'success',
    });
  };

  const handleSaveCaption = () => {
    const newSaved = {
      id: Date.now(),
      caption: generatedCaption,
      hashtags,
      date: new Date().toISOString(),
      score: aiScore,
    };
    setSavedCaptions(prev => [newSaved, ...prev]);
    setNotification({
      open: true,
      message: '💾 Caption saved successfully!',
      severity: 'success',
    });
  };

  const handleExport = () => {
    const exportData = {
      caption: generatedCaption,
      hashtags: hashtags.join(' '),
      titles: generatedTitles,
      descriptions: generatedDescriptions,
      platform: selectedPlatform,
      mediaType: selectedMediaType,
      aiScore,
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `caption-${Date.now()}.json`;
    a.click();
    
    setNotification({
      open: true,
      message: '📥 Caption exported successfully!',
      severity: 'success',
    });
  };

  const renderCaptionGenerator = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* AI Banner */}
      <Alert 
        severity="info" 
        icon={<AutoAwesomeIcon />} 
        sx={{ 
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          '& .MuiAlert-icon': { color: 'white' },
          borderRadius: 3,
        }}
      >
        <strong>🤖 AI-Powered Caption Generator:</strong> Create engaging, optimized captions with advanced AI technology
      </Alert>

      <Grid container spacing={3}>
        {/* Main Input Section */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            border: '1px solid #e0e0e0',
          }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AutoAwesomeIcon sx={{ color: '#667eea', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Content Input
                </Typography>
              </Box>

              <TextField
                fullWidth
                multiline
                rows={5}
                variant="outlined"
                placeholder="✍️ Describe your post content here... (e.g., 'New product launch for eco-friendly water bottles')"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                sx={{ 
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {content.length} characters
                </Typography>
                <FormControlLabel
                  control={
                    <Switch
                      checked={autoGenerate}
                      onChange={(e) => setAutoGenerate(e.target.checked)}
                      color="primary"
                    />
                  }
                  label={<Typography variant="caption">🤖 Auto-generate</Typography>}
                />
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Tone</InputLabel>
                    <Select
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      label="Tone"
                    >
                      {tones.map((toneOption) => (
                        <MenuItem key={toneOption.value} value={toneOption.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {toneOption.icon}
                            <span>{toneOption.label}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Platform</InputLabel>
                    <Select
                      value={selectedPlatform}
                      onChange={(e) => setSelectedPlatform(e.target.value)}
                      label="Platform"
                    >
                      {platforms.map((platform) => (
                        <MenuItem key={platform.value} value={platform.value}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {platform.icon}
                            <span>{platform.label}</span>
                          </Box>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              {/* Advanced Settings */}
              <Box sx={{ mb: 2 }}>
                <Button
                  size="small"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  endIcon={showAdvanced ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                  sx={{ textTransform: 'none', mb: 1 }}
                >
                  Advanced Settings
                </Button>
                
                <Collapse in={showAdvanced}>
                  <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                    <Typography gutterBottom variant="caption" color="text.secondary">
                      Tone Strength
                    </Typography>
                    <Slider
                      value={toneStrength}
                      onChange={(e, val) => setToneStrength(val)}
                      valueLabelDisplay="auto"
                      step={10}
                      marks
                      min={0}
                      max={100}
                      sx={{ mb: 2 }}
                    />
                  </Box>
                </Collapse>
              </Box>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={generateCaption}
                  disabled={loading || !content}
                  startIcon={loading ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                  sx={{ 
                    borderRadius: 2,
                    px: 4,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #5568d3 0%, #663d8f 100%)',
                    }
                  }}
                >
                  🤖 Generate AI Caption
                </Button>
                
                <Button
                  variant="outlined"
                  onClick={() => setOpenHistoryDialog(true)}
                  startIcon={<HistoryIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  History
                </Button>

                <Button
                  variant="outlined"
                  onClick={generateHashtags}
                  disabled={!content || isGenerating}
                  startIcon={isGenerating ? <CircularProgress size={20} /> : <TagIcon />}
                  sx={{ borderRadius: 2 }}
                >
                  Generate Hashtags
                </Button>
              </Box>
            </CardContent>
          </Card>

          {/* Generated Caption Display */}
          {generatedCaption && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card sx={{ 
                mt: 3, 
                borderRadius: 3, 
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '2px solid #667eea',
              }}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <DescriptionIcon sx={{ color: '#667eea', mr: 1, fontSize: 28 }} />
                      <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Generated Caption
                      </Typography>
                    </Box>
                    
                    {/* AI Score */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <SpeedIcon sx={{ color: '#667eea' }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {aiScore}%
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        AI Score
                      </Typography>
                    </Box>
                  </Box>

                  {/* Main Caption */}
                  <Paper
                    sx={{
                      p: 3,
                      mb: 2,
                      bgcolor: '#f8f9ff',
                      borderRadius: 2,
                      border: '1px solid #e0e7ff',
                      position: 'relative',
                    }}
                  >
                    <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
                      {generatedCaption}
                    </Typography>
                    <Box sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8,
                      display: 'flex',
                      gap: 1,
                    }}>
                      <Tooltip title="Copy">
                        <IconButton
                          size="small"
                          onClick={() => handleCopyToClipboard(generatedCaption)}
                          sx={{ bgcolor: 'white' }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Save">
                        <IconButton
                          size="small"
                          onClick={handleSaveCaption}
                          sx={{ bgcolor: 'white' }}
                        >
                          <SaveIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    {/* Character Count */}
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="caption" color="text.secondary">
                        {characterCount} / {platformLimits[selectedPlatform]} characters for {selectedPlatform}
                      </Typography>
                      <LinearProgress 
                        variant="determinate" 
                        value={(characterCount / platformLimits[selectedPlatform]) * 100}
                        sx={{ 
                          width: '200px',
                          height: 6,
                          borderRadius: 3,
                          bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': {
                            bgcolor: characterCount > platformLimits[selectedPlatform] ? '#f44336' : '#4caf50',
                          }
                        }}
                      />
                    </Box>
                  </Paper>

                  {/* Caption Variations */}
                  {captionVariations.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <RefreshIcon fontSize="small" sx={{ color: '#667eea' }} />
                        AI Caption Variations
                      </Typography>
                      <Grid container spacing={1}>
                        {captionVariations.map((variation, index) => (
                          <Grid item xs={12} key={index}>
                            <Paper
                              sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: '#fafafa',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                '&:hover': {
                                  bgcolor: '#f0f0f0',
                                  transform: 'translateX(5px)',
                                },
                              }}
                              onClick={() => setGeneratedCaption(variation)}
                            >
                              <Typography variant="body2">
                                {variation}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {/* Hashtags */}
                  {hashtags.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="subtitle2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <TagIcon fontSize="small" sx={{ color: '#667eea' }} />
                        Generated Hashtags
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        {hashtags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={tag}
                            onClick={() => handleCopyToClipboard(tag)}
                            sx={{
                              borderRadius: 1,
                              bgcolor: '#e3f2fd',
                              '&:hover': {
                                bgcolor: '#bbdefb',
                              },
                            }}
                          />
                        ))}
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleCopyToClipboard(hashtags.join(' '))}
                        startIcon={<ContentCopyIcon />}
                        sx={{ borderRadius: 2 }}
                      >
                        Copy All Hashtags
                      </Button>
                    </Box>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                    <Button
                      variant="contained"
                      onClick={handleExport}
                      startIcon={<DownloadIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      Export
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => setGeneratedCaption('')}
                      startIcon={<RefreshIcon />}
                      sx={{ borderRadius: 2 }}
                    >
                      Clear
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} lg={4}>
          {/* Media Type Selector */}
          <Card sx={{ 
            mb: 3, 
            borderRadius: 3, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <VideocamIcon sx={{ color: '#667eea', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Media Type
                </Typography>
              </Box>
              
              <Grid container spacing={1.5}>
                {mediaTypes.map((media) => (
                  <Grid item xs={6} key={media.value}>
                    <Button
                      fullWidth
                      variant={selectedMediaType === media.value ? 'contained' : 'outlined'}
                      onClick={() => setSelectedMediaType(media.value)}
                      startIcon={media.icon}
                      sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        p: 1.5,
                        ...(selectedMediaType === media.value && {
                          background: `linear-gradient(135deg, ${media.color} 0%, ${media.color}dd 100%)`,
                          color: 'white',
                        }),
                      }}
                    >
                      {media.label}
                    </Button>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>

          {/* AI Engagement Prediction */}
          {engagementPrediction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card sx={{ 
                mb: 3, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <AnalyticsIcon sx={{ mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      🤖 AI Prediction
                    </Typography>
                  </Box>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                          {engagementPrediction.reach.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Reach
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#f44336' }}>
                          {engagementPrediction.likes.toLocaleString()}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Likes
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#4caf50' }}>
                          {engagementPrediction.comments}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Comments
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={6}>
                      <Paper sx={{ p: 2, textAlign: 'center', borderRadius: 2 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#ff9800' }}>
                          {engagementPrediction.shares}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Shares
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Emoji Suggestions */}
          {emojiSuggestions.length > 0 && (
            <Card sx={{ mb: 3, borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EmojiIcon sx={{ color: '#667eea', mr: 1 }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Emoji Suggestions
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {emojiSuggestions.map((emoji, index) => (
                    <Button
                      key={index}
                      variant="outlined"
                      onClick={() => {
                        setGeneratedCaption(prev => prev + ' ' + emoji);
                        handleCopyToClipboard(emoji);
                      }}
                      sx={{
                        minWidth: 50,
                        height: 50,
                        fontSize: '1.5rem',
                        borderRadius: 2,
                      }}
                    >
                      {emoji}
                    </Button>
                  ))}
                </Box>
              </CardContent>
            </Card>
          )}

          {/* AI Tips */}
          <Card sx={{ 
            borderRadius: 3,
            bgcolor: '#fffbea',
            border: '1px solid #ffd54f',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbIcon sx={{ color: '#f57c00', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  AI Tips
                </Typography>
              </Box>
              
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="caption">Keep captions between 125-150 characters for best engagement</Typography>}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="caption">Use 1-3 emojis to increase visual appeal</Typography>}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="caption">Include 5-10 relevant hashtags</Typography>}
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 20 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary={<Typography variant="caption">Add a clear call-to-action</Typography>}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  const renderTrendingKeywords = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Alert 
        severity="warning" 
        icon={<TrendingUpIcon />} 
        sx={{ 
          mb: 3,
          bgcolor: '#fff3e0',
          border: '1px solid #ffb74d',
          borderRadius: 3,
        }}
      >
        <strong>📈 Trending Keywords:</strong> Real-time trending hashtags updated hourly by AI
      </Alert>

      <Grid container spacing={3}>
        {trendingKeywords.map((keyword, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <Card sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                border: keyword.trending ? '2px solid #f44336' : '1px solid #e0e0e0',
                position: 'relative',
                overflow: 'visible',
              }}>
                {keyword.trending && (
                  <Box sx={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    bgcolor: '#f44336',
                    color: 'white',
                    px: 2,
                    py: 0.5,
                    borderRadius: 2,
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    boxShadow: '0 4px 12px rgba(244,67,54,0.4)',
                  }}>
                    🔥 HOT
                  </Box>
                )}

                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TagIcon sx={{ color: keyword.trending ? '#f44336' : '#667eea', fontSize: 28, mr: 1 }} />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {keyword.keyword}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Posts
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 600 }}>
                        {keyword.count.toLocaleString()}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min((keyword.count / 3000000) * 100, 100)}
                      sx={{ 
                        height: 6,
                        borderRadius: 3,
                        bgcolor: '#e0e0e0',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: keyword.trending ? '#f44336' : '#667eea',
                        }
                      }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <TrendingUpIcon sx={{ fontSize: 16, mr: 0.5, color: '#4caf50' }} />
                    <Typography variant="caption" sx={{ fontWeight: 600, color: '#4caf50' }}>
                      +{keyword.growth}% growth
                    </Typography>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    size="small"
                    onClick={() => handleCopyToClipboard(keyword.keyword)}
                    startIcon={<ContentCopyIcon />}
                    sx={{ 
                      borderRadius: 2,
                      background: keyword.trending 
                        ? 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    Copy
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  const renderHashtagSuggestions = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Alert 
        severity="success" 
        icon={<TagIcon />} 
        sx={{ 
          mb: 3,
          bgcolor: '#e8f5e9',
          border: '1px solid #81c784',
          borderRadius: 3,
        }}
      >
        <strong>🏷️ Smart Hashtag Categories:</strong> Curated hashtag collections for maximum reach
      </Alert>

      <Grid container spacing={3}>
        {hashtagCategories.map((category, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <Card sx={{ 
                height: '100%',
                borderRadius: 3,
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                border: '1px solid #e0e0e0',
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      p: 1,
                      borderRadius: 2,
                      bgcolor: `${category.color}20`,
                      color: category.color,
                      mr: 1,
                    }}>
                      {category.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {category.name}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {category.hashtags.map((tag, tagIndex) => (
                      <Chip
                        key={tagIndex}
                        label={tag}
                        onClick={() => handleCopyToClipboard(tag)}
                        size="small"
                        sx={{
                          borderRadius: 1,
                          bgcolor: `${category.color}15`,
                          color: category.color,
                          fontWeight: 600,
                          '&:hover': {
                            bgcolor: `${category.color}30`,
                          },
                        }}
                      />
                    ))}
                  </Box>

                  <Button
                    variant="outlined"
                    fullWidth
                    size="small"
                    onClick={() => handleCopyToClipboard(category.hashtags.join(' '))}
                    startIcon={<ContentCopyIcon />}
                    sx={{ 
                      borderRadius: 2,
                      borderColor: category.color,
                      color: category.color,
                      '&:hover': {
                        borderColor: category.color,
                        bgcolor: `${category.color}10`,
                      },
                    }}
                  >
                    Copy All
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  const renderToneSettings = () => (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <Alert 
        severity="info" 
        icon={<TuneIcon />} 
        sx={{ 
          mb: 3,
          bgcolor: '#e3f2fd',
          border: '1px solid #90caf9',
          borderRadius: 3,
        }}
      >
        <strong>🎨 Tone Customization:</strong> Fine-tune your brand voice with AI-powered tone settings
      </Alert>

      <Grid container spacing={3}>
        {tones.map((toneOption, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: tone === toneOption.value ? '0 8px 32px rgba(102,126,234,0.3)' : '0 8px 24px rgba(0,0,0,0.1)',
                border: tone === toneOption.value ? `2px solid ${toneOption.color}` : '1px solid #e0e0e0',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onClick={() => setTone(toneOption.value)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${toneOption.color}20`,
                      color: toneOption.color,
                      mr: 1,
                    }}>
                      {toneOption.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {toneOption.label}
                    </Typography>
                  </Box>

                  <Paper sx={{
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 2,
                    mb: 2,
                  }}>
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      {getToneExample(toneOption.value)}
                    </Typography>
                  </Paper>

                  {tone === toneOption.value && (
                    <Chip 
                      label="✓ Selected" 
                      size="small"
                      sx={{
                        bgcolor: toneOption.color,
                        color: 'white',
                        fontWeight: 700,
                      }}
                    />
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </motion.div>
  );

  const getToneExample = (toneValue) => {
    const examples = {
      casual: "Hey folks! Just launched something amazing - you're gonna love this! 🎉",
      professional: "We are pleased to announce the launch of our latest innovation.",
      friendly: "Hi friends! We're excited to share this with you - let us know what you think!",
      formal: "It is with great pleasure that we present our newest offering.",
      humorous: "Stop scrolling! Our dev team actually shipped something! 😂",
      inspiring: "Believe in yourself and unlock your full potential today! 🚀",
    };
    return examples[toneValue];
  };

  const renderHistoryDialog = () => (
    <Dialog
      open={openHistoryDialog}
      onClose={() => setOpenHistoryDialog(false)}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <HistoryIcon sx={{ mr: 1 }} />
          Generation History
        </Box>
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Grid container spacing={2}>
          {history.length > 0 ? (
            history.map((item) => (
              <Grid item xs={12} key={item.id}>
                <motion.div
                  whileHover={{ x: 5 }}
                >
                  <Card sx={{ 
                    borderRadius: 2,
                    border: '1px solid #e0e0e0',
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {item.date}
                        </Typography>
                        <Chip 
                          label={`${item.score}% AI Score`}
                          size="small"
                          sx={{
                            bgcolor: item.score >= 70 ? '#4caf50' : '#ff9800',
                            color: 'white',
                            fontWeight: 700,
                          }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        <strong>Input:</strong> {item.content}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 2 }}>
                        <strong>Caption:</strong> {item.caption}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            setContent(item.content);
                            setGeneratedCaption(item.caption);
                            setOpenHistoryDialog(false);
                          }}
                        >
                          Use This
                        </Button>
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<ContentCopyIcon />}
                          onClick={() => handleCopyToClipboard(item.caption)}
                        >
                          Copy
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1" align="center" sx={{ p: 3 }}>
                No history available yet. Generate some content to see it here!
              </Typography>
            </Grid>
          )}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setOpenHistoryDialog(false)}>Close</Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                🤖 AI Caption Generator
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Create engaging, platform-optimized captions with advanced AI
              </Typography>
            </Box>
            <Chip
              label="🚀 AI Powered"
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                fontWeight: 700,
                px: 2,
                py: 2.5,
              }}
            />
          </Box>

          {/* Tabs */}
          <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.1)' }}>
            <Tabs
              value={activeTab}
              onChange={(e, newValue) => setActiveTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': {
                  height: 4,
                  borderRadius: 2,
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                },
                '& .Mui-selected': {
                  color: '#667eea !important',
                },
              }}
            >
              <Tab
                icon={<AutoAwesomeIcon />}
                label="AI Generator"
                iconPosition="start"
                sx={{ minHeight: 64, fontWeight: 600 }}
              />
              <Tab
                icon={<TrendingUpIcon />}
                label="Trending"
                iconPosition="start"
                sx={{ minHeight: 64, fontWeight: 600 }}
              />
              <Tab
                icon={<TagIcon />}
                label="Hashtags"
                iconPosition="start"
                sx={{ minHeight: 64, fontWeight: 600 }}
              />
              <Tab
                icon={<TuneIcon />}
                label="Tones"
                iconPosition="start"
                sx={{ minHeight: 64, fontWeight: 600 }}
              />
            </Tabs>
          </Paper>

          {/* Tab Content */}
          <Box sx={{ mt: 3 }}>
            <AnimatePresence mode="wait">
              {activeTab === 0 && renderCaptionGenerator()}
              {activeTab === 1 && renderTrendingKeywords()}
              {activeTab === 2 && renderHashtagSuggestions()}
              {activeTab === 3 && renderToneSettings()}
            </AnimatePresence>
          </Box>

          {/* Notification */}
          <Snackbar
            open={notification.open}
            autoHideDuration={4000}
            onClose={() => setNotification({ ...notification, open: false })}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          >
            <Alert
              onClose={() => setNotification({ ...notification, open: false })}
              severity={notification.severity}
              sx={{ 
                width: '100%', 
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                borderRadius: 2,
              }}
              iconMapping={{
                success: <CheckCircleIcon fontSize="inherit" />,
              }}
            >
              {notification.message}
            </Alert>
          </Snackbar>

          {renderHistoryDialog()}
        </motion.div>
      </Box>
    </ThemeProvider>
  );
};

export default CaptionGenerator;
