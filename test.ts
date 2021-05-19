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

test('Several words each agree with one word', t => {
  t.is(templural`I bought ${1} carrot{s} and ${1} potato{es}`, 'I bought 1 carrot and 1 potato')
  t.is(templural`I bought ${1} carrot{s} and ${3} potato{es}`, 'I bought 1 carrot and 3 potatoes')
  t.is(templural`I bought ${2} carrot{s} and ${1} potato{es}`, 'I bought 2 carrots and 1 potato')
  t.is(templural`I bought ${2} carrot{s} and ${3} potato{es}`, 'I bought 2 carrots and 3 potatoes')
})
