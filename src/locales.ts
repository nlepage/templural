export const defaultLocalesOptions: { [key: string]: LocalesOptions } = {
  fr: {
    categoriesFallbacks: { many: 'other' },
    categoriesOrder: ['one', 'other', 'many'],
  }
}

export type LocalesOptions = {
  categoriesPriority?: Intl.LDMLPluralRule[],
  categoriesOrder?: Intl.LDMLPluralRule[],
  categoriesFallbacks?: CategoriesFallbacks,
}

export type CategoriesFallbacks = { [key in Intl.LDMLPluralRule]?: Intl.LDMLPluralRule }
