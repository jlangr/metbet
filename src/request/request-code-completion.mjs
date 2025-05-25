import {createPrompt} from './prompt/cax-prompt.mjs'
import {sendPrompt} from './llms/openai/openai-prompt.mjs'
import {CodeResponseSplitter} from './extract/code-response-splitter.mjs'

export const requestCodeCompletion = async (promptText, examples, prodCodeOnly=false) => {
  const prompt = createPrompt(promptText, examples, prodCodeOnly)
  const input = prompt.messages().map(m => m.text).join('\n\n')

  console.log(input)

  const response = await sendPrompt(input)
  console.log(response.body)
  return CodeResponseSplitter().split(response.body)
}

export const requestProdCodeCompletionOnly = async (promptText, examples) =>
  await requestCodeCompletion(promptText, examples, true)
