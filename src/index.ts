import { buildCategories } from './categories'

export type Locales = string | string[]

export type LocalesOptions = {
  categoriesPriority?: Intl.LDMLPluralRule[],
  categoriesOrder?: Intl.LDMLPluralRule[],
  categoriesFallbacks?: CategoriesFallbacks,
}

export type CategoriesFallbacks = { [key in Intl.LDMLPluralRule]?: Intl.LDMLPluralRule }

const defaultLocalesOptions: { [key: string]: LocalesOptions } = {
  fr: {
    categoriesFallbacks: { many: 'other' },
    categoriesOrder: ['one', 'other', 'many'],
  }
}

export function forLocales(locales?: Locales, options?: LocalesOptions) {
  function templural(chunks: TemplateStringsArray, ...args: any[]): string {
    return chunks.reduce((prev, chunk, i) => {
      let next = chunk.replace(/\{(.*?)\}/g, (_match, group: string) => {
        const indexMatch = /^\$(\d)+;(.*)$/.exec(group)

        return indexMatch == null
          ? resolveGroup(group, args, i)
          : resolveGroup(indexMatch[2], args, Number(indexMatch[1]))
      })

      if (i > 0) next = toString(args[i - 1]) + next

      return prev + next
    }, '')
  }

  function resolveGroup(group: string, args: any[], index: number): string {
    const n = args[index - 1]

    if (typeof n !== 'number') return ''

    const split = group.split(';') // FIXME support escaping (split)

    const assocMatches = split.map(s => /^(zero|one|two|few|many|other):(.*)$/.exec(s))

    let categoryToResult: { [key in Intl.LDMLPluralRule]?: string }
    if (assocMatches.every(match => match == null)) {
      categoryToResult = Object.fromEntries(categories[split.length - 1].map((c, i) => [c, split[i]]))
    } else {
      if (assocMatches.some(match => match == null)) {
        throw new Error('Implicit and associative syntaxes cannot be mixed')
      }
      categoryToResult = Object.fromEntries(assocMatches.map(match => match.slice(1)))
    }

    let category = pluralRules.select(n)

    do {
      if (category in categoryToResult) return categoryToResult[category]
      category = categoriesFallbacks?.[category]
    } while (category != null)

    return ''
  }

  let pluralRules: Intl.PluralRules
  let categories: Intl.LDMLPluralRule[][]
  let categoriesFallbacks: CategoriesFallbacks

  templural.setLocales = function setLocales(locales?: Locales, options?: LocalesOptions) {
    pluralRules = new Intl.PluralRules(locales)

    const optionsWDefault = Object.assign({}, options, defaultLocalesOptions[pluralRules.resolvedOptions().locale])

    categories = buildCategories(pluralRules, optionsWDefault)
    categoriesFallbacks = optionsWDefault.categoriesFallbacks

    return templural
  }

  return templural.setLocales(locales, options)
}

export const templural = forLocales()

function toString(v: any): string {
  return v == null ? '' : v.toString()
}
