import test from 'ava'

import { resolveCategoryOrders } from '../src/categories'

test('Resolve category orders', t => {
  t.deepEqual(resolveCategoryOrders(['one', 'other']), [['other'], ['one', 'other']])
  t.deepEqual(resolveCategoryOrders(['many', 'one', 'other']), [['other'], ['one', 'other'], ['one', 'many', 'other']])
  t.deepEqual(resolveCategoryOrders(['many', 'one', 'other'], { categoryOrder: ['one', 'other', 'many'] }), [['other'], ['one', 'other'], ['one', 'other', 'many']])
  t.deepEqual(resolveCategoryOrders(['few', 'many', 'one', 'two', 'zero', 'other']), [['other'], ['one', 'other'], ['one', 'two', 'other'], ['one', 'two', 'few', 'other'], ['one', 'two', 'few', 'many', 'other'], ['zero', 'one', 'two', 'few', 'many', 'other']])
  t.deepEqual(resolveCategoryOrders(['few', 'many', 'one', 'two', 'zero', 'other'], { categoryPriority: ['other', 'one', 'zero', 'two', 'few', 'many'] }), [['other'], ['one', 'other'], ['zero', 'one', 'other'], ['zero', 'one', 'two', 'other'], ['zero', 'one', 'two', 'few', 'other'], ['zero', 'one', 'two', 'few', 'many', 'other']])
})
