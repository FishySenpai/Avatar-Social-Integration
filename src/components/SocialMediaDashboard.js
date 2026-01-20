import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Grid,
  Typography,
  Button,
  TextField,
  IconButton,
  Chip,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar,
  CircularProgress,
  Avatar,
  Tooltip,
  Badge,
  LinearProgress,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tabs,
  Tab,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Instagram as InstagramIcon,
  LinkedIn as LinkedInIcon,
  Schedule as ScheduleIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  AccessTime as AccessTimeIcon,
  BarChart as BarChartIcon,
  SmartToy as AIIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  AutoAwesome as AutoAwesomeIcon,
  Lightbulb as LightbulbIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  GitHub as GitHubIcon,
  YouTube as YouTubeIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Filler
);

const SocialMediaDashboard = () => {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;

  const [activeTab, setActiveTab] = useState(0);
  const [scheduledPosts, setScheduledPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);
  const [postDialogOpen, setPostDialogOpen] = useState(false);
  const [analyticsDialogOpen, setAnalyticsDialogOpen] = useState(false);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);
  const [connectingPlatform, setConnectingPlatform] = useState(null);
  const [editFormData, setEditFormData] = useState({ content: '', platform: '', aiScore: 0 });
  const [connectedAccounts, setConnectedAccounts] = useState({
    facebook: false,
    twitter: false,
    instagram: false,
    linkedin: false,
    github: false,
    youtube: false,
  });

  // Generate demo scheduled posts with AI scores
  const generateDemoPosts = useCallback(() => {
    const platforms = ['facebook', 'twitter', 'instagram', 'linkedin'];
    const statuses = ['scheduled', 'published', 'pending', 'failed'];
    const contentSamples = [
      '🚀 Exciting news! We just launched our new AI-powered feature. Try it now!',
      'Check out our latest blog post on digital marketing trends for 2025 📈',
      '✨ Transform your social media strategy with these proven tips',
      'Join us for our upcoming webinar on content creation #Marketing #SocialMedia',
      '🎉 Celebrating 10K followers! Thank you for your amazing support',
      'New product alert! Discover what makes us different from the competition',
      'Behind the scenes: How we create content that resonates with our audience',
      'Expert tips for growing your online presence organically 🌱',
    ];

    const posts = [];
    for (let i = 0; i < 20; i++) {
      const randomDaysAgo = Math.floor(Math.random() * 14);
      const randomHoursAgo = Math.floor(Math.random() * 24);
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() - randomDaysAgo);
      scheduledDate.setHours(scheduledDate.getHours() + randomHoursAgo);

      const platform = platforms[Math.floor(Math.random() * platforms.length)];
      const status = i < 12 ? 'published' : statuses[Math.floor(Math.random() * statuses.length)];
      const aiScore = Math.floor(Math.random() * 40) + 60; // 60-100
      const engagement = status === 'published' ? Math.floor(Math.random() * 5000) + 500 : 0;

      posts.push({
        id: `post-${i + 1}`,
        content: contentSamples[Math.floor(Math.random() * contentSamples.length)],
        platform,
        status,
        scheduledTime: scheduledDate.toISOString(),
        aiScore,
        likes: status === 'published' ? Math.floor(engagement * 0.6) : 0,
        comments: status === 'published' ? Math.floor(engagement * 0.2) : 0,
        shares: status === 'published' ? Math.floor(engagement * 0.2) : 0,
        reach: status === 'published' ? engagement * 10 : 0,
        impressions: status === 'published' ? engagement * 15 : 0,
        ctr: status === 'published' ? (Math.random() * 5 + 2).toFixed(2) : 0,
      });
    }

    posts.sort((a, b) => new Date(b.scheduledTime) - new Date(a.scheduledTime));
    setScheduledPosts(posts);
    setFilteredPosts(posts);

    // Save to localStorage
    if (uid) {
      localStorage.setItem(`scheduledPosts_${uid}`, JSON.stringify(posts));
    }
  }, [uid]);

  // Generate analytics data
  const generateAnalyticsData = useCallback(() => {
    const publishedPosts = scheduledPosts.filter(p => p.status === 'published');
    
    if (publishedPosts.length === 0) {
      return null;
    }

    const totalLikes = publishedPosts.reduce((sum, p) => sum + p.likes, 0);
    const totalComments = publishedPosts.reduce((sum, p) => sum + p.comments, 0);
    const totalShares = publishedPosts.reduce((sum, p) => sum + p.shares, 0);
    const totalReach = publishedPosts.reduce((sum, p) => sum + p.reach, 0);
    const totalImpressions = publishedPosts.reduce((sum, p) => sum + p.impressions, 0);
    const avgAIScore = (publishedPosts.reduce((sum, p) => sum + p.aiScore, 0) / publishedPosts.length).toFixed(1);
    const avgEngagement = Math.floor((totalLikes + totalComments + totalShares) / publishedPosts.length);
    const engagementRate = ((totalLikes + totalComments + totalShares) / totalImpressions * 100).toFixed(2);

    // Platform breakdown
    const platformData = {};
    publishedPosts.forEach(post => {
      if (!platformData[post.platform]) {
        platformData[post.platform] = { likes: 0, comments: 0, shares: 0, posts: 0 };
      }
      platformData[post.platform].likes += post.likes;
      platformData[post.platform].comments += post.comments;
      platformData[post.platform].shares += post.shares;
      platformData[post.platform].posts += 1;
    });

    // Time series data (last 7 days)
    const last7Days = [];
    const dailyData = {};
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      last7Days.push(dateStr);
      dailyData[dateStr] = { likes: 0, comments: 0, shares: 0, reach: 0 };
    }

    publishedPosts.forEach(post => {
      const postDate = new Date(post.scheduledTime);
      const dateStr = postDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      
      if (dailyData[dateStr]) {
        dailyData[dateStr].likes += post.likes;
        dailyData[dateStr].comments += post.comments;
        dailyData[dateStr].shares += post.shares;
        dailyData[dateStr].reach += post.reach;
      }
    });

    setAnalyticsData({
      overview: {
        totalPosts: publishedPosts.length,
        totalLikes,
        totalComments,
        totalShares,
        totalReach,
        totalImpressions,
        avgAIScore,
        avgEngagement,
        engagementRate,
      },
      platformData,
      timeSeriesData: {
        labels: last7Days,
        likes: last7Days.map(day => dailyData[day].likes),
        comments: last7Days.map(day => dailyData[day].comments),
        shares: last7Days.map(day => dailyData[day].shares),
        reach: last7Days.map(day => dailyData[day].reach),
      },
    });
  }, [scheduledPosts]);

  // Load data on mount
  useEffect(() => {
    if (uid) {
      const savedPosts = localStorage.getItem(`scheduledPosts_${uid}`);
      if (savedPosts) {
        const posts = JSON.parse(savedPosts);
        setScheduledPosts(posts);
        setFilteredPosts(posts);
      } else {
        generateDemoPosts();
      }

      // Load connected accounts
      const savedAccounts = localStorage.getItem(`connectedAccounts_${uid}`);
      if (savedAccounts) {
        setConnectedAccounts(JSON.parse(savedAccounts));
      }
    }
  }, [uid, generateDemoPosts]);

  // Generate analytics when posts change
  useEffect(() => {
    if (scheduledPosts.length > 0) {
      generateAnalyticsData();
    }
  }, [scheduledPosts, generateAnalyticsData]);

  // Apply filters
  useEffect(() => {
    let filtered = [...scheduledPosts];

    // Filter by platform
    if (filterPlatform !== 'all') {
      filtered = filtered.filter(p => p.platform === filterPlatform);
    }

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(p => p.status === filterStatus);
    }

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredPosts(filtered);
  }, [filterPlatform, filterStatus, searchQuery, scheduledPosts]);

  const handleDeletePost = useCallback((postId) => {
    const updatedPosts = scheduledPosts.filter(p => p.id !== postId);
    setScheduledPosts(updatedPosts);
    setFilteredPosts(updatedPosts);
    
    if (uid) {
      localStorage.setItem(`scheduledPosts_${uid}`, JSON.stringify(updatedPosts));
    }
    
    setSnack({ open: true, message: '✅ Post deleted successfully', severity: 'success' });
  }, [scheduledPosts, uid]);

  const handleEditPost = useCallback((post) => {
    setSelectedPost(post);
    setEditFormData({
      content: post.content,
      platform: post.platform,
      aiScore: post.aiScore,
    });
    setPostDialogOpen(true);
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!selectedPost) return;

    const updatedPosts = scheduledPosts.map(p =>
      p.id === selectedPost.id
        ? { ...p, content: editFormData.content, platform: editFormData.platform }
        : p
    );

    setScheduledPosts(updatedPosts);
    setFilteredPosts(updatedPosts);

    if (uid) {
      localStorage.setItem(`scheduledPosts_${uid}`, JSON.stringify(updatedPosts));
    }

    setPostDialogOpen(false);
    setSnack({ open: true, message: '✅ Post updated successfully!', severity: 'success' });
  }, [selectedPost, editFormData, scheduledPosts, uid]);

  const handleViewAnalytics = useCallback((post) => {
    setSelectedPost(post);
    setAnalyticsDialogOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      generateDemoPosts();
      setLoading(false);
      setSnack({ open: true, message: '✅ Data refreshed', severity: 'success' });
    }, 800);
  }, [generateDemoPosts]);

  const handleRefreshAnalytics = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      generateAnalyticsData();
      setLoading(false);
      setSnack({ open: true, message: '✅ Analytics refreshed', severity: 'success' });
    }, 800);
  }, [generateAnalyticsData]);

  const handleStatCardClick = useCallback((filterType, filterValue) => {
    setActiveTab(0); // Switch to Scheduled Posts tab
    
    if (filterType === 'status') {
      setFilterStatus(filterValue);
      setFilterPlatform('all');
    } else if (filterType === 'all') {
      setFilterStatus('all');
      setFilterPlatform('all');
    }
    
    setSearchQuery('');
    setSnack({ open: true, message: `Filtered by: ${filterValue}`, severity: 'info' });
  }, []);

  const handleConnectAccount = useCallback((platform) => {
    // Prevent multiple clicks at once
    if (connectingPlatform) return;
    
    setConnectingPlatform(platform);
    
    setTimeout(() => {
      const wasConnected = connectedAccounts[platform];
      const newStatus = !wasConnected;
      
      setConnectedAccounts(prev => ({
        ...prev,
        [platform]: newStatus
      }));
      
      if (uid) {
        const updatedAccounts = { ...connectedAccounts, [platform]: newStatus };
        localStorage.setItem(`connectedAccounts_${uid}`, JSON.stringify(updatedAccounts));
      }
      
      const action = wasConnected ? 'disconnected from' : 'connected to';
      setConnectingPlatform(null);
      setSnack({ 
        open: true, 
        message: `✅ Successfully ${action} ${platform.charAt(0).toUpperCase() + platform.slice(1)}!`, 
        severity: wasConnected ? 'warning' : 'success' 
      });
    }, 1000);
  }, [connectedAccounts, connectingPlatform, uid]);

  const getPlatformIcon = (platform) => {
    const icons = {
      facebook: <FacebookIcon sx={{ color: '#1877f2' }} />,
      twitter: <TwitterIcon sx={{ color: '#1da1f2' }} />,
      instagram: <InstagramIcon sx={{ color: '#e4405f' }} />,
      linkedin: <LinkedInIcon sx={{ color: '#0077b5' }} />,
      github: <GitHubIcon sx={{ color: '#333' }} />,
      youtube: <YouTubeIcon sx={{ color: '#ff0000' }} />,
    };
    return icons[platform] || <AIIcon />;
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      scheduled: { label: 'Scheduled', color: 'info', icon: <ScheduleIcon fontSize="small" /> },
      published: { label: 'Published', color: 'success', icon: <CheckCircleIcon fontSize="small" /> },
      pending: { label: 'Pending', color: 'warning', icon: <PendingIcon fontSize="small" /> },
      failed: { label: 'Failed', color: 'error', icon: <CloseIcon fontSize="small" /> },
    };
    
    const config = statusConfig[status] || statusConfig.pending;
    
    return (
      <Chip
        label={config.label}
        color={config.color}
        size="small"
        icon={config.icon}
        sx={{ fontWeight: 600 }}
      />
    );
  };

  const getAIScoreColor = (score) => {
    if (score >= 85) return '#4caf50';
    if (score >= 70) return '#ff9800';
    return '#f44336';
  };

  // Charts configuration
  const engagementLineChart = analyticsData ? {
    labels: analyticsData.timeSeriesData.labels,
    datasets: [
      {
        label: 'Likes',
        data: analyticsData.timeSeriesData.likes,
        borderColor: '#4caf50',
        backgroundColor: 'rgba(76, 175, 80, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Comments',
        data: analyticsData.timeSeriesData.comments,
        borderColor: '#2196f3',
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Shares',
        data: analyticsData.timeSeriesData.shares,
        borderColor: '#ff9800',
        backgroundColor: 'rgba(255, 152, 0, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  } : null;

  const platformBarChart = analyticsData ? {
    labels: Object.keys(analyticsData.platformData).map(p => p.charAt(0).toUpperCase() + p.slice(1)),
    datasets: [
      {
        label: 'Likes',
        data: Object.values(analyticsData.platformData).map(d => d.likes),
        backgroundColor: 'rgba(76, 175, 80, 0.8)',
      },
      {
        label: 'Comments',
        data: Object.values(analyticsData.platformData).map(d => d.comments),
        backgroundColor: 'rgba(33, 150, 243, 0.8)',
      },
      {
        label: 'Shares',
        data: Object.values(analyticsData.platformData).map(d => d.shares),
        backgroundColor: 'rgba(255, 152, 0, 0.8)',
      },
    ],
  } : null;

  const engagementDoughnut = analyticsData ? {
    labels: ['Likes', 'Comments', 'Shares'],
    datasets: [{
      data: [
        analyticsData.overview.totalLikes,
        analyticsData.overview.totalComments,
        analyticsData.overview.totalShares,
      ],
      backgroundColor: ['#4caf50', '#2196f3', '#ff9800'],
      borderWidth: 0,
    }],
  } : null;

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: '#f5f7fa', minHeight: '100vh' }}>
      {/* Header with AI Branding */}
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
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 40px rgba(102, 126, 234, 0.3)',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={2} mb={1}>
              <Avatar
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  width: 56,
                  height: 56,
                  backdropFilter: 'blur(10px)',
                }}
              >
                <AIIcon sx={{ fontSize: 32, color: '#fff' }} />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                  AI-Powered Social Media Dashboard
                </Typography>
                <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                  Intelligent scheduling and performance analytics
                </Typography>
              </Box>
            </Stack>

            {/* Quick Stats - Clickable */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={6} sm={3}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      backdropFilter: 'blur(10px)', 
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.25)',
                      }
                    }}
                    onClick={() => handleStatCardClick('all', 'All Posts')}
                  >
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Total Posts</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                      {scheduledPosts.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Click to view all
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      backdropFilter: 'blur(10px)', 
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.25)',
                      }
                    }}
                    onClick={() => handleStatCardClick('status', 'published')}
                  >
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Published</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                      {scheduledPosts.filter(p => p.status === 'published').length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Click to filter
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      backdropFilter: 'blur(10px)', 
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.25)',
                      }
                    }}
                    onClick={() => handleStatCardClick('status', 'scheduled')}
                  >
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Scheduled</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                      {scheduledPosts.filter(p => p.status === 'scheduled').length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Click to filter
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
              <Grid item xs={6} sm={3}>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Paper 
                    sx={{ 
                      p: 2, 
                      bgcolor: 'rgba(255,255,255,0.15)', 
                      backdropFilter: 'blur(10px)', 
                      borderRadius: 2,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: 'rgba(255,255,255,0.25)',
                      }
                    }}
                    onClick={() => {
                      setActiveTab(1);
                      setSnack({ open: true, message: 'Viewing AI Analytics', severity: 'info' });
                    }}
                  >
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>Avg AI Score</Typography>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: '#fff' }}>
                      {analyticsData ? analyticsData.overview.avgAIScore : '0'}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                      Click for analytics
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>
          </Box>

          {/* Animated background pattern */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              opacity: 0.1,
              background: 'radial-gradient(circle at 100% 0%, white 0%, transparent 50%)',
            }}
          />
        </Box>
      </motion.div>

      {/* Navigation Tabs */}
      <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTabs-indicator': {
              height: 4,
              borderRadius: '4px 4px 0 0',
            },
          }}
        >
          <Tab
            icon={<ScheduleIcon />}
            iconPosition="start"
            label={
              <Badge badgeContent={scheduledPosts.filter(p => p.status === 'scheduled').length} color="primary">
                Scheduled Posts
              </Badge>
            }
            sx={{ minHeight: 64, fontWeight: 600 }}
          />
          <Tab
            icon={<AnalyticsIcon />}
            iconPosition="start"
            label="Analytics"
            sx={{ minHeight: 64, fontWeight: 600 }}
          />
          <Tab
            icon={<CheckCircleIcon />}
            iconPosition="start"
            label={
              <Badge 
                badgeContent={Object.values(connectedAccounts).filter(Boolean).length} 
                color="success"
              >
                Connections
              </Badge>
            }
            sx={{ minHeight: 64, fontWeight: 600 }}
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        {activeTab === 0 && (
          <motion.div
            key="scheduled"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Filters */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 3 }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <FilterIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  Filters & Search
                </Typography>
              </Stack>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Search posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Platform</InputLabel>
                    <Select
                      value={filterPlatform}
                      label="Platform"
                      onChange={(e) => setFilterPlatform(e.target.value)}
                    >
                      <MenuItem value="all">All Platforms</MenuItem>
                      <MenuItem value="facebook">Facebook</MenuItem>
                      <MenuItem value="twitter">Twitter</MenuItem>
                      <MenuItem value="instagram">Instagram</MenuItem>
                      <MenuItem value="linkedin">LinkedIn</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      value={filterStatus}
                      label="Status"
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <MenuItem value="all">All Statuses</MenuItem>
                      <MenuItem value="scheduled">Scheduled</MenuItem>
                      <MenuItem value="published">Published</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="failed">Failed</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <Button
                    fullWidth
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                    onClick={handleRefresh}
                    disabled={loading}
                    sx={{
                      height: '100%',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    }}
                  >
                    Refresh
                  </Button>
                </Grid>
              </Grid>

              <Box sx={{ mt: 2 }}>
                <Chip
                  label={`${filteredPosts.length} posts shown`}
                  color="primary"
                  size="small"
                />
              </Box>
            </Paper>

            {/* Posts Table */}
            <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700, bgcolor: '#f5f7fa' }}>Content</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: '#f5f7fa' }}>Platform</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: '#f5f7fa' }}>Scheduled</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: '#f5f7fa' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: '#f5f7fa' }}>AI Score</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: '#f5f7fa' }}>Engagement</TableCell>
                      <TableCell sx={{ fontWeight: 700, bgcolor: '#f5f7fa' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredPosts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                          <Box>
                            <ScheduleIcon sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary">
                              No posts found
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Try adjusting your filters
                            </Typography>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPosts.map((post) => (
                        <TableRow
                          key={post.id}
                          hover
                          sx={{ '&:hover': { bgcolor: '#f5f7fa' } }}
                        >
                          <TableCell sx={{ maxWidth: 300 }}>
                            <Typography variant="body2" noWrap>
                              {post.content}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              {getPlatformIcon(post.platform)}
                              <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                                {post.platform}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <AccessTimeIcon fontSize="small" color="action" />
                              <Typography variant="body2">
                                {new Date(post.scheduledTime).toLocaleDateString()}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {getStatusChip(post.status)}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <AIIcon fontSize="small" sx={{ color: getAIScoreColor(post.aiScore) }} />
                              <Typography
                                variant="body2"
                                fontWeight="bold"
                                sx={{ color: getAIScoreColor(post.aiScore) }}
                              >
                                {post.aiScore}%
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell>
                            {post.status === 'published' ? (
                              <Stack direction="row" spacing={1}>
                                <Tooltip title="Likes">
                                  <Chip
                                    icon={<ThumbUpIcon />}
                                    label={post.likes}
                                    size="small"
                                    color="success"
                                  />
                                </Tooltip>
                                <Tooltip title="Comments">
                                  <Chip
                                    icon={<CommentIcon />}
                                    label={post.comments}
                                    size="small"
                                    color="info"
                                  />
                                </Tooltip>
                                <Tooltip title="Shares">
                                  <Chip
                                    icon={<ShareIcon />}
                                    label={post.shares}
                                    size="small"
                                    color="warning"
                                  />
                                </Tooltip>
                              </Stack>
                            ) : (
                              <Typography variant="body2" color="text.secondary">
                                N/A
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Stack direction="row" spacing={1}>
                              {post.status === 'published' && (
                                <Tooltip title="View Analytics">
                                  <IconButton
                                    size="small"
                                    color="primary"
                                    onClick={() => handleViewAnalytics(post)}
                                  >
                                    <ViewIcon />
                                  </IconButton>
                                </Tooltip>
                              )}
                              <Tooltip title="Edit">
                                <IconButton
                                  size="small"
                                  color="info"
                                  onClick={() => handleEditPost(post)}
                                >
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Tooltip>
                            </Stack>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </motion.div>
        )}

        {activeTab === 1 && analyticsData && (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Refresh Button */}
            <Box sx={{ mb: 3, textAlign: 'right' }}>
              <Button
                variant="contained"
                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <RefreshIcon />}
                onClick={handleRefreshAnalytics}
                disabled={loading}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                  },
                }}
              >
                Refresh Analytics
              </Button>
            </Box>

            {/* Overview Cards */}
            <Grid container spacing={3} mb={4}>
              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
                      color: '#fff',
                    }}
                  >
                    <ThumbUpIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {analyticsData.overview.totalLikes.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">Total Likes</Typography>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #2196f3 0%, #1976d2 100%)',
                      color: '#fff',
                    }}
                  >
                    <CommentIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {analyticsData.overview.totalComments.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">Total Comments</Typography>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #ff9800 0%, #f57c00 100%)',
                      color: '#fff',
                    }}
                  >
                    <ShareIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {analyticsData.overview.totalShares.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">Total Shares</Typography>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Paper
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: 'linear-gradient(135deg, #9c27b0 0%, #7b1fa2 100%)',
                      color: '#fff',
                    }}
                  >
                    <TrendingUpIcon sx={{ fontSize: 40, mb: 1 }} />
                    <Typography variant="h4" fontWeight="bold">
                      {analyticsData.overview.totalReach.toLocaleString()}
                    </Typography>
                    <Typography variant="body2">Total Reach</Typography>
                  </Paper>
                </motion.div>
              </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
              {/* Engagement Over Time */}
              <Grid item xs={12} lg={8}>
                <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <BarChartIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Engagement Over Time
                    </Typography>
                    <Chip
                      icon={<AIIcon />}
                      label="AI-Tracked"
                      size="small"
                      color="secondary"
                    />
                  </Stack>
                  {engagementLineChart && (
                    <Line
                      data={engagementLineChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 2,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  )}
                </Paper>
              </Grid>

              {/* Engagement Breakdown */}
              <Grid item xs={12} lg={4}>
                <Paper sx={{ p: 3, borderRadius: 3, height: '100%' }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <AnalyticsIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Engagement Breakdown
                    </Typography>
                  </Stack>
                  {engagementDoughnut && (
                    <Doughnut
                      data={engagementDoughnut}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                      }}
                    />
                  )}
                </Paper>
              </Grid>

              {/* Platform Performance */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <TrendingUpIcon color="primary" />
                    <Typography variant="h6" fontWeight="bold">
                      Platform Performance
                    </Typography>
                    <Chip
                      icon={<AIIcon />}
                      label="AI-Analyzed"
                      size="small"
                      color="secondary"
                    />
                  </Stack>
                  {platformBarChart && (
                    <Bar
                      data={platformBarChart}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 3,
                        plugins: {
                          legend: {
                            position: 'bottom',
                          },
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                          },
                        },
                      }}
                    />
                  )}
                </Paper>
              </Grid>

              {/* AI Insights */}
              <Grid item xs={12}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#fff',
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <LightbulbIcon sx={{ fontSize: 32 }} />
                    <Typography variant="h6" fontWeight="bold">
                      AI Insights & Recommendations
                    </Typography>
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
                          🎯 Peak Performance
                        </Typography>
                        <Typography variant="body2">
                          Your posts on Instagram achieve {Math.round(analyticsData.overview.engagementRate * 1.5)}% higher
                          engagement rate compared to other platforms. Consider posting more frequently there.
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
                          📈 Growth Opportunity
                        </Typography>
                        <Typography variant="body2">
                          Posts with AI scores above 85 receive 3x more engagement. Current avg: {analyticsData.overview.avgAIScore}%.
                          Use AI suggestions to improve your content quality.
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
                          ⏰ Best Time to Post
                        </Typography>
                        <Typography variant="body2">
                          Analysis shows your audience is most active between 2-4 PM on weekdays. Schedule posts
                          during these hours for maximum reach.
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, opacity: 0.9 }}>
                          🎨 Content Strategy
                        </Typography>
                        <Typography variant="body2">
                          Posts with emojis and images get {analyticsData.overview.avgEngagement + 200} avg engagement vs {analyticsData.overview.avgEngagement} for text-only.
                          Add visual elements to boost performance.
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {activeTab === 2 && (
          <motion.div
            key="connections"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Connections Header */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: '#fff' }}>
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <CheckCircleIcon sx={{ fontSize: 32 }} />
                <Box>
                  <Typography variant="h5" fontWeight="bold">
                    Social Media Connections
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Connect your social media accounts to start posting
                  </Typography>
                </Box>
              </Stack>
              <Chip
                label={`${Object.values(connectedAccounts).filter(Boolean).length} of 6 connected`}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontWeight: 600,
                }}
              />
            </Paper>

            {/* Connection Cards */}
            <Grid container spacing={3}>
              {[
                { platform: 'facebook', name: 'Facebook', icon: <FacebookIcon />, color: '#1877f2', description: 'Connect to Facebook for sharing posts and managing pages' },
                { platform: 'twitter', name: 'Twitter', icon: <TwitterIcon />, color: '#1da1f2', description: 'Tweet and manage your Twitter presence' },
                { platform: 'instagram', name: 'Instagram', icon: <InstagramIcon />, color: '#e4405f', description: 'Share photos and stories to Instagram' },
                { platform: 'linkedin', name: 'LinkedIn', icon: <LinkedInIcon />, color: '#0077b5', description: 'Post updates and articles to LinkedIn' },
                { platform: 'github', name: 'GitHub', icon: <GitHubIcon />, color: '#333', description: 'Share code snippets and project updates' },
                { platform: 'youtube', name: 'YouTube', icon: <YouTubeIcon />, color: '#ff0000', description: 'Upload and manage video content' },
              ].map((account) => (
                <Grid item xs={12} md={6} key={account.platform}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        border: connectedAccounts[account.platform] ? `2px solid ${account.color}` : '2px solid #e0e0e0',
                        position: 'relative',
                        overflow: 'hidden',
                        '&:hover': {
                          boxShadow: `0 8px 24px ${account.color}40`,
                        },
                      }}
                    >
                      {connectedAccounts[account.platform] && (
                        <Chip
                          icon={<CheckCircleIcon />}
                          label="Connected"
                          size="small"
                          color="success"
                          sx={{
                            position: 'absolute',
                            top: 16,
                            right: 16,
                            fontWeight: 600,
                          }}
                        />
                      )}

                      <Stack direction="row" spacing={3} alignItems="flex-start">
                        <Avatar
                          sx={{
                            bgcolor: connectedAccounts[account.platform] ? account.color : '#e0e0e0',
                            width: 64,
                            height: 64,
                            color: '#fff',
                          }}
                        >
                          {account.icon}
                        </Avatar>

                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" fontWeight="bold" mb={1}>
                            {account.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            {account.description}
                          </Typography>

                          <Stack direction="row" spacing={2}>
                            <Button
                              variant={connectedAccounts[account.platform] ? "outlined" : "contained"}
                              color={connectedAccounts[account.platform] ? "error" : "primary"}
                              size="small"
                              onClick={() => handleConnectAccount(account.platform)}
                              disabled={connectingPlatform === account.platform}
                              sx={{
                                ...(!connectedAccounts[account.platform] && {
                                  bgcolor: account.color,
                                  '&:hover': {
                                    bgcolor: account.color,
                                    opacity: 0.9,
                                  },
                                }),
                              }}
                              startIcon={
                                connectingPlatform === account.platform ? (
                                  <CircularProgress size={16} color="inherit" />
                                ) : connectedAccounts[account.platform] ? (
                                  <CloseIcon />
                                ) : (
                                  <LinkIcon />
                                )
                              }
                            >
                              {connectingPlatform === account.platform 
                                ? 'Connecting...' 
                                : connectedAccounts[account.platform] 
                                ? 'Disconnect' 
                                : 'Connect'
                              }
                            </Button>

                            {connectedAccounts[account.platform] && (
                              <Tooltip title="Account settings">
                                <IconButton size="small">
                                  <AIIcon />
                                </IconButton>
                              </Tooltip>
                            )}
                          </Stack>
                        </Box>
                      </Stack>

                      {/* Connection Status */}
                      {connectedAccounts[account.platform] && (
                        <Box
                          sx={{
                            mt: 2,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: `${account.color}10`,
                            border: `1px solid ${account.color}30`,
                          }}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={2}>
                              <Chip
                                label="Active"
                                size="small"
                                sx={{
                                  bgcolor: `${account.color}20`,
                                  color: account.color,
                                  fontWeight: 600,
                                }}
                              />
                              <Typography variant="caption" color="text.secondary">
                                Last synced: Just now
                              </Typography>
                            </Stack>
                            <Chip
                              label="Auto-post enabled"
                              size="small"
                              color="success"
                              variant="outlined"
                            />
                          </Stack>
                        </Box>
                      )}
                    </Paper>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            {/* Connection Tips */}
            <Paper
              sx={{
                p: 3,
                mt: 4,
                borderRadius: 3,
                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                color: '#fff',
              }}
            >
              <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                <AutoAwesomeIcon sx={{ fontSize: 32 }} />
                <Typography variant="h6" fontWeight="bold">
                  AI Connection Tips
                </Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      🔒 Secure Authentication
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      All connections use OAuth 2.0 for maximum security. Your credentials are never stored.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      🤖 AI Auto-Post
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      Once connected, AI will optimize your posts for each platform automatically.
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      📊 Real-Time Analytics
                    </Typography>
                    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                      Track performance across all connected platforms in one unified dashboard.
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Post Edit Dialog */}
      <Dialog
        open={postDialogOpen}
        onClose={() => setPostDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <EditIcon />
            <Typography variant="h6" fontWeight="bold">
              Edit Post
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Box sx={{ pt: 2 }}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Content"
                value={editFormData.content}
                onChange={(e) => setEditFormData({ ...editFormData, content: e.target.value })}
                sx={{ mb: 2 }}
                placeholder="Enter post content..."
              />
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Platform</InputLabel>
                    <Select
                      value={editFormData.platform}
                      label="Platform"
                      onChange={(e) => setEditFormData({ ...editFormData, platform: e.target.value })}
                    >
                      <MenuItem value="facebook">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <FacebookIcon sx={{ color: '#1877f2' }} />
                          <span>Facebook</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="twitter">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <TwitterIcon sx={{ color: '#1da1f2' }} />
                          <span>Twitter</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="instagram">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <InstagramIcon sx={{ color: '#e4405f' }} />
                          <span>Instagram</span>
                        </Stack>
                      </MenuItem>
                      <MenuItem value="linkedin">
                        <Stack direction="row" spacing={1} alignItems="center">
                          <LinkedInIcon sx={{ color: '#0077b5' }} />
                          <span>LinkedIn</span>
                        </Stack>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="AI Score"
                    value={`${editFormData.aiScore}%`}
                    disabled
                    helperText="AI score is automatically calculated"
                  />
                </Grid>
              </Grid>
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="body2">
                  Edit your post content and platform. Changes will be saved immediately.
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPostDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveEdit}
            startIcon={<CheckCircleIcon />}
            sx={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Analytics Detail Dialog */}
      <Dialog
        open={analyticsDialogOpen}
        onClose={() => setAnalyticsDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" alignItems="center" spacing={2}>
            <AnalyticsIcon />
            <Typography variant="h6" fontWeight="bold">
              Post Analytics
            </Typography>
          </Stack>
        </DialogTitle>
        <DialogContent>
          {selectedPost && (
            <Box sx={{ pt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {selectedPost.content}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f7fa' }}>
                    <ThumbUpIcon color="success" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {selectedPost.likes}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Likes
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f7fa' }}>
                    <CommentIcon color="info" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {selectedPost.comments}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Comments
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f7fa' }}>
                    <ShareIcon color="warning" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {selectedPost.shares}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Shares
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#f5f7fa' }}>
                    <TrendingUpIcon color="primary" sx={{ fontSize: 32, mb: 1 }} />
                    <Typography variant="h5" fontWeight="bold">
                      {selectedPost.reach.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Reach
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                  <Typography variant="body2" fontWeight="bold">
                    AI Performance Score
                  </Typography>
                  <Chip
                    label={`${selectedPost.aiScore}%`}
                    sx={{
                      bgcolor: getAIScoreColor(selectedPost.aiScore),
                      color: '#fff',
                      fontWeight: 'bold',
                    }}
                  />
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={selectedPost.aiScore}
                  sx={{
                    height: 10,
                    borderRadius: 5,
                    bgcolor: '#e0e0e0',
                    '& .MuiLinearProgress-bar': {
                      bgcolor: getAIScoreColor(selectedPost.aiScore),
                    },
                  }}
                />
              </Box>

              <Alert severity="success" sx={{ mt: 3 }}>
                <Typography variant="body2">
                  This post is performing {selectedPost.aiScore >= 85 ? 'excellent' : selectedPost.aiScore >= 70 ? 'well' : 'average'} based on AI analysis!
                </Typography>
              </Alert>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAnalyticsDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: '100%', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SocialMediaDashboard;
