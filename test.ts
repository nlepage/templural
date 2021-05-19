import test from 'ava'

import templural from './src'

test('No number', t => {
  t.is(templural`This is useless`, 'This is useless')
  t.is(templural`This is a test{s}`, 'This is a test')
})

test('One word agrees with one number', t => {
  t.is(templural`Yoann and Valentin had ${0} interesting idea{s}`, 'Yoann and Valentin had 0 interesting idea')
  t.is(templural`Yoann and Valentin had ${1} interesting idea{s}`, 'Yoann and Valentin had 1 interesting idea')
  t.is(templural`Yoann and Valentin had ${2} interesting idea{s}`, 'Yoann and Valentin had 2 interesting ideas')
  t.is(templural`Yoann and Valentin had ${42} interesting idea{s}`, 'Yoann and Valentin had 42 interesting ideas')
})

test('Several words agree with one number', t => {
  t.is(templural`I just had ${1} bear{s} darling{s}, I swear{s}`, 'I just had 1 bear darling, I swear')
  t.is(templural`I just had ${2} bear{s} darling{s}, I swear{s}`, 'I just had 2 bears darlings, I swears')
  t.is(templural`I just had ${6} bear{s} darling{s}, I swear{s}`, 'I just had 6 bears darlings, I swears')
})
