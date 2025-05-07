const createMessage = (content) => [{ role: 'user', content }]

const parseResponse = (response) =>
  ({
    body: response.choices[0].message.content
  })

const fetchOpenAI = async (body) => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  })

  // TODO test
  if (!res.ok) throw new Error(`OpenAI request failed with status ${res.status}`)

  return res.json()
}

export const sendPrompt = async (content) => {
  return parseResponse(await fetchOpenAI({
    model: 'gpt-4',
    messages: createMessage(content),
    temperature: 0
  }))
}
