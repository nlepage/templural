import test from 'ava'

import { lex, Token } from '../src/lex'

test('lex', t => {
  t.deepEqual(lex(''), [])
  t.deepEqual(lex('Yoann and Valentin had 1 interesting idea'), [Token.string('Yoann and Valentin had 1 interesting idea')])
})
