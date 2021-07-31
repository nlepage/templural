import { CategoriesFallbacks, buildCategories, localesFallbacks } from './categories'

type Locales = string | string[]

type LocalesOptions = {
  categoriesPriority?: Intl.LDMLPluralRule[],
  categoriesOrder?: Intl.LDMLPluralRule[],
  categoriesFallbacks?: CategoriesFallbacks,
}

export function forLocales(locales?: Locales, options?: LocalesOptions) {
  function templural(chunks: TemplateStringsArray, ...args: any[]): string {
    return chunks.reduce((prev, chunk, i) => {
      let next = chunk

      if (i > 0) next = toString(args[i - 1]) + next

      next = next.replace(/\{(.*?)\}/g, (_match, g1) => {
        let index = i - 1
        let split = g1.split(':')

        const indexMatch = /^\$(\d)+$/.exec(split[0])
        if (indexMatch != null) {
          index = Number(indexMatch[1]) - 1
          split = split.slice(1)
        }

        return resolve(split, args, index)
      })

      return prev + next
    }, '')
  }

  function resolve(split: string[], args: any[], index: number): string {
    return resolveArgRef(resolveSplit(split, args, index), args)
  }

  function resolveSplit(split: string[], args: any[], index: number): string {
    if (index === -1 || typeof args[index] !== 'number') return ''

    const splitCategories = categories[split.length - 1]

    let category = pluralRules.select(args[index])

    do {
      let splitIndex = splitCategories.indexOf(category)
      if (splitIndex !== -1) return split[splitIndex]

      category = categoriesFallbacks?.[category]
    } while (category != null)

    return ''
  }

  let pluralRules: Intl.PluralRules
  let categories: Intl.LDMLPluralRule[][]
  let categoriesFallbacks: CategoriesFallbacks

  templural.setLocales = function setLocales(locales?: Locales, options?: LocalesOptions) {
    // FIXME throw if no Intl.PluralRules

    pluralRules = new Intl.PluralRules(locales)
    categories = buildCategories(pluralRules, options)
    categoriesFallbacks = localesFallbacks[pluralRules.resolvedOptions().locale]

    return templural
  }

  templural.setLocales(locales, options)

  return templural
}

export const templural = forLocales()

function resolveArgRef(s: string, args: any[]): string {
  const argRefMatch = /^\$(\d+)$/.exec(s)

  return argRefMatch ? toString(args[parseInt(argRefMatch[1]) - 1]) : s
}

function toString(v: any): string {
  return v == null ? '' : v.toString()
}
