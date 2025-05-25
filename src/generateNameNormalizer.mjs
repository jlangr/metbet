import {createExampleList} from './request/prompt/example-list.mjs'
import {createExample} from './request/prompt/example.mjs'
import {requestCodeCompletion, requestProdCodeCompletionOnly} from './request/request-code-completion.mjs'
import {writeAllToDir} from './js/files.mjs'

const main = async () => {
  const promptText = `Build a name-normalizer function, with the general idea of transforming a person\'s name from First Middle Last format to "Last, First M."`

  const examples = createExampleList([
    createExample(1, 'Mononym', 'Plato -> Plato'),
    createExample(2, 'Duonym', 'Clarence Ellis -> Ellis, Clarence'),
    createExample(3, 'Trims spaces', '" \n\n  Alan  \n\t\r\v\fMathison  Turing  " -> Turing, Alan M.'),
    createExample(4, 'Initializes middle name', 'Donald Ervin Knuth -> Knuth, Donald E.'),
    createExample(5, 'Initializes multiple middle names', 'Grace Brewster Murray Hopper -> Hopper, Grace B. M.'),
  ])

  // console.log('requesting test + code 1')
  // const testAndProdCompletion = await requestCodeCompletion(promptText, examples)
  // await writeAllToDir(testAndProdCompletion.testFiles, '../scratch/nameNormalizer/1')
  // await writeAllToDir(testAndProdCompletion.prodFiles, `../scratch/nameNormalizer/1`)

  for (let i = 2; i <= 10; i++) {
    console.log(`requesting prod code ${i}`)
    const prodCompletion = await requestProdCodeCompletionOnly(promptText, examples)
    await writeAllToDir(prodCompletion.prodFiles, `../scratch/nameNormalizer/${i}`)
  }
}

await main()
