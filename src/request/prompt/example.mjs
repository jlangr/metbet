export const createExample = (id, name, text) => {
  const formatPromptText = () => {
    if (!name || name.trim() === '') return text
    return `name: ${name}\n${text}`
  }

  return {
    id,
    name,
    text,
    isEnabled: () => true,
    toPromptText: formatPromptText
  }
}
