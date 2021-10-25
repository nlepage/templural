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
    case undefined: return { done: true, value: null }
    case '{': return { value: this.readSpecialChar(Token.Type.LCurly) }
    case '}': return { value: this.readSpecialChar(Token.Type.RCurly) }
    case ';': return { value: this.readSpecialChar(Token.Type.SColon) }
    case '$': return { value: this.readSpecialChar(Token.Type.Dollar) }
    case ':': return { value: this.readSpecialChar(Token.Type.Colon) }
    default:
      return { value: this.readString() }
    }
  }

  readSpecialChar(type: Token.SpecialChar): Token {
    this.nextPos()
    return type
  }

  readString(): Token {
    const { pos } = this

    do {
      this.nextPos()
    } while(this.ch !== undefined)

    return Token.string(this.source.slice(pos, this.pos))
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
