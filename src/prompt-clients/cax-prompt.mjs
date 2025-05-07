import { PromptMessageType } from './prompt-message-type.mjs'
import { PromptMessage } from './prompt-message.mjs'

export const ASSISTANT_GUIDELINES = `You're a JavaScript programming assistant. When asked to generate solution code,
include only code. Don't include any explanation. Don't include comments in any code.`
export const CODE_STYLE = `- Extract implementation specifics to separate cohesive functions.
- Extract conditionals to separate predicate methods.
- Minimize use of temporary variables. Make calls to functions instead.
- Do not generate comments. Create readable code instead.`
export const LANGUAGE_SPECIFIC_CODE_STYLE = `- In function pipelines, do not create inline functions. Extract lambda bodies with implementation details to named separate functions
- Do not use semicolons to terminate statements
- Generate ES2024+ code
- Always use import, not require
- Generate const arrow functions
- Group related tests with 'describe' functions
- Use 'it' and not 'test' to declare tests
`

const PROMPT_OVERVIEW = `Generate jest test class(es) and production Java code for the solution.
In output, begin each code listing with a header in either the form:
/* test module file-name.test.mjs */
or:
/* prod class file-name.mjs */
End each code listing with a footer, either:
/* end test module */
or:
/* end prod module */.
Substitute the real base file name for 'file-name'.`
const PROMPT_HEADER = 'Generate code for this:'
const EXAMPLES_HEADER = 'Examples:'

export const createPrompt = (promptText, exampleList) => {
  const formattedPrompt = () => [
    '',
    PROMPT_OVERVIEW,
    '',
    PROMPT_HEADER,
    promptText,
    '',
    EXAMPLES_HEADER,
    exampleList.isEmpty() ? '' : '',
    exampleList.toPromptText()
  ].join('\n')

  return {
    messages: () => [
      new PromptMessage(PromptMessageType.SYSTEM, ASSISTANT_GUIDELINES),
      new PromptMessage(PromptMessageType.SYSTEM, CODE_STYLE),
      new PromptMessage(PromptMessageType.SYSTEM, LANGUAGE_SPECIFIC_CODE_STYLE),
      new PromptMessage(PromptMessageType.USER, formattedPrompt())
    ]
  }
}
