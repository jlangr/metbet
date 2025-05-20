export const createExampleList = (examples = []) => ({
  isEmpty: () => examples.length === 0,
  toPromptText: () => examples.map(e => e.toPromptText()).join('\n\n')
})
