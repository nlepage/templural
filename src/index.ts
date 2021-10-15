import { CategoriesConfiguration, resolveCategoryOrders } from './categories'
import { CategoryFallback, defaultLocalesOptions, LocalesOptions } from './locales'
import { parseChunks } from './parse'
import { Template } from './template'

export const templural = forLocales()

export function forLocales(locales?: Locales, options?: LocalesOptions) {
  function templural(chunks: TemplateStringsArray, ...args: readonly any[]): string {
    let template: Template

    const key = chunksToKey(chunks)
    if (templateCache.has(key)) {
      template = templateCache.get(key)
    } else {
      templateCache.set(
        key,
        template = Template.fromParsedTemplate(parseChunks(chunks), categoriesConfiguration),
      )
    }

    return resolve(template, args, pluralRules)
  }

  let pluralRules: Intl.PluralRules
  let categoriesConfiguration: CategoriesConfiguration
  const templateCache = new Map<string, Template>()

  templural.setLocales = function setLocales(locales?: Locales, options?: LocalesOptions) {
    pluralRules = new Intl.PluralRules(locales)

    const resolvedOptions = pluralRules.resolvedOptions()
    const optionsWDefault = Object.assign({}, defaultLocalesOptions[resolvedOptions.locale], options)

    categoriesConfiguration = {
      categories: resolvedOptions.pluralCategories,
      categoryOrders: resolveCategoryOrders(resolvedOptions.pluralCategories, optionsWDefault),
      categoryFallback: optionsWDefault.categoryFallback ?? {},
    }

    templateCache.clear()

    return templural
  }

  return templural.setLocales(locales, options)
}

export type Locales = string | string[]

export type { CategoryFallback, LocalesOptions }

function resolve(template: Template, args: readonly any[], pluralRules: Intl.PluralRules) {
  return template.map(item => {
    if (Template.isChunk(item)) return item
    if (Template.isArg(item)) return toString(args[item])
    if (!(item.argIndex in args)) return ''
    return item.categoryToResult[pluralRules.select(args[item.argIndex])] ?? ''
  }).join('')
}

function toString(v: any): string {
  return v == null ? '' : v.toString() // FIXME not sure
}

function chunksToKey(chunks: TemplateStringsArray) {
  return chunks.raw.reduce((acc, chunk, i) => `${acc}\${${i}}${chunk}`)
}
