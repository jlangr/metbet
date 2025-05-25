import path from 'node:path'
import fs from 'node:fs/promises'

const writeFileToDir = async (filename, content, targetDir) => {
  const targetPath = path.join(targetDir, path.basename(filename))
  await fs.mkdir(targetDir, {recursive: true})
  await fs.writeFile(targetPath, content, 'utf8')
  return targetPath
}

export const writeAllToDir = async (files, targetDir) =>
  await Promise.all(
    files.map(({content, name}) =>
      writeFileToDir(name, content, targetDir)))
