import {
  createPrompt,
  ASSISTANT_GUIDELINES,
  CODE_STYLE,
  LANGUAGE_SPECIFIC_PROD_CODE_STYLE, LANGUAGE_SPECIFIC_TEST_CODE_STYLE
} from './cax-prompt.mjs'
import { PromptMessageType } from './prompt-message-type.mjs'
import { PromptMessage } from './prompt-message.mjs'
import { createExampleList } from './example-list.mjs'
import { createExample } from './example.mjs'

describe('prompt', () => {
  it('returns list of prompt messages', () => {
    const example = createExample('1', 'name', 'example text')
    const exampleList = createExampleList([example])
    const prompt = createPrompt('text', exampleList)

    const result = prompt.messages()

    expect(result[0]).toEqual(new PromptMessage(PromptMessageType.SYSTEM, ASSISTANT_GUIDELINES))
    expect(result[1]).toEqual(new PromptMessage(PromptMessageType.SYSTEM, CODE_STYLE))
    expect(result[2]).toEqual(new PromptMessage(PromptMessageType.SYSTEM, LANGUAGE_SPECIFIC_PROD_CODE_STYLE))
    expect(result[3]).toEqual(new PromptMessage(PromptMessageType.SYSTEM, LANGUAGE_SPECIFIC_TEST_CODE_STYLE))

    const userMessage = result[4]
    expect(userMessage.type).toEqual(PromptMessageType.USER)
    expect(userMessage.text).toContain(`text

Examples:

name: name
example text`)
  })
})
