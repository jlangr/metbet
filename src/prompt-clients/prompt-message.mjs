export class PromptMessage {
  constructor(type, text) {
    this.type = type
    this.text = text
  }

  equals(other) {
    return this.type === other.type && this.text === other.text
  }
}
