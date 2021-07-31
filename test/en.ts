import test from 'ava'

import { templural } from '../src'

test.before(() => { templural.setLocales('en') })

test('Match a word to a preceding number', t => {
  t.is(templural`Yoann and Valentin had ${1} interesting idea{s}`, 'Yoann and Valentin had 1 interesting idea')
  t.is(templural`Yoann and Valentin had ${2} interesting idea{s}`, 'Yoann and Valentin had 2 interesting ideas')
  t.is(templural`Yoann and Valentin had ${42} interesting idea{s}`, 'Yoann and Valentin had 42 interesting ideas')
  t.is(templural`Yoann and Valentin had ${0} interesting idea{s}`, 'Yoann and Valentin had 0 interesting ideas')
})

test('Insert any other values in the text', t => {
  const user = 'Mario'
  t.is(templural`${user} has ${1} point{s}`, 'Mario has 1 point')
  t.is(templural`${user} has ${1024} point{s}`, 'Mario has 1024 points')
})

test('Match several words to the same preceding number', t => {
  t.is(templural`I just had ${1} bear{s} darling{s}, I swear{s}`, 'I just had 1 bear darling, I swear')
  t.is(templural`I just had ${2} bear{s} darling{s}, I swear{s}`, 'I just had 2 bears darlings, I swears')
  t.is(templural`I just had ${6} bear{s} darling{s}, I swear{s}`, 'I just had 6 bears darlings, I swears')
})

test('Match several words each to a different preceding number', t => {
  t.is(templural`I bought ${1} carrot{s} and ${1} potato{es}`, 'I bought 1 carrot and 1 potato')
  t.is(templural`I bought ${1} carrot{s} and ${3} potato{es}`, 'I bought 1 carrot and 3 potatoes')
  t.is(templural`I bought ${2} carrot{s} and ${1} potato{es}`, 'I bought 2 carrots and 1 potato')
  t.is(templural`I bought ${2} carrot{s} and ${3} potato{es}`, 'I bought 2 carrots and 3 potatoes')
})

test('Words with a different form in the singular and plural', t => {
  t.is(templural`${1} {person:people} {is:are} connected`, '1 person is connected')
  t.is(templural`${2} {person:people} {is:are} connected`, '2 people are connected')
  t.is(templural`${666} {person:people} {is:are} connected`, '666 people are connected')
})

test('Match several words with several preceding numbers', t => {
  t.is(templural`${1} dog{s} bark{s:} and ${1} cat{s} meow{s:}`, '1 dog barks and 1 cat meows')
  t.is(templural`${2} dog{s} bark{s:} and ${1} cat{s} meow{s:}`, '2 dogs bark and 1 cat meows')
  t.is(templural`${1} dog{s} bark{s:} and ${2} cat{s} meow{s:}`, '1 dog barks and 2 cats meow')
  t.is(templural`${2} dog{s} bark{s:} and ${2} cat{s} meow{s:}`, '2 dogs bark and 2 cats meow')
})

test('Match a word to a non preceding number', t => {
  t.is(templural`There {$1:is:are} ${1} flying whale{s}`, 'There is 1 flying whale')
  t.is(templural`There {$1:is:are} ${2} flying whale{s}`, 'There are 2 flying whales')
})
