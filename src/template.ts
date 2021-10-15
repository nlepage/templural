import { CategoriesConfiguration } from "./categories"
import { ParsedTemplate } from "./parse"

export type Template = readonly (Template.Chunk | Template.Group | Template.Arg)[]

export namespace Template {
  export type Chunk = ParsedTemplate.Chunk

  export function isChunk(value: Chunk | Group | Arg): value is Chunk {
    return typeof value === 'string'
  }

  export type Group = {
    readonly argIndex: number
    readonly categoryToResult: CategoryToResult
  }

  export type CategoryToResult = { readonly [key in Intl.LDMLPluralRule]?: string }

  export type Arg = ParsedTemplate.Arg

  export function isArg(value: Chunk | Group | Arg): value is Arg {
    return typeof value === 'number'
  }

  export function fromParsedTemplate(template: ParsedTemplate, { categories, categoryOrders, categoryFallback }: CategoriesConfiguration): Template {
    return template.map(item => {
      if (!ParsedTemplate.isGroup(item)) return item

      let categoryToResult: CategoryToResult = ParsedTemplate.isOrdredGroup(item)
        ? Object.fromEntries(categoryOrders[item.orderedResults.length - 1].map((c, i) => [c, item.orderedResults[i]]))
        : item.associativeResults

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
        argIndex: item.argIndex,
        categoryToResult,
      }
    })
  }
}
