import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const avatarContentService = {
  // Generate AI Image
  generateImage: async (prompt, background = 'studio', style = 'realistic') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/avatar/generate-image`, {
        prompt,
        background,
        style
      });
      return response.data;
    } catch (error) {
      console.error('Error generating image:', error);
      throw error;
    }
  },

  // Generate AI Video
  generateVideo: async (prompt, duration = '30s', style = 'realistic') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/avatar/generate-video`, {
        prompt,
        duration,
        style
      });
      return response.data;
    } catch (error) {
      console.error('Error generating video:', error);
      throw error;
    }
  },

  // Generate Storytelling Script
  generateScript: async (prompt, length = 'medium', tone = 'engaging') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/avatar/generate-script`, {
        prompt,
        length,
        tone
      });
      return response.data;
    } catch (error) {
      console.error('Error generating script:', error);
      throw error;
    }
  },

  // Generate Auto Captions
  generateCaptions: async (prompt, language = 'en', style = 'standard') => {
    try {
      const response = await axios.post(`${API_BASE_URL}/avatar/generate-captions`, {
        prompt,
        language,
        style
      });
      return response.data;
    } catch (error) {
      console.error('Error generating captions:', error);
      throw error;
    }
  },

  // Upload file
  uploadFile: async (file) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(`${API_BASE_URL}/avatar/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  // Get content library
  getContentLibrary: async (type = null, limit = 20, offset = 0) => {
    try {
      const params = { limit, offset };
      if (type) params.type = type;
      
      const response = await axios.get(`${API_BASE_URL}/avatar/library`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching content library:', error);
      throw error;
    }
  },

  // Delete content
  deleteContent: async (contentId) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/avatar/content/${contentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/avatar/health`);
      return response.data;
    } catch (error) {
      console.error('Error checking API health:', error);
      throw error;
    }
  }
};

export default avatarContentService;




