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

  t.deepEqual(lex('Here is an integer:123456789;'), [
    Token.string('Here is an integer'),
    Token.Type.Colon,
    Token.integer(123456789),
    Token.Type.SColon,
  ])

  t.deepEqual(lex('Here is a string starting with digits:123abc.'), [
    Token.string('Here is a string starting with digits'),
    Token.Type.Colon,
    Token.string('123abc.'),
  ])

  t.deepEqual(lex('This string contains some escaped chars \\{ \\} \\; \\$ \\: \\\\ \\a \\b \\n'), [
    Token.string('This string contains some escaped chars { } ; $ : \\ a b n'),
  ])

  t.deepEqual(lex('\\{This string started with an escaped char'), [
    Token.string('{This string started with an escaped char'),
  ])

  t.deepEqual(lex('\\{{Escaped char followed by special char \\{{'), [
    Token.string('{'),
    Token.Type.LCurly,
    Token.string('Escaped char followed by special char {'),
    Token.Type.LCurly,
  ])
})
