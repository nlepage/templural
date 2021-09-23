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

test('Plural substitution in template args should not be resolved', t => {
  t.is(templural`You have ${2} ${'message{s}'}`, 'You have 2 message{s}')
  t.is(templural`You have ${2} ${'message{s'}}`, 'You have 2 message{s}')
  t.is(templural`You have ${2} message{${'s}'}`, 'You have 2 message{s}')
  t.is(templural`You have ${2} message{${'s'}}`, 'You have 2 message{s}')
})

test('Ordered and associative syntaxes cannot be mixed', t => {
  t.throws(() => templural`${0}{test;one:test}`, {
    instanceOf: Error,
    message: 'Ordered and associative syntaxes cannot be mixed',
  })
})

test('Incomplete groups', t => {
  t.is(templural`This is a test{s`, 'This is a test{s')
  t.is(templural`This is a tests}`, 'This is a tests}')
  t.is(templural`This is a test{s}a}`, 'This is a testa}')
})

test.failing('Escaping special chars', t => {
  t.is(templural`This is a test\\{s}`, 'This is a test{s}')
  t.is(templural`This is a test\\\\{s}`, 'This is a test\\')
  t.is(templural`This is a test\\\\\\{s}`, 'This is a test\\{s}')
  t.is(templural`This is a test\\\\\\\\{s}`, 'This is a test\\\\')
  t.is(templural`This is a test\\\\\\\\\\{s}`, 'This is a test\\\\{s}')
  t.is(templural`This is a test\\\\\\\\\\\\{s}`, 'This is a test\\\\\\')

  t.is(templural`This is a test\\{s`, 'This is a test{s')

  t.is(templural`This is a test{s\\}}`, 'This is a test')
})
