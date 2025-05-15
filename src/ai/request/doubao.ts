import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: '63cc5882-7936-4618-be31-8d961e3a8815',
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3',
});

export async function chatWithDoubao() {
  // Non-streaming:
  console.log('----- standard request -----')
  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: '你是人工智能助手' },
      { role: 'user', content: '常见的十字花科植物有哪些？' },
    ],
    model: 'ep-20250317081759-7tts4',
  });
  console.log(completion.choices[0]?.message?.content);

  // Streaming:
  console.log('----- streaming request -----')
  const stream = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: '你是人工智能助手' },
      { role: 'user', content: '常见的十字花科植物有哪些？' },
    ],
    model: 'ep-20250317081759-7tts4',
    stream: true,
  });
  for await (const part of stream) {
    process.stdout.write(part.choices[0]?.delta?.content || '');
  }
  process.stdout.write('\n');
}

