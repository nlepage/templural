import { resolveCategoryOrders } from './categories'
import { CategoryFallback, defaultLocalesOptions, LocalesOptions } from './locales'

export const templural = forLocales()

export function forLocales(locales?: Locales, options?: LocalesOptions) {
  function templural(chunks: TemplateStringsArray, ...args: any[]): string {
    let resolver: Resolver

    const key = chunksToKey(chunks)
    if (resolversCache.has(key)) {
      resolver = resolversCache.get(key)
    } else {
      resolversCache.set(key, resolver = parseChunks(chunks))
    }

    return resolver(args)
  }

  function parseChunks(chunks: TemplateStringsArray): Resolver {
    const chunkResolvers = chunks.map(parseChunk)

    return (args: any[]) => chunkResolvers.reduce((prev, chunkResolver, i) => {
      let next = chunkResolver(args)
      if (i > 0) next = toString(args[i - 1]) + next
      return prev + next
    }, '')
  }

  function parseChunk(chunk: string, chunkIndex: number): Resolver {
    let subChunks: string[] = []
    let groupResolvers: Resolver[] = [undefined]

    let lastIndex = 0

    const re = /\{(.*?)\}/g
    let res: RegExpExecArray
    while (res = re.exec(chunk)) {
      subChunks.push(chunk.slice(lastIndex, res.index))
      lastIndex = res.index + res[0].length

      groupResolvers.push(parseGroup(res[1], chunkIndex))
    }

    subChunks.push(chunk.slice(lastIndex))

    return (args: any[]) => subChunks.reduce((prev, subChunk, i) => prev + groupResolvers[i](args) + subChunk)
  }

  function parseGroup(group: string, chunkIndex: number): Resolver {
    const indexMatch = /^\$(\d)+;(.*)$/.exec(group)
    const index = indexMatch == null ? chunkIndex : Number(indexMatch[1])

    const split = (indexMatch == null ? group : indexMatch[2]).split(';') // FIXME support escaping (split)

    const assocMatches = split.map(s => /^(zero|one|two|few|many|other):(.*)$/.exec(s))

    let categoryToResult: { [key in Intl.LDMLPluralRule]?: string }
    if (assocMatches.every(match => match == null)) {
      categoryToResult = Object.fromEntries(categoryOrders[split.length - 1].map((c, i) => [c, split[i]]))
    } else {
      if (assocMatches.some(match => match == null)) {
        throw new Error('Ordered and associative syntaxes cannot be mixed')
      }
      categoryToResult = Object.fromEntries(assocMatches.map(match => match.slice(1)))
    }

    for (const category of categories) {
      if (category in categoryToResult || !(category in categoryFallback)) continue
      categoryToResult[category] = categoryToResult[categoryFallback[category]]
    }

    return (args: any[]) => {
      const n = args[index - 1]

      // FIXME try converting to number ?
      if (typeof n !== 'number') return ''

      return categoryToResult[pluralRules.select(n)] ?? ''
    }
  }

  let pluralRules: Intl.PluralRules
  let categories: Intl.LDMLPluralRule[]
  let categoryOrders: Intl.LDMLPluralRule[][]
  let categoryFallback: CategoryFallback
  const resolversCache = new Map<string, Resolver>()

  templural.setLocales = function setLocales(locales?: Locales, options?: LocalesOptions) {
    pluralRules = new Intl.PluralRules(locales)

    const resolvedOptions = pluralRules.resolvedOptions()
    const optionsWDefault = Object.assign({}, options, defaultLocalesOptions[resolvedOptions.locale])

    categories = resolvedOptions.pluralCategories
    categoryOrders = resolveCategoryOrders(categories, optionsWDefault)
    categoryFallback = optionsWDefault.categoryFallback ?? {}

    resolversCache.clear()

    return templural
  }

  return templural.setLocales(locales, options)
}

export type Locales = string | string[]

export type { CategoryFallback, LocalesOptions }

function toString(v: any): string {
  return v == null ? '' : v.toString() // FIXME not sure
}

function chunksToKey(chunks: TemplateStringsArray) {
  return chunks.raw.reduce((acc, chunk, i) => `${acc}\${${i}}${chunk}`)
}

type Template = {
  chunks: readonly string[]
  groups: readonly Group[]
}

type Group = { [key in Intl.LDMLPluralRule]?: string }

type Resolver = (args: any[]) => string
