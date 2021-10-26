import { lex, Token } from "./lex"

export function parseChunks(chunks: TemplateStringsArray): Template {
  return chunks.map(parseChunk).reduce((tmpl, chunkTmpl, index) => [...tmpl, index - 1, ...chunkTmpl])
}

export function parseChunk(chunk: string, chunkIndex: number): Template {
  return [...new Parser(lex(chunk), chunkIndex - 1)]
}

class Parser implements IterableIterator<Template.Chunk | Template.Group> {
  tokens: Token[]

  defaultArgIndex: number

  pos = 0

  constructor(tokens: Token[], defaultArgIndex: number) {
    this.tokens = tokens
    this.defaultArgIndex = defaultArgIndex
  }

  next(): IteratorResult<Template.Chunk | Template.Group> {
    if (this.token === undefined) return { done: true, value: null }

    if (this.token === Token.Type.LCurly) return { value: this.readGroup() }

    return { value: this.readChunk() }
  }

  readGroup(): Template.Group {
    this.nextPos()

    let argIndex = this.defaultArgIndex

    if (Token.isInteger(this.token) && this.nextToken === Token.Type.Dollar) {
      argIndex = Number(this.token[1]) - 1
      this.nextPos()
      this.nextPos()
    }

    return Token.isString(this.token) && this.nextToken === Token.Type.Colon
      ? this.readAssociativeGroup(argIndex)
      : this.readOrderedGroup(argIndex)
  }

  readOrderedGroup(argIndex: number): Template.OrderedGroup {
    const orderedResults: string[] = []

    let result = ''
    do {
      if (this.token === Token.Type.SColon) {
        orderedResults.push(result)
        result = ''
      } else {
        result += Token.isString(this.token) || Token.isInteger(this.token)
          ? this.token[1]
          : this.token
      }

      this.nextPos()
    } while (this.token !== Token.Type.RCurly && this.token !== undefined)

    if (this.token === undefined) throw new SyntaxError('unexpected end of chunk')

    orderedResults.push(result)

    this.nextPos()

    return { argIndex, orderedResults }
  }

  readAssociativeGroup(argIndex: number): Template.AssociativeGroup {
    const associativeResults: { [key in Intl.LDMLPluralRule]?: string } = {}

    while (true) {
      const category = this.readCategory()

      let result = ''
      while (this.token !== Token.Type.SColon && this.token !== Token.Type.RCurly && this.token !== undefined) {
        result += Token.isString(this.token) || Token.isInteger(this.token)
          ? this.token[1]
          : this.token
        this.nextPos()
      }

      if (this.token === undefined) throw new SyntaxError('unexpected end of chunk')

      associativeResults[category] = result

      if (this.token === Token.Type.RCurly) break

      this.nextPos()
    }

    this.nextPos()

    return { argIndex, associativeResults }
  }

  readCategory() {
    const category = this.readCategoryName()

    if (this.token !== Token.Type.Colon) throw new SyntaxError(`expected colon, got "${Token.toString(this.token)}"`)
    this.nextPos()

    return category
  }

  readCategoryName() {
    if (!Token.isString(this.token) || !isLDMLPluralRule(this.token[1])) throw new SyntaxError(`expected category name, got "${Token.toString(this.token)}"`)
    const category = this.token[1]
    this.nextPos()
    return category
  }

  readChunk(): Template.Chunk {
    const { pos } = this

    do {
      this.nextPos()
    } while (this.token !== Token.Type.LCurly && this.token !== undefined)

    return this.tokens
      .slice(pos, this.pos)
      .map(token => Token.isString(token) || Token.isInteger(token) ? token[1] : token)
      .join('')
  }

  nextPos() {
    this.pos++
  }

  get token() {
    return this.tokens[this.pos]
  }

  get nextToken() {
    return this.tokens[this.pos + 1]
  }

  [Symbol.iterator](): IterableIterator<Template.Chunk | Template.Group> {
    return this
  }
}

function isLDMLPluralRule(s: string): s is Intl.LDMLPluralRule {
  return s === 'one' || s === 'other' || s === 'zero' || s === 'two' || s === 'few' || s === 'many'
}

type Template = readonly (Template.Chunk | Template.Group | Template.Arg)[]

namespace Template {
  export type Chunk = string

  export type Group = OrderedGroup | AssociativeGroup

  export function isGroup(item: Chunk | Group | Arg): item is Group {
    return typeof item === 'object'
  }

  export type OrderedGroup = {
    readonly argIndex: number
    readonly orderedResults: OrderedResults
  }

  export function isOrdredGroup(group: Group): group is OrderedGroup {
    return 'orderedResults' in group
  }

  export type OrderedResults = readonly string[]

  export type AssociativeGroup = {
    readonly argIndex: number
    readonly associativeResults: AssociativeResults
  }

  export type AssociativeResults = { readonly [key in Intl.LDMLPluralRule]?: string } 

  export type Arg = number
}

export { Template as ParsedTemplate }
