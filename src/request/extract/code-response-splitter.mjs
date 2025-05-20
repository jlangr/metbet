import { FileType } from './file-type.mjs'
import { createSourceFile } from './source-file.mjs'
import { createFiles } from './files.mjs'

export const CodeResponseSplitter = () => {
  const split = response => {
    const pattern = /\/\*\s*(test|prod)\s+module\s+(.+?)\s*\*\/\s*([\s\S]*?)\/\*\s*end\s+\1\s+module\s*\*\//gi

    const prodFiles = []
    const testFiles = []

    let match
    while ((match = pattern.exec(response)) !== null) {
      const [, type, name, content] = match
      const fileType = type.toUpperCase() === 'TEST' ? FileType.TEST : FileType.PROD
      const file = createSourceFile(fileType, content.trim(), name.trim())
      if (fileType === FileType.TEST) testFiles.push(file)
      else prodFiles.push(file)
    }

    return createFiles(prodFiles, testFiles)
  }

  return { split }
}
