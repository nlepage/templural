import test from 'ava'

import { templural } from '../src'

test('No number', t => {
  t.is(templural`This is useless`, 'This is useless')
  t.is(templural`This is a test{s}`, 'This is a test')
})

test('Ending left curly must not disappear', t => {
  t.is(templural`Please don't eat the curly {`, "Please don't eat the curly {")
})
