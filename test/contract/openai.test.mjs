import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

describe('OpenAI Chat Completions API (live)', () => {
  it('should return a valid completion for a simple prompt', async () => {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [ { role: 'user', content: 'Say yes in Czech' } ],
      temperature: 0,
    });

    expect(response).toHaveProperty('choices');
    expect(response.choices.length).toBeGreaterThan(0);

    const content = response.choices[0].message.content?.toLowerCase() ?? '';

    expect(content).toMatch(/ano/);
  }, 10000);
});