import test from 'ava'

import { lex, Token } from '../src/lex'

test('lex', t => {
  t.deepEqual(lex(''), [])

  t.deepEqual(lex('Yoann and Valentin had 1 interesting idea'), [
    Token.string('Yoann and Valentin had 1 interesting idea'),
  ])

  t.deepEqual(lex('{};$:'), [
    Token.Type.LCurly,
    Token.Type.RCurly,
    Token.Type.SColon,
    Token.Type.Dollar,
    Token.Type.Colon,
  ])

  t.deepEqual(lex('Here are some special chars: {, }, ;, $'), [
    Token.string('Here are some special chars'),
    Token.Type.Colon,
    Token.string(' '),
    Token.Type.LCurly,
    Token.string(', '),
    Token.Type.RCurly,
    Token.string(', '),
    Token.Type.SColon,
    Token.string(', '),
    Token.Type.Dollar,
  ])
})
