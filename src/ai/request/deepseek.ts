import axios from 'axios'

const DEEPSEEK_TOKEN = 'sk-fa28bf7d2ed24d4d8ba2f03b98feace9'

// 封装API请求（使用对象传递参数）
async function sendChatRequest({
  messages, 
  model = 'deepseek-chat', 
  maxTokens = 2048, 
  temperature = 1, 
  stop = null, 
  frequencyPenalty = 0, 
  presencePenalty = 0, 
  responseFormat = 'text', 
  stream = false, 
  tools = null,
  token
}) {
  const data = JSON.stringify({
    messages: messages,
    model: model,
    frequency_penalty: frequencyPenalty,
    max_tokens: maxTokens,
    presence_penalty: presencePenalty,
    response_format: { type: responseFormat },
    stop: stop,
    stream: stream,
    temperature: temperature,
    top_p: 1,
    tools: tools,
    tool_choice: "none",
    logprobs: false,
    top_logprobs: null
  });

  const config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.deepseek.com/chat/completions',
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json', 
      'Authorization': `Bearer ${token}`
    },
    data: data
  };

  try {
    const response = await axios(config);
    return response.data;  // 返回响应数据
  } catch (error) {
    console.error('请求出错:', error);
    throw error;  // 重新抛出错误
  }
}

// 用于封装并调用
export async function chatWithDeepSeek({
  system,
  user
}) {
  const messages = [
    { role: 'system', content: system },
    { role: 'user', content: user }
  ];

  const token = DEEPSEEK_TOKEN;  // 替换为你的 API Token

  try {
    const responseData = await sendChatRequest({
      messages: messages,
      model: 'deepseek-chat',
      maxTokens: 2048,
      temperature: 1,
      token: token
    });
    return responseData
  } catch (error) {
    console.error('聊天请求失败:', error);
   throw error
  }
}

/**
 * 解析用户输入的字段
*/
