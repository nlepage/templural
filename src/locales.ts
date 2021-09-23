export const defaultLocalesOptions: { [key: string]: LocalesOptions } = {
  fr: {
    categoryFallback: { many: 'other' },
    categoryOrder: ['one', 'other', 'many'],
  }
}

export type LocalesOptions = {
  readonly categoryPriority?: readonly Intl.LDMLPluralRule[],
  readonly categoryOrder?: readonly Intl.LDMLPluralRule[],
  readonly categoryFallback?: CategoryFallback,
}

export type CategoryFallback = { readonly [key in Intl.LDMLPluralRule]?: Intl.LDMLPluralRule }
