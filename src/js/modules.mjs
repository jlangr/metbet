import path from 'node:path'
import {fileURLToPath, pathToFileURL} from 'node:url'

const projectRoot = path.resolve( path.dirname(fileURLToPath(import.meta.url)), '../../')

export const module = (filename =>
  pathToFileURL(path.join(projectRoot, filename)))
