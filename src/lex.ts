export type Token = (
  [Token.Type.String, string] |
  [Token.Type.Integer, number] |
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

  export function string(s: string): [Type.String, string] {
    return [Type.String, s]
  }

  export function isString(token: Token): token is [Type.String, string] {
    return Array.isArray(token) && token[0] === Type.String
  }

  export function integer(n: number): [Type.Integer, number] {
    return [Type.Integer, n]
  }

  export function isInteger(token: Token): token is [Type.Integer, number] {
    return Array.isArray(token) && token[0] === Type.Integer
  }

  export function toString(token: Token): string {
    if (isString(token)) return token[1]
    if (isInteger(token)) return token[1].toString()
    return token
  }
}

export function lex(source: string): Token[] {
  return [...new Lexer(source)]
}

class Lexer implements IterableIterator<Token> {
  source: string

  pos = 0

  constructor(source: string) {
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
