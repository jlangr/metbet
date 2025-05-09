import {createPrompt} from './cax-prompt.mjs'
import {sendPrompt} from './openai-prompt.mjs'
import {CodeResponseSplitter} from './code-response-splitter.mjs'

export const requestCodeCompletion = async (promptText, examples) => {
  const prompt = createPrompt(promptText, examples)
  const input = prompt.messages().map(m => m.text).join('\n\n')
  const response = await sendPrompt(input)
  return CodeResponseSplitter().split(response.body)
}
