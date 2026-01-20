import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tab,
  Tabs,
  Alert,
  Snackbar,
  LinearProgress,
  Paper,
  Divider,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Send as SendIcon,
  Schedule as ScheduleIcon,
  AutoAwesome as AutoAwesomeIcon,
  Preview as PreviewIcon,
  TrendingUp as TrendingUpIcon,
  Tag as TagIcon,
  Image as ImageIcon,
  Link as LinkIcon,
  Analytics as AnalyticsIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  Favorite as FavoriteIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';

const SocialMediaHub = () => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const hashtagInputRef = useRef(null);
  
  // Post content
  const [postContent, setPostContent] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [mediaUrl, setMediaUrl] = useState('');
  
  // Features
  const [autoHashtagEnabled, setAutoHashtagEnabled] = useState(true);
  const [suggestedHashtags, setSuggestedHashtags] = useState([]);
  const [performanceEstimate, setPerformanceEstimate] = useState(null);
  const [optimizedContent, setOptimizedContent] = useState('');
  const [previewMode, setPreviewMode] = useState('facebook');
  
  // Platform connections
  const [connectedPlatforms, setConnectedPlatforms] = useState({
    facebook: false,
    twitter: false,
    instagram: false,
    linkedin: false,
  });
  
  // Dialogs
  const [previewOpen, setPreviewOpen] = useState(false);
  const [performanceOpen, setPerformanceOpen] = useState(false);
  
  // Notifications
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    loadUserSettings();
  }, [currentUser]);

  useEffect(() => {
    if (postContent.length > 10 && autoHashtagEnabled) {
      generateHashtags();
    }
  }, [postContent, autoHashtagEnabled]);

  const loadUserSettings = async () => {
    if (!currentUser) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setConnectedPlatforms(data.connectedPlatforms || connectedPlatforms);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  // ✅ Auto-Hashtag Generation
  const generateHashtags = async () => {
    try {
      // Simulate AI hashtag generation with better word extraction
      // Split by spaces, newlines, and common punctuation
      const words = postContent
        .toLowerCase()
        .split(/[\s\n\r,.!?;:]+/)
        .filter(word => word.length > 0);
      
      // Filter meaningful words (longer than 3 characters)
      const keyWords = words.filter(word => word.length > 3);
      
      // Clean and format hashtags
      const generated = keyWords
        .slice(0, 6) // Get up to 6 hashtags
        .map(word => word.replace(/[^a-z0-9]/g, '')) // Remove special chars
        .filter(word => word.length > 3); // Ensure still meaningful after cleaning
      
      // Remove duplicates
      const uniqueHashtags = [...new Set(generated)];
      
      setSuggestedHashtags(uniqueHashtags);
      
      console.log('Generated hashtags:', uniqueHashtags);
    } catch (error) {
      console.error('Error generating hashtags:', error);
    }
  };

  // ✅ Post Optimization
  const optimizePost = async () => {
    setLoading(true);
    try {
      let optimized = postContent.trim();
      const lowerContent = postContent.toLowerCase();
      
      // SMART REWRITING - Not just adding emojis!
      // Detect service/business type and create engaging content
      
      // Pattern 1: List of services → Compelling offer
      const servicePattern = /(.+)\n(.+)\n(.+)/;
      if (servicePattern.test(optimized) && optimized.split('\n').length >= 2) {
        const lines = optimized.split('\n').map(l => l.trim()).filter(l => l.length > 0);
        
        // Create engaging announcement
        if (lines.length >= 2) {
          const services = lines.slice(0, 3);
          optimized = `🎯 Looking for professional services?\n\n` +
                     `✅ ${services[0]}\n` +
                     (services[1] ? `✅ ${services[1]}\n` : '') +
                     (services[2] ? `✅ ${services[2]}\n` : '') +
                     `\n💬 Contact us today for a free quote!`;
          
          setOptimizedContent(optimized);
          setNotification({
            open: true,
            message: '✅ Content optimized for maximum engagement!',
            severity: 'success'
          });
          setLoading(false);
          return;
        }
      }
      
      // Pattern 2: Single line business description → Add hook and CTA
      if (optimized.split('\n').length === 1 || !optimized.includes('\n')) {
        // Check for business keywords
        const hasService = /service|repair|shop|store|business|company|consulting|agency|studio/i.test(optimized);
        const hasTech = /web|mobile|app|software|digital|tech|development|coding/i.test(optimized);
        
        if (hasService || hasTech) {
          // Create professional announcement
          const words = optimized.split(/\s+/);
          const mainServices = words.slice(0, Math.min(6, words.length)).join(' ');
          
          optimized = `🚀 Need expert help?\n\n` +
                     `We specialize in ${mainServices}!\n\n` +
                     `✨ Professional quality\n` +
                     `⚡ Fast delivery\n` +
                     `💯 Satisfaction guaranteed\n\n` +
                     `📞 Get in touch today!`;
          
          setOptimizedContent(optimized);
          setNotification({
            open: true,
            message: '✅ Content optimized for maximum engagement!',
            severity: 'success'
          });
          setLoading(false);
          return;
        }
      }
      
      // Pattern 3: Already well-formatted → Just enhance with strategic emojis
      const emojiMap = {
        // Emotions & reactions
        'happy': ['😊', '🙂', '😄'],
        'excited': ['🎉', '🙌', '😍'],
        'amazing': ['🌟', '⭐', '✨'],
        'love': ['❤️', '💕', '💖'],
        'great': ['👍', '👏', '🎉'],
        
        // Business & professional
        'success': ['🎉', '✨', '🌟'],
        'business': ['💼', '📊', '💰'],
        'professional': ['👔', '💼', '🎯'],
        'service': ['⚙️', '🛠️', '✨'],
        'consulting': ['💡', '📊', '🎯'],
        
        // Tech & digital
        'development': ['💻', '🚀', '⚡'],
        'web': ['🌐', '💻', '🖥️'],
        'mobile': ['📱', '📲', '🔧'],
        'app': ['📱', '💫', '🚀'],
        'digital': ['💻', '🌐', '⚡'],
        'technology': ['⚡', '💻', '🔬'],
        'coding': ['💻', '⌨️', '🚀'],
        'software': ['💾', '💻', '🔧'],
        
        // Marketing & social
        'marketing': ['📈', '🎯', '💡'],
        'social': ['👥', '🌍', '💬'],
        'media': ['📱', '📺', '🎬'],
        'advertising': ['📢', '🎯', '💡'],
        'branding': ['🎨', '✨', '🔥'],
        
        // Actions & verbs
        'new': ['✨', '🆕', '💫'],
        'launch': ['🚀', '🎯', '💥'],
        'start': ['🚀', '▶️', '💪'],
        'build': ['🏗️', '🔨', '⚙️'],
        'create': ['✨', '🎨', '🔧'],
        'design': ['🎨', '✏️', '🖌️'],
        
        // Products & commerce
        'product': ['🚀', '📦', '✨'],
        'shop': ['🛍️', '🏪', '🛒'],
        'store': ['🏬', '🛍️', '🛒'],
        'sale': ['💰', '🛍️', '💸'],
        'offer': ['🎁', '💝', '🎉'],
        'discount': ['💰', '🏷️', '🔥'],
        
        // Services specific
        'repair': ['🔧', '🛠️', '⚙️'],
        'fix': ['🔧', '✅', '🛠️'],
        'support': ['🤝', '💪', '🆘'],
        'help': ['🤝', '💡', '✨'],
        'consulting': ['💡', '📊', '🎯'],
        
        // Time & urgency
        'today': ['📅', '🗓️', '⏰'],
        'now': ['⏰', '⚡', '🔔'],
        'soon': ['🔜', '⏰', '🎯'],
        
        // Quality & results
        'best': ['🏆', '⭐', '✨'],
        'quality': ['⭐', '💎', '✅'],
        'premium': ['💎', '⭐', '🏆'],
        'certified': ['✅', '🏅', '🎖️'],
        
        // Misc
        'project': ['💼', '📊', '🎯'],
        'team': ['👥', '🤝', '💪'],
        'work': ['💼', '⚙️', '💪'],
      };

      
      // Fallback: If no pattern matched, just add subtle emoji enhancement
      let emojisAdded = 0;
      const maxEmojis = 1; // Very minimal for fallback
      
      for (const [word, emojis] of Object.entries(emojiMap)) {
        if (emojisAdded >= maxEmojis) break;
        
        const regex = new RegExp(`\\b${word}\\b`, 'i');
        if (regex.test(optimized) && !emojis.some(e => optimized.includes(e))) {
          const emoji = emojis[Math.floor(Math.random() * emojis.length)];
          optimized = optimized.replace(regex, (match) => {
            emojisAdded++;
            return `${match} ${emoji}`;
          });
        }
      }
      
      // Add minimal CTA if completely missing
      if (!/\?|!|contact|call|visit|learn|get|try/i.test(optimized) && optimized.length < 100) {
        optimized += ' ✨';
      }
      
      // Optimize length for Twitter
      if (selectedPlatforms.includes('twitter') && optimized.length > 280) {
        optimized = optimized.substring(0, 277) + '...';
      }
      
      setOptimizedContent(optimized);
      setNotification({
        open: true,
        message: '✅ Content optimized for maximum engagement!',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error optimizing:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Content Performance Estimation - DYNAMIC ALGORITHM
  const estimatePerformance = async () => {
    setLoading(true);
    try {
      const content = optimizedContent || postContent;
      const contentLength = content.length;
      const hasHashtags = hashtags.length > 0;
      const hashtagCount = hashtags.length;
      const hasMedia = mediaUrl.length > 0;
      const platformCount = selectedPlatforms.length;
      
      // Advanced scoring algorithm based on content analysis
      let engagementScore = 0;
      
      // 1. Content Length Scoring (0-25 points)
      if (contentLength === 0) {
        engagementScore += 0;
      } else if (contentLength < 50) {
        engagementScore += 10; // Too short
      } else if (contentLength >= 50 && contentLength <= 150) {
        engagementScore += 25; // Optimal length
      } else if (contentLength > 150 && contentLength <= 280) {
        engagementScore += 20; // Good length
      } else {
        engagementScore += 10; // Too long
      }
      
      // 2. Hashtag Scoring (0-20 points)
      if (hashtagCount === 0) {
        engagementScore += 0;
      } else if (hashtagCount >= 3 && hashtagCount <= 7) {
        engagementScore += 20; // Optimal hashtag count
      } else if (hashtagCount > 0 && hashtagCount < 3) {
        engagementScore += 10; // Some hashtags
      } else {
        engagementScore += 5; // Too many hashtags
      }
      
      // 3. Media Scoring (0-20 points)
      if (hasMedia) {
        engagementScore += 20;
      }
      
      // 4. Platform Selection (0-10 points)
      engagementScore += Math.min(platformCount * 3, 10);
      
      // 5. Content Quality Analysis (0-15 points)
      const emojiCount = (content.match(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu) || []).length;
      if (emojiCount >= 1 && emojiCount <= 3) {
        engagementScore += 10; // Good emoji usage
      } else if (emojiCount > 3) {
        engagementScore += 5; // Too many emojis
      }
      
      // Check for call-to-action
      if (/\?|!|check out|learn more|click|visit|contact|call|dm|message|get|try|buy|shop|download/i.test(content)) {
        engagementScore += 5;
      }
      
      // 6. Keyword Quality (0-10 points)
      const marketingKeywords = ['new', 'exclusive', 'limited', 'free', 'sale', 'offer', 'today', 'now', 'best', 'amazing', 'special'];
      const keywordMatches = marketingKeywords.filter(keyword => 
        new RegExp(`\\b${keyword}\\b`, 'i').test(content)
      );
      engagementScore += Math.min(keywordMatches.length * 2, 10);
      
      // Cap score at 100
      engagementScore = Math.min(engagementScore, 100);
      
      // Calculate realistic estimates based on score
      // Use minimum of 1 platform for calculation to avoid 0 values
      const effectivePlatformCount = Math.max(platformCount, 1);
      const baseReach = 500;
      const reachMultiplier = Math.max(engagementScore / 20, 1); // Minimum multiplier of 1
      const estimatedReach = Math.max(Math.floor(baseReach * reachMultiplier * effectivePlatformCount), 250);
      const estimatedLikes = Math.max(Math.floor(estimatedReach * 0.15 * (engagementScore / 100)), 50);
      const estimatedShares = Math.max(Math.floor(estimatedLikes * 0.25), 10);
      
      console.log('📊 Performance Calculation:');
      console.log('  - Engagement Score:', engagementScore);
      console.log('  - Platform Count:', platformCount, '(effective:', effectivePlatformCount + ')');
      console.log('  - Estimated Reach:', estimatedReach);
      console.log('  - Estimated Likes:', estimatedLikes);
      console.log('  - Estimated Shares:', estimatedShares);
      
      const estimate = {
        engagement: Math.round(engagementScore),
        estimatedReach: estimatedReach,
        estimatedLikes: estimatedLikes,
        estimatedShares: estimatedShares,
        sentiment: engagementScore >= 75 ? 'Positive' : engagementScore >= 50 ? 'Neutral' : 'Needs Improvement',
        platformsSelected: platformCount,
      };
      
      setPerformanceEstimate(estimate);
      setPerformanceOpen(true);
    } catch (error) {
      console.error('Error estimating:', error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Multi-Platform Posting
  const handlePost = async () => {
    console.log('🔵 PUBLISH button clicked!');
    console.log('📊 Selected platforms:', selectedPlatforms);
    console.log('📝 Post content:', postContent);
    console.log('🏷️ Hashtags:', hashtags);
    
    if (selectedPlatforms.length === 0) {
      setNotification({
        open: true,
        message: '⚠️ Please select at least one platform',
        severity: 'warning'
      });
      return;
    }

    if (!postContent.trim()) {
      setNotification({
        open: true,
        message: '⚠️ Please add content to your post',
        severity: 'warning'
      });
      return;
    }

    setLoading(true);
    try {
      const postData = {
        content: optimizedContent || postContent,
        platforms: selectedPlatforms,
        hashtags: hashtags,
        mediaUrl: mediaUrl,
        createdAt: new Date().toISOString(),
        userId: currentUser?.uid || 'anonymous',
        status: 'published',
      };

      console.log('💾 Saving post data:', postData);
      const docRef = await addDoc(collection(db, 'posts'), postData);
      console.log('✅ Post saved with ID:', docRef.id);

      setNotification({
        open: true,
        message: `🎉 Successfully posted to ${selectedPlatforms.join(', ')}!`,
        severity: 'success'
      });

      // Reset form after 1 second to show success message
      setTimeout(() => {
        setPostContent('');
        setOptimizedContent('');
        setHashtags([]);
        setMediaUrl('');
        setSelectedPlatforms([]);
        console.log('🔄 Form reset complete');
      }, 1000);
    } catch (error) {
      console.error('❌ Error posting:', error);
      console.error('Error details:', error.message, error.stack);
      setNotification({
        open: true,
        message: `❌ Failed to publish: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const togglePlatform = (platform) => {
    if (!connectedPlatforms[platform]) {
      setNotification({
        open: true,
        message: `⚠️ Please connect your ${platform} account first`,
        severity: 'warning'
      });
      return;
    }

    setSelectedPlatforms(prev =>
      prev.includes(platform)
        ? prev.filter(p => p !== platform)
        : [...prev, platform]
    );
  };

  const addHashtag = () => {
    console.log('🔵 ADD button clicked!');
    console.log('📝 Input value:', hashtagInput);
    console.log('📊 Current hashtags:', hashtags);
    
    const cleanTag = hashtagInput.trim().replace('#', '');
    console.log('🧹 Clean tag:', cleanTag);
    
    if (!cleanTag) {
      console.log('❌ Empty tag!');
      setNotification({
        open: true,
        message: '⚠️ Please enter a hashtag',
        severity: 'warning'
      });
      return;
    }
    
    if (hashtags.includes(cleanTag)) {
      console.log('❌ Already exists!');
      setNotification({
        open: true,
        message: '⚠️ Hashtag already added',
        severity: 'warning'
      });
      setHashtagInput(''); // Clear input
      return;
    }
    
    const newHashtags = [...hashtags, cleanTag];
    console.log('✅ Adding hashtag! New list:', newHashtags);
    setHashtags(newHashtags);
    setHashtagInput('');
    setNotification({
      open: true,
      message: `✅ Added #${cleanTag} (Total: ${newHashtags.length})`,
      severity: 'success'
    });
    console.log('✅ Hashtag added successfully!');
  };

  const removeHashtag = (tag) => {
    setHashtags(hashtags.filter(t => t !== tag));
  };

  const applyOptimizedContent = () => {
    setPostContent(optimizedContent);
    setOptimizedContent('');
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#667eea' }}>
            🚀 Social Media Hub
          </Typography>
          <Typography variant="h6" color="text.secondary">
            AI-Powered Multi-Platform Content Management
          </Typography>
        </Box>

        {/* Main Content */}
        <Grid container spacing={3}>
          {/* Left Panel - Content Creation */}
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ✏️ Create Your Post
                </Typography>
                
                {/* Post Content */}
                <TextField
                  fullWidth
                  multiline
                  rows={6}
                  variant="outlined"
                  placeholder="What's on your mind?"
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  sx={{ mb: 2 }}
                />

                {/* Optimized Content Preview */}
                {optimizedContent && (
                  <Alert 
                    severity="success" 
                    action={
                      <Button color="inherit" size="small" onClick={applyOptimizedContent}>
                        Apply
                      </Button>
                    }
                    sx={{ mb: 2 }}
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      Optimized Version:
                    </Typography>
                    <Typography variant="body2">{optimizedContent}</Typography>
                  </Alert>
                )}

                {/* Media URL */}
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Add image/video URL (optional)"
                  value={mediaUrl}
                  onChange={(e) => setMediaUrl(e.target.value)}
                  InputProps={{
                    startAdornment: <ImageIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                  sx={{ mb: 2 }}
                />

                {/* Hashtags */}
                <Box sx={{ mb: 2 }}>
                  {/* Add Hashtag Input + Selected Hashtags in one line */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1, flexWrap: 'wrap' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                      <TextField
                        size="small"
                        placeholder="Add hashtag"
                        value={hashtagInput}
                        onChange={(e) => setHashtagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addHashtag()}
                        inputRef={hashtagInputRef}
                        sx={{ width: '200px' }}
                        InputProps={{
                          startAdornment: <TagIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                        }}
                      />
                      <Button onClick={addHashtag} size="small" variant="contained" sx={{ ml: 1, height: '40px' }}>
                        ADD
                      </Button>
                    </Box>
                    
                    {/* Selected hashtags on the same line */}
                    {hashtags.length > 0 && (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center', flex: 1 }}>
                        {hashtags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={`#${tag}`}
                            onDelete={() => removeHashtag(tag)}
                            color="primary"
                            size="small"
                            sx={{
                              animation: 'slideIn 0.3s ease-out',
                              '@keyframes slideIn': {
                                from: {
                                  opacity: 0,
                                  transform: 'scale(0.8)',
                                },
                                to: {
                                  opacity: 1,
                                  transform: 'scale(1)',
                                },
                              },
                            }}
                          />
                        ))}
                      </Box>
                    )}
                  </Box>
                  
                  {/* Auto-generated hashtags */}
                  {suggestedHashtags.length > 0 && (
                    <Box sx={{ p: 1.5, bgcolor: '#f0f7ff', borderRadius: 1, border: '1px solid #b3d9ff' }}>
                      <Box sx={{ color: '#1976d2', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                        <AutoAwesomeIcon sx={{ fontSize: 14 }} />
                        <Typography variant="caption" component="span" sx={{ color: '#1976d2', fontWeight: 600 }}>
                          AI Suggestions (Click to add):
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                        {suggestedHashtags.map((tag, index) => (
                          <Chip
                            key={index}
                            label={`#${tag}`}
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log('🔵 AI Hashtag clicked:', tag);
                              console.log('📝 Filling input field with:', tag);
                              
                              // Fill the input field with the clicked hashtag
                              setHashtagInput(tag);
                              
                              // Focus the input field so user can see it's filled
                              setTimeout(() => {
                                if (hashtagInputRef.current) {
                                  hashtagInputRef.current.focus();
                                  console.log('🎯 Input field focused!');
                                }
                              }, 100);
                              
                              setNotification({
                                open: true,
                                message: `✏️ "${tag}" ready - Click ADD button or press Enter`,
                                severity: 'info'
                              });
                            }}
                            sx={{ 
                              cursor: 'pointer',
                              bgcolor: hashtags.includes(tag) ? '#4caf50' : '#e3f2fd',
                              color: hashtags.includes(tag) ? '#fff' : '#1976d2',
                              border: hashtags.includes(tag) ? '2px solid #4caf50' : '1px dashed #90caf9',
                              '&:hover': {
                                bgcolor: hashtags.includes(tag) ? '#45a049' : '#90caf9',
                                transform: 'scale(1.05)',
                                boxShadow: 2
                              },
                              transition: 'all 0.2s'
                            }}
                            icon={hashtags.includes(tag) ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : undefined}
                          />
                        ))}
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            const uniqueHashtags = [...new Set([...hashtags, ...suggestedHashtags])];
                            setHashtags(uniqueHashtags);
                            setNotification({
                              open: true,
                              message: `✅ Added all suggestions! Total: ${uniqueHashtags.length}`,
                              severity: 'success'
                            });
                          }}
                          sx={{ 
                            ml: 1, 
                            fontSize: '0.7rem',
                            textTransform: 'none',
                            borderColor: '#1976d2',
                            color: '#1976d2',
                            '&:hover': {
                              bgcolor: '#e3f2fd',
                              borderColor: '#1565c0'
                            }
                          }}
                        >
                          + Add All
                        </Button>
                      </Box>
                    </Box>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Action Buttons */}
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<AutoAwesomeIcon />}
                      onClick={optimizePost}
                      disabled={loading || !postContent}
                    >
                      Optimize
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<PreviewIcon />}
                      onClick={() => setPreviewOpen(true)}
                      disabled={!postContent}
                    >
                      Preview
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="outlined"
                      startIcon={<TrendingUpIcon />}
                      onClick={estimatePerformance}
                      disabled={!postContent}
                    >
                      Estimate
                    </Button>
                  </Grid>
                  <Grid item xs={12} sm={6} md={3}>
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<SendIcon />}
                      onClick={handlePost}
                      disabled={loading}
                      sx={{
                        background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
                      }}
                    >
                      Publish
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* Right Panel - Platform Selection & Features */}
          <Grid item xs={12} md={4}>
            {/* Platform Selection */}
            <Card elevation={3} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  📱 Select Platforms
                </Typography>
                <List>
                  {[
                    { id: 'facebook', icon: FacebookIcon, color: '#1877f2', label: 'Facebook' },
                    { id: 'twitter', icon: TwitterIcon, color: '#1da1f2', label: 'Twitter' },
                    { id: 'instagram', icon: InstagramIcon, color: '#e4405f', label: 'Instagram' },
                    { id: 'linkedin', icon: LinkedInIcon, color: '#0077b5', label: 'LinkedIn' },
                  ].map((platform) => {
                    const Icon = platform.icon;
                    const isConnected = connectedPlatforms[platform.id];
                    const isSelected = selectedPlatforms.includes(platform.id);
                    
                    return (
                      <ListItem
                        key={platform.id}
                        button
                        onClick={() => togglePlatform(platform.id)}
                        sx={{
                          border: isSelected ? `2px solid ${platform.color}` : '1px solid #e0e0e0',
                          borderRadius: 1,
                          mb: 1,
                          bgcolor: isSelected ? `${platform.color}10` : 'transparent',
                        }}
                      >
                        <ListItemIcon>
                          <Badge
                            badgeContent={isConnected ? '✓' : '✗'}
                            color={isConnected ? 'success' : 'error'}
                          >
                            <Icon sx={{ color: platform.color }} />
                          </Badge>
                        </ListItemIcon>
                        <ListItemText primary={platform.label} />
                        {isSelected && <CheckCircleIcon sx={{ color: platform.color }} />}
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>

            {/* Features */}
            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  ⚙️ Smart Features
                </Typography>
                <List>
                  <ListItem>
                    <ListItemIcon>
                      <TagIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Auto-Hashtag Generation"
                      secondary={autoHashtagEnabled ? 'Enabled' : 'Disabled'}
                    />
                    <Switch
                      checked={autoHashtagEnabled}
                      onChange={(e) => setAutoHashtagEnabled(e.target.checked)}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AutoAwesomeIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="AI Optimization"
                      secondary="Enhance engagement"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <TrendingUpIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Performance Estimation"
                      secondary="Predict success"
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PreviewIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Smart Preview"
                      secondary="See before posting"
                    />
                  </ListItem>
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Preview Dialog */}
        <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>
            📱 Post Preview
            <Tabs value={previewMode} onChange={(e, v) => setPreviewMode(v)} sx={{ mt: 1 }}>
              <Tab label="Facebook" value="facebook" icon={<FacebookIcon />} iconPosition="start" />
              <Tab label="Twitter" value="twitter" icon={<TwitterIcon />} iconPosition="start" />
              <Tab label="Instagram" value="instagram" icon={<InstagramIcon />} iconPosition="start" />
              <Tab label="LinkedIn" value="linkedin" icon={<LinkedInIcon />} iconPosition="start" />
            </Tabs>
          </DialogTitle>
          <DialogContent>
            <Paper elevation={0} sx={{ 
              p: 2, 
              bgcolor: previewMode === 'twitter' ? '#15202b' : '#f5f5f5', 
              borderRadius: 2,
              border: previewMode === 'instagram' ? '1px solid #dbdbdb' : 'none'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar src={currentUser?.photoURL} sx={{ mr: 1 }}>
                  {currentUser?.displayName?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: previewMode === 'twitter' ? '#fff' : 'inherit' }}>
                    {currentUser?.displayName || 'User'}
                    {previewMode === 'twitter' && <Typography component="span" sx={{ color: '#8899a6', ml: 0.5 }}>@{currentUser?.displayName?.toLowerCase().replace(/\s/g, '') || 'user'}</Typography>}
                  </Typography>
                  <Typography variant="caption" sx={{ color: previewMode === 'twitter' ? '#8899a6' : 'text.secondary' }}>
                    {previewMode === 'linkedin' ? 'Posted on LinkedIn' : 'Just now'}
                  </Typography>
                </Box>
              </Box>
              
              {/* Platform-specific content rendering */}
              {previewMode === 'twitter' && (
                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: '#fff', fontSize: '15px' }}>
                  {(optimizedContent || postContent).length > 280 
                    ? (optimizedContent || postContent).substring(0, 277) + '...' 
                    : (optimizedContent || postContent)}
                  {hashtags.length > 0 && (
                    <Typography component="span" sx={{ color: '#1d9bf0', ml: 1 }}>
                      {hashtags.slice(0, 3).map(tag => `#${tag}`).join(' ')}
                    </Typography>
                  )}
                </Typography>
              )}
              
              {previewMode === 'instagram' && (
                <>
                  {mediaUrl && (
                    <Box sx={{ mt: 1, mb: 2, bgcolor: '#000', height: 300, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon sx={{ fontSize: 80, color: '#999' }} />
                    </Box>
                  )}
                  <Box>
                    <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                      <Typography component="span" sx={{ fontWeight: 600, mr: 1 }}>
                        {currentUser?.displayName?.toLowerCase().replace(/\s/g, '_') || 'user'}
                      </Typography>
                      {optimizedContent || postContent}
                    </Typography>
                    {hashtags.length > 0 && (
                      <Typography variant="body2" sx={{ color: '#00376b', mt: 1 }}>
                        {hashtags.map(tag => `#${tag}`).join(' ')}
                      </Typography>
                    )}
                  </Box>
                </>
              )}
              
              {previewMode === 'facebook' && (
                <>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 1 }}>
                {optimizedContent || postContent}
              </Typography>
              {hashtags.length > 0 && (
                    <Typography variant="body2" sx={{ color: '#385898', mb: 1 }}>
                  {hashtags.map(tag => `#${tag}`).join(' ')}
                </Typography>
              )}
              {mediaUrl && (
                    <Box sx={{ mt: 2, bgcolor: '#ddd', height: 250, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ImageIcon sx={{ fontSize: 60, color: '#999' }} />
                </Box>
                  )}
                </>
              )}
              
              {previewMode === 'linkedin' && (
                <>
                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 1, lineHeight: 1.6 }}>
                    {optimizedContent || postContent}
                  </Typography>
                  {hashtags.length > 0 && (
                    <Typography variant="body2" sx={{ color: '#0073b1', mb: 1 }}>
                      {hashtags.map(tag => `#${tag}`).join(' ')}
                    </Typography>
                  )}
                  {mediaUrl && (
                    <Box sx={{ mt: 2, bgcolor: '#ddd', height: 250, borderRadius: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <ImageIcon sx={{ fontSize: 60, color: '#999' }} />
                    </Box>
                  )}
                </>
              )}
            </Paper>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setPreviewOpen(false)}>Close</Button>
          </DialogActions>
        </Dialog>

        {/* Performance Dialog */}
        <Dialog open={performanceOpen} onClose={() => setPerformanceOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            color: '#fff',
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            <TrendingUpIcon /> Performance Estimation
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {performanceEstimate && (
              <Box>
                <Alert 
                  severity={
                    performanceEstimate.sentiment === 'Positive' ? 'success' : 
                    performanceEstimate.sentiment === 'Needs Improvement' ? 'warning' : 
                    'info'
                  } 
                  sx={{ mb: 3, fontSize: '16px' }}
                  icon={
                    performanceEstimate.sentiment === 'Positive' ? <CheckCircleIcon /> :
                    performanceEstimate.sentiment === 'Needs Improvement' ? <InfoIcon /> :
                    <InfoIcon />
                  }
                >
                  Overall Sentiment: <strong>{performanceEstimate.sentiment}</strong>
                </Alert>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Engagement Score
                  </Typography>
                    <Typography variant="h4" sx={{ 
                      fontWeight: 700,
                      color: performanceEstimate.engagement > 70 ? '#4caf50' : 
                             performanceEstimate.engagement > 50 ? '#ff9800' : '#f44336'
                    }}>
                      {performanceEstimate.engagement}%
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={performanceEstimate.engagement} 
                    sx={{ 
                      height: 12, 
                      borderRadius: 6,
                      bgcolor: '#e0e0e0',
                      '& .MuiLinearProgress-bar': {
                        borderRadius: 6,
                        background: performanceEstimate.engagement > 70 
                          ? 'linear-gradient(90deg, #4caf50, #81c784)' 
                          : performanceEstimate.engagement > 50
                          ? 'linear-gradient(90deg, #ff9800, #ffb74d)'
                          : 'linear-gradient(90deg, #f44336, #e57373)',
                      }
                    }}
                  />
                </Box>

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <VisibilityIcon sx={{ fontSize: 40, color: '#667eea', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                        {performanceEstimate.estimatedReach.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estimated Reach
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        people
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <FavoriteIcon sx={{ fontSize: 40, color: '#e91e63', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#e91e63' }}>
                        {performanceEstimate.estimatedLikes.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estimated Likes
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        reactions
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Paper elevation={2} sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f5f5', borderRadius: 2 }}>
                      <ShareIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
                      <Typography variant="h5" sx={{ fontWeight: 700, color: '#4caf50' }}>
                        {performanceEstimate.estimatedShares.toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Estimated Shares
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        shares
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>

                <Box sx={{ mt: 3, p: 2, bgcolor: '#e3f2fd', borderRadius: 2, borderLeft: '4px solid #2196f3' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <InfoIcon fontSize="small" color="info" />
                    <Typography variant="body2" component="span">
                      <strong>Tip:</strong> {performanceEstimate.platformsSelected === 0
                        ? '⚠️ Select at least one platform to see real performance estimates. These are baseline projections.'
                        : performanceEstimate.engagement > 70 
                        ? 'Great job! Your content is optimized for maximum engagement.' 
                        : performanceEstimate.engagement > 50
                        ? 'Good start! Consider adding more hashtags or media to boost engagement.'
                        : 'Try optimizing your content with emojis, hashtags, and eye-catching media.'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            )}
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={() => setPerformanceOpen(false)} variant="outlined">Close</Button>
            <Button 
              onClick={() => {
                setPerformanceOpen(false);
                optimizePost();
              }} 
              variant="contained"
              startIcon={<AutoAwesomeIcon />}
            >
              Optimize Content
            </Button>
          </DialogActions>
        </Dialog>

        {/* Notification Snackbar */}
        <Snackbar
          open={notification.open}
          autoHideDuration={4000}
          onClose={() => setNotification({ ...notification, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={() => setNotification({ ...notification, open: false })} 
            severity={notification.severity}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>

        {loading && <LinearProgress sx={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9999 }} />}
      </motion.div>
    </Container>
  );
};

export default SocialMediaHub;


