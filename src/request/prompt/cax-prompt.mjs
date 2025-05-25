import { PromptMessageType } from './prompt-message-type.mjs'
import { PromptMessage } from './prompt-message.mjs'

export const ASSISTANT_GUIDELINES = `You're a JavaScript programming assistant currently used for LLM research. When asked to generate solution code,
include only code. Don't include any explanation. Don't include comments in any code.
- DO NOT use any 3rd-party libraries (e.g. Ramda, Lodash)! Only use standard ES2024+ JavaScript. Assume no dependencies can be imported.
- If you ignore this, the code will break our research.`
export const CODE_STYLE = `- Extract implementation specifics to separate cohesive functions.
- Extract conditionals to separate predicate methods.
- Minimize use of temporary variables. Make calls to functions instead.
- Do not generate comments. Create readable code instead.`
export const LANGUAGE_SPECIFIC_PROD_CODE_STYLE = `- In function pipelines, do not create inline functions. Extract lambda bodies with implementation details to named separate functions
- Do not use semicolons to terminate statements
- Generate ES2024+ code
- Always use import, not require
- Generate const arrow functions
- Name source files using hyphens, not camel case
- Name all source files with an extension of .mjs
`
export const LANGUAGE_SPECIFIC_TEST_CODE_STYLE = `- Group related tests with 'describe' functions
- Use 'it' and not 'test' to declare tests
- Do not import the jest functions like 'it' and 'describe'
- Name test files usng the pattern target-module-name.test.mjs`

const PROD_ONLY_PROMPT_OVERVIEW = `Generate production Java code for the solution.
In output, begin each code listing with a header in the form:
/* prod module file-name.mjs */
End each code listing with a footer:
/* end prod module */.
Substitute the real base file name for 'file-name'.`
const PROMPT_OVERVIEW = `Generate jest test class(es) and production Java code for the solution.
In output, begin each code listing with a header in either the form:
/* test module file-name.test.mjs */
or:
/* prod module file-name.mjs */
End each code listing with a footer, either:
/* end test module */
or:
/* end prod module */.
Substitute the real base file name for 'file-name'.`
const PROMPT_HEADER = 'Generate code for this:'
const EXAMPLES_HEADER = 'Examples:'

export const createPrompt = (promptText, exampleList, prodCodeOnly) => {
  const formattedPrompt = () => [
    '',
    (prodCodeOnly ? PROD_ONLY_PROMPT_OVERVIEW : PROMPT_OVERVIEW),
    '',
    PROMPT_HEADER,
    promptText,
    '',
    EXAMPLES_HEADER,
    '',
    exampleList.toPromptText()
  ].join('\n')

  return {
    messages: () => [
      new PromptMessage(PromptMessageType.SYSTEM, ASSISTANT_GUIDELINES),
      new PromptMessage(PromptMessageType.SYSTEM, CODE_STYLE),
      new PromptMessage(PromptMessageType.SYSTEM, LANGUAGE_SPECIFIC_PROD_CODE_STYLE),
      (prodCodeOnly ? '' : new PromptMessage(PromptMessageType.SYSTEM, LANGUAGE_SPECIFIC_TEST_CODE_STYLE)),
      new PromptMessage(PromptMessageType.USER, formattedPrompt())
    ]
  }
}
