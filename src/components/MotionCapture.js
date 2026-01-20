import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  Paper,
  Alert,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Videocam as VideocamIcon,
  Stop as StopIcon,
  FiberManualRecord as RecordIcon,
  PlayArrow as PlayArrowIcon,
  Save as SaveIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  Visibility as VisibilityIcon,
  VideoLibrary as VideoLibraryIcon,
  Animation as AnimationIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../AuthContext';
import { db } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, query, where } from 'firebase/firestore';

const MotionCapture = () => {
  const { currentUser } = useAuth();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [isPosing, setIsPosing] = useState(false);
  const [currentPose, setCurrentPose] = useState('neutral');
  const [detectionMode, setDetectionMode] = useState('pose'); // 'pose', 'hand', 'face'
  const [recordedMotions, setRecordedMotions] = useState([]);
  const [currentRecording, setCurrentRecording] = useState(null);
  const [poseData, setPoseData] = useState([]);
  const [notification, setNotification] = useState({ open: false, message: '', severity: 'info' });
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [recordingName, setRecordingName] = useState('');
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);

  // Pose detection states
  const [detectedKeypoints, setDetectedKeypoints] = useState([]);
  const [poseConfidence, setPoseConfidence] = useState(0);
  const [bodyAngles, setBodyAngles] = useState({});

  useEffect(() => {
    loadRecordings();
  }, [currentUser]);

  const loadRecordings = async () => {
    if (!currentUser) return;
    try {
      const q = query(
        collection(db, 'motionCapture'),
        where('userId', '==', currentUser.uid)
      );
      const snapshot = await getDocs(q);
      const recordings = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRecordedMotions(recordings);
    } catch (error) {
      console.error('Error loading recordings:', error);
    }
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: false
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
        startPoseDetection();
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
      setNotification({
        open: true,
        message: 'Failed to access webcam. Please check permissions.',
        severity: 'error'
      });
    }
  };

  const stopWebcam = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsWebcamActive(false);
      setIsPosing(false);
    }
  };

  const startPoseDetection = () => {
    setIsPosing(true);
    // Simulate pose detection (in production, integrate MediaPipe)
    const detectionInterval = setInterval(() => {
      if (videoRef.current) {
        simulatePoseDetection();
      }
    }, 100);

    return () => clearInterval(detectionInterval);
  };

  const simulatePoseDetection = () => {
    // Simulate keypoint detection
    const mockKeypoints = [
      { name: 'nose', x: 0.5, y: 0.3, confidence: 0.95 },
      { name: 'leftShoulder', x: 0.4, y: 0.4, confidence: 0.92 },
      { name: 'rightShoulder', x: 0.6, y: 0.4, confidence: 0.93 },
      { name: 'leftElbow', x: 0.35, y: 0.5, confidence: 0.88 },
      { name: 'rightElbow', x: 0.65, y: 0.5, confidence: 0.89 },
      { name: 'leftWrist', x: 0.3, y: 0.6, confidence: 0.85 },
      { name: 'rightWrist', x: 0.7, y: 0.6, confidence: 0.86 },
      { name: 'leftHip', x: 0.42, y: 0.6, confidence: 0.91 },
      { name: 'rightHip', x: 0.58, y: 0.6, confidence: 0.90 },
      { name: 'leftKnee', x: 0.41, y: 0.75, confidence: 0.87 },
      { name: 'rightKnee', x: 0.59, y: 0.75, confidence: 0.88 },
      { name: 'leftAnkle', x: 0.40, y: 0.9, confidence: 0.83 },
      { name: 'rightAnkle', x: 0.60, y: 0.9, confidence: 0.84 },
    ];

    setDetectedKeypoints(mockKeypoints);
    const avgConfidence = mockKeypoints.reduce((sum, kp) => sum + kp.confidence, 0) / mockKeypoints.length;
    setPoseConfidence(avgConfidence);

    // Calculate body angles
    const angles = {
      leftElbow: calculateAngle(mockKeypoints[1], mockKeypoints[3], mockKeypoints[5]),
      rightElbow: calculateAngle(mockKeypoints[2], mockKeypoints[4], mockKeypoints[6]),
      leftKnee: calculateAngle(mockKeypoints[7], mockKeypoints[9], mockKeypoints[11]),
      rightKnee: calculateAngle(mockKeypoints[8], mockKeypoints[10], mockKeypoints[12]),
    };
    setBodyAngles(angles);

    if (isRecording) {
      setPoseData(prev => [...prev, {
        timestamp: Date.now(),
        keypoints: mockKeypoints,
        angles: angles,
        confidence: avgConfidence
      }]);
    }

    // Draw on canvas
    drawPoseOnCanvas(mockKeypoints);
  };

  const calculateAngle = (a, b, c) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs(radians * 180.0 / Math.PI);
    if (angle > 180.0) {
      angle = 360 - angle;
    }
    return Math.round(angle);
  };

  const drawPoseOnCanvas = (keypoints) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const video = videoRef.current;
    
    if (!video) return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw keypoints
    keypoints.forEach(kp => {
      if (kp.confidence > 0.5) {
        const x = kp.x * canvas.width;
        const y = kp.y * canvas.height;
        
        ctx.beginPath();
        ctx.arc(x, y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#00ff00';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    });

    // Draw skeleton connections
    const connections = [
      ['nose', 'leftShoulder'],
      ['nose', 'rightShoulder'],
      ['leftShoulder', 'rightShoulder'],
      ['leftShoulder', 'leftElbow'],
      ['leftElbow', 'leftWrist'],
      ['rightShoulder', 'rightElbow'],
      ['rightElbow', 'rightWrist'],
      ['leftShoulder', 'leftHip'],
      ['rightShoulder', 'rightHip'],
      ['leftHip', 'rightHip'],
      ['leftHip', 'leftKnee'],
      ['leftKnee', 'leftAnkle'],
      ['rightHip', 'rightKnee'],
      ['rightKnee', 'rightAnkle'],
    ];

    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    connections.forEach(([start, end]) => {
      const startKp = keypoints.find(kp => kp.name === start);
      const endKp = keypoints.find(kp => kp.name === end);
      
      if (startKp && endKp && startKp.confidence > 0.5 && endKp.confidence > 0.5) {
        ctx.beginPath();
        ctx.moveTo(startKp.x * canvas.width, startKp.y * canvas.height);
        ctx.lineTo(endKp.x * canvas.width, endKp.y * canvas.height);
        ctx.stroke();
      }
    });
  };

  const startRecording = () => {
    setIsRecording(true);
    setPoseData([]);
    recordedChunksRef.current = [];
    
    setNotification({
      open: true,
      message: 'Recording started...',
      severity: 'info'
    });
  };

  const stopRecording = async () => {
    setIsRecording(false);
    
    if (poseData.length === 0) {
      setNotification({
        open: true,
        message: 'No motion data recorded',
        severity: 'warning'
      });
      return;
    }

    const recording = {
      id: Date.now().toString(),
      name: recordingName || `Motion_${new Date().toLocaleString()}`,
      duration: (poseData[poseData.length - 1].timestamp - poseData[0].timestamp) / 1000,
      frames: poseData.length,
      data: poseData,
      detectionMode: detectionMode,
      createdAt: new Date().toISOString(),
    };

    setCurrentRecording(recording);
    
    // Save to Firestore
    if (currentUser) {
      try {
        await addDoc(collection(db, 'motionCapture'), {
          ...recording,
          userId: currentUser.uid,
        });
        await loadRecordings();
        setNotification({
          open: true,
          message: 'Motion recorded successfully!',
          severity: 'success'
        });
      } catch (error) {
        console.error('Error saving recording:', error);
        setNotification({
          open: true,
          message: 'Failed to save recording',
          severity: 'error'
        });
      }
    }
    
    setPoseData([]);
    setRecordingName('');
  };

  const deleteRecording = async (id) => {
    try {
      await deleteDoc(doc(db, 'motionCapture', id));
      await loadRecordings();
      setNotification({
        open: true,
        message: 'Recording deleted',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting recording:', error);
      setNotification({
        open: true,
        message: 'Failed to delete recording',
        severity: 'error'
      });
    }
  };

  const playbackRecording = (recording) => {
    setSelectedRecording(recording);
    setShowPreview(true);
    
    // Simulate playback
    let frameIndex = 0;
    const playbackInterval = setInterval(() => {
      if (frameIndex < recording.data.length) {
        const frame = recording.data[frameIndex];
        drawPoseOnCanvas(frame.keypoints);
        frameIndex++;
      } else {
        clearInterval(playbackInterval);
      }
    }, 50);
  };

  const downloadRecording = (recording) => {
    const dataStr = JSON.stringify(recording, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = `${recording.name}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', color: '#667eea', mb: 3 }}>
          🎭 Motion Capture Studio
        </Typography>
        <Typography variant="h6" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
          Real-time body tracking and animation recording
        </Typography>

        <Grid container spacing={3}>
          {/* Video Preview */}
          <Grid item xs={12} md={8}>
            <Card elevation={3}>
              <CardContent>
                <Box sx={{ position: 'relative', width: '100%', height: 480, bgcolor: '#000', borderRadius: 2, overflow: 'hidden' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      display: isWebcamActive ? 'block' : 'none'
                    }}
                  />
                  <canvas
                    ref={canvasRef}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      pointerEvents: 'none'
                    }}
                  />
                  {!isWebcamActive && (
                    <Box sx={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      textAlign: 'center',
                      color: 'white'
                    }}>
                      <VideocamIcon sx={{ fontSize: 80, mb: 2, opacity: 0.5 }} />
                      <Typography variant="h6">Click "Start Camera" to begin</Typography>
                    </Box>
                  )}
                </Box>

                {/* Controls */}
                <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  {!isWebcamActive ? (
                    <Button
                      variant="contained"
                      startIcon={<VideocamIcon />}
                      onClick={startWebcam}
                      sx={{ background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)' }}
                    >
                      Start Camera
                    </Button>
                  ) : (
                    <Button
                      variant="outlined"
                      startIcon={<StopIcon />}
                      onClick={stopWebcam}
                      color="error"
                    >
                      Stop Camera
                    </Button>
                  )}

                  {isWebcamActive && !isRecording && (
                    <Button
                      variant="contained"
                      startIcon={<RecordIcon />}
                      onClick={startRecording}
                      color="error"
                    >
                      Start Recording
                    </Button>
                  )}

                  {isRecording && (
                    <Button
                      variant="contained"
                      startIcon={<StopIcon />}
                      onClick={stopRecording}
                      sx={{ animation: 'pulse 1.5s infinite' }}
                    >
                      Stop Recording ({poseData.length} frames)
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Controls & Stats */}
          <Grid item xs={12} md={4}>
            <Card elevation={3} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <AnimationIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Detection Settings
                </Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Detection Mode</InputLabel>
                  <Select
                    value={detectionMode}
                    onChange={(e) => setDetectionMode(e.target.value)}
                    label="Detection Mode"
                  >
                    <MenuItem value="pose">Full Body Pose</MenuItem>
                    <MenuItem value="hand">Hand Tracking</MenuItem>
                    <MenuItem value="face">Face Landmarks</MenuItem>
                  </Select>
                </FormControl>

                {isPosing && (
                  <>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Pose Confidence
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={poseConfidence * 100} 
                      sx={{ mb: 2, height: 8, borderRadius: 4 }}
                    />
                    
                    <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                      Body Angles:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {Object.entries(bodyAngles).map(([joint, angle]) => (
                        <Chip 
                          key={joint}
                          label={`${joint}: ${angle}°`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </>
                )}
              </CardContent>
            </Card>

            <Card elevation={3}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  <VideoLibraryIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Recorded Motions ({recordedMotions.length})
                </Typography>
                <List>
                  {recordedMotions.slice(0, 5).map((recording) => (
                    <ListItem
                      key={recording.id}
                      sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 1,
                        mb: 1,
                        '&:hover': { bgcolor: '#f5f5f5' }
                      }}
                    >
                      <ListItemIcon>
                        <PersonIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={recording.name}
                        secondary={`${recording.frames} frames • ${recording.duration.toFixed(1)}s`}
                      />
                      <IconButton onClick={() => playbackRecording(recording)} size="small">
                        <PlayArrowIcon />
                      </IconButton>
                      <IconButton onClick={() => downloadRecording(recording)} size="small">
                        <DownloadIcon />
                      </IconButton>
                      <IconButton onClick={() => deleteRecording(recording.id)} size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

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

export default MotionCapture;


