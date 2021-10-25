export type Token = (
  [Token.Type.String, String] |
  [Token.Type.Integer, Number] |
  Token.SpecialChar
)

export namespace Token {
  export enum Type {
    String = 'String',
    Integer = 'Integer',
    LCurly = '{',
    RCurly = '}',
    SColon = ';',
    Dollar = '$',
    Colon = ':',
  }

  export type SpecialChar = (
    Token.Type.LCurly |
    Token.Type.RCurly |
    Token.Type.SColon |
    Token.Type.Dollar |
    Token.Type.Colon
  )

  export function isSpecialChar(char: string): char is SpecialChar {
    return char === Token.Type.LCurly || char === Token.Type.RCurly || char === Token.Type.SColon || char === Token.Type.Dollar || char === Token.Type.Colon
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
    if (this.ch === undefined) return { done: true, value: null }

    if (Token.isSpecialChar(this.ch)) {
      const value = this.ch
      this.nextPos()
      return { value }
    }

    if (this.ch >= '1' && this.ch <= '9') return { value: this.readInteger() }

    return { value: this.readString() }
  }

  readInteger(): Token {
    const { pos } = this

    do {
      this.nextPos()
    } while (this.ch !== undefined && this.ch >= '0' && this.ch <= '9')

    if (!Token.isSpecialChar(this.ch)) return this.readString(pos)

    return Token.integer(Number(this.source.slice(pos, this.pos)))
  }

  readString(pos = this.pos): Token {
    do {
      if (this.ch === '\\') this.nextPos()
      this.nextPos()
    } while (this.ch !== undefined && !Token.isSpecialChar(this.ch))

    return Token.string(this.source.slice(pos, this.pos).replace(/\\(.)/g, '$1'))
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
