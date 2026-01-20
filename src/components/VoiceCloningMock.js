import React, { useState } from 'react';
import './VoiceCloning.css';

const VoiceCloningMock = () => {
  const [text, setText] = useState('');
  const [audioFile, setAudioFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleAudioFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  const handleVideoFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleVoiceClone = async () => {
    if (!text.trim() || !audioFile) {
      setError('Please provide both text and audio file');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate API call delay
    setTimeout(() => {
      setResult({
        type: 'audio',
        filename: 'demo_cloned_voice.wav',
        message: 'Voice cloned successfully (Demo Mode)'
      });
      setLoading(false);
    }, 2000);
  };

  const handleLipSync = async () => {
    if (!videoFile || !audioFile) {
      setError('Please provide both video and audio files');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    // Simulate API call delay
    setTimeout(() => {
      setResult({
        type: 'video',
        filename: 'demo_lip_synced.mp4',
        message: 'Lip sync completed successfully (Demo Mode)'
      });
      setLoading(false);
    }, 3000);
  };

  const resetForm = () => {
    setText('');
    setAudioFile(null);
    setVideoFile(null);
    setResult(null);
    setError(null);
  };

  return (
    <div className="voice-cloning-container">
      <div className="voice-cloning-header">
        <h1>Voice Cloning & Animation</h1>
        <p>Clone voices and sync lip movements with audio</p>
        <div style={{ 
          background: 'rgba(255,255,255,0.2)', 
          padding: '10px', 
          borderRadius: '8px', 
          marginTop: '10px',
          fontSize: '0.9rem'
        }}>
          <strong>Demo Mode:</strong> This is a demonstration interface. To enable full functionality, 
          run the backend server with: <code>npm run server</code>
        </div>
      </div>

      <div className="voice-cloning-content">
        <div className="input-section">
          <div className="form-group">
            <label htmlFor="text-input">Text to Convert</label>
            <textarea
              id="text-input"
              value={text}
              onChange={handleTextChange}
              placeholder="Enter the text you want to convert to speech..."
              rows={4}
              disabled={loading}
            />
          </div>

          <div className="file-inputs">
            <div className="form-group">
              <label htmlFor="audio-input">Reference Audio File</label>
              <input
                id="audio-input"
                type="file"
                accept="audio/*"
                onChange={handleAudioFileChange}
                disabled={loading}
              />
              <small>Upload a sample audio file to clone the voice</small>
            </div>

            <div className="form-group">
              <label htmlFor="video-input">Video File (for Lip Sync)</label>
              <input
                id="video-input"
                type="file"
                accept="video/*"
                onChange={handleVideoFileChange}
                disabled={loading}
              />
              <small>Upload a video file for lip synchronization</small>
            </div>
          </div>

          <div className="action-buttons">
            <button
              onClick={handleVoiceClone}
              disabled={loading || !text.trim() || !audioFile}
              className="btn btn-primary"
            >
              {loading ? 'Cloning Voice...' : 'Clone Voice'}
            </button>

            <button
              onClick={handleLipSync}
              disabled={loading || !videoFile || !audioFile}
              className="btn btn-secondary"
            >
              {loading ? 'Syncing...' : 'Lip Sync Video'}
            </button>

            <button
              onClick={resetForm}
              disabled={loading}
              className="btn btn-outline"
            >
              Reset
            </button>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}

        {result && (
          <div className="result-section">
            <h3>Result</h3>
            <p className="success-message">{result.message}</p>
            
            {result.type === 'audio' && (
              <div className="audio-result">
                <h4>Cloned Voice (Demo)</h4>
                <div style={{ 
                  padding: '20px', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  textAlign: 'center',
                  margin: '10px 0'
                }}>
                  <p>🎵 Audio would be generated here</p>
                  <p><strong>File:</strong> {result.filename}</p>
                </div>
              </div>
            )}

            {result.type === 'video' && (
              <div className="video-result">
                <h4>Lip-Synced Video (Demo)</h4>
                <div style={{ 
                  padding: '20px', 
                  background: '#f8f9fa', 
                  borderRadius: '8px',
                  textAlign: 'center',
                  margin: '10px 0'
                }}>
                  <p>🎬 Video would be generated here</p>
                  <p><strong>File:</strong> {result.filename}</p>
                </div>
              </div>
            )}

            <div className="download-section">
              <button className="btn btn-download" disabled>
                Download {result.type === 'audio' ? 'Audio' : 'Video'} (Demo)
              </button>
            </div>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>Processing your request...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceCloningMock;





