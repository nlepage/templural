import test from 'ava'

import { templural, forLocales } from '../src'

test('No number', t => {
  t.is(templural`This is useless`, 'This is useless')
  t.is(templural`This is a test{s}`, 'This is a test')
})

test('Use several locales', t => {
  const en = forLocales('en')
  const fr = forLocales('fr')

  t.is(en`You have ${0} message{s}`, 'You have 0 messages')
  t.is(fr`Vous avez ${0} message{s}`, 'Vous avez 0 message')
})
