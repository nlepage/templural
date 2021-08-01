import test from 'ava'

import { buildCategories } from '../src/categories'

test('Build categories', t => {
  t.deepEqual(buildCategories(new Intl.PluralRules('en')), [['other'], ['one', 'other']])
  t.deepEqual(buildCategories(new Intl.PluralRules('fr')), [['other'], ['one', 'other'], ['one', 'many', 'other']])
  t.deepEqual(buildCategories(new Intl.PluralRules('fr'), { categoriesOrder: ['one', 'other', 'many'] }), [['other'], ['one', 'other'], ['one', 'other', 'many']])
  t.deepEqual(buildCategories(new Intl.PluralRules('ar')), [['other'], ['one', 'other'], ['one', 'two', 'other'], ['one', 'two', 'few', 'other'], ['one', 'two', 'few', 'many', 'other'], ['zero', 'one', 'two', 'few', 'many', 'other']])
  t.deepEqual(buildCategories(new Intl.PluralRules('ar'), { categoriesPriority: ['other', 'one', 'zero', 'two', 'few', 'many'] }), [['other'], ['one', 'other'], ['zero', 'one', 'other'], ['zero', 'one', 'two', 'other'], ['zero', 'one', 'two', 'few', 'other'], ['zero', 'one', 'two', 'few', 'many', 'other']])
})
