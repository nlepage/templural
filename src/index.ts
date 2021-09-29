import { CategoryOrders, resolveCategoryOrders } from './categories'
import { CategoryFallback, defaultLocalesOptions, LocalesOptions } from './locales'

export const templural = forLocales()

export function forLocales(locales?: Locales, options?: LocalesOptions) {
  function templural(chunks: TemplateStringsArray, ...args: readonly any[]): string {
    let template: Template

    const key = chunksToKey(chunks)
    if (templateCache.has(key)) {
      template = templateCache.get(key)
    } else {
      templateCache.set(key, template = parseChunks(chunks))
    }

    return resolve(template, args)
  }

  function parseChunks(chunks: TemplateStringsArray): Template {
    return chunks.map(parseChunk).reduce((tmpl, chunkTmpl, index) => [...tmpl, index - 1, ...chunkTmpl])
  }

  function parseChunk(chunk: string, chunkIndex: number): Template {
    const chunkTmpl: (Chunk | Group)[] = []

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

  function parseGroup(group: string, chunkIndex: number): Group {
    const indexMatch = /^\$(\d)+;(.*)$/.exec(group)
    const argIndex = (indexMatch == null ? chunkIndex : Number(indexMatch[1])) - 1

    const split = (indexMatch == null ? group : indexMatch[2]).split(';') // FIXME support escaping (split)

    const assocMatches = split.map(s => /^(zero|one|two|few|many|other):(.*)$/.exec(s))

    let categoryToResult: CategoryToResult
    if (assocMatches.every(match => match == null)) {
      categoryToResult = Object.fromEntries(categoryOrders[split.length - 1].map((c, i) => [c, split[i]]))
    } else {
      if (assocMatches.some(match => match == null)) {
        throw new Error('Ordered and associative syntaxes cannot be mixed')
      }
      categoryToResult = Object.fromEntries(assocMatches.map(match => match.slice(1)))
    }

    for (const category of categories) {
      if (category in categoryToResult) continue
      let fallback = category
      while (fallback in categoryFallback) {
        fallback = categoryFallback[fallback]
        if (fallback in categoryToResult) {
          categoryToResult = { ...categoryToResult, [category]: categoryToResult[fallback] }
          break
        }
      }
    }

    return {
      argIndex,
      categoryToResult,
    }
  }

  function resolve(template: Template, args: readonly any[]) {
    return template.map(item => {
      if (isChunk(item)) return item
      if (isArg(item)) return toString(args[item])
      if (!(item.argIndex in args)) return ''
      return item.categoryToResult[pluralRules.select(args[item.argIndex])] ?? ''
    }).join('')
  }

  let pluralRules: Intl.PluralRules
  let categories: readonly Intl.LDMLPluralRule[]
  let categoryOrders: CategoryOrders
  let categoryFallback: CategoryFallback
  const templateCache = new Map<string, Template>()

  templural.setLocales = function setLocales(locales?: Locales, options?: LocalesOptions) {
    pluralRules = new Intl.PluralRules(locales)

    const resolvedOptions = pluralRules.resolvedOptions()
    const optionsWDefault = Object.assign({}, defaultLocalesOptions[resolvedOptions.locale], options)

    categories = resolvedOptions.pluralCategories
    categoryOrders = resolveCategoryOrders(categories, optionsWDefault)
    categoryFallback = optionsWDefault.categoryFallback ?? {}

    templateCache.clear()

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

type Template = readonly (string | Group | Arg)[]

type Chunk = string

function isChunk(value: Chunk | Group | Arg): value is Chunk {
  return typeof value === 'string'
}

type Group = {
  readonly argIndex: number
  readonly categoryToResult: CategoryToResult
}

type CategoryToResult = { readonly [key in Intl.LDMLPluralRule]?: string }

type Arg = number

function isArg(value: Chunk | Group | Arg): value is Arg {
  return typeof value === 'number'
}
