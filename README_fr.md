# templural 🍤

**Fonction de template pour le formatage de texte sensible aux accords pluriels.**

[![CI](https://github.com/nlepage/templural/actions/workflows/ci.yml/badge.svg)](https://github.com/nlepage/templural/actions)
[![Version](https://img.shields.io/npm/v/templural.svg)](https://www.npmjs.com/package/templural)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache2.0-yellow.svg)](https://spdx.org/licenses/Apache-2.0.html)

[![README en anglais](https://img.shields.io/badge/🇬🇧-README-blue)](https://github.com/nlepage/templural#readme)

## Utilisation

### Installation

```sh
yarn add templural
```

ou

```sh
npm install templural
```

### Importation

```js
import { templural } from 'templural'
```

ou

```js
const { templural } = require('templural')
```

### Choisir une locale

templural utilise [Intl.PluralRules](https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) pour savoir quelle règle d'accord appliquer pour un nombre donné, et les règles d'accord varient selon la langue.

Cela signifie que **vous devez définir la locale utilisée par templural** afin de formater des phrases correctes.

Soit définir la locale par défaut :

```js
templural.setLocales('fr_BE') // Français (Belgique)
```

soit créer une nouvelle fonction de template pour une locale spécifique :


```js
import { forLocales } from 'templural'

const templuralDeCH = forLocales('de_CH') // Allemand (Suisse)
```

Pour plus d'informations sur les valeurs acceptées par `templural.setLocales()` et `forLocales()` voir [Argument locales](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl#argument_locales).

Les exemples suivants sont spécifiques au Français, voir [Internationalisation](#%EF%B8%8F-internationalisation) pour des informations sur les autres langues.

### Accorder un mot avec nombre le précédant

```js
templural`Yoann et Valentin ont eu ${nbIdees} idée{s}`

// nbIdees = 1  ➔ "Yoann et Valentin ont eu 1 idée"
// nbIdees = 2  ➔ "Yoann et Valentin ont eu 2 idées"
// nbIdees = 42 ➔ "Yoann et Valentin ont eu 42 idées"
// nbIdees = 0  ➔ "Yoann et Valentin ont eu 0 idée"
```

### Insérer n'importe quelle autre valeur dans le texte

```js
templural`${nomUtilisateur} a ${nbPoints} point{s}`

// nomUtilisateur = "Joe",   nbPoints = 1    ➔ "Joe a 1 point"
// nomUtilisateur = "Mario", nbPoints = 1000 ➔ "Mario a 1000 points"
```

### Accorder plusieurs mots avec le même nombre les précédant

```js
templural`J'ai juste pris ${nbPintes} petite{s} bière{s} chéri·e, {z}je te jure`

// nbPintes = 1 ➔ "J'ai juste pris 1 petite bière chéri·e, je te jure"
// nbPintes = 2 ➔ "J'ai juste pris 2 petites bières chéri·e, zje te jure"
// nbPintes = 6 ➔ "J'ai juste pris 6 petites bières chéri·e, zje te jure"
```

### Accorder plusieurs mots chacun avec un nombre différent le précédent

```js
templural`J'ai acheté ${nbCarottes} carotte{s} et ${nbPatates} patate{s}`

// nbCarottes = 1, nbPatates = 1 ➔ "J'ai acheté 1 carotte et 1 patate"
// nbCarottes = 1, nbPatates = 3 ➔ "J'ai acheté 1 carotte et 3 patates"
// nbCarottes = 2, nbPatates = 1 ➔ "J'ai acheté 2 carottes et 1 patate"
// nbCarottes = 2, nbPatates = 3 ➔ "J'ai acheté 2 carottes et 3 patates"
```

### Mots avec une forme différente au singulier et au pluriel

```js
templural`${nbConnectes} personne{s} {est;sont} connecté{s}`

// nbConnectes = 1   ➔ "1 personne est connectée"
// nbConnectes = 2   ➔ "2 personnes sont connectées"
// nbConnectes = 666 ➔ "666 personnes sont connectées"
```

### Mélanger tous les exemples précédents

```js
templural`${nbChevaux} cheva{l;ux} {a;ont} ${nbChevaux} tête{s}, ${nbChevaux * 2} {oeil;yeux} et ${nbChevaux * 4} patte{s}`

// nbChevaux = 1 ➔ "1 cheval a 1 tête, 2 yeux et 4 pattes"
// nbChevaux = 2 ➔ "2 chevaux ont 2 têtes, 4 yeux et 8 pattes"
```

### Accorder un mot avec un nombre *ne le précédant pas*

```js
templural`Dans le ciel vole{$1;nt} ${nbWhales} baleine{s}`

// nbWhales = 1 ➔ "Dans le ciel vole 1 baleine"
// nbWhales = 2 ➔ "Dans le ciel volent 2 baleines"
```

`$1` référence la première expression interpolée.

`$2`, `$3` ou `$n` peuvent être utilisés pour référencer la deuxième, troisième ou énième expression interpolée.

### Accorder avec des grands nombres

```js
templural`${nbPersonnes}{;; de} personne{s} connectée{s}`

// nbConnectes = 1       ➔ "1 personne connectée"
// nbConnectes = 2       ➔ "2 personnes connectées"
// nbConnectes = 1000000 ➔ "1000000 de personnes connectées"
```

### Syntaxe associative

Dans certains cas, la syntaxe associative peut être utilisée pour éviter les valeurs vides :

```js
templural`${nbPersonnes}{;; de} personne{s} connectée{s}`

// peut être remplacé par

templural`${nbPersonnes}{many: de} personne{s} connectée{s}`
```

**⚠️ La syntaxe associative et la syntaxe ordonnée ne doivent pas être mélangées:**

```js
// Correct:
templural`${nbCheval} cheva{one:l;other:ux}`

// Erroné:
templural`${nbCheval} cheva{one:l;ux}`
```

## 🗣️ Internationalisation

templural est construit sur la base de [Intl.PluralRules](https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) et peut être utilisé pour formater des phrases dans n'importe quelle langue.

Ce README est disponible dans les langues suivantes :

 - [🇬🇧 Anglais](https://github.com/nlepage/templural#readme)

### Règles d'accord

Chaque langue a des règles d'accord différentes.

Par exemple le français a trois catégories d'accord, `"one"` pour les singulier, `"other"` pour le pluriel, et `"many"` pour certains grands nombres :

```js
templural.setLocales('fr')

templural`${n} est dans la catégorie {one;other;many}`

// n = 1       ➔ "1 est dans la catégorie one"
// n = 2       ➔ "2 est dans la catégorie other"
// n = 1000000 ➔ "1000000 est dans la catégorie many"
// n = 0       ➔ "0 est dans la catégorie one"
```

L'anglais est un peu différent du français, il n'a que les deux catégories `"one"` et `"other"`, et le 0 est pluriel :

```js
templural.setLocales('en')

templural`${n} est dans la catégorie {one;other}`

// n = 1       ➔ "1 est dans la catégorie one"
// n = 2       ➔ "2 est dans la catégorie other"
// n = 1000000 ➔ "1000000 est dans la catégorie other"
// n = 0       ➔ "0 est dans la catégorie other"
```

Voir [Language Plural Rules](https://unicode-org.github.io/cldr-staging/charts/latest/supplemental/language_plural_rules.html) pour des informations sur les règles d'accord dans n'importe quelle autre langue.

Le comportement de templural peut être personnalisé en utilisant trois mécanismes :

 - Priorité de catégorie
 - Ordre de catégorie
 - *Fallback* de catégorie

**FIXME finir la traduction de cette section**

## ❓ FAQ

### Et les nombres négatifs ou flottants ?

templural s'en fiche, il se base sur [Intl.PluralRules](https://developer.mozilla.org/fr-FR/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules).

### De nouvelles features sont-elles prévues ?

Pas pour le moment.

templural est simple et bête, et il va probablement le rester.

### D'autres questions ?

Utilisez l'[onglet Discussions](https://github.com/nlepage/templural/discussions).

## Auteurs & Contributeurs

Remerciements particuliers à [Valentin Cocaud](https://github.com/EmrysMyrddin) et [Yoann Prot](https://github.com/Taranys) pour l'idée originale derrière templural.

👤 **Nicolas Lepage**

* Twitter: [@njblepage](https://twitter.com/njblepage)
* Github: [@nlepage](https://github.com/nlepage)

## 🤝 Contribuer

Les contributions, issues et demande de feature sont les bienvenues !<br />N'hésitez pas à consulter les [issues](https://github.com/nlepage/templural/issues).

## Montrez votre soutien

Lachez une ⭐️ et/ou sponsororisez si ce projet vous a aidé !

## 📝 Licence

Copyright © 2021 [Nicolas Lepage](https://github.com/nlepage).<br />
Ce projet est sous licence [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html).
