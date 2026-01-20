import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../AuthContext';
import axios from 'axios';

const VoiceUploadCloning = () => {
  const { currentUser } = useAuth();
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceSamples, setVoiceSamples] = useState([]);
  const [selectedSample, setSelectedSample] = useState(null);
  const [textToSpeak, setTextToSpeak] = useState('');
  const [clonedAudio, setClonedAudio] = useState(null);
  const [isCloning, setIsCloning] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [voiceAnalysis, setVoiceAnalysis] = useState(null);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  // Load user's voice samples on mount
  useEffect(() => {
    if (currentUser) {
      loadVoiceSamples();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  // Load voice samples from backend
  const loadVoiceSamples = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/voice-samples/user/${currentUser.uid}`);
      const samples = response.data.samples || [];
      setVoiceSamples(samples);
      return samples; // Return samples for immediate use
    } catch (err) {
      console.error('Error loading voice samples:', err);
      return [];
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/ogg', 'video/mp4', 'video/webm', 'video/avi'];
      if (!validTypes.some(type => file.type.startsWith('audio/') || file.type.startsWith('video/'))) {
        setError('Please upload an audio or video file');
        return;
      }

      // Validate file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        setError('File size must be less than 50MB');
        return;
      }

      setUploadedFile(file);
      setError('');
    }
  };

  // Upload and process voice sample
  const handleUploadAndProcess = async () => {
    if (!uploadedFile) {
      setError('Please select a file first');
      return;
    }

    if (!currentUser) {
      setError('Please login to upload voice samples');
      return;
    }

    setIsProcessing(true);
    setError('');
    setSuccess('');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      formData.append('user_id', currentUser.uid);
      formData.append('sample_name', uploadedFile.name.split('.')[0]);

      const response = await axios.post('http://localhost:5000/api/voice-samples/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
      });

      if (response.data.success) {
        setSuccess('✅ Voice sample uploaded and analyzed successfully! Now select it below to start cloning.');
        setVoiceAnalysis(response.data.analysis);
        setUploadedFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        // Reload samples and auto-select the newly uploaded one
        const samples = await loadVoiceSamples();
        const newSampleId = response.data.sample_id;
        
        if (newSampleId && samples.length > 0) {
          const uploadedSample = samples.find(s => s.id === newSampleId);
          if (uploadedSample) {
            setSelectedSample(uploadedSample);
            console.log('✅ Auto-selected newly uploaded sample:', uploadedSample.name);
          }
        }
      } else {
        setError(response.data.error || 'Failed to process voice sample');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.response?.data?.error || 'Failed to upload voice sample');
    } finally {
      setIsProcessing(false);
    }
  };

  // Clone voice with uploaded sample
  const handleCloneVoice = async () => {
    if (!selectedSample) {
      setError('Please select a voice sample first');
      return;
    }

    if (!textToSpeak.trim()) {
      setError('Please enter text to generate speech');
      return;
    }

    setIsCloning(true);
    setError('');
    setClonedAudio(null);

    try {
      const response = await axios.post('http://localhost:5000/api/voice-samples/clone', {
        sample_id: selectedSample.id,
        text: textToSpeak,
        user_id: currentUser.uid,
      });

      if (response.data.success) {
        setClonedAudio(response.data.audio_url);
        
        // Check if it's real cloning or generic voice
        if (response.data.is_cloned === false || response.data.method === 'gtts_fallback') {
          setError(response.data.message || 'Generated with generic voice (not cloned)');
          setSuccess(''); // Clear success message
        } else {
          setSuccess('✅ Voice cloned successfully with real voice cloning!');
          setError(''); // Clear error message
        }
        
        // Auto-play the cloned audio with proper error handling
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            audioRef.current.load();
            audioRef.current.play().catch(err => {
              console.log('Auto-play prevented:', err);
            });
          }
        }, 200);
      } else {
        setError(response.data.error || 'Failed to clone voice');
      }
    } catch (err) {
      console.error('Clone error:', err);
      setError(err.response?.data?.error || 'Failed to clone voice');
    } finally {
      setIsCloning(false);
    }
  };

  // Delete voice sample
  const handleDeleteSample = async (sampleId) => {
    if (!window.confirm('Are you sure you want to delete this voice sample?')) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:5000/api/voice-samples/${sampleId}`);
      if (response.data.success) {
        setSuccess('Voice sample deleted');
        await loadVoiceSamples();
        if (selectedSample?.id === sampleId) {
          setSelectedSample(null);
        }
      }
    } catch (err) {
      setError('Failed to delete voice sample');
    }
  };

  if (!currentUser) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>🎤 Voice Upload & Cloning</h2>
        <p style={{ marginTop: '20px', fontSize: '1.1rem' }}>
          Please <a href="/login" style={{ color: '#667eea' }}>login</a> to upload and clone voices
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      maxWidth: '1200px', 
      margin: '0 auto',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '30px',
        color: 'white',
        marginBottom: '30px',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: '0', fontSize: '2.5rem' }}>
          🎤 AI Voice Upload & Cloning
        </h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '1.2rem', opacity: 0.9 }}>
          Upload audio/video → Analyze voice → Clone it with any text!
        </p>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <div style={{
          background: error.includes('GENERIC voice') ? '#ff9800' : '#f44336',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px',
          whiteSpace: 'pre-line',
          lineHeight: '1.6'
        }}>
          {error.includes('GENERIC voice') ? '⚠️' : '❌'} {error}
        </div>
      )}

      {success && (
        <div style={{
          background: '#4caf50',
          color: 'white',
          padding: '15px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          ✅ {success}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        
        {/* Left Column - Upload Section */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#667eea' }}>
            📤 Step 1: Upload Voice Sample
          </h2>

          <div style={{
            border: '3px dashed #667eea',
            borderRadius: '10px',
            padding: '30px',
            textAlign: 'center',
            background: '#f8f9ff',
            cursor: 'pointer'
          }}
          onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="audio/*,video/*"
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: '4rem', marginBottom: '10px' }}>
              {uploadedFile ? '✅' : '🎵'}
            </div>
            <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: 'bold' }}>
              {uploadedFile ? uploadedFile.name : 'Click to select audio/video file'}
            </p>
            <p style={{ margin: '10px 0 0 0', fontSize: '0.9rem', color: '#666' }}>
              Supported: MP3, WAV, MP4, WebM (Max 50MB)
            </p>
          </div>

          {uploadedFile && (
            <div style={{ marginTop: '15px' }}>
              <p style={{ margin: '0 0 10px 0' }}>
                <strong>File:</strong> {uploadedFile.name}<br />
                <strong>Size:</strong> {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <button
                onClick={handleUploadAndProcess}
                disabled={isProcessing}
                style={{
                  width: '100%',
                  padding: '15px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '10px',
                  background: isProcessing 
                    ? '#ccc' 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  cursor: isProcessing ? 'not-allowed' : 'pointer',
                  transition: 'all 0.3s'
                }}
              >
                {isProcessing ? '⏳ Processing...' : '🚀 Upload & Analyze Voice'}
              </button>

              {uploadProgress > 0 && uploadProgress < 100 && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{
                    background: '#e0e0e0',
                    borderRadius: '10px',
                    height: '20px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      height: '100%',
                      width: `${uploadProgress}%`,
                      transition: 'width 0.3s'
                    }} />
                  </div>
                  <p style={{ margin: '5px 0 0 0', textAlign: 'center' }}>
                    {uploadProgress}%
                  </p>
                </div>
              )}
            </div>
          )}

          {voiceAnalysis && (
            <div style={{
              marginTop: '20px',
              padding: '15px',
              background: '#e3f2fd',
              borderRadius: '10px'
            }}>
              <h3 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>
                🔍 Voice Analysis Results
              </h3>
              <div style={{ fontSize: '0.9rem' }}>
                <p style={{ margin: '5px 0' }}>
                  <strong>Average Pitch:</strong> {voiceAnalysis.pitch?.toFixed(1)} Hz
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Speaking Rate:</strong> {voiceAnalysis.rate?.toFixed(2)}x
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Duration:</strong> {voiceAnalysis.duration?.toFixed(1)}s
                </p>
                <p style={{ margin: '5px 0' }}>
                  <strong>Gender:</strong> {voiceAnalysis.gender || 'Unknown'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Clone Section */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '25px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ margin: '0 0 20px 0', color: '#667eea' }}>
            🎙️ Step 2: Clone Voice with Text
          </h2>

          {/* Voice Samples List */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>
              Select Voice Sample:
            </h3>
            {voiceSamples.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                No voice samples yet. Upload one to get started!
              </p>
            ) : (
              <>
                {!selectedSample && (
                  <div style={{
                    padding: '10px',
                    background: '#fff3cd',
                    borderRadius: '8px',
                    marginBottom: '10px',
                    border: '2px solid #ffc107'
                  }}>
                    <p style={{ margin: 0, color: '#856404', fontSize: '0.9rem' }}>
                      👆 <strong>Click on a voice sample below to select it</strong>
                    </p>
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {voiceSamples.map(sample => (
                  <div
                    key={sample.id}
                    onClick={() => setSelectedSample(sample)}
                    style={{
                      padding: '15px',
                      border: selectedSample?.id === sample.id 
                        ? '3px solid #667eea' 
                        : '2px solid #ddd',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      background: selectedSample?.id === sample.id 
                        ? '#f0f4ff' 
                        : 'white',
                      transition: 'all 0.3s',
                      position: 'relative'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <p style={{ margin: '0', fontWeight: 'bold' }}>
                          {sample.name}
                        </p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '0.85rem', color: '#666' }}>
                          Uploaded: {new Date(sample.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSample(sample.id);
                        }}
                        style={{
                          padding: '5px 10px',
                          border: 'none',
                          borderRadius: '5px',
                          background: '#f44336',
                          color: 'white',
                          cursor: 'pointer',
                          fontSize: '0.9rem'
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
                </div>
              </>
            )}
          </div>

          {/* Text Input */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>
              Enter Text to Generate:
            </h3>
            <textarea
              value={textToSpeak}
              onChange={(e) => setTextToSpeak(e.target.value)}
              placeholder="Enter the text you want the cloned voice to speak..."
              rows="5"
              style={{
                width: '100%',
                padding: '12px',
                border: '2px solid #ddd',
                borderRadius: '10px',
                fontSize: '1rem',
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </div>

          {/* Clone Button */}
          <button
            onClick={handleCloneVoice}
            disabled={isCloning || !selectedSample || !textToSpeak.trim()}
            style={{
              width: '100%',
              padding: '15px',
              fontSize: '1.1rem',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '10px',
              background: (isCloning || !selectedSample || !textToSpeak.trim())
                ? '#ccc'
                : 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)',
              color: 'white',
              cursor: (isCloning || !selectedSample || !textToSpeak.trim())
                ? 'not-allowed'
                : 'pointer',
              transition: 'all 0.3s'
            }}
          >
            {isCloning ? '⏳ Cloning Voice...' : '🎤 Clone Voice Now!'}
          </button>

          {/* Audio Player */}
          {clonedAudio && (
            <div style={{
              marginTop: '20px',
              padding: '20px',
              background: '#e8f5e9',
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <h3 style={{ margin: '0 0 15px 0', color: '#2e7d32' }}>
                ✅ Cloned Voice Ready!
              </h3>
              <audio
                ref={audioRef}
                controls
                src={clonedAudio}
                style={{
                  width: '100%',
                  marginBottom: '10px'
                }}
              />
              <a
                href={clonedAudio}
                download={`cloned_voice_${Date.now()}.wav`}
                style={{
                  display: 'inline-block',
                  padding: '10px 20px',
                  background: '#1976d2',
                  color: 'white',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: 'bold'
                }}
              >
                📥 Download Audio
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div style={{
        marginTop: '30px',
        background: 'white',
        borderRadius: '15px',
        padding: '25px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ margin: '0 0 15px 0', color: '#667eea' }}>
          📖 How to Use Voice Cloning
        </h2>
        <ol style={{ lineHeight: '1.8', fontSize: '1rem' }}>
          <li><strong>Upload:</strong> Select an audio or video file containing the voice you want to clone (at least 5 seconds recommended)</li>
          <li><strong>Analyze:</strong> Click "Upload & Analyze Voice" to extract voice characteristics</li>
          <li><strong>Select:</strong> Choose your uploaded voice sample from the list</li>
          <li><strong>Generate:</strong> Enter any text and click "Clone Voice Now!"</li>
          <li><strong>Listen:</strong> The AI will generate speech in the uploaded voice!</li>
        </ol>
        <div style={{
          marginTop: '15px',
          padding: '15px',
          background: '#fff3cd',
          borderRadius: '10px'
        }}>
          <p style={{ margin: '0', color: '#856404' }}>
            <strong>💡 Tips:</strong> For best results, use clear audio with minimal background noise. 
            The voice sample should be at least 5-10 seconds long with natural speech.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoiceUploadCloning;

