export type Categories = (
  [
    [Intl.LDMLPluralRule],
  ] |
  [
    [Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule],
  ] |
  [
    [Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule],
  ] |
  [
    [Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule],
  ] |
  [
    [Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule],
  ] |
  [
    [Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule],
    [Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule, Intl.LDMLPluralRule],
  ]
)

const defaultCategoriesPriority: Intl.LDMLPluralRule[] = ['other', 'one', 'two', 'few', 'many', 'zero']
const defaultCategoriesOrder: Intl.LDMLPluralRule[] = ['zero', 'one', 'two', 'few', 'many', 'other']

export function guessCategories(
  pluralRules: Intl.PluralRules,
  options?: { categoriesPriority?: Intl.LDMLPluralRule[], categoriesOrder?: Intl.LDMLPluralRule[] },
): Categories {
  const { pluralCategories } = pluralRules.resolvedOptions()
  const { categoriesPriority = defaultCategoriesPriority, categoriesOrder = defaultCategoriesOrder } = options ?? {}

  const categories: Intl.LDMLPluralRule[][] = []

  categoriesPriority
    .filter(c => pluralCategories.includes(c))
    .forEach(c => {
      categories.push(
        [...(categories[categories.length - 1] ?? []), c].sort((c1, c2) => categoriesOrder.indexOf(c1) - categoriesOrder.indexOf(c2))
      )
    })

  return categories as Categories
}

export type CategoriesFallbacks = { [key in Intl.LDMLPluralRule]?: Intl.LDMLPluralRule }

export const localesFallbacks: { [key: string]: CategoriesFallbacks } = {
  fr: { many: 'other' },
}
