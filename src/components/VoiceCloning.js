import React, { useState } from 'react';
import axios from 'axios';
import './VoiceCloning.css';

const VoiceCloning = () => {
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

    try {
      const formData = new FormData();
      formData.append('text', text);
      formData.append('audioFile', audioFile);

      const response = await axios.post('/api/voice/clone', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult({
        type: 'audio',
        filename: response.data.filename,
        outputPath: response.data.outputPath,
        message: response.data.message
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Voice cloning failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLipSync = async () => {
    if (!videoFile || !audioFile) {
      setError('Please provide both video and audio files');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append('videoFile', videoFile);
      formData.append('audioFile', audioFile);

      const response = await axios.post('/api/voice/lip-sync', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResult({
        type: 'video',
        filename: response.data.filename,
        outputPath: response.data.outputPath,
        message: response.data.message
      });
    } catch (err) {
      setError(err.response?.data?.error || 'Lip sync failed');
    } finally {
      setLoading(false);
    }
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
                <h4>Cloned Voice</h4>
                <audio controls>
                  <source src={`/outputs/${result.filename}`} type="audio/wav" />
                  Your browser does not support the audio element.
                </audio>
                <p><strong>File:</strong> {result.filename}</p>
              </div>
            )}

            {result.type === 'video' && (
              <div className="video-result">
                <h4>Lip-Synced Video</h4>
                <video controls width="100%" height="auto">
                  <source src={`/outputs/${result.filename}`} type="video/mp4" />
                  Your browser does not support the video element.
                </video>
                <p><strong>File:</strong> {result.filename}</p>
              </div>
            )}

            <div className="download-section">
              <a
                href={`/outputs/${result.filename}`}
                download={result.filename}
                className="btn btn-download"
              >
                Download {result.type === 'audio' ? 'Audio' : 'Video'}
              </a>
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

export default VoiceCloning;





