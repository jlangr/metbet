import {createPrompt} from './prompt/cax-prompt.mjs'
import {sendPrompt} from './llms/openai/openai-prompt.mjs'
import {CodeResponseSplitter} from './extract/code-response-splitter.mjs'

export const requestCodeCompletion = async (promptText, examples) => {
  const prompt = createPrompt(promptText, examples)
  const input = prompt.messages().map(m => m.text).join('\n\n')
  const response = await sendPrompt(input)
  return CodeResponseSplitter().split(response.body)
}
