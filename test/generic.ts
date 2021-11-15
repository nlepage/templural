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

test.failing('Plural substitution in template args should not be resolved', t => {
  t.is(templural`You have ${2} ${'message{s}'}`, 'You have 2 message{s}')
  t.is(templural`You have ${2} ${'message{s'}}`, 'You have 2 message{s}')
  t.is(templural`You have ${2} message{${'s}'}`, 'You have 2 message{s}')
  t.is(templural`You have ${2} message{${'s'}}`, 'You have 2 message{s}')
})

test.failing('Ordered and associative syntaxes cannot be mixed', t => {
  t.throws(() => templural`${0}{test;one:test}`, {
    instanceOf: SyntaxError,
    message: 'Ordered and associative syntaxes cannot be mixed',
  })

  t.throws(() => templural`${0}{one:test;test}`, {
    instanceOf: SyntaxError,
    message: 'Ordered and associative syntaxes cannot be mixed',
  })
})

test.failing('Incomplete groups', t => {
  t.is(templural`This is a test{s`, 'This is a test{s')
  t.is(templural`This is a tests}`, 'This is a tests}')
  t.is(templural`This is a test{s}a}`, 'This is a testa}')
})

test('Escaping special chars', t => {
  t.is(templural`This is a test\\{s}`, 'This is a test{s}')
  t.is(templural`This is a test\\\\{s}`, 'This is a test\\')
  t.is(templural`This is a test\\\\\\{s}`, 'This is a test\\{s}')
  t.is(templural`This is a test\\\\\\\\{s}`, 'This is a test\\\\')
  t.is(templural`This is a test\\\\\\\\\\{s}`, 'This is a test\\\\{s}')
  t.is(templural`This is a test\\\\\\\\\\\\{s}`, 'This is a test\\\\\\')

  t.is(templural`This is a test\\{s`, 'This is a test{s')

  t.is(templural`This is a test{s\\}}`, 'This is a test')

  // FIXME add more
})

test('Fallback chain', t => {
  const fr = forLocales('fr', { categoryFallback: {
    many: 'one',
    one: 'other',
  } })

  t.is(fr`${1000000} is {one;other;many} and falls back to {one;other} or {other}`, '1000000 is many and falls back to one or other')
})
