import test from 'ava'

import { templural } from '../src'

test.before(() => { templural.setLocales('de') })

test('Einem Wort eine vorangehende Zahl zuordnen', t => {
  t.is(templural`Yoann und Valentin hatten ${1} interessante Idee{n}`, 'Yoann und Valentin hatten 1 interessante Idee')
  t.is(templural`Yoann und Valentin hatten ${2} interessante Idee{n}`, 'Yoann und Valentin hatten 2 interessante Ideen')
  t.is(templural`Yoann und Valentin hatten ${42} interessante Idee{n}`, 'Yoann und Valentin hatten 42 interessante Ideen')
  t.is(templural`Yoann und Valentin hatten ${0} interessante Idee{n}`, 'Yoann und Valentin hatten 0 interessante Ideen')
})

test('Beliebiger anderer Werte in den Text einfügen', t => {
  t.is(templural`${"Joe"} hat ${1} Punkt{e}`, 'Joe hat 1 Punkt')
  t.is(templural`${"Mario"} hat ${1024} Punkt{e}`, 'Mario hat 1024 Punkte')
})

test('Mehrere Wörter der gleichen vorangehenden Zahl zuordnen', t => {
  t.is(templural`Ich hatte nur ${1} Bier{e}, Liebling{e}, ich schwöre{n}`, 'Ich hatte nur 1 Bier, Liebling, ich schwöre')
  t.is(templural`Ich hatte nur ${2} Bier{e}, Liebling{e}, ich schwöre{n}`, 'Ich hatte nur 2 Biere, Lieblinge, ich schwören')
  t.is(templural`Ich hatte nur ${6} Bier{e}, Liebling{e}, ich schwöre{n}`, 'Ich hatte nur 6 Biere, Lieblinge, ich schwören')
})

test('Mehrere Wörter jeweils einer anderen vorangehenden Zahl zuordnen', t => {
  t.is(templural`Ich habe ${1} Karotte{n} und ${1} Kartoffel{n} gekauft`, 'Ich habe 1 Karotte und 1 Kartoffel gekauft')
  t.is(templural`Ich habe ${1} Karotte{n} und ${3} Kartoffel{n} gekauft`, 'Ich habe 1 Karotte und 3 Kartoffeln gekauft')
  t.is(templural`Ich habe ${2} Karotte{n} und ${1} Kartoffel{n} gekauft`, 'Ich habe 2 Karotten und 1 Kartoffel gekauft')
  t.is(templural`Ich habe ${2} Karotte{n} und ${3} Kartoffel{n} gekauft`, 'Ich habe 2 Karotten und 3 Kartoffeln gekauft')
})

test('Wörter mit einer anderen Form im Singular und Plural', t => {
  t.is(templural`${1} Person{en} {ist;sind} verbunden`, '1 Person ist verbunden')
  t.is(templural`${2} Person{en} {ist;sind} verbunden`, '2 Personen sind verbunden')
  t.is(templural`${666} Person{en} {ist;sind} verbunden`, '666 Personen sind verbunden')
})

test('Mischen Sie alle vorherigen Beispiele', t => {
  t.is(templural`${1} Hund{e} bell{t;en} und ${1} Katze{n} miau{t;en}`, '1 Hund bellt und 1 Katze miaut')
  t.is(templural`${2} Hund{e} bell{t;en} und ${1} Katze{n} miau{t;en}`, '2 Hunde bellen und 1 Katze miaut')
  t.is(templural`${1} Hund{e} bell{t;en} und ${2} Katze{n} miau{t;en}`, '1 Hund bellt und 2 Katzen miauen')
  t.is(templural`${2} Hund{e} bell{t;en} und ${2} Katze{n} miau{t;en}`, '2 Hunde bellen und 2 Katzen miauen')
})

test('Einem Wort eine nicht vorangehende Zahl zuordnen', t => {
  t.is(templural`Die ${1} nette{$1;n} Frau{en}`, 'Die 1 nette Frau')
  t.is(templural`Die ${2} nette{$1;n} Frau{en}`, 'Die 2 netten Frauen')
})
