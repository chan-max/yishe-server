import axios from 'axios';

// 创建 axios 实例
const apiClient = axios.create({
  baseURL: 'https://api.gpt.ge/v1/chat/completions',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + 'sk-TWV3wtOUbVEuZdGu75F78170818849Fb89A48935338fD560'
  }
});



/**
 * 与 GPT API 进行对话
 * @param {string} message - 用户消息
 * @param {Object} options - 可选配置
 * @returns {Promise<Object>} API响应数据
 */

export async function chatWithGPT(message, options = {}) {
  // 默认配置
  const defaultConfig = {
    model: 'gpt-4o',
    max_tokens: 1688,
    temperature: 0.5,
    stream: false
  };

  // 合并默认配置和用户自定义配置
  const config = { ...defaultConfig, ...options };

  try {
    const response = await apiClient.post('', {
      model: config.model,
      messages: [{
        role: 'user',
        content: message
      }],
      max_tokens: config.max_tokens,
      temperature: config.temperature,
      stream: config.stream,
    });

    return response.data;
  } catch (error) {
    console.error('GPT API 调用失败:', error);
    throw error;
  }
}

