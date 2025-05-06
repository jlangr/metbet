export const createExample = (id, name, text) => ({
  id,
  name,
  text,
  toPromptText: () => `${name}: ${name}\n${text}`
})
