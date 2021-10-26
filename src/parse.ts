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

  readGroup(): Template.Group | Template.Chunk {
    const { pos } = this

    this.nextPos()

    const argIndex = this.readArgIndex()

    const orderedResults: string[] = []
    const associativeResults: { [key in Intl.LDMLPluralRule]?: string } = {}

    while (true) {
      const category = this.readCategory()
      const result = this.readResult()

      if (category == null) {
        orderedResults.push(result)
      } else {
        associativeResults[category] = result
      }

      if (this.token === undefined) return this.readChunk(pos)

      if (this.token === Token.Type.RCurly) break

      this.nextPos()
    }

    this.nextPos()

    if (Object.keys(associativeResults).length !== 0) {
      if (orderedResults.length !== 0) throw SyntaxError('Ordered and associative syntaxes cannot be mixed')

      return { argIndex, associativeResults }
    }

    return { argIndex, orderedResults }
  }

  readArgIndex() {
    if (!Token.isInteger(this.token) || this.nextToken !== Token.Type.Dollar) return this.defaultArgIndex

    const argIndex = Number(this.token[1]) - 1
    this.nextPos()
    this.nextPos()
    return argIndex
  }

  readCategory() {
    if (!Token.isString(this.token) || !isLDMLPluralRule(this.token[1]) || this.nextToken !== Token.Type.Colon) return null
    const category = this.token[1]
    this.nextPos()
    this.nextPos()
    return category
  }

  readResult() {
    const { pos } = this

    while (this.token !== undefined && this.token !== Token.Type.RCurly && this.token !== Token.Type.SColon) {
      this.nextPos()
    }

    return this.tokens
      .slice(pos, this.pos)
      .map(token => Token.isString(token) || Token.isInteger(token) ? token[1] : token)
      .join('')
  }

  readChunk(pos = this.pos): Template.Chunk {
    do {
      this.nextPos()
    } while (this.token !== Token.Type.LCurly && this.token != null)

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
