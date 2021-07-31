const defaultCategoriesPriority: Intl.LDMLPluralRule[] = ['other', 'one', 'two', 'few', 'many', 'zero']

const localesCategoriesPriority: { [key: string]: Intl.LDMLPluralRule[] } = {}

const defaultCategoriesOrder: Intl.LDMLPluralRule[] = ['zero', 'one', 'two', 'few', 'many', 'other']

const localesCategoriesOrder: { [key: string]: Intl.LDMLPluralRule[] } = {
  fr: ['one', 'other', 'many'],
}

export function buildCategories(
  pluralRules: Intl.PluralRules,
  options?: { categoriesPriority?: Intl.LDMLPluralRule[], categoriesOrder?: Intl.LDMLPluralRule[] },
): Intl.LDMLPluralRule[][] {
  const { pluralCategories, locale } = pluralRules.resolvedOptions()
  const {
    categoriesPriority = localesCategoriesPriority[locale] ?? defaultCategoriesPriority,
    categoriesOrder = localesCategoriesOrder[locale] ?? defaultCategoriesOrder
  } = options ?? {}

  const categories: Intl.LDMLPluralRule[][] = []

  categoriesPriority
    .filter(c => pluralCategories.includes(c))
    .forEach(c => {
      categories.push(
        [...(categories[categories.length - 1] ?? []), c].sort((c1, c2) => categoriesOrder.indexOf(c1) - categoriesOrder.indexOf(c2))
      )
    })

  return categories
}

export type CategoriesFallbacks = { [key in Intl.LDMLPluralRule]?: Intl.LDMLPluralRule }

export const localesFallbacks: { [key: string]: CategoriesFallbacks } = {
  fr: { many: 'other' },
}
