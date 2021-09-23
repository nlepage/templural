export const defaultLocalesOptions: { [key: string]: LocalesOptions } = {
  fr: {
    categoryFallback: { many: 'other' },
    categoryOrder: ['one', 'other', 'many'],
  }
}

export type LocalesOptions = {
  categoryPriority?: Intl.LDMLPluralRule[],
  categoryOrder?: Intl.LDMLPluralRule[],
  categoryFallback?: CategoryFallback,
}

export type CategoryFallback = { [key in Intl.LDMLPluralRule]?: Intl.LDMLPluralRule }
