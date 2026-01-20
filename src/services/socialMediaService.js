// Social Media API Configuration
const socialMediaConfig = {
  facebook: {
    appId: process.env.REACT_APP_FACEBOOK_APP_ID,
    appSecret: process.env.REACT_APP_FACEBOOK_APP_SECRET,
    scope: 'public_profile,email,publish_to_groups,pages_manage_posts,publish_pages'
  },
  instagram: {
    clientId: process.env.REACT_APP_INSTAGRAM_CLIENT_ID,
    clientSecret: process.env.REACT_APP_INSTAGRAM_CLIENT_SECRET,
    scope: 'basic,publish_media,pages_show_list'
  },
  twitter: {
    apiKey: process.env.REACT_APP_TWITTER_API_KEY,
    apiSecret: process.env.REACT_APP_TWITTER_API_SECRET,
    scope: 'tweet.write,users.read,offline.access'
  },
  linkedin: {
    clientId: process.env.REACT_APP_LINKEDIN_CLIENT_ID,
    clientSecret: process.env.REACT_APP_LINKEDIN_CLIENT_SECRET,
    scope: 'r_liteprofile w_member_social'
  }
};

class SocialMediaService {
  constructor() {
    this.authTokens = {};
    this.connectedPlatforms = new Set();
    this.scheduledPosts = [];
    this.contentCache = new Map();
  }

  // Platform connection methods
  async connectPlatform(platform) {
    try {
      const config = socialMediaConfig[platform.toLowerCase()];
      if (!config) throw new Error(`Unsupported platform: ${platform}`);

      // Implement OAuth flow for each platform
      const token = await this.handleOAuth(platform, config);
      this.authTokens[platform] = token;
      this.connectedPlatforms.add(platform);
      
      return true;
    } catch (error) {
      console.error(`Failed to connect to ${platform}:`, error);
      throw error;
    }
  }

  getConnectedPlatforms() {
    return Array.from(this.connectedPlatforms);
  }

  // Content optimization and analysis
  async analyzeContent(content, platform) {
    try {
      // Use Kaggle dataset for content analysis
      const response = await fetch('https://api.kaggle.com/api/v1/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_KAGGLE_API_KEY}`
        },
        body: JSON.stringify({ content, platform })
      });

      return await response.json();
    } catch (error) {
      console.error('Content analysis failed:', error);
      throw error;
    }
  }

  async generateHashtags(content, platform) {
    try {
      // Use Kaggle dataset for hashtag suggestions
      const response = await fetch('https://api.kaggle.com/api/v1/hashtags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_KAGGLE_API_KEY}`
        },
        body: JSON.stringify({ content, platform })
      });

      return await response.json();
    } catch (error) {
      console.error('Hashtag generation failed:', error);
      throw error;
    }
  }

  // Post scheduling and management
  async schedulePostToMultiplePlatforms(content, platforms, image, scheduledTime, hashtags) {
    const results = {};
    
    for (const platform of platforms) {
      try {
        const postId = await this.schedulePost(platform, content, image, scheduledTime, hashtags);
        results[platform] = { success: true, postId };
      } catch (error) {
        results[platform] = { success: false, error: error.message };
      }
    }

    return results;
  }

  async schedulePost(platform, content, image, scheduledTime, hashtags) {
    if (!this.authTokens[platform]) {
      throw new Error(`Not authenticated with ${platform}`);
    }

    const post = {
      id: Date.now().toString(),
      platform,
      content,
      image,
      scheduledTime,
      hashtags,
      status: 'scheduled'
    };

    this.scheduledPosts.push(post);
    
    // Platform-specific scheduling logic
    switch (platform.toLowerCase()) {
      case 'facebook':
        return this.scheduleFacebookPost(post);
      case 'twitter':
        return this.scheduleTwitterPost(post);
      case 'instagram':
        return this.scheduleInstagramPost(post);
      case 'linkedin':
        return this.scheduleLinkedInPost(post);
      default:
        throw new Error(`Unsupported platform: ${platform}`);
    }
  }

  // Platform-specific posting methods
  async scheduleFacebookPost(post) {
    const formData = new FormData();
    formData.append('message', `${post.content}\n\n${post.hashtags.join(' ')}`);
    formData.append('scheduled_publish_time', Math.floor(new Date(post.scheduledTime).getTime() / 1000));
    
    if (post.image) {
      formData.append('source', post.image);
    }

    const response = await fetch(
      `https://graph.facebook.com/v12.0/me/photos?access_token=${this.authTokens.facebook}`,
      {
        method: 'POST',
        body: formData
      }
    );

    return await response.json();
  }

  async scheduleTwitterPost(post) {
    // Twitter API v2 endpoint for scheduled tweets
    const endpoint = 'https://api.twitter.com/2/tweets';
    const data = {
      text: `${post.content}\n\n${post.hashtags.join(' ')}`,
      media: post.image ? { media_ids: [await this.uploadTwitterMedia(post.image)] } : undefined,
      scheduled_time: new Date(post.scheduledTime).toISOString()
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authTokens.twitter}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  }

  async scheduleInstagramPost(post) {
    // First upload the image to get the media ID
    const mediaId = await this.uploadInstagramMedia(post.image);
    
    // Then schedule the post with the media ID
    const endpoint = `https://graph.facebook.com/v12.0/me/media_publish`;
    const data = {
      media_id: mediaId,
      caption: `${post.content}\n\n${post.hashtags.join(' ')}`,
      scheduled_publish_time: Math.floor(new Date(post.scheduledTime).getTime() / 1000)
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authTokens.instagram}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  }

  async scheduleLinkedInPost(post) {
    const endpoint = 'https://api.linkedin.com/v2/ugcPosts';
    const data = {
      author: `urn:li:person:${this.linkedInUserId}`,
      lifecycleState: 'SCHEDULED',
      scheduledTime: new Date(post.scheduledTime).getTime(),
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: {
            text: `${post.content}\n\n${post.hashtags.join(' ')}`
          },
          shareMediaCategory: post.image ? 'IMAGE' : 'NONE',
          media: post.image ? [
            {
              status: 'READY',
              description: {
                text: 'Post image'
              },
              media: await this.uploadLinkedInMedia(post.image)
            }
          ] : undefined
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authTokens.linkedin}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    return await response.json();
  }

  // Media upload helpers
  async uploadTwitterMedia(image) {
    const endpoint = 'https://upload.twitter.com/1.1/media/upload.json';
    const formData = new FormData();
    formData.append('media', image);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authTokens.twitter}`
      },
      body: formData
    });

    const data = await response.json();
    return data.media_id_string;
  }

  async uploadInstagramMedia(image) {
    const endpoint = 'https://graph.facebook.com/v12.0/me/media';
    const formData = new FormData();
    formData.append('image_url', image);
    formData.append('access_token', this.authTokens.instagram);

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    return data.id;
  }

  async uploadLinkedInMedia(image) {
    // LinkedIn requires a two-step process: register upload & upload binary
    const registerEndpoint = 'https://api.linkedin.com/v2/assets?action=registerUpload';
    const register = await fetch(registerEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authTokens.linkedin}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        registerUploadRequest: {
          recipes: ['urn:li:digitalmediaRecipe:feedshare-image'],
          owner: `urn:li:person:${this.linkedInUserId}`,
          serviceRelationships: [{
            relationshipType: 'OWNER',
            identifier: 'urn:li:userGeneratedContent'
          }]
        }
      })
    });

    const { value: { uploadMechanism, asset } } = await register.json();
    
    // Upload the image
    const uploadResponse = await fetch(uploadMechanism['com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest'].uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authTokens.linkedin}`,
        'Content-Type': 'image/jpeg'
      },
      body: image
    });

    return asset;
  }
}

export const socialMediaService = new SocialMediaService(); 