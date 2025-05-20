import {jest} from '@jest/globals'
import {sendPrompt} from './openai-prompt.mjs'

global.fetch = jest.fn()

describe('promptOpenAI', () => {
  it('should fetch openai and parse the response with correct body', async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{message: {content: 'response body'}}]
      })
    })

    const response = await sendPrompt('input prompt')

    const calledWith = fetch.mock.calls[0][1]
    expect(fetch).toHaveBeenCalledWith(
      'https://api.openai.com/v1/chat/completions',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({
          'Content-Type': 'application/json',
          'Authorization': expect.stringContaining('Bearer ')
        })
      })
    )
    expect(JSON.parse(calledWith.body)).toEqual({
      model: 'gpt-4',
      messages: [{role: 'user', content: 'input prompt'}],
      temperature: 0
    })
    expect(response.body).toEqual('response body')
  })
})
