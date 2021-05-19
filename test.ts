import test from 'ava'

import templural from './src'

test('No number', t => {
  t.is(templural`This is useless`, 'This is useless')
  t.is(templural`This is a test{s}`, 'This is a test')
})

test('One word agrees with one number', t => {
  t.is(templural`Yoann and Valentin had ${1} interesting idea{s}`, 'Yoann and Valentin had 1 interesting idea')
  t.is(templural`Yoann and Valentin had ${2} interesting idea{s}`, 'Yoann and Valentin had 2 interesting ideas')
  t.is(templural`Yoann and Valentin had ${42} interesting idea{s}`, 'Yoann and Valentin had 42 interesting ideas')
})

test('Several words agree with one number', t => {
  t.is(templural`I just had ${1} bear{s} darling{s}, I swear{s}`, 'I just had 1 bear darling, I swear')
  t.is(templural`I just had ${2} bear{s} darling{s}, I swear{s}`, 'I just had 2 bears darlings, I swears')
  t.is(templural`I just had ${6} bear{s} darling{s}, I swear{s}`, 'I just had 6 bears darlings, I swears')
})

test('Several words each agree with one different number', t => {
  t.is(templural`I bought ${1} carrot{s} and ${1} potato{es}`, 'I bought 1 carrot and 1 potato')
  t.is(templural`I bought ${1} carrot{s} and ${3} potato{es}`, 'I bought 1 carrot and 3 potatoes')
  t.is(templural`I bought ${2} carrot{s} and ${1} potato{es}`, 'I bought 2 carrots and 1 potato')
  t.is(templural`I bought ${2} carrot{s} and ${3} potato{es}`, 'I bought 2 carrots and 3 potatoes')
})

test('The singular of a word is not a prefix of the plural', t => {
  t.is(templural`${1} {person:people} {is:are} connected`, '1 person is connected')
  t.is(templural`${2} {person:people} {is:are} connected`, '2 people are connected')
  t.is(templural`${666} {person:people} {is:are} connected`, '666 people are connected')
})

test('Several words agree with several numbers', t => {
  t.is(templural`${1} dog{s} bark{s:} and ${1} cat{s} meow{s:}`, '1 dog barks and 1 cat meows')
  t.is(templural`${2} dog{s} bark{s:} and ${1} cat{s} meow{s:}`, '2 dogs bark and 1 cat meows')
  t.is(templural`${1} dog{s} bark{s:} and ${2} cat{s} meow{s:}`, '1 dog barks and 2 cats meow')
  t.is(templural`${2} dog{s} bark{s:} and ${2} cat{s} meow{s:}`, '2 dogs bark and 2 cats meow')
})

test('Some words agree with and preceed a number', t => {
  t.is(templural`There {$1:is only:are} ${1} dog{s} barking!`, 'There is only 1 dog barking!')
  t.is(templural`There {$1:is only:are} ${2} dog{s} barking!`, 'There are 2 dogs barking!')
})
