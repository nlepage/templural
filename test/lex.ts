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

  t.deepEqual(lex('Here is 1 integer:1234567890;'), [
    Token.string('Here is 1 integer'),
    Token.Type.Colon,
    Token.integer('1234567890'),
    Token.Type.SColon,
  ])

  t.deepEqual(lex('Here is a string starting with digits:123abc.'), [
    Token.string('Here is a string starting with digits'),
    Token.Type.Colon,
    Token.string('123abc.'),
  ])

  t.deepEqual(lex('456 This string started with digits'), [
    Token.string('456 This string started with digits'),
  ])

  t.deepEqual(lex('This is not an integer{0123}'), [
    Token.string('This is not an integer'),
    Token.Type.LCurly,
    Token.string('0123'),
    Token.Type.RCurly,
  ])

  t.deepEqual(lex('This string contains some escaped chars \\{\\}\\;\\$\\:\\\\\\\\\\a\\b\\n'), [
    Token.string('This string contains some escaped chars {};$:\\\\abn'),
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

  t.deepEqual(lex('Trailing backslash is kept \\'), [
    Token.string('Trailing backslash is kept \\'),
  ])
})
