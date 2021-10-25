export function parseChunks(chunks: TemplateStringsArray): Template {
  return chunks.map(parseChunk).reduce((tmpl, chunkTmpl, index) => [...tmpl, index - 1, ...chunkTmpl])
}

export function parseChunk(chunk: string, chunkIndex: number): Template {
  const chunkTmpl: (Template.Chunk | Template.Group)[] = []

  let lastIndex = 0

  const re = /\{(.*?)\}/g
  let res: RegExpExecArray
  while (res = re.exec(chunk)) {
    chunkTmpl.push(chunk.slice(lastIndex, res.index))
    lastIndex = res.index + res[0].length

    chunkTmpl.push(parseGroup(res[1], chunkIndex))
  }

  chunkTmpl.push(chunk.slice(lastIndex))

  return chunkTmpl
}

function parseGroup(group: string, chunkIndex: number): Template.Group {
  const indexMatch = /^\$(\d)+;(.*)$/.exec(group)
  const argIndex = (indexMatch == null ? chunkIndex : Number(indexMatch[1])) - 1

  const split = (indexMatch == null ? group : indexMatch[2]).split(';')

  const assocMatches = split.map(s => /^(zero|one|two|few|many|other):(.*)$/.exec(s))

  if (assocMatches.every(match => match == null)) {
    return {
      argIndex,
      orderedResults: split,
    }
  }

  if (assocMatches.some(match => match == null)) {
    throw new Error('Ordered and associative syntaxes cannot be mixed')
  }

  return {
    argIndex,
    associativeResults: Object.fromEntries(assocMatches.map(match => match.slice(1))),
  }
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
