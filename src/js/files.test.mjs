import fs from 'node:fs/promises'
import path from 'node:path'
import tmp from 'tmp'
import {writeAllToDir} from './files.mjs'

tmp.setGracefulCleanup()

describe('writeAllToDir (real FS)', () => {
  let tmpDir

  beforeEach(() => {
    tmpDir = tmp.dirSync({unsafeCleanup: true}).name
  })

  it('writes all files into the target directory', async () => {
    const files = [
      {name: 'a.txt', content: 'Alpha'},
      {name: 'b.txt', content: 'Beta'}
    ]

    const results = await writeAllToDir(files, tmpDir)

    for (let i = 0; i < files.length; i++) {
      const filePath = results[i]
      const expectedPath = path.join(tmpDir, path.basename(files[i].name))
      expect(filePath).toBe(expectedPath)

      const actual = await fs.readFile(filePath, 'utf8')
      expect(actual).toBe(files[i].content)
    }

    const writtenFiles = await fs.readdir(tmpDir)
    expect(writtenFiles.sort()).toEqual(['a.txt', 'b.txt'])
  })
})
