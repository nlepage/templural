import test from 'ava'

import { templural } from '../src'

test.before(() => { templural.setLocales('fr') })

test('Accorder un mot avec un nombre le précédant', t => {
  t.is(templural`Yoann et Valentin ont eu ${1} idée{s}`, 'Yoann et Valentin ont eu 1 idée')
  t.is(templural`Yoann et Valentin ont eu ${2} idée{s}`, 'Yoann et Valentin ont eu 2 idées')
  t.is(templural`Yoann et Valentin ont eu ${42} idée{s}`, 'Yoann et Valentin ont eu 42 idées')
  t.is(templural`Yoann et Valentin ont eu ${0} idée{s}`, 'Yoann et Valentin ont eu 0 idée')
})

test("Insérer n'importe quelle autre valeur dans le texte", t => {
  t.is(templural`${'Joe'} a ${1} point{s}`, 'Joe a 1 point')
  t.is(templural`${'Mario'} a ${1000} point{s}`, 'Mario a 1000 points')
})

test('Accorder plusieurs mots avec le même nombre les précédant', t => {
  t.is(templural`J'ai juste pris ${1} petite{s} bière{s} chéri·e, {z}je te jure`, "J'ai juste pris 1 petite bière chéri·e, je te jure")
  t.is(templural`J'ai juste pris ${2} petite{s} bière{s} chéri·e, {z}je te jure`, "J'ai juste pris 2 petites bières chéri·e, zje te jure")
  t.is(templural`J'ai juste pris ${6} petite{s} bière{s} chéri·e, {z}je te jure`, "J'ai juste pris 6 petites bières chéri·e, zje te jure")
})

test('Accorder plusieurs mots chacun avec un nombre différent', t => {
  t.is(templural`J'ai acheté ${1} carotte{s} et ${1} patate{s}`, "J'ai acheté 1 carotte et 1 patate")
  t.is(templural`J'ai acheté ${1} carotte{s} et ${3} patate{s}`, "J'ai acheté 1 carotte et 3 patates")
  t.is(templural`J'ai acheté ${2} carotte{s} et ${1} patate{s}`, "J'ai acheté 2 carottes et 1 patate")
  t.is(templural`J'ai acheté ${2} carotte{s} et ${3} patate{s}`, "J'ai acheté 2 carottes et 3 patates")
})

test('Acccorder un mot avec une forme différente au singulier et au pluriel', t => {
  t.is(templural`${1} personne{s} {est;sont} connectée{s}`, '1 personne est connectée')
  t.is(templural`${2} personne{s} {est;sont} connectée{s}`, '2 personnes sont connectées')
  t.is(templural`${666} personne{s} {est;sont} connectée{s}`, '666 personnes sont connectées')
})

test('Un mélange de tous les exemples précédents', t => {
  t.is(templural`${1} cheva{l;ux} {a;ont} ${1} tête{s}, ${2} {oeil;yeux} et ${4} patte{s}`, '1 cheval a 1 tête, 2 yeux et 4 pattes')
  t.is(templural`${2} cheva{l;ux} {a;ont} ${2} tête{s}, ${4} {oeil;yeux} et ${8} patte{s}`, '2 chevaux ont 2 têtes, 4 yeux et 8 pattes')
  t.is(templural`${1} cheva{l;ux} borgne{s} {a;ont} ${1} tête{s}, ${1} {oeil;yeux} et ${4} patte{s}`, '1 cheval borgne a 1 tête, 1 oeil et 4 pattes')
})

test('Accorder un mot avec un nombre ne le précédant pas', t => {
  t.is(templural`Dans le ciel vole{1$nt} ${1} baleine{s}`, 'Dans le ciel vole 1 baleine')
  t.is(templural`Dans le ciel vole{1$nt} ${2} baleine{s}`, 'Dans le ciel volent 2 baleines')
})

test('Accorder avec des grands nombres', t => {
  // Spécifier explicitement other et many pour "s"
  t.is(templural`Yoann et Valentin ont eu ${1000000} {;;d'}idée{;s;s}`, "Yoann et Valentin ont eu 1000000 d'idées")
  // Laisser many retomber en other pour "s"
  t.is(templural`${'Thomas'} a ${1000000000}{;; de} point{s}`, 'Thomas a 1000000000 de points')
  // Utiliser le nom de catégorie pour éviter le double point-virgule
  t.is(templural`${2}{many: de} personne{s} {est;sont} connectée{s}`, '2 personnes sont connectées')
  t.is(templural`${2000000}{many: de} personne{s} {est;sont} connectée{s}`, '2000000 de personnes sont connectées')
})
