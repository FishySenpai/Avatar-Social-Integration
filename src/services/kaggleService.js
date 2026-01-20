import axios from 'axios';

class KaggleService {
  constructor() {
    this.apiKey = process.env.REACT_APP_KAGGLE_API_KEY;
    this.baseUrl = 'https://www.kaggle.com/api/v1';
    this.datasets = {
      avatars: 'professional-avatars',
      socialContent: 'social-media-content',
      hashtagTrends: 'hashtag-performance',
      engagementMetrics: 'social-engagement-metrics'
    };
  }

  // Initialize Kaggle API client
  initializeClient() {
    return axios.create({
      baseURL: this.baseUrl,
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      }
    });
  }

  // Avatar-related methods
  async getAvatarStyles(category) {
    try {
      const client = this.initializeClient();
      const response = await client.get(`/datasets/download/${this.datasets.avatars}`, {
        params: { category }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch avatar styles:', error);
      throw error;
    }
  }

  async getAvatarRecommendations(platform, style) {
    try {
      const client = this.initializeClient();
      const response = await client.get(`/datasets/download/${this.datasets.avatars}/recommendations`, {
        params: { platform, style }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get avatar recommendations:', error);
      throw error;
    }
  }

  // Content optimization methods
  async analyzeContent(content, platform) {
    try {
      const client = this.initializeClient();
      const response = await client.post(`/datasets/download/${this.datasets.socialContent}/analyze`, {
        content,
        platform
      });
      return response.data;
    } catch (error) {
      console.error('Content analysis failed:', error);
      throw error;
    }
  }

  async optimizeContent(content, platform, style) {
    try {
      const client = this.initializeClient();
      const response = await client.post(`/datasets/download/${this.datasets.socialContent}/optimize`, {
        content,
        platform,
        style
      });
      return response.data;
    } catch (error) {
      console.error('Content optimization failed:', error);
      throw error;
    }
  }

  // Hashtag generation and analysis
  async generateHashtags(content, platform) {
    try {
      const client = this.initializeClient();
      const response = await client.post(`/datasets/download/${this.datasets.hashtagTrends}/generate`, {
        content,
        platform
      });
      return response.data;
    } catch (error) {
      console.error('Hashtag generation failed:', error);
      throw error;
    }
  }

  async analyzeHashtagPerformance(hashtags, platform) {
    try {
      const client = this.initializeClient();
      const response = await client.post(`/datasets/download/${this.datasets.hashtagTrends}/analyze`, {
        hashtags,
        platform
      });
      return response.data;
    } catch (error) {
      console.error('Hashtag analysis failed:', error);
      throw error;
    }
  }

  // Engagement prediction and optimization
  async predictEngagement(content, platform, timing) {
    try {
      const client = this.initializeClient();
      const response = await client.post(`/datasets/download/${this.datasets.engagementMetrics}/predict`, {
        content,
        platform,
        timing
      });
      return response.data;
    } catch (error) {
      console.error('Engagement prediction failed:', error);
      throw error;
    }
  }

  async getOptimalPostingTimes(platform, contentType) {
    try {
      const client = this.initializeClient();
      const response = await client.get(`/datasets/download/${this.datasets.engagementMetrics}/optimal-times`, {
        params: { platform, contentType }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get optimal posting times:', error);
      throw error;
    }
  }

  // Content performance analysis
  async analyzePerformanceHistory(platform, timeRange) {
    try {
      const client = this.initializeClient();
      const response = await client.get(`/datasets/download/${this.datasets.engagementMetrics}/history`, {
        params: { platform, timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Performance history analysis failed:', error);
      throw error;
    }
  }

  async getContentSuggestions(platform, style, audience) {
    try {
      const client = this.initializeClient();
      const response = await client.get(`/datasets/download/${this.datasets.socialContent}/suggestions`, {
        params: { platform, style, audience }
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get content suggestions:', error);
      throw error;
    }
  }
}

export const kaggleService = new KaggleService(); 