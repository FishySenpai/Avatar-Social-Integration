import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './Register';
import VerifyEmail from './VerifyEmail';
import Login from './Login';
import Dashboard from './components/Dashboard';
import EngagementTrendAnalysis from './components/EngagementTrendAnalysis';
import TokenBasedSubscription from './components/TokenBasedSubscription';
import Security from './components/Security';
import { AuthProvider } from './AuthContext';
import PrivateRoute from './PrivateRoute';
import ProfileManagement from './components/ProfileManagement';
import AvatarTest from './components/AvatarTest';
import PostScheduling from './components/PostScheduling';
import CaptionGenerator from './components/CaptionGenerator';
import BusinessInsights from './components/BusinessInsights';
import VoiceCloning from './components/VoiceCloningWithCRUD';
import VoiceUploadCloning from './components/VoiceUploadCloning';
import ForgotPassword from './components/ForgotPassword';
import AdminDashboard from './components/AdminDashboard';
import PhoneVerification from './components/PhoneVerification';
import LandingPage from './components/LandingPage';
import Layout from './components/Layout';
import SocialMediaHub from './components/SocialMediaHub';
import MotionCapture from './components/MotionCapture';
import PersonaManager from './components/PersonaManager';
import PoseLibrary from './components/PoseLibrary';
import EnhancedVoiceCloning from './components/EnhancedVoiceCloning';
import AvatarContentGeneration from './components/AvatarContentGeneration';
import FeedbackNotification from './components/FeedbackNotification';
import AvatarProfileManager from './components/AvatarProfileManager';
import ProfileSettings from './components/ProfileSettings';
import About from './components/About';
import Contact from './components/Contact';
import Features from './components/Features';
import Pricing from './components/Pricing';
import SecurityPage from './components/SecurityPage';
import Blog from './components/Blog';
import Careers from './components/Careers';
function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Landing Page - Has its own footer, use Layout */}
          <Route path="/" element={<Layout showFooter={false}><LandingPage /></Layout>} />
          
          {/* Public Pages - Use Layout with footer */}
          <Route path="/about" element={<Layout><About /></Layout>} />
          <Route path="/contact" element={<Layout><Contact /></Layout>} />
          <Route path="/features" element={<Layout><Features /></Layout>} />
          <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
          <Route path="/security" element={<Layout><SecurityPage /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          <Route path="/careers" element={<Layout><Careers /></Layout>} />
          
          {/* Auth Pages - Use Layout with footer */}
          <Route path="/login" element={<Layout><Login /></Layout>} />
          <Route path="/register" element={<Layout><Register /></Layout>} />
          <Route path="/forgot-password" element={<Layout><ForgotPassword /></Layout>} />
          <Route path="/verify-email" element={<Layout><VerifyEmail /></Layout>} />
          
          {/* Dashboard Pages - Already have Sidebar/Header, don't use Layout */}
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
          
          {/* Profile & Security - Use Layout */}
          <Route path="/profile" element={<Layout><PrivateRoute><ProfileManagement /></PrivateRoute></Layout>} />
          <Route path="/profile-settings" element={<Layout><PrivateRoute><ProfileSettings /></PrivateRoute></Layout>} />
          <Route path="/security-settings" element={<Layout><PrivateRoute><Security /></PrivateRoute></Layout>} />
          <Route path="/verify-phone" element={<Layout><PrivateRoute><PhoneVerification /></PrivateRoute></Layout>} />
          
          {/* Feature Pages - Use Layout */}
          <Route path="/avatar-profile-manager" element={<Layout><PrivateRoute><AvatarProfileManager /></PrivateRoute></Layout>} />
          <Route path="/social-media-hub" element={<Layout><PrivateRoute><SocialMediaHub /></PrivateRoute></Layout>} />
          <Route path="/post-scheduling" element={<Layout><PrivateRoute><PostScheduling /></PrivateRoute></Layout>} />
          <Route path="/caption-generator" element={<Layout><PrivateRoute><CaptionGenerator /></PrivateRoute></Layout>} />
          <Route path="/business-insights" element={<Layout><PrivateRoute><BusinessInsights /></PrivateRoute></Layout>} />
          <Route path="/voice-cloning" element={<Layout><PrivateRoute><VoiceCloning /></PrivateRoute></Layout>} />
          <Route path="/voice-upload-cloning" element={<Layout><PrivateRoute><VoiceUploadCloning /></PrivateRoute></Layout>} />
          <Route path="/token-subscription" element={<Layout><PrivateRoute><TokenBasedSubscription /></PrivateRoute></Layout>} />
          <Route path="/engagement-trend-analysis" element={<Layout><PrivateRoute><EngagementTrendAnalysis /></PrivateRoute></Layout>} />
          <Route path="/feedback-notification" element={<Layout><PrivateRoute><FeedbackNotification /></PrivateRoute></Layout>} />
          
          {/* Avatar Virtual Influencer Features - Use Layout */}
          <Route path="/motion-capture" element={<Layout><PrivateRoute><MotionCapture /></PrivateRoute></Layout>} />
          <Route path="/persona-manager" element={<Layout><PrivateRoute><PersonaManager /></PrivateRoute></Layout>} />
          <Route path="/pose-library" element={<Layout><PrivateRoute><PoseLibrary /></PrivateRoute></Layout>} />
          <Route path="/enhanced-voice-cloning" element={<Layout><PrivateRoute><EnhancedVoiceCloning /></PrivateRoute></Layout>} />
          <Route path="/avatar-content-generation" element={<Layout><PrivateRoute><AvatarContentGeneration /></PrivateRoute></Layout>} />
          
          {/* Test Page */}
          <Route path="/test" element={<Layout><AvatarTest /></Layout>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
