import { PromptMessageType } from './promptMessageType.mjs'
import { PromptMessage } from './promptMessage.mjs'

export const ASSISTANT_GUIDELINES = `You're a Java programming assistant. When asked to generate solution code,
include only code. Don't include any explanation. Don't include comments in any code.`
export const CODE_STYLE = `- When possible, prefer functional solutions, with functional methods and immutable classes. Avoid side effects.
- Extract implementation specifics to separate cohesive methods.
- Extract conditionals to separate predicate methods.
- Minimize use of temporary variables. Make calls to methods instead.`
export const LANGUAGE_SPECIFIC_CODE_STYLE = `- Within chained calls using the streams interface, extract lambda bodies with implementation details to separate methods.
- Create instance-side methods by default. Do not use static methods unless appropriate or otherwise asked.
- In tests, do not start the name of the test method with the word "test".`

const PROMPT_OVERVIEW = `Generate JUnit test class(es) and production Java code for the solution.
In output, begin each code listing with a header in either the form:
/* test class TestFileName.java */
or:
/* prod class ProdFileName.java */
End each code listing with a footer, either:
/* end test class */
or:
/* end prod class */.
Substitute the real file name for TestFileName and ProdFileName.`
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
