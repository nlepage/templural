export type Token = (
  [Token.Type.String, String] |
  [Token.Type.Integer, Number] |
  Token.Type.LCurly |
  Token.Type.RCurly |
  Token.Type.Semicolon |
  Token.Type.Dollar |
  Token.Type.Colon
)

export namespace Token {
  export enum Type {
    String = 'String',
    Integer = 'Integer',
    LCurly = '{',
    RCurly = '}',
    Semicolon = ';',
    Dollar = '$',
    Colon = ':',
  }

  export function string(s: String): [Type.String, String] {
    return [Type.String, s]
  }

  export function integer(n: Number): [Type.Integer, Number] {
    return [Type.Integer, n]
  }
}

export function lex(source: String): Token[] {
  return [...new Lexer(source)]
}

class Lexer implements IterableIterator<Token> {
  source: String

  pos = 0

  constructor(source: String) {
    this.source = source
  }

  next(): IteratorResult<Token> {
    switch (this.ch) {
    case undefined:
      return { done: true, value: null }
    default:
      return this.readString()
    }
  }

  readString(): IteratorResult<Token> {
    const { pos } = this

    do {
      this.nextPos()
    } while(this.ch !== undefined)

    return {
      value: Token.string(this.source.slice(pos, this.pos))
    }
  }

  nextPos() {
    this.pos++
  }

  get ch() {
    return this.source[this.pos]
  }

  [Symbol.iterator]() {
    return this
  }
}
