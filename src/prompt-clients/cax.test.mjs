import {createPrompt} from "./cax-prompt.mjs";
import {createExample} from "./example.mjs";
import {createExampleList} from "./example-list.mjs";
import {sendPrompt} from "./openai-prompt.mjs";
import {CodeResponseSplitter} from "./code-response-splitter.mjs";

it('prompts fer real', async () => {
  const prompt = createPrompt(
    'fizzbuzz digits only not sequence', createExampleList([
      createExample('1', 'divisible by 3', 'fizzbuzzDigit(6) -> Fizz\nfizzBuzzDigit(9) -> Fizz'),
      createExample('2', 'divisible by 5', 'fizzBuzzDigit(5) -> Fizz\nfizzBuzzDigit(10) -> Buzz'),
      createExample('3', 'divisible by 3 and 5', 'fizzBuzzDigit(15) -> FizzBuzz'),
      createExample('4', 'otherwise returns input', 'fizzBuzzDigit(4) -> 4')
    ]))
  const promptText = prompt.messages().map(message => message.text).join('\n')

  const response = await sendPrompt(promptText)
  console.log(response)

  const files = CodeResponseSplitter().split(response.body)
  console.log(files)
}, 20000)
