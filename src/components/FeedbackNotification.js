import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Grid,
  Typography,
  Button,
  TextField,
  Rating,
  Chip,
  Stack,
  Switch,
  FormControlLabel,
  Tab,
  Tabs,
  Paper,
  Divider,
  IconButton,
  Alert,
  Badge,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Snackbar,
  Avatar,
} from '@mui/material';
import {
  Assessment,
  Notifications,
  Feedback,
  Warning,
  TrendingUp,
  CheckCircle,
  NotificationsOff,
  Speed,
  Lightbulb,
  Send,
  Download,
  Refresh,
  Close,
  SmartToy,
  ThumbUp,
  Star,
  BarChart,
  AutoAwesome,
  Delete,
  MarkEmailRead,
  Schedule,
} from '@mui/icons-material';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  ChartTooltip,
  Legend
);

const FeedbackNotification = () => {
  const { currentUser } = useAuth();
  const uid = currentUser?.uid;
  
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(false);
  const [applyingRecommendationId, setApplyingRecommendationId] = useState(null);
  const [snack, setSnack] = useState({ open: false, message: '', severity: 'success' });

  // ===== 1. PERFORMANCE REPORTS =====
  const [performanceData, setPerformanceData] = useState({
    totalEngagement: 0,
    avgEngagement: 0,
    totalReach: 0,
    totalLikes: 0,
    totalComments: 0,
    totalShares: 0,
    growthRate: 0,
    aiScore: 0,
    totalPosts: 0,
    avgPerPost: 0,
  });
  const [reportDateRange, setReportDateRange] = useState('7days');
  const [performanceChart, setPerformanceChart] = useState([]);

  // ===== 2. RECOMMENDATIONS =====
  const [recommendations, setRecommendations] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);

  // ===== 3. NOTIFICATIONS =====
  const [notificationSettings, setNotificationSettings] = useState({
    pushEnabled: true,
    emailNotifications: true,
    contentIssues: true,
    performanceAlerts: true,
    feedbackAlerts: true,
    lowEngagementAlerts: true,
    copyrightAlerts: true,
  });
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // ===== 4. USER FEEDBACK =====
  const [feedbackList, setFeedbackList] = useState([]);
  const [feedbackForm, setFeedbackForm] = useState({
    type: 'feature',
    rating: 5,
    subject: '',
    message: '',
  });
  const [feedbackAnalysis, setFeedbackAnalysis] = useState({
    totalFeedback: 0,
    avgRating: 4.6,
    sentiment: { positive: 78, neutral: 15, negative: 7 },
    commonTopics: ['User Interface', 'Performance', 'Features', 'AI Quality'],
  });

  // ===== 5. ALERTS =====
  const [alerts, setAlerts] = useState([]);
  const [alertFilters, setAlertFilters] = useState({
    copyright: true,
    lowEngagement: true,
    contentQuality: true,
    spam: true,
  });

  // ===== LOAD FUNCTIONS =====
  const loadPerformanceData = useCallback(() => {
    setLoading(true);
    
    // Calculate days based on range
    const days = reportDateRange === '7days' ? 7 : reportDateRange === '30days' ? 30 : 90;
    const chartData = [];
    
    // Generate realistic chart data with trend
    const baseEngagement = 2500;
    const baseReach = 6000;
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Add some realistic variation and upward trend
      const trend = (days - i) / days * 0.3; // 30% growth over period
      const variation = (Math.random() - 0.5) * 0.4; // ±20% random variation
      
      chartData.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        engagement: Math.floor(baseEngagement * (1 + trend + variation)),
        reach: Math.floor(baseReach * (1 + trend + variation)),
      });
    }
    
    setPerformanceChart(chartData);
    
    // Calculate dynamic totals based on chart data
    const totalChartEngagement = chartData.reduce((sum, d) => sum + d.engagement, 0);
    const totalChartReach = chartData.reduce((sum, d) => sum + d.reach, 0);
    const avgDailyEngagement = Math.floor(totalChartEngagement / days);
    
    // Calculate breakdown (likes ≈ 58%, comments ≈ 21%, shares ≈ 21%)
    const totalLikes = Math.floor(totalChartEngagement * 0.58);
    const totalComments = Math.floor(totalChartEngagement * 0.21);
    const totalShares = Math.floor(totalChartEngagement * 0.21);
    
    // Calculate growth rate (comparing to previous period)
    const currentAvg = avgDailyEngagement;
    const previousAvg = Math.floor(currentAvg * (1 - (Math.random() * 0.15 + 0.15))); // 15-30% lower
    const growthRate = ((currentAvg - previousAvg) / previousAvg * 100).toFixed(1);
    
    // AI Score based on performance (70-95 range)
    const aiScore = Math.min(95, Math.max(70, Math.floor(70 + (growthRate / 30 * 25) + Math.random() * 10)));
    
    // Calculate posts (assuming avg engagement per post)
    const avgEngagementPerPost = reportDateRange === '7days' ? 450 : reportDateRange === '30days' ? 520 : 580;
    const totalPosts = Math.max(1, Math.floor(totalChartEngagement / avgEngagementPerPost));
    
    setPerformanceData({
      totalEngagement: totalChartEngagement,
      avgEngagement: avgDailyEngagement,
      totalReach: totalChartReach,
      totalLikes: totalLikes,
      totalComments: totalComments,
      totalShares: totalShares,
      growthRate: parseFloat(growthRate),
      aiScore: aiScore,
      totalPosts: totalPosts,
      avgPerPost: Math.floor(totalChartReach / totalPosts),
    });
    
    setTimeout(() => setLoading(false), 800);
    setSnack({ open: true, message: `📊 Performance data for ${days} days loaded!`, severity: 'success' });
  }, [reportDateRange]);

  const loadRecommendations = useCallback(() => {
    const aiRecommendations = [
      {
        id: 1,
        type: 'content',
        title: 'Optimize Posting Time',
        description: 'Post between 2-4 PM for 35% higher engagement based on your audience activity',
        impact: 'High',
        icon: <Schedule />,
        color: '#f093fb',
      },
      {
        id: 2,
        type: 'engagement',
        title: 'Increase Video Content',
        description: 'Video posts get 3x more engagement. Try incorporating more video content',
        impact: 'High',
        icon: <BarChart />,
        color: '#f5576c',
      },
      {
        id: 3,
        type: 'audience',
        title: 'Target New Demographics',
        description: 'AI detected untapped audience in 25-34 age group. Consider targeted content',
        impact: 'Medium',
        icon: <TrendingUp />,
        color: '#667eea',
      },
      {
        id: 4,
        type: 'content',
        title: 'Use More Hashtags',
        description: 'Posts with 5-7 hashtags perform 40% better than those with fewer',
        impact: 'Medium',
        icon: <AutoAwesome />,
        color: '#764ba2',
      },
    ];
    
    setRecommendations(aiRecommendations);
    
    const insights = [
      'Your engagement rate increased by 23% this week',
      'Weekend posts perform 40% better for your audience',
      'Posts with images get 2.5x more engagement',
      'Your response time to comments is excellent',
    ];
    
    setAiInsights(insights);
  }, []);

  const loadNotifications = useCallback(() => {
    const demoNotifications = [
      {
        id: 1,
        type: 'performance',
        title: 'High Engagement Alert',
        message: 'Your recent post reached 10K impressions!',
        time: new Date(Date.now() - 3600000).toISOString(),
        read: false,
        icon: <TrendingUp />,
        color: '#4caf50',
      },
      {
        id: 2,
        type: 'feedback',
        title: 'New Feedback Received',
        message: '5 new user feedbacks with avg rating 4.8',
        time: new Date(Date.now() - 7200000).toISOString(),
        read: false,
        icon: <Feedback />,
        color: '#2196f3',
      },
      {
        id: 3,
        type: 'content',
        title: 'Content Scheduled',
        message: '3 posts scheduled for next week',
        time: new Date(Date.now() - 10800000).toISOString(),
        read: true,
        icon: <CheckCircle />,
        color: '#ff9800',
      },
      {
        id: 4,
        type: 'ai',
        title: 'AI Recommendation Ready',
        message: 'New insights available for your content strategy',
        time: new Date(Date.now() - 14400000).toISOString(),
        read: false,
        icon: <SmartToy />,
        color: '#9c27b0',
      },
    ];
    
    setNotifications(demoNotifications);
    setUnreadCount(demoNotifications.filter(n => !n.read).length);
  }, []);

  const loadFeedback = useCallback(() => {
    const demoFeedback = [
      {
        id: 1,
        type: 'feature',
        rating: 5,
        subject: 'Love the AI recommendations!',
        message: 'The AI-powered content suggestions have really helped improve my engagement rates.',
        user: 'John Doe',
        date: new Date(Date.now() - 86400000).toISOString(),
        sentiment: 'positive',
      },
      {
        id: 2,
        type: 'bug',
        rating: 3,
        subject: 'Minor UI issue',
        message: 'The notification badge sometimes doesn\'t update in real-time.',
        user: 'Jane Smith',
        date: new Date(Date.now() - 172800000).toISOString(),
        sentiment: 'neutral',
      },
      {
        id: 3,
        type: 'feature',
        rating: 5,
        subject: 'Excellent analytics dashboard',
        message: 'The performance reports are detailed and easy to understand. Great job!',
        user: 'Mike Johnson',
        date: new Date(Date.now() - 259200000).toISOString(),
        sentiment: 'positive',
      },
    ];
    
    setFeedbackList(demoFeedback);
    
    const totalRating = demoFeedback.reduce((sum, f) => sum + f.rating, 0);
    setFeedbackAnalysis(prev => ({
      ...prev,
      totalFeedback: demoFeedback.length,
      avgRating: (totalRating / demoFeedback.length).toFixed(1),
    }));
  }, []);

  const loadAlerts = useCallback(() => {
    const demoAlerts = [
      {
        id: 1,
        type: 'copyright',
        severity: 'high',
        title: 'Potential Copyright Issue',
        message: 'AI detected copyrighted music in your recent video',
        time: new Date(Date.now() - 1800000).toISOString(),
        action: 'Review Content',
      },
      {
        id: 2,
        type: 'lowEngagement',
        severity: 'medium',
        title: 'Low Engagement Detected',
        message: 'Last 3 posts have 40% lower engagement than average',
        time: new Date(Date.now() - 3600000).toISOString(),
        action: 'View Analytics',
      },
      {
        id: 3,
        type: 'contentQuality',
        severity: 'low',
        title: 'Content Quality Suggestion',
        message: 'Consider adding captions to improve accessibility',
        time: new Date(Date.now() - 7200000).toISOString(),
        action: 'Learn More',
      },
      {
        id: 4,
        type: 'spam',
        severity: 'medium',
        title: 'Spam Comments Detected',
        message: '15 spam comments detected on your recent posts. Auto-moderation active.',
        time: new Date(Date.now() - 5400000).toISOString(),
        action: 'Review Content',
      },
    ];
    
    setAlerts(demoAlerts);
  }, []);

  // ===== EFFECTS =====
  // Initialize data
  useEffect(() => {
    if (uid) {
      loadPerformanceData();
      loadRecommendations();
      loadNotifications();
      loadFeedback();
      loadAlerts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uid]);

  // Reload performance data when date range changes
  useEffect(() => {
    if (uid) {
      loadPerformanceData();
    }
  }, [reportDateRange, uid, loadPerformanceData]);

  // ===== ACTION FUNCTIONS =====
  const generatePerformanceReport = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSnack({ open: true, message: '📊 Performance report generated successfully!', severity: 'success' });
    }, 2000);
  }, []);

  const downloadReport = useCallback(() => {
    const reportData = {
      dateRange: reportDateRange,
      performance: performanceData,
      timestamp: new Date().toISOString(),
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `performance-report-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    setSnack({ open: true, message: '📥 Report downloaded successfully!', severity: 'success' });
  }, [reportDateRange, performanceData]);

  const handleSubmitFeedback = useCallback(() => {
    if (!feedbackForm.subject || !feedbackForm.message) {
      setSnack({ open: true, message: '❌ Please fill in all fields', severity: 'error' });
      return;
    }
    
    const newFeedback = {
      id: Date.now(),
      ...feedbackForm,
      user: currentUser?.displayName || 'Anonymous',
      date: new Date().toISOString(),
      sentiment: feedbackForm.rating >= 4 ? 'positive' : feedbackForm.rating >= 3 ? 'neutral' : 'negative',
    };
    
    setFeedbackList(prev => [newFeedback, ...prev]);
    
    // Reset form
    setFeedbackForm({
      type: 'feature',
      rating: 5,
      subject: '',
      message: '',
    });
    
    setSnack({ open: true, message: '✅ Feedback submitted successfully! Thank you!', severity: 'success' });
  }, [feedbackForm, currentUser]);

  const markNotificationAsRead = useCallback((id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
    setSnack({ open: true, message: '✅ All notifications marked as read', severity: 'success' });
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      return prev.filter(n => n.id === id);
    });
    setSnack({ open: true, message: '🗑️ Notification deleted', severity: 'info' });
  }, []);

  const handleSettingToggle = useCallback((setting) => {
    setNotificationSettings(prev => ({
      ...prev,
      [setting]: !prev[setting],
    }));
    setSnack({ open: true, message: '⚙️ Settings updated', severity: 'success' });
  }, []);

  const dismissAlert = useCallback((id) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
    setSnack({ open: true, message: '✅ Alert dismissed', severity: 'info' });
  }, []);

  const handleAlertAction = useCallback((alert) => {
    let message = '';
    
    switch(alert.action) {
      case 'Review Content':
        message = '📝 Opening content review panel...';
        // Simulate opening content review
        setTimeout(() => {
          setSnack({ open: true, message: '✅ Content review opened! Please check the flagged items.', severity: 'success' });
        }, 800);
        break;
      
      case 'View Analytics':
        message = '📊 Loading analytics dashboard...';
        // Simulate opening analytics
        setTimeout(() => {
          setSnack({ open: true, message: '✅ Analytics loaded! Check your engagement metrics.', severity: 'success' });
        }, 800);
        break;
      
      case 'Learn More':
        message = '📚 Opening help documentation...';
        // Simulate opening help
        setTimeout(() => {
          setSnack({ open: true, message: '✅ Help center opened! Browse our guides to improve your content.', severity: 'success' });
        }, 800);
        break;
      
      default:
        message = `✅ ${alert.action} action triggered!`;
    }
    
    setSnack({ open: true, message, severity: 'info' });
  }, []);

  // Filter alerts based on active filters
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      return alertFilters[alert.type];
    });
  }, [alerts, alertFilters]);

  const handleApplyRecommendation = useCallback((recommendation) => {
    // Prevent clicking if already applying
    if (applyingRecommendationId) return;
    
    // Set which recommendation is being applied
    setApplyingRecommendationId(recommendation.id);
    
    setTimeout(() => {
      setApplyingRecommendationId(null);
      
      // Show specific success message based on recommendation type
      let message = '';
      switch(recommendation.type) {
        case 'content':
          message = `✅ ${recommendation.title} applied! Your posting strategy has been updated.`;
          break;
        case 'engagement':
          message = `✅ ${recommendation.title} applied! Video content strategy activated.`;
          break;
        case 'audience':
          message = `✅ ${recommendation.title} applied! Target audience updated.`;
          break;
        default:
          message = `✅ ${recommendation.title} applied successfully!`;
      }
      
      setSnack({ open: true, message, severity: 'success' });
      
      // Update recommendations list to show as applied
      setRecommendations(prev => prev.map(r => 
        r.id === recommendation.id 
          ? { ...r, applied: true }
          : r
      ));
    }, 1500);
  }, [applyingRecommendationId]);

  // ===== CHART DATA =====
  const performanceLineChart = {
    labels: performanceChart.map(d => d.date),
    datasets: [
      {
        label: 'Engagement',
        data: performanceChart.map(d => d.engagement),
        borderColor: '#667eea',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        tension: 0.4,
      },
      {
        label: 'Reach',
        data: performanceChart.map(d => d.reach),
        borderColor: '#f093fb',
        backgroundColor: 'rgba(240, 147, 251, 0.1)',
        tension: 0.4,
      },
    ],
  };

  const sentimentDoughnutChart = {
    labels: ['Positive', 'Neutral', 'Negative'],
    datasets: [
      {
        data: [
          feedbackAnalysis.sentiment.positive,
          feedbackAnalysis.sentiment.neutral,
          feedbackAnalysis.sentiment.negative,
        ],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#f44336';
      case 'medium': return '#ff9800';
      case 'low': return '#2196f3';
      default: return '#9e9e9e';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return '#f093fb';
      case 'Medium': return '#667eea';
      case 'Low': return '#4caf50';
      default: return '#9e9e9e';
    }
  };

  return (
    <Box sx={{ bgcolor: '#f5f7fa', minHeight: '100vh', p: { xs: 2, md: 4 } }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box sx={{ 
          mb: 4,
          p: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 4,
          color: 'white'
        }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <SmartToy sx={{ fontSize: 48 }} />
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                Feedback & Notifications Center
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.95 }}>
                AI-Powered insights, real-time alerts, and comprehensive feedback management
              </Typography>
            </Box>
          </Stack>
        </Box>
      </motion.div>

      {/* Tabs */}
      <Paper sx={{ mb: 3, borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="fullWidth"
          sx={{
            '& .MuiTab-root': {
              fontSize: '1rem',
              fontWeight: 600,
              py: 2,
            },
            '& .Mui-selected': {
              color: '#667eea',
            },
          }}
        >
          <Tab icon={<Assessment />} label="Performance" iconPosition="start" />
          <Tab icon={<Lightbulb />} label="AI Recommendations" iconPosition="start" />
          <Tab
            icon={
              <Badge badgeContent={unreadCount} color="error">
                <Notifications />
              </Badge>
            }
            label="Notifications"
            iconPosition="start"
          />
          <Tab icon={<Feedback />} label="User Feedback" iconPosition="start" />
          <Tab icon={<Warning />} label="Alerts" iconPosition="start" />
        </Tabs>
      </Paper>

      {/* Tab Panels */}
      <AnimatePresence mode="wait">
        {/* ===== TAB 1: PERFORMANCE REPORTS ===== */}
        {activeTab === 0 && (
          <motion.div
            key="performance"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {/* Controls */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <FormControl size="small" sx={{ minWidth: 150 }}>
                      <InputLabel>Date Range</InputLabel>
                      <Select
                        value={reportDateRange}
                        label="Date Range"
                        onChange={(e) => setReportDateRange(e.target.value)}
                      >
                        <MenuItem value="7days">Last 7 Days</MenuItem>
                        <MenuItem value="30days">Last 30 Days</MenuItem>
                        <MenuItem value="90days">Last 90 Days</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <Stack direction="row" spacing={1}>
                      <Button
                        variant="outlined"
                        startIcon={<Refresh />}
                        onClick={loadPerformanceData}
                        disabled={loading}
                      >
                        Refresh
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Download />}
                        onClick={downloadReport}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        }}
                      >
                        Download
                      </Button>
                      <Button
                        variant="contained"
                        startIcon={<Assessment />}
                        onClick={generatePerformanceReport}
                        disabled={loading}
                        sx={{
                          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        }}
                      >
                        {loading ? 'Generating...' : 'Generate Report'}
                      </Button>
                    </Stack>
                  </Stack>
                </Paper>
              </Grid>

              {/* Stats Cards */}
              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Engagement</Typography>
                      <TrendingUp />
                    </Stack>
                    <Typography variant="h3" fontWeight="bold">
                      {performanceData.totalEngagement.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      +{performanceData.growthRate}% from last period
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Reach</Typography>
                      <Speed />
                    </Stack>
                    <Typography variant="h3" fontWeight="bold">
                      {performanceData.totalReach.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Avg: {performanceData.avgPerPost ? performanceData.avgPerPost.toLocaleString() : '0'} per post
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #4caf50 0%, #8bc34a 100%)', color: 'white' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Likes</Typography>
                      <ThumbUp />
                    </Stack>
                    <Typography variant="h3" fontWeight="bold">
                      {performanceData.totalLikes.toLocaleString()}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {performanceData.totalComments.toLocaleString()} comments
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.2 }}>
                  <Paper sx={{ p: 3, borderRadius: 3, background: 'linear-gradient(135deg, #ff9800 0%, #ff5722 100%)', color: 'white' }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>AI Performance Score</Typography>
                      <SmartToy />
                    </Stack>
                    <Typography variant="h3" fontWeight="bold">
                      {performanceData.aiScore}%
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      Excellent rating
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>

              {/* Chart */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Performance Trends
                  </Typography>
                  {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                      <CircularProgress />
                    </Box>
                  ) : (
                    <Box sx={{ height: 400 }}>
                      <Line
                        data={performanceLineChart}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'top',
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    </Box>
                  )}
                </Paper>
              </Grid>

              {/* Breakdown */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Engagement Breakdown
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: '#667eea' }}>
                          <ThumbUp />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Likes</Typography>
                          <Typography variant="h6" fontWeight="bold">{performanceData.totalLikes.toLocaleString()}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: '#f093fb' }}>
                          <Feedback />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Comments</Typography>
                          <Typography variant="h6" fontWeight="bold">{performanceData.totalComments.toLocaleString()}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar sx={{ bgcolor: '#4caf50' }}>
                          <TrendingUp />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">Shares</Typography>
                          <Typography variant="h6" fontWeight="bold">{performanceData.totalShares.toLocaleString()}</Typography>
                        </Box>
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* ===== TAB 2: AI RECOMMENDATIONS ===== */}
        {activeTab === 1 && (
          <motion.div
            key="recommendations"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {/* AI Insights Banner */}
              <Grid item xs={12}>
                <Paper sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white'
                }}>
                  <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                    <SmartToy sx={{ fontSize: 40 }} />
                    <Box>
                      <Typography variant="h5" fontWeight="bold">AI-Powered Insights</Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>Real-time recommendations to boost your performance</Typography>
                    </Box>
                  </Stack>
                  <Grid container spacing={2}>
                    {aiInsights.map((insight, index) => (
                      <Grid item xs={12} sm={6} key={index}>
                        <Box sx={{ 
                          p: 2, 
                          bgcolor: 'rgba(255,255,255,0.15)', 
                          borderRadius: 2,
                          backdropFilter: 'blur(10px)'
                        }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <CheckCircle sx={{ fontSize: 20 }} />
                            <Typography variant="body2">{insight}</Typography>
                          </Stack>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Paper>
              </Grid>

              {/* Recommendations Cards */}
              {recommendations.map((rec) => (
                <Grid item xs={12} md={6} key={rec.id}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 3,
                      border: `2px solid ${rec.color}`,
                      '&:hover': {
                        boxShadow: `0 8px 24px ${rec.color}40`,
                      }
                    }}>
                      <Stack direction="row" alignItems="flex-start" spacing={2}>
                        <Avatar sx={{ bgcolor: rec.color, width: 56, height: 56 }}>
                          {rec.icon}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="h6" fontWeight="bold">{rec.title}</Typography>
                            <Chip 
                              label={rec.impact} 
                              size="small"
                              sx={{ 
                                bgcolor: getImpactColor(rec.impact),
                                color: 'white',
                                fontWeight: 600
                              }}
                            />
                          </Stack>
                          <Typography variant="body2" color="text.secondary" mb={2}>
                            {rec.description}
                          </Typography>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleApplyRecommendation(rec)}
                            disabled={rec.applied || applyingRecommendationId === rec.id}
                            startIcon={rec.applied ? <CheckCircle /> : null}
                            sx={{
                              background: rec.applied 
                                ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                                : `linear-gradient(135deg, ${rec.color} 0%, ${rec.color}dd 100%)`,
                              '&:hover': {
                                background: rec.applied
                                  ? 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)'
                                  : `linear-gradient(135deg, ${rec.color}dd 0%, ${rec.color}bb 100%)`,
                                transform: rec.applied ? 'none' : 'translateY(-2px)',
                                boxShadow: rec.applied ? 'none' : `0 4px 12px ${rec.color}60`,
                              },
                              transition: 'all 0.3s ease',
                              opacity: rec.applied ? 0.8 : 1,
                              cursor: rec.applied ? 'default' : 'pointer',
                            }}
                          >
                            {rec.applied ? 'Applied ✓' : applyingRecommendationId === rec.id ? 'Applying...' : 'Apply Recommendation'}
                          </Button>
                        </Box>
                      </Stack>
                    </Paper>
                  </motion.div>
                </Grid>
              ))}

              {/* Quick Stats */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Recommendations Impact Analysis
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="bold" color="primary">
                          {recommendations.filter(r => r.impact === 'High').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">High Impact</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="bold" color="secondary">
                          {recommendations.filter(r => r.impact === 'Medium').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Medium Impact</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="bold" sx={{ color: '#4caf50' }}>
                          87%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">AI Accuracy</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h3" fontWeight="bold" sx={{ color: '#ff9800' }}>
                          +{performanceData.growthRate}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Growth Rate</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* ===== TAB 3: NOTIFICATIONS ===== */}
        {activeTab === 2 && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {/* Settings */}
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Notification Settings
                  </Typography>
                  <Stack spacing={2}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.pushEnabled}
                          onChange={() => handleSettingToggle('pushEnabled')}
                          color="primary"
                        />
                      }
                      label="Push Notifications"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onChange={() => handleSettingToggle('emailNotifications')}
                          color="primary"
                        />
                      }
                      label="Email Notifications"
                    />
                    <Divider />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.contentIssues}
                          onChange={() => handleSettingToggle('contentIssues')}
                          color="secondary"
                        />
                      }
                      label="Content Issues"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.performanceAlerts}
                          onChange={() => handleSettingToggle('performanceAlerts')}
                          color="secondary"
                        />
                      }
                      label="Performance Alerts"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.feedbackAlerts}
                          onChange={() => handleSettingToggle('feedbackAlerts')}
                          color="secondary"
                        />
                      }
                      label="Feedback Alerts"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.lowEngagementAlerts}
                          onChange={() => handleSettingToggle('lowEngagementAlerts')}
                          color="secondary"
                        />
                      }
                      label="Low Engagement Alerts"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={notificationSettings.copyrightAlerts}
                          onChange={() => handleSettingToggle('copyrightAlerts')}
                          color="secondary"
                        />
                      }
                      label="Copyright Alerts"
                    />
                  </Stack>
                </Paper>
              </Grid>

              {/* Notifications List */}
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight="bold">
                      Notifications ({unreadCount} unread)
                    </Typography>
                    <Button
                      size="small"
                      startIcon={<MarkEmailRead />}
                      onClick={markAllNotificationsAsRead}
                      disabled={unreadCount === 0}
                    >
                      Mark All as Read
                    </Button>
                  </Stack>

                  {notifications.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 8 }}>
                      <NotificationsOff sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                      <Typography variant="h6" color="text.secondary">
                        No notifications yet
                      </Typography>
                    </Box>
                  ) : (
                    <List>
                      {notifications.map((notification) => (
                        <motion.div
                          key={notification.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <ListItem
                            sx={{
                              mb: 2,
                              border: 1,
                              borderColor: 'divider',
                              borderRadius: 2,
                              bgcolor: notification.read ? 'transparent' : 'rgba(102, 126, 234, 0.05)',
                              '&:hover': {
                                bgcolor: 'rgba(102, 126, 234, 0.1)',
                              },
                            }}
                            secondaryAction={
                              <IconButton
                                edge="end"
                                onClick={() => deleteNotification(notification.id)}
                              >
                                <Delete />
                              </IconButton>
                            }
                          >
                            <ListItemIcon>
                              <Avatar sx={{ bgcolor: notification.color }}>
                                {notification.icon}
                              </Avatar>
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Typography variant="subtitle1" fontWeight="bold">
                                    {notification.title}
                                  </Typography>
                                  {!notification.read && (
                                    <Chip label="New" size="small" color="primary" />
                                  )}
                                </Stack>
                              }
                              secondary={
                                <Box component="span" sx={{ display: 'block' }}>
                                  <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                    {notification.message}
                                  </Typography>
                                  <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                    {new Date(notification.time).toLocaleString()}
                                  </Typography>
                                </Box>
                              }
                            />
                            {!notification.read && (
                              <Button
                                size="small"
                                onClick={() => markNotificationAsRead(notification.id)}
                              >
                                Mark as Read
                              </Button>
                            )}
                          </ListItem>
                        </motion.div>
                      ))}
                    </List>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* ===== TAB 4: USER FEEDBACK ===== */}
        {activeTab === 3 && (
          <motion.div
            key="feedback"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {/* Submit Feedback Form */}
              <Grid item xs={12} md={5}>
                <Paper sx={{ p: 3, borderRadius: 3, border: '2px solid', borderColor: '#667eea' }}>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Submit Feedback
                  </Typography>
                  
                  <Stack spacing={3}>
                    <FormControl fullWidth>
                      <InputLabel>Feedback Type</InputLabel>
                      <Select
                        value={feedbackForm.type}
                        label="Feedback Type"
                        onChange={(e) => setFeedbackForm(prev => ({ ...prev, type: e.target.value }))}
                      >
                        <MenuItem value="feature">Feature Request</MenuItem>
                        <MenuItem value="bug">Bug Report</MenuItem>
                        <MenuItem value="improvement">Improvement</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                      </Select>
                    </FormControl>

                    <Box>
                      <Typography variant="body2" mb={1}>Rating</Typography>
                      <Rating
                        value={feedbackForm.rating}
                        onChange={(e, newValue) => setFeedbackForm(prev => ({ ...prev, rating: newValue }))}
                        size="large"
                      />
                    </Box>

                    <TextField
                      fullWidth
                      label="Subject"
                      value={feedbackForm.subject}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, subject: e.target.value }))}
                      placeholder="Brief description of your feedback"
                    />

                    <TextField
                      fullWidth
                      multiline
                      rows={4}
                      label="Message"
                      value={feedbackForm.message}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                      placeholder="Detailed feedback..."
                    />

                    <Button
                      fullWidth
                      variant="contained"
                      size="large"
                      startIcon={<Send />}
                      onClick={handleSubmitFeedback}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        py: 1.5,
                        fontWeight: 600,
                      }}
                    >
                      Submit Feedback
                    </Button>
                  </Stack>
                </Paper>
              </Grid>

              {/* Feedback Analysis */}
              <Grid item xs={12} md={7}>
                <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Feedback Analysis
                  </Typography>
                  
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#f3e5f5', borderRadius: 2 }}>
                        <Typography variant="h3" fontWeight="bold" color="primary">
                          {feedbackAnalysis.totalFeedback}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Total Feedback</Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Paper sx={{ p: 3, textAlign: 'center', bgcolor: '#fff3e0', borderRadius: 2 }}>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                          <Typography variant="h3" fontWeight="bold" color="secondary">
                            {feedbackAnalysis.avgRating}
                          </Typography>
                          <Star sx={{ color: '#ff9800', fontSize: 32 }} />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">Average Rating</Typography>
                      </Paper>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Box sx={{ height: 250 }}>
                        <Typography variant="subtitle2" mb={2}>Sentiment Distribution</Typography>
                        <Doughnut
                          data={sentimentDoughnutChart}
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                position: 'bottom',
                              },
                            },
                          }}
                        />
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} md={6}>
                      <Typography variant="subtitle2" mb={2}>Common Topics</Typography>
                      <Stack spacing={1}>
                        {feedbackAnalysis.commonTopics.map((topic, index) => (
                          <Chip
                            key={index}
                            label={topic}
                            color="primary"
                            variant="outlined"
                            sx={{ justifyContent: 'flex-start' }}
                          />
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </Paper>

                {/* Recent Feedback */}
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={3}>
                    Recent Feedback
                  </Typography>
                  
                  <Stack spacing={2}>
                    {feedbackList.map((feedback) => (
                      <Paper
                        key={feedback.id}
                        sx={{
                          p: 2,
                          border: 1,
                          borderColor: 'divider',
                          borderRadius: 2,
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                          <Box>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {feedback.subject}
                            </Typography>
                            <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                              <Chip label={feedback.type} size="small" />
                              <Rating value={feedback.rating} size="small" readOnly />
                              <Chip
                                label={feedback.sentiment}
                                size="small"
                                color={
                                  feedback.sentiment === 'positive'
                                    ? 'success'
                                    : feedback.sentiment === 'negative'
                                    ? 'error'
                                    : 'default'
                                }
                              />
                            </Stack>
                          </Box>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(feedback.date).toLocaleDateString()}
                          </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" component="div">
                          {feedback.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" component="div" sx={{ mt: 1 }}>
                          by {feedback.user}
                        </Typography>
                      </Paper>
                    ))}
                  </Stack>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        )}

        {/* ===== TAB 5: CONTENT ALERTS ===== */}
        {activeTab === 4 && (
          <motion.div
            key="alerts"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Grid container spacing={3}>
              {/* Alert Filters */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    Alert Filters
                  </Typography>
                  <Stack direction="row" spacing={2} flexWrap="wrap">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertFilters.copyright}
                          onChange={() => setAlertFilters(prev => ({ ...prev, copyright: !prev.copyright }))}
                          color="error"
                        />
                      }
                      label="Copyright Issues"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertFilters.lowEngagement}
                          onChange={() => setAlertFilters(prev => ({ ...prev, lowEngagement: !prev.lowEngagement }))}
                          color="warning"
                        />
                      }
                      label="Low Engagement"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertFilters.contentQuality}
                          onChange={() => setAlertFilters(prev => ({ ...prev, contentQuality: !prev.contentQuality }))}
                          color="info"
                        />
                      }
                      label="Content Quality"
                    />
                    <FormControlLabel
                      control={
                        <Switch
                          checked={alertFilters.spam}
                          onChange={() => setAlertFilters(prev => ({ ...prev, spam: !prev.spam }))}
                          color="primary"
                        />
                      }
                      label="Spam Detection"
                    />
                  </Stack>
                </Paper>
              </Grid>

              {/* Alerts List */}
              <Grid item xs={12}>
                {filteredAlerts.length === 0 ? (
                  <Paper sx={{ p: 8, borderRadius: 3, textAlign: 'center' }}>
                    <CheckCircle sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                    <Typography variant="h5" fontWeight="bold" mb={1}>
                      {alerts.length === 0 ? 'All Clear!' : 'No Alerts Match Filters'}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      {alerts.length === 0 
                        ? 'No active alerts. Your content is performing great!' 
                        : 'Try enabling more filter options to see alerts.'}
                    </Typography>
                  </Paper>
                ) : (
                  <Stack spacing={2}>
                    {filteredAlerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Alert
                          severity={alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'info'}
                          sx={{
                            borderRadius: 3,
                            border: 2,
                            borderColor: getSeverityColor(alert.severity),
                          }}
                          action={
                            <Stack direction="row" spacing={1}>
                              <Button
                                size="small"
                                variant="outlined"
                                onClick={() => handleAlertAction(alert)}
                                sx={{ 
                                  borderColor: getSeverityColor(alert.severity), 
                                  color: getSeverityColor(alert.severity),
                                  '&:hover': {
                                    borderColor: getSeverityColor(alert.severity),
                                    bgcolor: `${getSeverityColor(alert.severity)}10`,
                                    transform: 'scale(1.05)',
                                  },
                                  transition: 'all 0.2s ease',
                                  fontWeight: 600,
                                }}
                              >
                                {alert.action}
                              </Button>
                              <IconButton size="small" onClick={() => dismissAlert(alert.id)}>
                                <Close />
                              </IconButton>
                            </Stack>
                          }
                        >
                          <Typography variant="subtitle1" fontWeight="bold" mb={0.5}>
                            {alert.title}
                          </Typography>
                          <Typography variant="body2" mb={1}>
                            {alert.message}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(alert.time).toLocaleString()}
                          </Typography>
                        </Alert>
                      </motion.div>
                    ))}
                  </Stack>
                )}
              </Grid>

              {/* Alert Statistics */}
              <Grid item xs={12}>
                <Paper sx={{ p: 3, borderRadius: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight="bold">
                      Alert Statistics
                    </Typography>
                    <Chip 
                      label={`${filteredAlerts.length} of ${alerts.length} alerts shown`}
                      color="primary"
                      size="small"
                      sx={{ fontWeight: 600 }}
                    />
                  </Stack>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#ffebee', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="bold" color="error">
                          {filteredAlerts.filter(a => a.severity === 'high').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">High Priority</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="bold" color="warning.main">
                          {filteredAlerts.filter(a => a.severity === 'medium').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Medium Priority</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e3f2fd', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="bold" color="info.main">
                          {filteredAlerts.filter(a => a.severity === 'low').length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Low Priority</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Box sx={{ textAlign: 'center', p: 2, bgcolor: '#e8f5e9', borderRadius: 2 }}>
                        <Typography variant="h4" fontWeight="bold" color="success.main">
                          {filteredAlerts.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Filtered Alerts</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Snackbar */}
      <Snackbar
        open={snack.open}
        autoHideDuration={4000}
        onClose={() => setSnack(s => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnack(s => ({ ...s, open: false }))}
          severity={snack.severity || 'success'}
          sx={{ width: '100%', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeedbackNotification;
