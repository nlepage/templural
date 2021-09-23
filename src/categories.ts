import { LocalesOptions } from "./locales"

const defaultCategoryPriority: readonly Intl.LDMLPluralRule[] = ['other', 'one', 'two', 'few', 'many', 'zero']

const defaultCategoryOrder: readonly Intl.LDMLPluralRule[] = ['zero', 'one', 'two', 'few', 'many', 'other']

export function resolveCategoryOrders(
  pluralCategories: readonly Intl.LDMLPluralRule[],
  options?: LocalesOptions,
): CategoryOrders {
  const {
    categoryPriority = defaultCategoryPriority,
    categoryOrder = defaultCategoryOrder
  } = options ?? {}

  const categories: Intl.LDMLPluralRule[][] = []

  categoryPriority
    .filter(c => pluralCategories.includes(c))
    .forEach(c => {
      categories.push(
        [...(categories[categories.length - 1] ?? []), c].sort((c1, c2) => categoryOrder.indexOf(c1) - categoryOrder.indexOf(c2))
      )
    })

  return categories
}

export type CategoryOrders = readonly (readonly Intl.LDMLPluralRule[])[]
