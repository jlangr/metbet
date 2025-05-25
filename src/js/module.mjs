import {module} from "./modules.mjs"

export class Module {
  constructor(index) {
    this.prodModuleFilename = `generated/nameNormalizer/source.${index + 1}.mjs`
  }

  async load() {
    this.mod = await import(module(this.prodModuleFilename))
  }

  get firstExportedFunction() {
    const exported = Object.entries(this.mod).find(([_, val]) => typeof val === 'function')
    return exported?.[1]
  }

  getFunctionByName(name) {
    const fn = this.mod?.[name]
    if (typeof fn !== 'function') throw new Error(`'${name}' not found in ${this.prodModuleFilename}`)
    return fn
  }
}
