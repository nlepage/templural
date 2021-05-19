import test from 'ava'

import templural from './src'

test('templural', t => {
  t.is(templural`test`, 'templural')
})