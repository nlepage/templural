# templural 🍤

**Fonction de template pour accorder les pluriels dans les phrases.**

[![CI](https://github.com/nlepage/templural/actions/workflows/ci.yml/badge.svg)](https://github.com/nlepage/templural/actions)
[![Version](https://img.shields.io/npm/v/templural.svg)](https://www.npmjs.com/package/templural)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache2.0-yellow.svg)](https://spdx.org/licenses/Apache-2.0.html)

[![English README](https://img.shields.io/badge/🇬🇧-README-blue)](https://github.com/nlepage/templural#readme)

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

### Accorder un mot avec nombre le précédant

```js
templural`Yoann et Valentin ont eu ${nbIdees} idée{s}`

// nbIdees = 1 ➔ "Yoann et Valentin ont eu 1 idée"
// nbIdees = 2 ➔ "Yoann et Valentin ont eu 2 idées"
// nbIdees = 42 ➔ "Yoann et Valentin ont eu 42 idées"
// nbIdees = 0 ➔ "Yoann et Valentin ont eu 0 idée"
```

### Insérer n'importe quelle autre valeur dans le texte

```js
templural`${nomUtilisateur} a ${nbPoints} point{s}`

// nomUtilisateur = "Joe", nbPoints = 1 ➔ "Joe a 1 point"
// nomUtilisateur = "Mario", nbPoints = 1000 ➔ "Mario a 1000 points"
```

### Accorder plusieurs mots avec le même nombre les précédant

```js
templural`J'ai juste pris ${nbPintes} petite{s} bière{s} chéri·e, {z}je te jure`

// nbPintes = 1 ➔ "J'ai juste pris 1 petite bière chéri·e, je te jure"
// nbPintes = 2 ➔ "J'ai juste pris 2 petites bières chéri·e, zje te jure"
// nbPintes = 6 ➔ "J'ai juste pris 6 petites bières chéri·e, zje te jure"
```

### Accorder plusieurs mots chacun avec un nombre différent

```js
templural`J'ai acheté ${nbCarottes} carotte{s} et ${nbPatates} patate{s}`

// nbCarottes = 1, nbPatates = 1 ➔ "J'ai acheté 1 carotte et 1 patate"
// nbCarottes = 1, nbPatates = 3 ➔ "J'ai acheté 1 carotte et 3 patates"
// nbCarottes = 2, nbPatates = 1 ➔ "J'ai acheté 2 carottes et 1 patate"
// nbCarottes = 2, nbPatates = 3 ➔ "J'ai acheté 2 carottes et 3 patates"
```

### Mots avec une forme différentes au singulier et au pluriel

```js
templural`${nbConnectes} personne{s} {est;sont} connecté{s}`

// nbConnectes = 1 ➔ "1 personne est connectée"
// nbConnectes = 2 ➔ "2 personnes sont connectées"
// nbConnectes = 666 ➔ "666 personnes sont connectées"
```

### Un mélange de tous les exemples précédents

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

## 🗣️ Internationalisation

**⚠ Cette section est obsolète et doit être mise à jour ! ⚠**

templural est conçu pour être adaptable à n'importe quelle langue.

### Number ranges

templural utilise des plages de nombres pour définir quoi faire, du moins au plus explicite :

```js
templural`${n}{a}`
// ➔ Choisit "a" si n >= 2

templural`${n}{a;b}`
// ➔ Choisit "a" si 1 <= n < 2
// ➔ Choisit "b" si n >= 2

templural`${n}{a;b;c}`
// ➔ Choisit "a" si 0 <= n < 1
// ➔ Choisit "b" si 1 <= n < 2
// ➔ Choisit "c" si n >= 2
```

Lorsqu'une forme moins explicite est utilisée, templural utilise les [plural rules](#plural-rules) pour choisir quoi faire.

Il est possible de modifier les plages de nombres utilisées par templural, soit en modifiant les plages par défaut :

```js
templural.setRanges(...)
```

soit en créant une nouvelle fonction de template avec des plages spécifiques :

```js
import { forRanges } from 'templural'

const templuralCustom = forRanges(...)
```

Les plages par défaut utilisées par templural sont définies dans [`index.ts`](https://github.com/nlepage/templural/blob/ef1e75601049b545637ba8c2b4ce36ee3e8a6f18/src/index.ts#L8).

### Plural rules

templural utilise [`Intl.PluralRules`](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules) pour choisir quoi faire quand cela n'est pas spécifié explicitement.

Par exemple, zéro est pluriel en anglais alors qu'il est singulier en français :

```js
templural.setLocales('en')
templural`You have ${0} message{s}` // ➔ "You have 0 messages"

templural.setLocales('fr')
templural`Vous avez ${0} message{s}` // ➔ "Vous avez 0 message"
```

Il est donc recommandé de sélectionner la bonne langue lorsqu'on utilise templural afin d'éviter les erreurs.

Cependant il est possible de spécifier explicitement quoi faire dans tous les cas, et d'éviter de reposer sur `Intl.PluralRules` :

```js
// Cette phrase en français sera correcte même si la langue sélectionnée est l'anglais
templural`Vous avez ${0} message{;;s}` // ➔ "Vous avez 0 message"
```

#### Sélectionner la langue

Il est possible de sélectionner la langue utilisée par templural, soit en changeant la langue par défaut :

```js
templural.setLocales('fr_BE') // Français (Belgique)
```

ou en créant une nouvelle fonction de template pour une langue spécifique :

```js
import { forLocales } from 'templural'

const templuralDeCH = forLocales('de_CH') // Allemand (Suisse)
```

Pour plus d'informations sur les valeurs acceptées par `templural.setLocales()` et `forLocales()` voir l'[argument locales](https://developer.mozilla.org/fr/docs/Web/JavaScript/Reference/Global_Objects/Intl#argument_locales).

## ❓ FAQ

### De nouvelles features sont-elles prévues ?

Pas pour le moment.

templural est simple et bête, et il va probablement le rester.

### Et les nombres négatifs ou flottants alors ?

🚧 FIXME

### D'autres questions ?

Utilisez l'[onglet Discussions](https://github.com/nlepage/templural/discussions).

## Auteurs & Contributeurs

Remerciements particuliers à [Valentin Cocaud](https://github.com/EmrysMyrddin) et [Yoann Prot](https://github.com/Taranys) pour l'idée originale derrière templural.

👤 **Nicolas Lepage**

* Twitter: [@njblepage](https://twitter.com/njblepage)
* Github: [@nlepage](https://github.com/nlepage)

## 🤝 Contribuer

Les contributions, issues et demande de feature sont les bienvenues !<br />N'hésitez pas à consulter les [issues](https://github.com/nlepage/templural/issues).

## Show your support

Lachez une ⭐️ et/ou sponsororisez si ce projet vous a aidé !

## 📝 License

Copyright © 2021 [Nicolas Lepage](https://github.com/nlepage).<br />
Ce projet est sous licence [Apache-2.0](https://spdx.org/licenses/Apache-2.0.html).
