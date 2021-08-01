import { CategoriesFallbacks, buildCategories } from './categories'

export type Locales = string | string[]

export type LocalesOptions = {
  categoriesPriority?: Intl.LDMLPluralRule[],
  categoriesOrder?: Intl.LDMLPluralRule[],
  categoriesFallbacks?: CategoriesFallbacks,
}

const defaultLocalesOptions: { [key: string]: LocalesOptions } = {
  fr: {
    categoriesFallbacks: { many: 'other' },
    categoriesOrder: ['one', 'other', 'many'],
  }
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

    const optionsWDefault = Object.assign({}, options, defaultLocalesOptions[pluralRules.resolvedOptions().locale])

    categories = buildCategories(pluralRules, optionsWDefault)
    categoriesFallbacks = optionsWDefault.categoriesFallbacks

    return templural
  }

  return templural.setLocales(locales, options)
}

export const templural = forLocales()

function resolveArgRef(s: string, args: any[]): string {
  const argRefMatch = /^\$(\d+)$/.exec(s)

  return argRefMatch ? toString(args[parseInt(argRefMatch[1]) - 1]) : s
}

function toString(v: any): string {
  return v == null ? '' : v.toString()
}
