import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Tabs,
  Tab,
  Alert,
  Snackbar,
  Avatar,
  Chip,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  ThumbUp as ThumbUpIcon,
  Comment as CommentIcon,
  Share as ShareIcon,
  Visibility as VisibilityIcon,
  Analytics as AnalyticsIcon,
  AutoAwesome as AutoAwesomeIcon,
  TrendingDown as TrendingDownIcon,
  Public as PublicIcon,
  CheckCircle as CheckCircleIcon,
  Lightbulb as LightbulbIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
  CompareArrows as CompareIcon,
  Psychology as AIIcon,
  BarChart as BarChartIcon,
  ShowChart as ShowChartIcon,
  Speed as SpeedIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
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
  Filler
} from 'chart.js';
import { ThemeProvider, createTheme } from '@mui/material/styles';

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

const BusinessInsights = () => {
  const user = {
    uid: 'demo-user-uid',
    displayName: 'TechCorp Business',
    email: 'business@techcorp.com',
    photoURL: 'https://via.placeholder.com/100',
    accessToken: 'demo-access-token'
  };
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [timeRange, setTimeRange] = useState('7days');
  const [refreshing, setRefreshing] = useState(false);
  const [insights, setInsights] = useState({
    posts: [],
    userInfo: null,
    metrics: null,
    demographics: null,
    competitors: null,
    trends: null,
    aiInsights: null,
  });

  // Auto-load demo data on mount
  useEffect(() => {
    fetchInsights('demo-access-token');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Enhanced mock data function
  const fetchFacebookData = async (endpoint, accessToken) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    switch(endpoint) {
      case '/me/posts':
        return {
          data: [
            { 
              id: '1', 
              message: 'Excited to announce our new AI-powered product!', 
              created_time: '2024-01-15',
              likes: { data: [], summary: { total_count: 1245 } },
              comments: { data: [], summary: { total_count: 156 } },
              shares: { count: 89 },
              reach: 15420,
              impressions: 22350,
            },
            { 
              id: '2', 
              message: 'Summer sale - 50% off all products!', 
              created_time: '2024-01-10',
              likes: { data: [], summary: { total_count: 892 } },
              comments: { data: [], summary: { total_count: 67 } },
              shares: { count: 45 },
              reach: 11250,
              impressions: 16800,
            },
            { 
              id: '3', 
              message: 'Meet our amazing team behind the scenes', 
              created_time: '2024-01-05',
              likes: { data: [], summary: { total_count: 756 } },
              comments: { data: [], summary: { total_count: 42 } },
              shares: { count: 28 },
              reach: 9500,
              impressions: 14200,
            },
            { 
              id: '4', 
              message: 'Customer success story: How we helped XYZ Corp', 
              created_time: '2024-01-03',
              likes: { data: [], summary: { total_count: 1120 } },
              comments: { data: [], summary: { total_count: 98 } },
              shares: { count: 156 },
              reach: 18900,
              impressions: 25600,
            },
            { 
              id: '5', 
              message: 'Join our webinar on digital transformation', 
              created_time: '2024-01-01',
              likes: { data: [], summary: { total_count: 534 } },
              comments: { data: [], summary: { total_count: 38 } },
              shares: { count: 22 },
              reach: 7800,
              impressions: 11400,
            },
          ],
          paging: {}
        };
        
      case '/me/insights':
        return {
          data: [
            { name: 'page_impressions', period: 'day', values: [{ value: 45280 }] },
            { name: 'page_engaged_users', period: 'day', values: [{ value: 8920 }] },
            { name: 'page_post_engagements', period: 'day', values: [{ value: 12450 }] },
            { name: 'page_fans_gender_age', period: 'lifetime', 
              values: [{ value: { 
                'M.18-24': 420, 'M.25-34': 680, 'M.35-44': 520, 'M.45-54': 310,
                'F.18-24': 890, 'F.25-34': 1250, 'F.35-44': 780, 'F.45-54': 450,
                'F.55-64': 280
              }}] 
            },
            { name: 'page_impressions_by_country', period: 'day', 
              values: [{ value: { 
                'US': 18500, 'UK': 8200, 'CA': 5400, 'AU': 4200, 'IN': 3800,
                'DE': 2100, 'FR': 1900, 'BR': 1180
              }}] 
            }
          ]
        };
        
      case '/me?fields=name,email':
        return {
          name: 'TechCorp Business',
          email: 'business@techcorp.com',
          id: '123456789',
          followers: 25680,
        };
        
      case '/competitors':
        return {
          data: [
            { 
              name: 'Competitor A',
              followers: 28500,
              engagement_rate: 4.8,
              posts_last_month: 22,
              avg_reach: 14200,
              growth_rate: 12.5,
            },
            { 
              name: 'Competitor B',
              followers: 19800,
              engagement_rate: 3.2,
              posts_last_month: 18,
              avg_reach: 9800,
              growth_rate: 8.3,
            },
            { 
              name: 'Competitor C',
              followers: 35200,
              engagement_rate: 5.6,
              posts_last_month: 28,
              avg_reach: 18500,
              growth_rate: 15.2,
            },
            { 
              name: 'Your Business',
              followers: 25680,
              engagement_rate: 4.2,
              posts_last_month: 20,
              avg_reach: 12890,
              growth_rate: 10.8,
            },
          ]
        };
        
      case '/trends':
        return {
          data: [
            { month: 'Aug', impressions: 28500, engagements: 3200, reach: 18500, followers: 22400 },
            { month: 'Sep', impressions: 32200, engagements: 4100, reach: 21200, followers: 23100 },
            { month: 'Oct', impressions: 38500, engagements: 5800, reach: 24500, followers: 23850 },
            { month: 'Nov', impressions: 41500, engagements: 7200, reach: 28900, followers: 24680 },
            { month: 'Dec', impressions: 45200, engagements: 8900, reach: 32400, followers: 25350 },
            { month: 'Jan', impressions: 48900, engagements: 12450, reach: 36800, followers: 25680 },
          ]
        };
        
      default:
        return {};
    }
  };


  // Fetch insights
  const fetchInsights = async (accessToken) => {
    try {
      setLoading(true);
      
      const [postsData, insightsData, userInfo, competitorsData, trendsData] = await Promise.all([
        fetchFacebookData('/me/posts', accessToken),
        fetchFacebookData('/me/insights', accessToken),
        fetchFacebookData('/me?fields=name,email', accessToken),
        fetchFacebookData('/competitors', accessToken),
        fetchFacebookData('/trends', accessToken)
      ]);

      // Calculate metrics
      const totalLikes = postsData.data.reduce((sum, post) => sum + (post.likes?.summary?.total_count || 0), 0);
      const totalComments = postsData.data.reduce((sum, post) => sum + (post.comments?.summary?.total_count || 0), 0);
      const totalShares = postsData.data.reduce((sum, post) => sum + (post.shares?.count || 0), 0);

      const metrics = {
        totalPosts: postsData.data.length,
        totalLikes,
        totalComments,
        totalShares,
        totalEngagement: totalLikes + totalComments + totalShares,
        impressions: 45280,
        reach: 62870,
        engagedUsers: insightsData.data.find(i => i.name === 'page_engaged_users')?.values[0]?.value || 0,
        engagementRate: '11.68',
        followers: 25680,
        avgEngagementPerPost: ((totalLikes + totalComments + totalShares) / postsData.data.length).toFixed(0),
      };

      // Demographics
      const genderAgeData = insightsData.data.find(i => i.name === 'page_fans_gender_age')?.values[0]?.value || {};
      const countryData = insightsData.data.find(i => i.name === 'page_impressions_by_country')?.values[0]?.value || {};

      // Generate AI insights
      const aiInsights = generateAIInsights(postsData.data, metrics, competitorsData.data);

      setInsights({
        posts: postsData.data,
        userInfo,
        metrics,
        demographics: {
          genderAge: genderAgeData,
          countries: countryData
        },
        competitors: competitorsData.data,
        trends: trendsData.data,
        aiInsights,
      });

    } catch (error) {
      console.error('Error fetching insights:', error);
      setNotification({
        open: true,
        message: '❌ Error loading insights',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate AI insights (Dynamic based on metrics)
  const generateAIInsights = (posts, metrics, competitors) => {
    const topPost = [...posts].sort((a, b) => 
      (b.likes?.summary?.total_count || 0) - (a.likes?.summary?.total_count || 0)
    )[0];
    
    const avgCompetitorEngagement = competitors
      .filter(c => c.name !== 'Your Business')
      .reduce((sum, c) => sum + c.engagement_rate, 0) / (competitors.length - 1);

    const performanceScore = (parseFloat(metrics.engagementRate) / avgCompetitorEngagement * 100).toFixed(0);

    // AI-calculated insights
    const engagementTrend = '+12.5%';
    const followerGrowth = '+8.3%';
    const reachGrowth = '+15.2%';

    return {
      performanceScore: Math.min(performanceScore, 100),
      topPost: {
        message: topPost?.message,
        engagement: topPost?.likes?.summary?.total_count || 0,
      },
      recommendations: [
        {
          type: 'success',
          title: '🤖 AI-Detected Top Performer',
          description: `Your post "${topPost?.message?.substring(0, 50)}..." received 1,245 likes. AI recommends similar content themes.`,
          impact: 'high',
        },
        {
          type: performanceScore > 100 ? 'success' : 'warning',
          title: performanceScore > 100 ? '🏆 AI: Above Market Average' : '⚡ AI: Optimization Needed',
          description: performanceScore > 100
            ? `AI analysis shows ${(performanceScore - 100).toFixed(0)}% better engagement than competitors!`
            : `AI suggests focusing on video content - competitors average ${avgCompetitorEngagement.toFixed(1)}% engagement.`,
          impact: 'high',
        },
        {
          type: 'info',
          title: '📊 AI Posting Schedule',
          description: `AI recommends ${(metrics.totalPosts / 4 * 1.5).toFixed(1)} posts/week. Current: ${(metrics.totalPosts / 4).toFixed(1)}/week. Increase by 40% for optimal reach.`,
          impact: 'high',
        },
        {
          type: 'info',
          title: '💬 AI Engagement Booster',
          description: 'AI detects posts with questions get 2.5x more comments. Add CTAs in 80% of posts for best results.',
          impact: 'medium',
        },
        {
          type: 'success',
          title: '🎯 AI Optimal Times',
          description: 'AI-calculated best times: Mon-Fri 10AM-2PM (65% engagement) & 6PM-9PM (72% engagement). Avoid weekends.',
          impact: 'high',
        },
        {
          type: 'warning',
          title: '🔥 AI Trend Alert',
          description: `Reels are trending +180% in your industry. AI recommends 3 Reels/week to capitalize on ${reachGrowth} reach growth.`,
          impact: 'high',
        },
      ],
      insights: [
        { label: 'AI Engagement Trend', value: engagementTrend, trend: 'up', aiScore: 98 },
        { label: 'AI Follower Growth', value: followerGrowth, trend: 'up', aiScore: 95 },
        { label: 'AI Reach Expansion', value: reachGrowth, trend: 'up', aiScore: 92 },
        { label: 'AI Response Score', value: '96%', trend: 'up', aiScore: 96 },
      ],
    };
  };

  // Refresh data
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchInsights(user.accessToken);
    setRefreshing(false);
    setNotification({
      open: true,
      message: '🔄 Data refreshed successfully!',
      severity: 'success',
    });
  };

  // Handle time range change
  const handleTimeRangeChange = async (range) => {
    setRefreshing(true);
    try {
      // Simulate fetching data for different time ranges
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Adjust metrics based on time range
      const multipliers = {
        '7days': { followers: 1.0, impressions: 1.0, reach: 1.0, engagement: 1.0 },
        '30days': { followers: 1.15, impressions: 4.2, reach: 3.8, engagement: 1.05 },
        '90days': { followers: 1.28, impressions: 12.5, reach: 11.2, engagement: 1.12 },
      };
      
      const mult = multipliers[range];
      
      // Update metrics dynamically
      setInsights(prev => ({
        ...prev,
        metrics: {
          ...prev.metrics,
          followers: Math.round(25680 * mult.followers),
          impressions: Math.round(45280 * mult.impressions),
          reach: Math.round(62870 * mult.reach),
          engagementRate: (11.68 * mult.engagement).toFixed(2),
        }
      }));
      
      setNotification({
        open: true,
        message: `📊 Data updated for ${range === '7days' ? 'last 7 days' : range === '30days' ? 'last 30 days' : 'last 90 days'}`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Error updating time range:', error);
    } finally {
      setRefreshing(false);
    }
  };

  // Chart data generators
  const getEngagementChartData = () => {
    if (!insights.posts.length) return null;
    
    const sortedPosts = [...insights.posts].sort((a, b) => 
      (b.likes?.summary?.total_count || 0) - (a.likes?.summary?.total_count || 0)
    ).slice(0, 5);

    return {
      labels: sortedPosts.map(post => post.message.substring(0, 30) + '...'),
      datasets: [
        {
          label: 'Likes',
          data: sortedPosts.map(post => post.likes?.summary?.total_count || 0),
          backgroundColor: 'rgba(102, 126, 234, 0.8)',
        },
        {
          label: 'Comments',
          data: sortedPosts.map(post => post.comments?.summary?.total_count || 0),
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
        },
        {
          label: 'Shares',
          data: sortedPosts.map(post => post.shares?.count || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
        }
      ]
    };
  };

  const getTrendsChartData = () => {
    if (!insights.trends) return null;
    
    return {
      labels: insights.trends.map(t => t.month),
      datasets: [
        {
          label: 'Impressions',
          data: insights.trends.map(t => t.impressions),
          borderColor: 'rgba(102, 126, 234, 1)',
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Engagements',
          data: insights.trends.map(t => t.engagements),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.1)',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Reach',
          data: insights.trends.map(t => t.reach),
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.1)',
          tension: 0.4,
          fill: true,
        }
      ]
    };
  };

  const getDemographicChartData = () => {
    if (!insights.demographics) return null;
    
    const genderAge = insights.demographics.genderAge;
    
    return {
      labels: Object.keys(genderAge).map(key => {
        const gender = key.split('.')[0] === 'M' ? 'Male' : 'Female';
        const age = key.split('.')[1];
        return `${gender} ${age}`;
      }),
      datasets: [{
        data: Object.values(genderAge),
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(118, 75, 162, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(201, 203, 207, 0.8)',
          'rgba(255, 205, 86, 0.8)',
        ]
      }]
    };
  };

  const getCountryChartData = () => {
    if (!insights.demographics) return null;
    
    const countries = insights.demographics.countries;
    
    return {
      labels: Object.keys(countries),
      datasets: [{
        data: Object.values(countries),
        backgroundColor: [
          'rgba(102, 126, 234, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(118, 75, 162, 0.8)',
        ]
      }]
    };
  };

  const getCompetitorChartData = () => {
    if (!insights.competitors) return null;
    
    return {
      labels: insights.competitors.map(c => c.name),
      datasets: [
        {
          label: 'Followers',
          data: insights.competitors.map(c => c.followers),
          backgroundColor: insights.competitors.map(c => 
            c.name === 'Your Business' ? 'rgba(102, 126, 234, 0.8)' : 'rgba(200, 200, 200, 0.6)'
          ),
        },
      ]
    };
  };

  const getEngagementRateChartData = () => {
    if (!insights.competitors) return null;
    
    return {
      labels: insights.competitors.map(c => c.name),
      datasets: [{
        label: 'Engagement Rate (%)',
        data: insights.competitors.map(c => c.engagement_rate),
        backgroundColor: insights.competitors.map(c => 
          c.name === 'Your Business' ? 'rgba(75, 192, 192, 0.8)' : 'rgba(200, 200, 200, 0.6)'
        ),
      }]
    };
  };

  // Render Analytics Dashboard
  const renderAnalyticsDashboard = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {/* AI Performance Score */}
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
        <strong>🤖 AI Performance Score: {insights.aiInsights?.performanceScore}%</strong> - 
        {insights.aiInsights?.performanceScore > 100 
          ? ' Excellent! You\'re outperforming competitors!' 
          : ' Keep optimizing your content strategy!'}
      </Alert>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {[
          { 
            label: 'Total Followers', 
            value: insights.metrics?.followers?.toLocaleString() || '0',
            icon: <PeopleIcon sx={{ fontSize: 40 }} />,
            color: '#667eea',
            trend: '+8.3%',
            description: 'AI-tracked growth',
          },
          { 
            label: 'Total Impressions', 
            value: insights.metrics?.impressions?.toLocaleString() || '0',
            icon: <VisibilityIcon sx={{ fontSize: 40 }} />,
            color: '#4caf50',
            trend: '+15.2%',
            description: 'AI-optimized reach',
          },
          { 
            label: 'Engagement Rate', 
            value: `${insights.metrics?.engagementRate || 0}%`,
            icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
            color: '#ff9800',
            trend: '+12.5%',
            description: 'AI-enhanced engagement',
          },
          { 
            label: 'Total Reach', 
            value: insights.metrics?.reach?.toLocaleString() || '0',
            icon: <PublicIcon sx={{ fontSize: 40 }} />,
            color: '#f44336',
            trend: '+10.8%',
            description: 'AI-calculated reach',
          },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div variants={itemVariants}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                },
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: `${metric.color}20`,
                      color: metric.color,
                    }}>
                      {metric.icon}
                    </Box>
                    <Chip 
                      label={metric.trend}
                      size="small"
                      sx={{
                        bgcolor: '#4caf5020',
                        color: '#4caf50',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {metric.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: metric.color }}>
                    {metric.value}
                  </Typography>
                  <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 1, color: '#7b1fa2' }}>
                    <AutoAwesomeIcon sx={{ fontSize: 12 }} />
                    {metric.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3}>
        {/* Engagement Chart */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <BarChartIcon sx={{ color: '#667eea', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Top Performing Posts
                </Typography>
              </Box>
              <Box sx={{ height: 350 }}>
                {getEngagementChartData() && (
                  <Bar 
                    data={getEngagementChartData()}
                  options={{
                    responsive: true,
                      maintainAspectRatio: false,
                    plugins: {
                        legend: { 
                          position: 'top',
                          labels: { font: { size: 12 } }
                        },
                      },
                      scales: {
                        y: { beginAtZero: true }
                    }
                  }}
                />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Stats */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)', height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                📊 Quick Stats
              </Typography>
              <List dense>
                {[
                  { label: 'Total Posts', value: insights.metrics?.totalPosts, icon: <BarChartIcon /> },
                  { label: 'Total Likes', value: insights.metrics?.totalLikes?.toLocaleString(), icon: <ThumbUpIcon /> },
                  { label: 'Total Comments', value: insights.metrics?.totalComments?.toLocaleString(), icon: <CommentIcon /> },
                  { label: 'Total Shares', value: insights.metrics?.totalShares?.toLocaleString(), icon: <ShareIcon /> },
                  { label: 'Avg Engagement/Post', value: insights.metrics?.avgEngagementPerPost, icon: <SpeedIcon /> },
                ].map((stat, index) => (
                  <ListItem key={index} sx={{ py: 1.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      <Box sx={{
                        p: 1,
                        borderRadius: 2,
                        bgcolor: '#667eea20',
                        color: '#667eea',
                        display: 'flex',
                      }}>
                        {stat.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText 
                      primary={stat.label}
                      secondary={
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                          {stat.value || '0'}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Trends Chart */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShowChartIcon sx={{ color: '#667eea', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  6-Month Performance Trends
                </Typography>
              </Box>
              <Box sx={{ height: 350 }}>
                {getTrendsChartData() && (
                <Line 
                    data={getTrendsChartData()}
                  options={{
                    responsive: true,
                      maintainAspectRatio: false,
                    plugins: {
                      legend: { position: 'top' }
                      },
                      scales: {
                        y: { beginAtZero: true }
                    }
                  }}
                />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  // Render Demographics
  const renderDemographics = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Alert 
        severity="success" 
        icon={<PeopleIcon />} 
        sx={{ 
          mb: 3,
          bgcolor: '#e8f5e9',
          border: '1px solid #81c784',
          borderRadius: 3,
        }}
      >
        <strong>👥 Audience Insights:</strong> Understand your demographic composition for targeted marketing
      </Alert>

      <Grid container spacing={3}>
        {/* Gender & Age */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                👥 Gender & Age Distribution
              </Typography>
              <Box sx={{ height: 350 }}>
                {getDemographicChartData() && (
                  <Pie 
                    data={getDemographicChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { 
                          position: 'right',
                          labels: { font: { size: 11 } }
                        }
                      }
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Countries */}
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                🌍 Geographic Distribution
              </Typography>
              <Box sx={{ height: 350 }}>
                {getCountryChartData() && (
                  <Doughnut 
                    data={getCountryChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { 
                          position: 'right',
                          labels: { font: { size: 11 } }
                        }
                      }
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Demographics Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                📊 Detailed Demographic Breakdown
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Audience</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Percentage</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Trend</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insights.demographics && Object.entries(insights.demographics.genderAge)
                      .sort((a, b) => b[1] - a[1])
                      .slice(0, 5)
                      .map(([key, value], index) => {
                        const total = Object.values(insights.demographics.genderAge).reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        const gender = key.split('.')[0] === 'M' ? 'Male' : 'Female';
                        const age = key.split('.')[1];
                        
        return (
                          <TableRow key={index}>
                            <TableCell>{`${gender} ${age}`}</TableCell>
                            <TableCell>{value.toLocaleString()}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <LinearProgress 
                                  variant="determinate" 
                                  value={parseFloat(percentage)}
                                  sx={{ 
                                    width: 100,
                                    height: 8,
                                    borderRadius: 4,
                                    bgcolor: '#e0e0e0',
                                    '& .MuiLinearProgress-bar': {
                                      bgcolor: '#667eea',
                                    }
                                  }}
                                />
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {percentage}%
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Chip 
                                label="+5.2%" 
                                size="small"
                                sx={{
                                  bgcolor: '#4caf5020',
                                  color: '#4caf50',
                                  fontWeight: 600,
                                }}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  // Render Competitor Analysis
  const renderCompetitorAnalysis = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Alert 
        severity="warning" 
        icon={<CompareIcon />} 
        sx={{ 
          mb: 3,
          bgcolor: '#fff3e0',
          border: '1px solid #ffb74d',
          borderRadius: 3,
        }}
      >
        <strong>🔍 Competitive Intelligence:</strong> See how you stack up against competitors
      </Alert>

      <Grid container spacing={3}>
        {/* Followers Comparison */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                👥 Follower Comparison
              </Typography>
              <Box sx={{ height: 300 }}>
                {getCompetitorChartData() && (
                  <Bar 
                    data={getCompetitorChartData()}
                  options={{
                    responsive: true,
                      maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                      },
                      scales: {
                        y: { beginAtZero: true }
                      }
                    }}
                  />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Engagement Rate Comparison */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                📊 Engagement Rate Comparison
              </Typography>
              <Box sx={{ height: 300 }}>
                {getEngagementRateChartData() && (
                  <Bar 
                    data={getEngagementRateChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: { display: false }
                    },
                    scales: {
                      y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return value + '%';
                            }
                          }
                      }
                    }
                  }}
                />
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Detailed Comparison Table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3, boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                📈 Detailed Competitive Analysis
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Business</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Followers</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Engagement Rate</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Posts/Month</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Avg Reach</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Growth Rate</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {insights.competitors?.map((competitor, index) => (
                      <TableRow 
                        key={index}
                        sx={{
                          bgcolor: competitor.name === 'Your Business' ? '#667eea10' : 'transparent',
                        }}
                      >
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {competitor.name === 'Your Business' && <StarIcon sx={{ color: '#ffd700' }} />}
                            <Typography sx={{ fontWeight: competitor.name === 'Your Business' ? 700 : 400 }}>
                              {competitor.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>{competitor.followers.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={`${competitor.engagement_rate}%`}
                            size="small"
                            sx={{
                              bgcolor: competitor.engagement_rate > 4.5 ? '#4caf5020' : '#ff980020',
                              color: competitor.engagement_rate > 4.5 ? '#4caf50' : '#ff9800',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                        <TableCell>{competitor.posts_last_month}</TableCell>
                        <TableCell>{competitor.avg_reach.toLocaleString()}</TableCell>
                        <TableCell>
                          <Chip 
                            label={`+${competitor.growth_rate}%`}
                            size="small"
                            icon={<TrendingUpIcon sx={{ fontSize: 16 }} />}
                            sx={{
                              bgcolor: '#4caf5020',
                              color: '#4caf50',
                              fontWeight: 600,
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  // Render AI Recommendations
  const renderRecommendations = () => (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      <Alert 
        severity="info" 
        icon={<AIIcon />} 
        sx={{ 
          mb: 3,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          '& .MuiAlert-icon': { color: 'white' },
          borderRadius: 3,
        }}
      >
        <strong>🤖 AI-Powered Recommendations:</strong> Personalized insights to boost your social media performance
      </Alert>

      <Grid container spacing={3}>
        {/* Recommendations Cards */}
        {insights.aiInsights?.recommendations.map((rec, index) => (
          <Grid item xs={12} md={6} key={index}>
            <motion.div variants={itemVariants}>
              <Card sx={{ 
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: `2px solid ${
                  rec.type === 'success' ? '#4caf50' :
                  rec.type === 'warning' ? '#ff9800' :
                  '#2196f3'
                }`,
                transition: 'all 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                },
              }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {rec.title}
                    </Typography>
                    <Chip 
                      label={rec.impact.toUpperCase()}
                      size="small"
                      sx={{
                        bgcolor: rec.impact === 'high' ? '#f4433620' : '#ff980020',
                        color: rec.impact === 'high' ? '#f44336' : '#ff9800',
                        fontWeight: 700,
                      }}
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {rec.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}

        {/* AI Quick Insights */}
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <AutoAwesomeIcon sx={{ color: '#667eea' }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  🤖 AI Real-Time Insights
                </Typography>
              </Box>
              <Grid container spacing={2}>
                {insights.aiInsights?.insights.map((insight, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <Paper sx={{ 
                      p: 2.5, 
                      borderRadius: 2, 
                      bgcolor: 'white',
                      border: '2px solid #667eea20',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 24px rgba(102,126,234,0.2)',
                      },
                    }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Typography variant="caption" color="text.secondary">
                          {insight.label}
                        </Typography>
                        <Chip 
                          label={`AI: ${insight.aiScore}`}
                          size="small"
                          sx={{
                            bgcolor: insight.aiScore >= 95 ? '#4caf5020' : '#667eea20',
                            color: insight.aiScore >= 95 ? '#4caf50' : '#667eea',
                            fontWeight: 700,
                            fontSize: '0.65rem',
                          }}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#667eea' }}>
                          {insight.value}
                        </Typography>
                        {insight.trend === 'up' && <TrendingUpIcon sx={{ color: '#4caf50', fontSize: 28 }} />}
                        {insight.trend === 'down' && <TrendingDownIcon sx={{ color: '#f44336', fontSize: 28 }} />}
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Action Items */}
        <Grid item xs={12}>
          <Card sx={{ 
            borderRadius: 3, 
            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
            background: 'linear-gradient(135deg, #fffbea 0%, #fff3e0 100%)',
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <LightbulbIcon sx={{ color: '#f57c00', mr: 1, fontSize: 28 }} />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  💡 Action Items for This Week
                </Typography>
              </Box>
              <List>
                {[
                  'Post 3-5 times focusing on your top-performing content themes',
                  'Respond to all comments within 2 hours to boost engagement',
                  'Create content targeting your F.25-34 demographic (largest audience)',
                  'Schedule posts for weekday afternoons (highest engagement window)',
                  'Add more video content - videos get 2x more engagement',
                ].map((action, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon sx={{ color: '#4caf50' }} />
                    </ListItemIcon>
                    <ListItemText primary={action} />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </motion.div>
  );

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}>
        {loading && insights.metrics === null ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              Loading your business insights...
            </Typography>
          </Box>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              flexWrap: 'wrap',
              gap: 2,
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar 
                src={user.photoURL} 
                alt={user.displayName} 
                  sx={{ width: 60, height: 60, border: '3px solid #667eea' }}
                />
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 700 }}>
                    {insights.userInfo?.name || user.displayName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {insights.userInfo?.email || user.email}
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Tooltip title="Refresh Data">
                  <IconButton 
                    onClick={handleRefresh}
                    disabled={refreshing}
                    sx={{
                      bgcolor: '#667eea20',
                      '&:hover': { bgcolor: '#667eea30' },
                    }}
                  >
                    {refreshing ? <CircularProgress size={20} /> : <RefreshIcon />}
                  </IconButton>
                </Tooltip>

                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <Select
                    value={timeRange}
                    onChange={(e) => {
                      setTimeRange(e.target.value);
                      handleTimeRangeChange(e.target.value);
                    }}
                    sx={{ 
                      borderRadius: 2,
                      bgcolor: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#5568d3',
                      },
                    }}
                  >
                    <MenuItem value="7days">Last 7 days</MenuItem>
                    <MenuItem value="30days">Last 30 days</MenuItem>
                    <MenuItem value="90days">Last 90 days</MenuItem>
                  </Select>
                </FormControl>
              </Box>
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
                  icon={<AnalyticsIcon />} 
                  label="Analytics" 
                  iconPosition="start"
                  sx={{ minHeight: 64, fontWeight: 600 }}
                />
                <Tab 
                  icon={<PeopleIcon />} 
                  label="Demographics" 
                  iconPosition="start"
                  sx={{ minHeight: 64, fontWeight: 600 }}
                />
                <Tab 
                  icon={<CompareIcon />} 
                  label="Competitors" 
                  iconPosition="start"
                  sx={{ minHeight: 64, fontWeight: 600 }}
                />
                <Tab 
                  icon={<AIIcon />} 
                  label="AI Recommendations" 
                  iconPosition="start"
                  sx={{ minHeight: 64, fontWeight: 600 }}
                />
              </Tabs>
            </Paper>

            {/* Loading */}
            {loading && (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
                <CircularProgress size={60} />
                <Typography variant="h6" sx={{ mt: 2 }}>
                  Loading insights...
                </Typography>
              </Box>
            )}

            {/* Tab Content */}
            {!loading && (
              <Box>
                <AnimatePresence mode="wait">
                  {activeTab === 0 && renderAnalyticsDashboard()}
                  {activeTab === 1 && renderDemographics()}
                  {activeTab === 2 && renderCompetitorAnalysis()}
                  {activeTab === 3 && renderRecommendations()}
                </AnimatePresence>
              </Box>
            )}
          </motion.div>
        )}

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
          >
            {notification.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default BusinessInsights;
