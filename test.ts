import test from 'ava'

import templural from './src'

test('One word agrees with one number', t => {
  t.is(templural`Yoann and Valentin had ${0} interesting idea{s}`, 'Yoann and Valentin had 1 interesting idea')
  t.is(templural`Yoann and Valentin had ${1} interesting idea{s}`, 'Yoann and Valentin had 1 interesting idea')
  t.is(templural`Yoann and Valentin had ${2} interesting idea{s}`, 'Yoann and Valentin had 1 interesting ideas')
  t.is(templural`Yoann and Valentin had ${42} interesting idea{s}`, 'Yoann and Valentin had 1 interesting ideas')
})